from datetime import date
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import database

class User(database.Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    oidc_subject = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GlobalSetting(database.Base):
    __tablename__ = "global_settings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    dob = Column(Date, default=date(1986, 1, 1))
    base_salary = Column(Float, default=150000.0)
    expected_raise_percent = Column(Float, default=0.03)
    pay_periods = Column(Integer, default=52)
    tax_mode = Column(String, default="simple")
    federal_tax_rate = Column(Float, default=0.22)
    state_tax_rate = Column(Float, default=0.04)
    insurance_premium = Column(Float, default=200.0)
    adv_fed_tax = Column(Float, default=0.0)
    adv_ss_tax = Column(Float, default=0.0)
    adv_med_tax = Column(Float, default=0.0)
    adv_state_tax = Column(Float, default=0.0)
    adv_state_other = Column(Float, default=0.0)
    adv_med_ins = Column(Float, default=0.0)
    adv_dental = Column(Float, default=0.0)
    adv_vision = Column(Float, default=0.0)
    adv_life = Column(Float, default=0.0)
    adv_other_ins = Column(Float, default=0.0)
    adv_hsa = Column(Float, default=0.0)
    contribution_401k_percent = Column(Float, default=0.15)
    k401_match_type = Column(Float, default=1.0)
    k401_match_limit_percent = Column(Float, default=0.04)
    k401_auto_contribution_percent = Column(Float, default=0.0)
    target_bonus_percent = Column(Float, default=0.10)
    target_retirement_age = Column(Integer, default=65)
    target_roth_retirement_age = Column(Integer, default=65)
    withdrawal_retirement = Column(Integer, default=65)
    roth_withdrawal_retirement = Column(Integer, default=65)
    withdrawal_rate = Column(Float, default=0.04)
    roth_withdrawal_rate = Column(Float, default=0.04)
    timezone = Column(String, default="UTC")

class Property(database.Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_type = Column(String, nullable=False, default="Primary Residence")
    address_street = Column(String, nullable=True)
    address_city = Column(String, nullable=True)
    address_state = Column(String, nullable=True)
    address_zip = Column(String, nullable=True)
    address = Column(String, nullable=True)
    purchase_price = Column(Float, nullable=False)
    purchase_date = Column(Date, nullable=False)
    loan_start_date = Column(Date, nullable=True)
    loan_term_months = Column(Integer, nullable=True)
    payment_frequency = Column(String, default="Monthly")
    initial_loan_value = Column(Float, nullable=True)
    interest_rate = Column(Float, nullable=True)
    loan_type = Column(String, default="Conventional")
    reconciled_balance = Column(Float, nullable=True)
    reconciliation_date = Column(Date, nullable=True)
    last_payment_date = Column(Date, nullable=True)
    principal_paid = Column(Float, default=0.0)
    interest_paid = Column(Float, default=0.0)
    escrow_collected = Column(Float, default=0.0)
    monthly_principal = Column(Float, default=0.0)
    monthly_interest = Column(Float, default=0.0)
    monthly_tax = Column(Float, default=0.0)
    monthly_insurance = Column(Float, default=0.0)
    monthly_overage = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    loan_payments = relationship("LoanPayment", back_populates="property", cascade="all, delete-orphan")

class ExtraPayment(database.Base):
    __tablename__ = "extra_payments"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    payment_date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PropertyValuation(database.Base):
    __tablename__ = "property_valuations"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    valuation_date = Column(Date, nullable=False)
    estimated_value = Column(Float, nullable=False)
    source = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Paystub(database.Base):
    __tablename__ = "paystubs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pay_date = Column(Date, nullable=False)
    gross_pay = Column(Float, nullable=False)
    extra_pay = Column(Float, default=0.0)
    federal_tax = Column(Float, default=0.0)
    social_security_tax = Column(Float, default=0.0)
    medicare_tax = Column(Float, default=0.0)
    state_tax = Column(Float, default=0.0)
    state_other_tax = Column(Float, default=0.0)
    medical_insurance = Column(Float, default=0.0)
    dental_insurance = Column(Float, default=0.0)
    vision_insurance = Column(Float, default=0.0)
    life_insurance = Column(Float, default=0.0)
    other_insurance = Column(Float, default=0.0)
    hsa_contribution = Column(Float, default=0.0)
    k401k_contribution = Column(Float, default=0.0)
    net_pay = Column(Float, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HistoricalSnapshot(database.Base):
    __tablename__ = "historical_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    snapshot_date = Column(Date, nullable=False)
    net_worth = Column(Float, nullable=False)
    property_value = Column(Float, nullable=False, default=0.0)
    balance_401k = Column(Float, nullable=False)
    investment_balance = Column(Float, nullable=False)
    mortgage_balance = Column(Float, nullable=False)
    balance_roth_ira = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LoanPayment(database.Base):
    __tablename__ = "loan_payments"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    payment_date = Column(Date, nullable=False)
    principal_amount = Column(Float, default=0.0)
    interest_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    insurance_amount = Column(Float, default=0.0)
    overage_amount = Column(Float, default=0.0)
    total_payment = Column(Float, default=0.0)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    property = relationship("Property", back_populates="loan_payments")

class InvestmentAccount(database.Base):
    __tablename__ = "investment_accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    account_type = Column(String, nullable=False)
    current_value = Column(Float, nullable=False)
    growth_target = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    valuations = relationship("InvestmentValuation", back_populates="account", cascade="all, delete-orphan")

class InvestmentValuation(database.Base):
    __tablename__ = "investment_valuations"
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("investment_accounts.id"), nullable=False)
    valuation_date = Column(Date, nullable=False)
    value = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    account = relationship("InvestmentAccount", back_populates="valuations")

