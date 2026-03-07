import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
import models
import database

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

models.database.Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[database.get_db] = override_get_db

client = TestClient(app)

def test_create_and_get_property():
    response = client.post(
        "/api/properties?user_id=1",
        json={
            "property_type": "Primary Residence",
            "address": "123 Main St",
            "purchase_price": 500000.0,
            "purchase_date": "2020-01-01",
            "loan_start_date": "2020-01-01",
            "loan_term_months": 360,
            "payment_frequency": "Monthly",
            "initial_loan_value": 400000.0,
            "interest_rate": 0.03,
            "loan_type": "Conventional"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["address"] == "123 Main St"
    prop_id = data["id"]

    response2 = client.get("/api/properties?user_id=1")
    assert response2.status_code == 200
    props = response2.json()
    assert len(props) > 0
    assert any(p["id"] == prop_id for p in props)

def test_create_and_get_extra_payment():
    # First create property
    response = client.post(
        "/api/properties?user_id=1",
        json={
            "address": "456 Oak St",
            "purchase_price": 300000.0,
            "purchase_date": "2021-01-01",
            "loan_start_date": "2021-01-01"
        }
    )
    prop_id = response.json()["id"]

    # Now extra payment
    payment_res = client.post(
        f"/api/properties/{prop_id}/extra-payments?user_id=1",
        json={
            "payment_date": "2022-01-01",
            "amount": 500.0
        }
    )
    assert payment_res.status_code == 200
    assert payment_res.json()["amount"] == 500.0

    # Test before loan start date block
    bad_payment = client.post(
        f"/api/properties/{prop_id}/extra-payments?user_id=1",
        json={
            "payment_date": "1999-01-01",
            "amount": 100.0
        }
    )
    assert bad_payment.status_code == 400
