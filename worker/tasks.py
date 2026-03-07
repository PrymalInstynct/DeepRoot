import os
import sys
import logging
from celery import Celery
from datetime import date

# Ensure the api module is in the Python path
# The volume mount `./api:/app/api` means /app/api has the database/models modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

try:
    import database
    import models
except ImportError:
    # Fallback for local execution vs container path differences
    sys.path.append('/app/api')
    import database
    import models

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

celery_app = Celery(
    "worker",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Setup periodic execution (e.g. every week)
    sender.add_periodic_task(604800.0, fetch_estimated_home_values.s(), name='fetch home values weekly')

@celery_app.task
def fetch_estimated_home_values():
    """
    Background worker task to fetch home values.
    Direct scraping of Zillow/Redfin hits Cloudflare bot-protection.
    This module is designed to accept data from an API aggregator like RapidAPI
    or a headless Playwright instance.
    """
    logger.info("Starting scheduled task: fetch_estimated_home_values")
    
    db = database.SessionLocal()
    try:
        properties = db.query(models.Property).all()
        for prop in properties:
            logger.info(f"Fetching valuation for property ID {prop.id} at {prop.address}")
            
            try:
                from valuation_service import get_valuation
                val, source = get_valuation(prop)
            except Exception as service_err:
                logger.error(f"Valuation service error: {str(service_err)}")
                # Extreme fallback
                val = prop.purchase_price * 1.02
                source = "System Fallback (Calc)"

            valuation = models.PropertyValuation(
                property_id=prop.id,
                valuation_date=date.today(),
                estimated_value=val,
                source=source
            )
            db.add(valuation)
        
        db.commit()
        logger.info(f"Successfully processed valuations for {len(properties)} properties.")
    except Exception as e:
        logger.error(f"Error fetching home values: {str(e)}")
        db.rollback()
    finally:
        db.close()
