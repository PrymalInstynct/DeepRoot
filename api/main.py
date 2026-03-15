import os
import logging
import math
from datetime import date, datetime
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
import database
import export_service

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables if they don't exist
models.database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Lifestyle Maintenance API")

from fastapi import Request
from fastapi.responses import Response

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

class GlobalSettingsUpdate(BaseModel):
    dob: date
    base_salary: float
    expected_raise_percent: float
    pay_periods: int
    tax_mode: str
    federal_tax_rate: float
    state_tax_rate: float
    insurance_premium: float
    adv_fed_tax: float
    adv_ss_tax: float
    adv_med_tax: float
    adv_state_tax: float
    adv_state_other: float
    adv_med_ins: float
    adv_dental: float
    adv_vision: float
    adv_life: float
    adv_other_ins: float
    adv_hsa: float
    contribution_401k_percent: float
    k401_match_type: float
    k401_match_limit_percent: float
    k401_auto_contribution_percent: float
    timezone: str
    target_bonus_percent: float
    target_retirement_age: int
    target_roth_retirement_age: int
    withdrawal_retirement: int
    roth_withdrawal_retirement: int
    withdrawal_rate: float
    roth_withdrawal_rate: float

class GlobalSettingsResponse(GlobalSettingsUpdate):
    id: int
    user_id: int
    class Config: from_attributes = True


class PaystubCreate(BaseModel):
    pay_date: date
    gross_pay: float
    extra_pay: float = 0.0
    federal_tax: float = 0.0
    social_security_tax: float = 0.0
    medicare_tax: float = 0.0
    state_tax: float = 0.0
    state_other_tax: float = 0.0
    medical_insurance: float = 0.0
    dental_insurance: float = 0.0
    vision_insurance: float = 0.0
    life_insurance: float = 0.0
    other_insurance: float = 0.0
    hsa_contribution: float = 0.0
    k401k_contribution: float = 0.0
    net_pay: float
    notes: str = None

class PaystubResponse(PaystubCreate):
    id: int
    user_id: int
    created_at: datetime
    class Config: from_attributes = True

class PropertyCreate(BaseModel):
    property_type: str = "Primary Residence"
    address_street: str | None = None
    address_city: str | None = None
    address_state: str | None = None
    address_zip: str | None = None
    address: str | None = None
    purchase_price: float
    purchase_date: date
    loan_start_date: date | None = None
    loan_term_months: int | None = None
    payment_frequency: str = "Monthly"
    initial_loan_value: float | None = None
    interest_rate: float | None = None
    loan_type: str = "Conventional"
    reconciled_balance: float | None = None
    reconciliation_date: date | None = None
    last_payment_date: date | None = None
    principal_paid: float = 0.0
    interest_paid: float = 0.0
    escrow_collected: float = 0.0
    monthly_principal: float = 0.0
    monthly_interest: float = 0.0
    monthly_tax: float = 0.0
    monthly_insurance: float = 0.0
    monthly_overage: float = 0.0

class PropertyResponse(PropertyCreate):
    id: int
    user_id: int
    created_at: datetime
    class Config: from_attributes = True

class LoanPaymentCreate(BaseModel):
    payment_date: date
    principal_amount: float = 0.0
    interest_amount: float = 0.0
    tax_amount: float = 0.0
    insurance_amount: float = 0.0
    overage_amount: float = 0.0
    total_payment: float = 0.0
    notes: str | None = None

class LoanPaymentResponse(LoanPaymentCreate):
    id: int
    property_id: int
    created_at: datetime
    class Config: from_attributes = True

class PropertyValuationResponse(BaseModel):
    id: int
    property_id: int
    valuation_date: date
    estimated_value: float
    source: str
    created_at: datetime
    class Config: from_attributes = True

class InvestmentAccountCreate(BaseModel):
    name: str
    account_type: str
    current_value: float
    growth_target: float

class InvestmentAccountUpdate(InvestmentAccountCreate):
    pass

class InvestmentAccountResponse(InvestmentAccountCreate):
    id: int
    user_id: int
    created_at: datetime
    class Config: from_attributes = True

class InvestmentHistoryCreate(BaseModel):
    investment_account_id: int
    record_date: date
    balance: float

class InvestmentHistoryResponse(InvestmentHistoryCreate):
    id: int
    created_at: datetime
    class Config: from_attributes = True

class InvestmentValuationResponse(BaseModel):
    id: int
    account_id: int
    valuation_date: date
    value: float
    created_at: datetime
    class Config: from_attributes = True

@app.get("/health")
def health_check(): return {"status": "healthy"}

@app.get("/api/settings", response_model=GlobalSettingsResponse)
def get_settings(user_id: int = 1, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = models.User(id=user_id, username=f"user{user_id}", email=f"user{user_id}@example.com")
        db.add(user); db.commit()
    settings = db.query(models.GlobalSetting).filter(models.GlobalSetting.user_id == user_id).first()
    if not settings:
        settings = models.GlobalSetting(user_id=user_id)
        db.add(settings); db.commit(); db.refresh(settings)
    return settings

@app.put("/api/settings", response_model=GlobalSettingsResponse)
def update_settings(settings_in: GlobalSettingsUpdate, user_id: int = 1, db: Session = Depends(database.get_db)):
    settings = db.query(models.GlobalSetting).filter(models.GlobalSetting.user_id == user_id).first()
    if not settings: settings = models.GlobalSetting(user_id=user_id); db.add(settings)
    for field, value in settings_in.model_dump().items(): setattr(settings, field, value)
    db.commit(); db.refresh(settings)
    return settings

@app.get("/api/properties", response_model=list[PropertyResponse])
def get_properties(user_id: int = 1, db: Session = Depends(database.get_db)):
    return db.query(models.Property).filter(models.Property.user_id == user_id).order_by(models.Property.purchase_date.desc()).all()

@app.post("/api/properties", response_model=PropertyResponse)
def create_property(property_in: PropertyCreate, user_id: int = 1, db: Session = Depends(database.get_db)):
    data = property_in.model_dump()
    new_property = models.Property(**data, user_id=user_id)
    db.add(new_property); db.commit(); db.refresh(new_property)
    return new_property

@app.get("/api/properties/{property_id}/payments", response_model=list[LoanPaymentResponse])
def get_loan_payments(property_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    return db.query(models.LoanPayment).filter(models.LoanPayment.property_id == property_id).order_by(models.LoanPayment.payment_date.desc()).all()

@app.post("/api/properties/{property_id}/payments", response_model=LoanPaymentResponse)
def create_loan_payment(property_id: int, payment_in: LoanPaymentCreate, user_id: int = 1, db: Session = Depends(database.get_db)):
    new_payment = models.LoanPayment(**payment_in.model_dump(), property_id=property_id)
    db.add(new_payment); db.commit(); db.refresh(new_payment)
    return new_payment

@app.get("/api/loan-payments", response_model=list[LoanPaymentResponse])
def get_all_loan_payments(user_id: int = 1, db: Session = Depends(database.get_db)):
    p_ids = [p.id for p in db.query(models.Property.id).filter(models.Property.user_id == user_id).all()]
    return db.query(models.LoanPayment).filter(models.LoanPayment.property_id.in_(p_ids)).all()

@app.get("/api/properties/{property_id}/valuations", response_model=list[PropertyValuationResponse])
def get_property_valuations(property_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    return db.query(models.PropertyValuation).filter(models.PropertyValuation.property_id == property_id).order_by(models.PropertyValuation.valuation_date.desc()).all()


# --- Paystubs ---
@app.get("/api/paystubs", response_model=list[PaystubResponse])
def get_paystubs(user_id: int = 1, db: Session = Depends(database.get_db)):
    return db.query(models.Paystub).filter(
        models.Paystub.user_id == user_id
    ).order_by(models.Paystub.pay_date.desc()).all()

@app.post("/api/paystubs", response_model=PaystubResponse)
def create_paystub(paystub_in: PaystubCreate, user_id: int = 1, db: Session = Depends(database.get_db)):
    ps = models.Paystub(**paystub_in.model_dump(), user_id=user_id)
    db.add(ps); db.commit(); db.refresh(ps)
    return ps

@app.delete("/api/paystubs/{paystub_id}")
def delete_paystub(paystub_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    ps = db.query(models.Paystub).filter(
        models.Paystub.id == paystub_id,
        models.Paystub.user_id == user_id
    ).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Paystub not found")
    db.delete(ps); db.commit()
    return {"ok": True}

# --- Properties (PUT / DELETE) ---
@app.put("/api/properties/{property_id}", response_model=PropertyResponse)
def update_property(property_id: int, property_in: PropertyCreate, user_id: int = 1, db: Session = Depends(database.get_db)):
    prop = db.query(models.Property).filter(
        models.Property.id == property_id,
        models.Property.user_id == user_id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    for field, value in property_in.model_dump().items():
        setattr(prop, field, value)
    db.commit(); db.refresh(prop)
    return prop

@app.delete("/api/properties/{property_id}")
def delete_property(property_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    prop = db.query(models.Property).filter(
        models.Property.id == property_id,
        models.Property.user_id == user_id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(prop); db.commit()
    return {"ok": True}

# --- Extra Payments ---
@app.get("/api/properties/{property_id}/extra-payments")
def get_extra_payments(property_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    return db.query(models.ExtraPayment).filter(
        models.ExtraPayment.property_id == property_id
    ).order_by(models.ExtraPayment.payment_date.desc()).all()

@app.post("/api/properties/{property_id}/extra-payments")
def create_extra_payment(property_id: int, payload: dict, user_id: int = 1, db: Session = Depends(database.get_db)):
    ep = models.ExtraPayment(**payload, property_id=property_id)
    db.add(ep); db.commit(); db.refresh(ep)
    return ep

@app.delete("/api/properties/{property_id}/extra-payments/{ep_id}")
def delete_extra_payment(property_id: int, ep_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    ep = db.query(models.ExtraPayment).filter(models.ExtraPayment.id == ep_id).first()
    if not ep:
        raise HTTPException(status_code=404, detail="Extra payment not found")
    db.delete(ep); db.commit()
    return {"ok": True}

# --- Loan Payment DELETE ---
@app.delete("/api/loan-payments/{payment_id}")
def delete_loan_payment(payment_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    p = db.query(models.LoanPayment).filter(models.LoanPayment.id == payment_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Loan payment not found")
    db.delete(p); db.commit()
    return {"ok": True}

# --- Investment Accounts ---
@app.get("/api/investments", response_model=list[InvestmentAccountResponse])
def get_investments(user_id: int = 1, db: Session = Depends(database.get_db)):
    return db.query(models.InvestmentAccount).filter(models.InvestmentAccount.user_id == user_id).all()

@app.post("/api/investments", response_model=InvestmentAccountResponse)
def create_investment(inv_in: InvestmentAccountCreate, user_id: int = 1, db: Session = Depends(database.get_db)):
    data = inv_in.model_dump()
    data["current_value"] = round(data["current_value"], 2)
    new_inv = models.InvestmentAccount(**data, user_id=user_id)
    db.add(new_inv); db.commit(); db.refresh(new_inv)
    
    # Record initial history
    history = models.InvestmentValuation(
        account_id=new_inv.id,
        valuation_date=date.today(),
        value=new_inv.current_value
    )
    db.add(history); db.commit()
    
    return new_inv

@app.put("/api/investments/{inv_id}", response_model=InvestmentAccountResponse)
def update_investment(inv_id: int, inv_in: InvestmentAccountUpdate, user_id: int = 1, db: Session = Depends(database.get_db)):
    inv = db.query(models.InvestmentAccount).filter(
        models.InvestmentAccount.id == inv_id,
        models.InvestmentAccount.user_id == user_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment account not found")
    old_value = inv.current_value
    for field, value in inv_in.model_dump().items():
        if field == "current_value":
            value = round(value, 2)
        setattr(inv, field, value)
    db.commit(); db.refresh(inv)

    # Record history if value changed
    if old_value != inv.current_value:
        history = models.InvestmentValuation(
            account_id=inv.id,
            valuation_date=date.today(),
            value=inv.current_value
        )
        db.add(history); db.commit()

    return inv

@app.get("/api/investments/{inv_id}/history", response_model=list[InvestmentValuationResponse])
def get_investment_history(inv_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    inv = db.query(models.InvestmentAccount).filter(
        models.InvestmentAccount.id == inv_id,
        models.InvestmentAccount.user_id == user_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment account not found")
    return db.query(models.InvestmentValuation).filter(
        models.InvestmentValuation.account_id == inv_id
    ).order_by(models.InvestmentValuation.valuation_date.desc()).all()

@app.delete("/api/investments/{inv_id}")
def delete_investment(inv_id: int, user_id: int = 1, db: Session = Depends(database.get_db)):
    inv = db.query(models.InvestmentAccount).filter(
        models.InvestmentAccount.id == inv_id,
        models.InvestmentAccount.user_id == user_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment account not found")
    db.delete(inv); db.commit()
    return {"ok": True}

@app.get("/api/investment-history", response_model=list[InvestmentHistoryResponse])
def get_investment_history_all(user_id: int = 1, db: Session = Depends(database.get_db)):
    # Find all accounts for this user
    acc_ids = [a.id for a in db.query(models.InvestmentAccount.id).filter(models.InvestmentAccount.user_id == user_id).all()]
    return db.query(models.InvestmentHistory).filter(models.InvestmentHistory.investment_account_id.in_(acc_ids)).order_by(models.InvestmentHistory.record_date.desc()).all()

@app.post("/api/investment-history", response_model=InvestmentHistoryResponse)
def create_investment_history(hist_in: InvestmentHistoryCreate, user_id: int = 1, db: Session = Depends(database.get_db)):
    # Verify account ownership
    acc = db.query(models.InvestmentAccount).filter(models.InvestmentAccount.id == hist_in.investment_account_id, models.InvestmentAccount.user_id == user_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail="Investment account not found or access denied")
    
    new_hist = models.InvestmentHistory(**hist_in.model_dump())
    db.add(new_hist); db.commit(); db.refresh(new_hist)
    return new_hist

# ── Financial Statement Export ────────────────────────────────────────────────

def _compute_outstanding_balance(prop: models.Property, as_of: date) -> float:
    """
    Estimate the outstanding mortgage balance as of `as_of` using standard
    amortization.  Falls back gracefully when optional fields are missing.
    """
    balance   = prop.reconciled_balance if prop.reconciled_balance else prop.initial_loan_value
    if not balance:
        return 0.0
    rate_annual = prop.interest_rate or 0.0
    term_months = prop.loan_term_months or 360
    start_date  = prop.reconciliation_date or prop.loan_start_date
    if not start_date:
        return balance

    monthly_rate = rate_annual / 12.0

    # Number of payments that have elapsed since the reconciliation / start date
    months_elapsed = (
        (as_of.year - start_date.year) * 12 + (as_of.month - start_date.month)
    )
    months_elapsed = max(0, months_elapsed)

    if monthly_rate == 0:
        # Zero-interest loan
        payment = balance / term_months
        return max(0.0, balance - payment * months_elapsed)

    # Standard amortization payment
    payment = balance * (monthly_rate * (1 + monthly_rate) ** term_months) / \
              ((1 + monthly_rate) ** term_months - 1)

    # Balance after months_elapsed payments
    remaining = balance * (1 + monthly_rate) ** months_elapsed - \
                payment * ((1 + monthly_rate) ** months_elapsed - 1) / monthly_rate

    return max(0.0, round(remaining, 2))


@app.get("/api/export/financial-statement")
def export_financial_statement(
    format: str = Query("pdf", regex="^(pdf|docx)$"),
    user_id: int = 1,
    db: Session = Depends(database.get_db),
):
    """
    Generate a Statement of Financial Position and return it as a downloadable file.
    Supports ?format=pdf (default) and ?format=docx.
    """
    today = date.today()

    # ── Gather data ────────────────────────────────────────────────────────────
    properties_db   = db.query(models.Property).filter(models.Property.user_id == user_id).all()
    investments_db  = db.query(models.InvestmentAccount).filter(models.InvestmentAccount.user_id == user_id).all()

    # Build property payload with current valuations
    props_payload = []
    for p in properties_db:
        latest_val = (
            db.query(models.PropertyValuation)
            .filter(models.PropertyValuation.property_id == p.id)
            .order_by(models.PropertyValuation.valuation_date.desc())
            .first()
        )
        current_value = latest_val.estimated_value if latest_val else p.purchase_price
        props_payload.append({
            "id":             p.id,
            "property_type":  p.property_type,
            "address_street": p.address_street,
            "address_city":   p.address_city,
            "address_state":  p.address_state,
            "address":        p.address,
            "purchase_price": p.purchase_price,
            "current_value":  current_value,
        })

    # Build investment payload
    investments_payload = [
        {
            "id":            inv.id,
            "name":          inv.name,
            "account_type":  inv.account_type,
            "current_value": inv.current_value,
        }
        for inv in investments_db
    ]

    # Build mortgage (liability) payload — only properties with active loans
    mortgages_payload = []
    for p in properties_db:
        if not p.initial_loan_value:
            continue
        outstanding = _compute_outstanding_balance(p, today)
        if outstanding <= 0:
            continue
        addr_parts = [p.address_street, p.address_city, p.address_state]
        addr = ", ".join(x for x in addr_parts if x) or p.address or "Property"
        mortgages_payload.append({
            "property_id":       p.id,
            "address":           addr,
            "outstanding_balance": outstanding,
        })

    data = {
        "report_date":  today.strftime("%B %d, %Y"),
        "properties":   props_payload,
        "investments":  investments_payload,
        "mortgages":    mortgages_payload,
    }

    # ── Generate document ──────────────────────────────────────────────────────
    try:
        if format == "pdf":
            file_path = export_service.generate_pdf(data)
            media_type = "application/pdf"
            filename   = f"financial_statement_{today.isoformat()}.pdf"
        else:
            file_path = export_service.generate_docx(data)
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            filename   = f"financial_statement_{today.isoformat()}.docx"
    except Exception as e:
        logger.error(f"Export failed: {e}")
        raise HTTPException(status_code=500, detail=f"Export generation failed: {str(e)}")

    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=filename,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
