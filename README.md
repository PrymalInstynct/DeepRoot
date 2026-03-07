# DeepRoot Financial

Welcome to the **DeepRoot Financial** repository. This repository contains tools,
calculators, and applications designed to help you manage personal finance, visualize
financial independence, and execute targeted wealth strategies.

## Financial Planning Dashboard

The core web application is a single-page interactive dashboard designed to provide a
macro-level view of your wealth trajectory over a 25+ year horizon. It combines modular
tools for tracking 401(k) compound growth, forecasting salary and bonus earnings, running
precise mortgage amortization schedules, visualizing your total net worth, and tracking
actual real-estate holdings with month-by-month payment accuracy.

### Architecture & Tech Stack

This project is a production-ready, full-stack application leveraging the following
technologies:

- **Frontend**: Vanilla JS styled with Tailwind CSS, served by Nginx.
- **Backend API**: Python via FastAPI with a full REST API surface.
- **Database**: PostgreSQL — stores user settings, paystubs, historical net worth
  snapshots, property records, loan payments, property valuations, and extra payments.
- **Background Worker**: Python Celery worker (with Redis) for automated data ingestion.
- **Infrastructure**: Orchestrated with Docker Compose.

### How to Launch the Application

1. Ensure `docker` and `docker-compose` are installed on your system.
2. Navigate to the root folder of this repository.
3. Run `docker compose up --build -d` to launch the stack in the background.
4. Open your web browser and navigate to `http://localhost:8080` to access the dashboard.
5. The backend API (with interactive Swagger docs) is accessible at `http://localhost:8000/docs`.
6. **Optional:** To enable automated property valuations, obtain a free API key from
   [RentCast](https://rentcast.io/api) and add it to your environment as `RENTCAST_API_KEY`.

### Backend API Endpoints

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| GET/PUT | `/api/settings` | Read and update global user settings |
| GET/POST | `/api/historical` | Net worth snapshots (Historical Ledger) |
| DELETE | `/api/historical/{id}` | Remove a specific snapshot |
| GET/POST | `/api/paystubs` | Paystub entries |
| DELETE | `/api/paystubs/{id}` | Remove a specific paystub |
| GET/POST | `/api/properties` | Property records |
| GET/PUT/DELETE | `/api/properties/{id}` | Read, update, or delete a property |
| GET/POST | `/api/properties/{id}/payments` | Actual monthly loan payments |
| DELETE | `/api/loan-payments/{id}` | Remove a specific loan payment |
| GET | `/api/loan-payments` | All loan payments across all properties |
| GET/POST | `/api/properties/{id}/extra-payments` | Extra/lump-sum payments |
| GET | `/api/properties/{id}/valuations` | Property valuation history |
| GET/POST | `/api/investments` | Investment account records |
| GET/PUT/DELETE | `/api/investments/{id}` | Read, update, or delete an investment account |

---

### Dashboard Tools

#### 1. Dashboard Home

The central command center and default landing page. Features a dynamic greeting and
high-level financial KPIs including:

- **Total Estimated Net Worth** — sourced from the most recent Historical Ledger snapshot
- **Effective Pay Rate** — calculated from your most recent paystub
- **Retirement Savings Rate** — your current 401(k) contribution rate

Quick-access cards allow you to jump directly to any deep-dive module.

#### 2. Salary & Bonus Forecaster

A straightforward calculation isolating your future gross earnings trajectory assuming
your global expected raise inputs. It layers on variable discretionary bonus income based
on a fixed percentage target, giving you a clean 15-year lookahead at your total
compensation ceiling.

#### 3. Mortgage Amortization

An exact month-by-month engine mapping your remaining debt. It handles floating point
fractional year inputs (e.g. "25 Years and 3 Months") and calculates the exact Principal
vs. Interest split for every dollar you send the bank. It calculates dynamically until
the balance hits $0, rolling the final fractional year into a granular month-by-month
breakdown so you know the exact date of your final payment.

#### 4. 401(k) Compounder

A dedicated view for your primary retirement vehicle. This tab models:

- Your core personal contribution percentage vs. limits.
- **Employer Match Logic:** Supports both basic percentage matching and complex tiered
  matching (e.g., 100% of the first 3%, 50% of the next 2%), displayed in separate
  **Personal Contribution** and **Company Contribution** columns.
- **Auto-Escalation:** Models automatic yearly increases to your contribution rate until
  a defined ceiling is hit.
- The projection stops at your custom-defined **Targeted Retirement Age** for accurate
  final-balance lookups.

#### 5. 401(k) Withdrawal Simulator

Projects the lifespan of your 401(k) balance during retirement based on a specified
retirement age and withdrawal rate. Grabs the targeted retirement balance automatically
from the 401(k) Compounder and models the drawdown until the account reaches zero or
your 99th birthday.

#### 6. Mortgage Kill Shot

A scenario modeling tool for forecasting wealth accumulation from future pay raises.
Models true paystub deductions mathematically:

- **Federal & State Taxes:** Indexed to grow at ~3.0% YoY.
- **Health Insurance:** Modeled to grow at ~5.0% YoY.
- **401(k) Contributions:** Calculated via a user-defined percentage, auto-scaling with
  raises.

The model routes exactly **50% of the newly created net wealth** from each raise into a
taxable brokerage account, stacking cumulatively and compounding at a user-defined
growth rate. When the Investment Balance exceeds the Remaining Mortgage Balance, the
"Kill Shot" option is triggered — demonstrating the exact **Projected Interest Saved**
by executing a lump-sum payoff.

#### 7. Income Observability

A deep-dive analytics dashboard aggregating historical paystub data. Provides
year-over-year and month-over-month trends for **Total Gross Income**, **Effective Tax
Rates**, and **Insurance Burdens**. Identifies your most and least expensive months and
calculates real-world financial efficiency markers.

#### 8. Paystub Entry & Historical Ledger

A two-part data ingestion and storage system:

- **Paystub Entry:** An interactive form that auto-populates `Gross Pay`, `401(k)
  Match`, all `Taxes & Deductions`, and calculates `Net Pay` in real-time from your
  Global Settings. Supports `Extra Pay` (bonuses, PTO sell). Saves finalized stubs to
  the database.
- **Historical Ledger:** A full historical view of all saved paystubs with expandable
  rows revealing the `Effective Hourly Rate`, `True Tax & Insurance Burden %`, and a
  granular breakdown of every deduction. Dynamic **Yearly Rollup** rows aggregate total
  earnings per calendar year. A separate **Net Worth Snapshots** section lets you
  capture point-in-time balances (401k, Roth IRA, Brokerage, Mortgage) to track your
  actual net worth over time.

#### 9. Property Entry

A dedicated form for managing real-estate holdings. Each property record stores:

- **Property Information:** Type, address, purchase price, and purchase date.
- **Loan Details:** Initial loan value, start date, term (months), interest rate, and
  loan type (Conventional, FHA, VA, etc.).
- **Reconciliation:** Manually reconciled balance with a reconciliation date to keep your
  amortization projections accurate.
- **Expandable Records:** The Saved Properties table supports a `+` expand button to
  reveal the full property details stored in the database, including math-derived
  amortization estimates for Payment 1 (Principal & Interest).
- Edit and delete operations are fully supported via the API.

#### 10. Investment Account Entry

A mirror of the Property Entry architecture tailored for financial investment accounts (401k, Roth IRA, HSA, Brokerage, etc.). Features:

- **Account Tracking:** Monitor current values and growth targets for individual accounts.
- **Account Types:** Supports specific tagging for 401(k), Roth IRA, Traditional IRA, HSA, 529 plan, Brokerage, and Money Market accounts.
- **Rounding:** Automatically rounds current values to 2 decimal places on save for financial accuracy.
- **Full CRUD:** Interactively add, edit, or delete accounts through a sleek UI.
- **Persistence:** All account data is stored in the PostgreSQL `investment_accounts` table.

#### 11. Property Details

A rich analytics dashboard for a selected property. Displays:

- **Top KPI Row:** Five uniform cards spanning the full width — `Select Property`
  dropdown, `Purchase Price`, `Interest Rate`, `Monthly Payment`, and `Remaining
  Balance`.
  - *Remaining Balance* — computed via the closed-form amortization formula using the
    exact number of monthly payment cycles elapsed since `loan_start_date` to today.
    Updates automatically each month without any manual input.
- **Equity Panel:** Displayed beside the Accurate Payment Breakdown, the equity card
  shows:
  - *Est. Current Equity* — `(purchase_price × 1.02^years_owned) − remaining_balance`
  - *% Owned* — equity as a share of the estimated current value
  - *Est. Value* — 2%/yr appreciation from purchase date to today
  - *Payoff Date* — today plus remaining amortization years
- **Accurate Payment Breakdown:** Principal, Interest, Tax, Insurance, and Overage from
  the most recent logged payment (or zeros if none logged yet).
- **Charts:**
  - *Equity Growth & Loan Amortization* — anchored to the property's **purchase date**,
    spanning the full loan lifetime (past + future). Past loan balance is reconstructed
    using the closed-form amortization formula; future balance comes from the live
    schedule. Home value appreciates at 2%/yr from purchase price on purchase year.
  - *Valuation History (Daily)* — actual recorded property valuations over time.
  - *Principal vs. Interest Paid (Annual)* — full-lifetime stacked bar chart aligned to
    purchase year. Past years are computed from the amortization formula; future years
    from the live schedule. Shows the correct payoff year automatically.
  - *Escrow Trends (Tax & Insurance)* — actual logged Tax and Insurance amounts per
    payment over time.
- **Log Actual Monthly Payment:** A form to record each month's actual payment with a
  due date, total payment, and full breakdown (Principal, Interest, Tax, Insurance,
  Overage, Notes). Each new entry is date-stamped and stored as a separate record,
  enabling Actual vs. Projection analysis.
- **Monthly Payment History:** A full history table of all logged payments, with the
  most-recent entry highlighted with a `LATEST` badge and blue left border.

#### 12. Total Net Worth Stack

A macro-view stacked-bar chart aggregating all asset classes:

- Taxable raise allocation balances
- 401(k) projected growth
- Roth IRA projected growth
- Home equity (property value appreciation minus remaining loan balance)

Visualizes your Total Net Worth trajectory over a 25-year horizon.

---

### Key Features

- **Full-Stack Persistence:** All data — settings, paystubs, property records, loan
  payments, valuations, and net worth snapshots — is persisted to a local PostgreSQL
  database. Nothing leaves your machine.
- **Flexible Currency Input:** All financial input fields across the app accept multiple
  formats (`4429`, `4,429`, `4429.08`, `4,429.08`) and automatically normalize to clean
  formatted values on input and to floats on save.
- **Actual vs. Projection Tracking:** Log your real monthly mortgage payments
  month-by-month to compare actual Principal/Interest splits against amortization
  projections. Tax and Insurance amounts are time-stamped per payment for trend analysis.
- **Full-Lifetime Property Charts:** The Equity Growth and Principal vs. Interest charts
  start at the property's purchase date and span the complete loan term, not just the
  remaining years. Past years are computed from the closed-form amortization formula so
  the charts are always historically accurate without requiring you to have logged
  individual payments.
- **Month-Accurate Remaining Balance:** The Remaining Balance KPI re-evaluates on every
  page load using the exact number of completed payment cycles since `loan_start_date`,
  giving you a figure that automatically advances each month.
- **State & Session Persistence:** Uses `localStorage` to remember your Active Tab and
  Global Settings panel visibility across refreshes.
- **Paystub Auto-Population:** Paystub Entry instantly pre-calculates expected gross
  pay, 401(k) matches, and withholdings from Global Settings.
- **Real-Time Reactivity:** Slider and number inputs recalculate the full 30+ year
  projection matrix in real-time. Large balances natively format with comma separation
  while typing.
- **"Date of Birth" Driven:** Dynamic timeline generation that converts your DOB into
  current age brackets for all long-term tracking tables.
- **Precise Mortgage Modeling:** Calculates remaining loan down to the exact month of
  payoff, accepting split "Years and Months" inputs.
- **Native Numeric Precision:** Chart.js global configurations lock all tooltips and
  graphical scales to exactly two decimal places, using `compact` notation for millions
  (`M`) and thousands (`K`).
- **Customizable Retirement Horizon:** Compounding calculates to a custom Projected
  Retirement Age. The Withdrawal Simulator picks up that balance and models drawdown
  with an age 99 ceiling. Roth IRA is modeled independently alongside 401(k).
- **Complete Privacy (Local Hosting):** Financial data persists securely in your local
  PostgreSQL container and never leaves your machine.
