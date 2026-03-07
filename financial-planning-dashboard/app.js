/**
 * Financial Planning Dashboard - Centralized State & Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Chart Instances ---
  let charts = {
    split: null,
    k401: null,
    mortgage: null,
    networth: null,
    cashFlow: null,
    monthlyBars: null,
    ytdArea: null,
    yoyDelta: null,
    escrowTrends: null,
    wealthActuals: null,
  };

  // --- Currency Formatter ---
  const fmtCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  // --- DOM Elements ---
  const elements = {
    // Toggle Panel
    headerToggle: document.getElementById("headerToggle"),
    globalInputsPanel: document.getElementById("globalInputsPanel"),
    toggleText: document.getElementById("toggleText"),
    toggleIcon: document.getElementById("toggleIcon"),

    // Inputs
    inpDob: document.getElementById("inpDob"),
    inpSalary: document.getElementById("inpSalary"),
    inpRaise: document.getElementById("inpRaise"),
    valRaise: document.getElementById("valRaise"),
    inpPayPeriod: document.getElementById("inpPayPeriod"),
    inpTimezone: document.getElementById("inpTimezone"),
    inpFedTax: document.getElementById("inpFedTax"),
    inpStateTax: document.getElementById("inpStateTax"),
    inpInsurance: document.getElementById("inpInsurance"),
    inp401kPersonal: document.getElementById("inp401kPersonal"),
    inp401kMatchType: document.getElementById("inp401kMatchType"),
    inp401kMatchLimit: document.getElementById("inp401kMatchLimit"),
    inp401kAuto: document.getElementById("inp401kAuto"),
    inp401kGrowth: document.getElementById("inp401kGrowth"),
    val401kGrowth: document.getElementById("val401kGrowth"),
    inpRothGrowth: document.getElementById("inpRothGrowth"),
    valRothGrowth: document.getElementById("valRothGrowth"),
    inp401kBal: document.getElementById("inp401kBal"),
    inpRothBal: document.getElementById("inpRothBal"),
    inpTaxableBal: document.getElementById("inpTaxableBal"),
    inpTaxableGrowth: document.getElementById("inpTaxableGrowth"),
    valTaxableGrowth: document.getElementById("valTaxableGrowth"),
    // Advanced Mode Elements
    btnTaxMode: document.getElementById("btnTaxMode"),
    taxSimpleMode: document.getElementById("tax-simple-mode"),
    taxAdvMode: document.getElementById("tax-adv-mode"),
    inpAdvFed: document.getElementById("inpAdvFed"),
    inpAdvSS: document.getElementById("inpAdvSS"),
    inpAdvMed: document.getElementById("inpAdvMed"),
    inpAdvState: document.getElementById("inpAdvState"),
    inpAdvStateOther: document.getElementById("inpAdvStateOther"),
    inpAdvMedIns: document.getElementById("inpAdvMedIns"),
    inpAdvDental: document.getElementById("inpAdvDental"),
    inpAdvVision: document.getElementById("inpAdvVision"),
    inpAdvLife: document.getElementById("inpAdvLife"),
    inpAdvOtherIns: document.getElementById("inpAdvOtherIns"),
    inpAdvHsa: document.getElementById("inpAdvHsa"),
    // Property Entry
    propertyForm: document.getElementById("propertyForm"),
    propId: document.getElementById("propId"),
    propType: document.getElementById("propType"),
    propAddress: document.getElementById("propAddress"),
    propCity: document.getElementById("propCity"),
    propState: document.getElementById("propState"),
    propZip: document.getElementById("propZip"),
    propPurchaseDate: document.getElementById("propPurchaseDate"),
    propPurchasePrice: document.getElementById("propPurchasePrice"),
    propLoanDate: document.getElementById("propLoanDate"),
    propLoanTerm: document.getElementById("propLoanTerm"),
    propPayFreq: document.getElementById("propPayFreq"),
    propInitLoan: document.getElementById("propInitLoan"),
    propInterest: document.getElementById("propInterest"),
    propRate: document.getElementById("propRate"),
    propLoanType: document.getElementById("propLoanType"),
    propReconBal: document.getElementById("propReconBal"),
    propReconciledBalance: document.getElementById("propReconciledBalance"),
    propReconciliationDate: document.getElementById("propReconciliationDate"),
    btnSaveProperty: document.getElementById("btnSaveProperty"),
    tbProperties: document.getElementById("tbProperties"),
    inpWealthTimeframe: document.getElementById("inpWealthTimeframe"),

    // Extra Payments
    extraPaymentForm: document.getElementById("extraPaymentForm"),
    epPropertySelect: document.getElementById("epPropertySelect"),
    epDate: document.getElementById("epDate"),
    epAmount: document.getElementById("epAmount"),
    btnSaveExtraPayment: document.getElementById("btnSaveExtraPayment"),
    tbExtraPayments: document.getElementById("tbExtraPayments"),

    // Bonus Input
    inpBonus: document.getElementById("inpBonus"),
    inpRetirementAge: document.getElementById("inpRetirementAge"),
    inpRothRetirementAge: document.getElementById("inpRothRetirementAge"),
    inpWithdrawalRetAge: document.getElementById("inpWithdrawalRetAge"),
    inpRothWithdrawalRetAge: document.getElementById("inpRothWithdrawalRetAge"),
    inpWithdrawalRate: document.getElementById("inpWithdrawalRate"),
    inpRothWithdrawalRate: document.getElementById("inpRothWithdrawalRate"),

    // Tab Triggers
    tabButtons: document.querySelectorAll(".nav-link"),
    tabContents: document.querySelectorAll(".tab-content"),

    // Roth Ouptuts
    outRoth55: document.getElementById("outRoth55"),
    outRothRet: document.getElementById("outRothRet"),
    outRothWithdrawalStartAge: document.getElementById(
      "outRothWithdrawalStartAge",
    ),
    outRothWithdrawalStartBal: document.getElementById(
      "outRothWithdrawalStartBal",
    ),
    outRothWithdrawalResultVal: document.getElementById(
      "outRothWithdrawalResultVal",
    ),
    outRothWithdrawalDepleteAge: document.getElementById(
      "outRothWithdrawalDepleteAge",
    ),
    tbRoth: document.getElementById("tbRoth"),
    tbRothWithdrawal: document.getElementById("tbRothWithdrawal"),

    // Paystub Entry
    paystubForm: document.getElementById("paystubForm"),
    psDate: document.getElementById("psDate"),
    psGross: document.getElementById("psGross"),
    psExtraPay: document.getElementById("psExtraPay"),
    psFedTax: document.getElementById("psFedTax"),
    psStateTax: document.getElementById("psStateTax"),
    psStateOther: document.getElementById("psStateOther"),
    psSSTax: document.getElementById("psSSTax"),
    psMedTax: document.getElementById("psMedTax"),
    psMedIns: document.getElementById("psMedIns"),
    psDenIns: document.getElementById("psDenIns"),
    psVisIns: document.getElementById("psVisIns"),
    psLifeIns: document.getElementById("psLifeIns"),
    psOtherIns: document.getElementById("psOtherIns"),
    psHsa: document.getElementById("psHsa"),
    ps401k: document.getElementById("ps401k"),
    psNotes: document.getElementById("psNotes"),

    // Observability Dashboard
    inpDashboardYear: document.getElementById("inpDashboardYear"),
    kpiTaxRate: document.getElementById("kpiTaxRate"),
    kpiInsRate: document.getElementById("kpiInsRate"),
    kpiRetRate: document.getElementById("kpiRetRate"),
    outMortgageInterestSaved: document.getElementById(
      "outMortgageInterestSaved",
    ),
    outMortgageYearsSaved: document.getElementById("outMortgageYearsSaved"),
    // Property Details Tab
    detailsPropertySelect: document.getElementById("detailsPropertySelect"),
    outDetailsPurchasePrice: document.getElementById("outDetailsPurchasePrice"),
    outDetailsInterestRate: document.getElementById("outDetailsInterestRate"),
    outDetailsMonthlyPmt: document.getElementById("outDetailsMonthlyPmt"),
    outDetailsRemainingBalance: document.getElementById("outDetailsRemainingBalance"),
    outDetailsEquity: document.getElementById("outDetailsEquity"),
    outDetailsEquityPct: document.getElementById("outDetailsEquityPct"),
    outDetailsEstValue: document.getElementById("outDetailsEstValue"),
    outDetailsPayoffDate: document.getElementById("outDetailsPayoffDate"),
    outDetailsMonthlyPrincipal: document.getElementById("outDetailsMonthlyPrincipal"),
    outDetailsMonthlyInterest: document.getElementById("outDetailsMonthlyInterest"),
    outDetailsMonthlyTax: document.getElementById("outDetailsMonthlyTax"),
    outDetailsMonthlyInsurance: document.getElementById("outDetailsMonthlyInsurance"),
    outDetailsMonthlyOverage: document.getElementById("outDetailsMonthlyOverage"),
    
    // Loan Payment Logging
    loanPaymentForm: document.getElementById("loanPaymentForm"),
    lpDate: document.getElementById("lpDate"),
    lpTotal: document.getElementById("lpTotal"),
    lpPrincipal: document.getElementById("lpPrincipal"),
    lpInterest: document.getElementById("lpInterest"),
    lpTax: document.getElementById("lpTax"),
    lpInsurance: document.getElementById("lpInsurance"),
    lpOverage: document.getElementById("lpOverage"),
    lpNotes: document.getElementById("lpNotes"),
    btnLogLoanPayment: document.getElementById("btnLogLoanPayment"),
    tbLoanPayments: document.getElementById("tbLoanPayments"),

    // Investment Account Entry
    investmentForm: document.getElementById("investmentForm"),
    invId: document.getElementById("invId"),
    invName: document.getElementById("invName"),
    invType: document.getElementById("invType"),
    invValue: document.getElementById("invValue"),
    invGrowth: document.getElementById("invGrowth"),
    valInvGrowth: document.getElementById("valInvGrowth"),
    btnSaveInvestment: document.getElementById("btnSaveInvestment"),
    tbInvestments: document.getElementById("tbInvestments"),
  };

  // --- Global State ---
  const state = {
    taxMode: "simple",
    mortMode: "simple",
    timelineYears: 25, // Global standard timeline
    isInitialLoad: true, // Guard against pushes during boot
    currentYear: new Date().getFullYear(),
    dataSplit: [],
    data401k: [],
    dataRoth: [],
    data401kWithdrawal: [],
    dataRothWithdrawal: [],
    withdrawalSim: {
      startBal: 0,
      startAge: 0,
      yearsLasted: 0,
      depleteAge: null,
      hit99Bal: 0,
      hit99: false,
    },
    rothWithdrawalSim: {
      startBal: 0,
      startAge: 0,
      yearsLasted: 0,
      depleteAge: null,
      hit99Bal: 0,
      hit99: false,
    },
    dataSalary: [],
    dataMortgage: [],
    dataNetWorth: [],
    dataPaystubs: [], // Used for Observability Dashboard
    properties: [],
    extraPayments: [],
    valuations: {}, // keyed by property id
    dashboardYearFilter: "All",
    observabilityMetrics: {
      totalGross: 0,
      totalTaxes: 0,
      totalIns: 0,
      total401k: 0,
      totalNet: 0,
    },
    crossover: {
      fired: false,
      year: null,
      month: null,
      moPayment: 0,
      actualInterestPaid: 0,
    },
    mortgageTotalStandardInterest: 0,
    selectedPropertyId: null,
    propertyAmortization: {}, // keyed by property id
    loanPayments: {}, // Added for historical tracking
    dataHistorical: [], // Added for ledger tracking
    wealthActualsData: [], // Added for Actuals vs Projections chart
    investments: [], // Added for Investment Account Entry
  };

  // --- UI Listeners ---
  // --- Global Settings Toggle ---
  let panelOpen = localStorage.getItem("globalSettingsOpen") !== "false";

  // Set Initial Visibility
  function updatePanelUI(isOpen, immediate = false) {
    if (immediate) {
      elements.globalInputsPanel.style.transition = "none";
    }
    if (isOpen) {
      elements.globalInputsPanel.style.maxHeight = "50vh";
      elements.toggleText.textContent = "Hide Global Settings";
      elements.toggleIcon.style.transform = "rotate(0deg)";
    } else {
      elements.globalInputsPanel.style.maxHeight = "0px";
      elements.toggleText.textContent = "Show Global Settings";
      elements.toggleIcon.style.transform = "rotate(180deg)";
    }
    if (immediate) {
      elements.globalInputsPanel.offsetHeight; // force reflow
      elements.globalInputsPanel.style.transition = "";
    }
  }

  // Run initial state
  updatePanelUI(panelOpen, true);

  // Export toggle function for external use (tab switching)
  function toggleGlobalSettings(forceOpen = null) {
    if (forceOpen !== null) {
      panelOpen = forceOpen;
    } else {
      panelOpen = !panelOpen;
    }
    localStorage.setItem("globalSettingsOpen", panelOpen);
    updatePanelUI(panelOpen);
  }

  elements.headerToggle.addEventListener("click", () => toggleGlobalSettings());

  elements.btnTaxMode.addEventListener("click", () => {
    state.taxMode = state.taxMode === "simple" ? "advanced" : "simple";
    if (state.taxMode === "advanced") {
      elements.taxSimpleMode.classList.add("hidden");
      elements.taxAdvMode.classList.remove("hidden");
      elements.btnTaxMode.textContent = "Simple";
    } else {
      elements.taxAdvMode.classList.add("hidden");
      elements.taxSimpleMode.classList.remove("hidden");
      elements.btnTaxMode.textContent = "Advanced";
    }
    runAllCalculations();
  });

  elements.tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      elements.tabButtons.forEach((b) =>
        b.classList.remove("active", "border-brand-500", "text-white"),
      );
      elements.tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active", "border-brand-500", "text-white");
      btn.classList.remove("border-transparent", "text-slate-400");
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");

      // Persist the active tab
      localStorage.setItem("activeTab", targetId);

      // Only fetch historical data when the tab is opened
      if (targetId === "tab-historical") {
        fetchHistoricalDataFromAPI();
      }

      if (targetId === "tab-wealth-actuals") {
        window.calcWealthActuals();
      }

      if (targetId === "tab-paystub") {
        populatePaystubFromGlobals();
      }

      if (targetId === "tab-observability") {
        calcObservabilityDashboard();
      }

      if (targetId === "tab-property-details") {
        populateDetailsPropertySelect();
      }

      renderCharts(targetId); // only resize/render the visible chart

      if (targetId === "tab-home") {
        updateHomeScreenMetrics();
        // Requirement: Global Settings should always be hidden on homepage unless expanded
        if (panelOpen) {
          toggleGlobalSettings(false);
        }
      }
    });
  });

  function populateDetailsPropertySelect() {
    if (!elements.detailsPropertySelect) return;
    const currentVal = elements.detailsPropertySelect.value;
    elements.detailsPropertySelect.innerHTML =
      '<option value="">-- Choose Property --</option>';
    state.properties.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      const addr = p.address_street
        ? `${p.address_street}, ${p.address_city}`
        : p.address || "Unknown Property";
      opt.textContent = addr;
      elements.detailsPropertySelect.appendChild(opt);
    });
    if (currentVal && state.properties.some((p) => p.id == currentVal)) {
      elements.detailsPropertySelect.value = currentVal;
    } else if (state.properties.length > 0 && !state.selectedPropertyId) {
      // Auto-select first if none selected
      elements.detailsPropertySelect.value = state.properties[0].id;
      state.selectedPropertyId = state.properties[0].id;
      updatePropertyDetailsUI();
    }
  }

  function updatePropertyDetailsUI() {
    const propId = elements.detailsPropertySelect.value;
    state.selectedPropertyId = propId;
    const prop = state.properties.find((p) => p.id == propId);

    if (prop) {
      elements.outDetailsPurchasePrice.textContent = fmtCurrency.format(
        prop.purchase_price,
      );
      elements.outDetailsInterestRate.textContent = `${(prop.interest_rate * 100).toFixed(3)}%`;

      // Calc single pmt
      const r = prop.interest_rate / 12;
      const n = prop.loan_term_months;
      const principal = prop.initial_loan_value || prop.purchase_price;
      let pmt = 0;
      if (n > 0 && r > 0) {
        pmt = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      } else if (n > 0) {
        pmt = principal / n;
      }
      elements.outDetailsMonthlyPmt.textContent = fmtCurrency.format(pmt);

      // Remaining balance — closed-form calculation using exact months elapsed from
      // loan_start_date to today. Recalculates on every page load so it stays
      // current as time passes without requiring any DB reads.
      const startDateForBal = prop.loan_start_date || prop.purchase_date;
      let remainingBal = principal; // default to full loan if no start date
      if (startDateForBal && r > 0 && n > 0) {
        const loanStart = new Date(startDateForBal);
        const now = new Date();
        // Count full monthly payment cycles elapsed
        const monthsElapsed = Math.max(
          0,
          (now.getFullYear() - loanStart.getFullYear()) * 12 +
          (now.getMonth() - loanStart.getMonth())
        );
        const paymentsMade = Math.min(monthsElapsed, n);
        if (paymentsMade > 0) {
          const compound = Math.pow(1 + r, paymentsMade);
          remainingBal = Math.max(0, principal * compound - pmt * (compound - 1) / r);
        }
      }
      if (elements.outDetailsRemainingBalance) {
        elements.outDetailsRemainingBalance.textContent = fmtCurrency.format(remainingBal);
      }

      // --- Estimated Equity KPI block ---
      // Reason: current value estimate uses 2%/yr appreciation from purchase_date,
      // same rate used by the equity growth chart for consistency.
      const startDateForEq = prop.loan_start_date || prop.purchase_date;
      let estCurrentValue = prop.purchase_price || 0;
      if (startDateForEq) {
        const eqStart = new Date(startDateForEq);
        const eqNow   = new Date();
        const yearsOwned =
          (eqNow.getFullYear() - eqStart.getFullYear()) +
          (eqNow.getMonth() - eqStart.getMonth()) / 12;
        estCurrentValue = (prop.purchase_price || 0) * Math.pow(1.02, Math.max(0, yearsOwned));
      }
      const estEquity    = Math.max(0, estCurrentValue - remainingBal);
      const estEquityPct = estCurrentValue > 0 ? (estEquity / estCurrentValue) * 100 : 0;

      if (elements.outDetailsEquity)
        elements.outDetailsEquity.textContent = fmtCurrency.format(estEquity);
      if (elements.outDetailsEquityPct)
        elements.outDetailsEquityPct.textContent = `${estEquityPct.toFixed(1)}% owned`;
      if (elements.outDetailsEstValue)
        elements.outDetailsEstValue.textContent = fmtCurrency.format(estCurrentValue);

      // Projected payoff date — today + remaining amortization months
      (() => {
        if (!elements.outDetailsPayoffDate) return;
        const amort = state.propertyAmortization[propId] || [];
        if (amort.length === 0) {
          elements.outDetailsPayoffDate.textContent = "—";
          return;
        }
        // Each entry = 1 year; last entry's endBal should be ~0
        const yearsRemaining = amort.length;
        const payoff = new Date();
        payoff.setFullYear(payoff.getFullYear() + yearsRemaining);
        elements.outDetailsPayoffDate.textContent =
          payoff.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      })();


      // Tax/Insurance averaged from logged payments (if any), else $0.
      const rBreak = (prop.interest_rate || 0) / 12;
      const nBreak = prop.loan_term_months || 0;
      const pvBreak = prop.initial_loan_value || prop.purchase_price || 0;
      let pmtBreak = 0;
      if (nBreak > 0 && rBreak > 0) {
        pmtBreak = (pvBreak * (rBreak * Math.pow(1 + rBreak, nBreak))) / (Math.pow(1 + rBreak, nBreak) - 1);
      } else if (nBreak > 0) {
        pmtBreak = pvBreak / nBreak;
      }
      // Reason: Interest portion for payment 1 = balance * monthly rate
      const monthlyInterestBreak = pvBreak * rBreak;
      const monthlyPrincipalBreak = pmtBreak - monthlyInterestBreak;

      // Average tax/insurance from logged payments if available
      const propPayments = (state.loanPayments && state.loanPayments[propId]) || [];
      let avgTax = 0, avgIns = 0, avgOver = 0;
      if (propPayments.length > 0) {
        avgTax = propPayments.reduce((s, p) => s + (p.tax_amount || 0), 0) / propPayments.length;
        avgIns = propPayments.reduce((s, p) => s + (p.insurance_amount || 0), 0) / propPayments.length;
        avgOver = propPayments.reduce((s, p) => s + (p.overage_amount || 0), 0) / propPayments.length;
      }

      elements.outDetailsMonthlyPrincipal.textContent = fmtCurrency.format(monthlyPrincipalBreak);
      elements.outDetailsMonthlyInterest.textContent = fmtCurrency.format(monthlyInterestBreak);
      elements.outDetailsMonthlyTax.textContent = fmtCurrency.format(avgTax);
      elements.outDetailsMonthlyInsurance.textContent = fmtCurrency.format(avgIns);
      elements.outDetailsMonthlyOverage.textContent = fmtCurrency.format(avgOver);


      // Fetch valuations for this property
      fetchValuationsForProperty(propId);
      // Fetch actual payments for this property
      fetchLoanPayments(propId);
    } else {
      elements.outDetailsPurchasePrice.textContent = "$0.00";
      elements.outDetailsInterestRate.textContent = "0.000%";
      elements.outDetailsMonthlyPmt.textContent = "$0.00";
      if (elements.outDetailsRemainingBalance) elements.outDetailsRemainingBalance.textContent = "$0.00";
      elements.outDetailsMonthlyPrincipal.textContent = "$0";
      elements.outDetailsMonthlyInterest.textContent = "$0";
      elements.outDetailsMonthlyTax.textContent = "$0";
      elements.outDetailsMonthlyInsurance.textContent = "$0";
      elements.outDetailsMonthlyOverage.textContent = "$0";
      
      if (elements.tbLoanPayments) {
        elements.tbLoanPayments.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-slate-500 italic">Select a property to view payment history.</td></tr>`;
      }
    }

    runAllCalculations();
  }

  elements.detailsPropertySelect?.addEventListener("change", () => {
    updatePropertyDetailsUI();
  });

  async function fetchValuationsForProperty(propId) {
    try {
      const resp = await fetch(
        API_URL_PROPERTIES + `/${propId}/valuations?user_id=1`,
      );
      if (resp.ok) {
        const data = await resp.json();
        state.valuations[propId] = data.sort(
          (a, b) => new Date(a.valuation_date) - new Date(b.valuation_date),
        );
        renderCharts("tab-property-details");
      }
    } catch (e) {
      console.error("Scale fetch valuations error:", e);
    }
  }

  async function fetchLoanPayments(propId) {
    if (!propId) return;
    try {
      const resp = await fetch(API_URL_PROPERTIES + `/${propId}/payments?user_id=1`);
      if (resp.ok) {
        state.loanPayments[propId] = await resp.json();
        renderLoanPaymentsTable(propId);
        runAllCalculations(); // History might affect projections
      }
    } catch (e) {
      console.error("Failed to fetch loan payments:", e);
    }
  }

  function renderLoanPaymentsTable(propId) {
    if (!elements.tbLoanPayments) return;
    const payments = (state.loanPayments[propId] || [])
      .slice()
      .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

    // --- Update Monthly Payment KPI & Breakdown from most-recent logged payment ---
    const mostRecent = payments[0] || null;
    if (mostRecent) {
      // KPI: use the actual total payment logged
      elements.outDetailsMonthlyPmt.textContent = fmtCurrency.format(mostRecent.total_payment || 0);
      // Breakdown: pull every field directly from that entry
      elements.outDetailsMonthlyPrincipal.textContent = fmtCurrency.format(mostRecent.principal_amount || 0);
      elements.outDetailsMonthlyInterest.textContent  = fmtCurrency.format(mostRecent.interest_amount  || 0);
      elements.outDetailsMonthlyTax.textContent       = fmtCurrency.format(mostRecent.tax_amount       || 0);
      elements.outDetailsMonthlyInsurance.textContent = fmtCurrency.format(mostRecent.insurance_amount || 0);
      elements.outDetailsMonthlyOverage.textContent   = fmtCurrency.format(mostRecent.overage_amount   || 0);
    } else {
      // No payments logged yet — show the amortization-estimated total and zeros
      const prop = state.properties.find(pr => pr.id === propId);
      if (prop) {
        const r = (prop.interest_rate || 0) / 12;
        const n = prop.loan_term_months || 0;
        const pv = prop.initial_loan_value || prop.purchase_price || 0;
        let pmtEst = 0;
        if (n > 0 && r > 0) {
          pmtEst = (pv * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
        } else if (n > 0) {
          pmtEst = pv / n;
        }
        elements.outDetailsMonthlyPmt.textContent = fmtCurrency.format(pmtEst) + " (est.)";
      }
      elements.outDetailsMonthlyPrincipal.textContent = "$0.00";
      elements.outDetailsMonthlyInterest.textContent  = "$0.00";
      elements.outDetailsMonthlyTax.textContent       = "$0.00";
      elements.outDetailsMonthlyInsurance.textContent = "$0.00";
      elements.outDetailsMonthlyOverage.textContent   = "$0.00";
    }

    // --- Render table rows ---
    if (payments.length === 0) {
      elements.tbLoanPayments.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-slate-500 italic">No historical payments logged yet.</td></tr>`;
      return;
    }

    elements.tbLoanPayments.innerHTML = payments
      .map((p) => `
        <tr class="hover:bg-white/5 transition-colors group${p.id === mostRecent.id ? ' border-l-2 border-brand-400' : ''}">
          <td class="py-2 px-2 text-slate-400">${p.payment_date}${p.id === mostRecent.id ? ' <span class="text-[9px] text-brand-400 font-bold">LATEST</span>' : ''}</td>
          <td class="py-2 px-2 text-right text-brand-300 font-bold">${fmtCurrency.format(p.principal_amount)}</td>
          <td class="py-2 px-2 text-right text-brand-300 font-bold">${fmtCurrency.format(p.interest_amount)}</td>
          <td class="py-2 px-2 text-right text-slate-400 font-bold">${fmtCurrency.format(p.tax_amount)}</td>
          <td class="py-2 px-2 text-right text-slate-400 font-bold">${fmtCurrency.format(p.insurance_amount)}</td>
          <td class="py-2 px-2 text-right text-slate-400 font-bold">${fmtCurrency.format(p.overage_amount)}</td>
          <td class="py-2 px-2 text-right text-white font-bold font-bold">${fmtCurrency.format(p.total_payment)}</td>
          <td class="py-2 px-2 text-center text-bold">
            <button onclick="deleteLoanPayment(${p.property_id}, ${p.id})" class="text-slate-600 hover:text-red-400 transition-colors" title="Delete record">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </td>
        </tr>
      `).join("");
  }

  window.deleteLoanPayment = async (propId, paymentId) => {
    if (!confirm("Delete this payment record?")) return;
    try {
      const resp = await fetch(API_URL_PROPERTIES + `/${propId}/payments/${paymentId}?user_id=1`, {
        method: "DELETE"
      });
      if (resp.ok) {
        fetchLoanPayments(propId);
      }
    } catch (e) {
      console.error("Delete loan payment error:", e);
    }
  };

  const updateSliderLabels = () => {
    elements.valRaise.textContent = `${Number(elements.inpRaise.value).toFixed(2)}%`;
    elements.val401kGrowth.textContent = `${Number(elements.inp401kGrowth.value).toFixed(2)}%`;
    elements.valRothGrowth.textContent = `${Number(elements.inpRothGrowth.value).toFixed(2)}%`;
    elements.valTaxableGrowth.textContent = `${Number(elements.inpTaxableGrowth.value).toFixed(2)}%`;
    if (elements.valInvGrowth) {
      elements.valInvGrowth.textContent = `${Number(elements.invGrowth.value).toFixed(2)}%`;
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const attachInputListeners = () => {
    const triggers = Object.values(elements).filter(
      (el) => el && (el.tagName === "INPUT" || el.tagName === "SELECT"),
    );
    triggers.forEach((input) => {
      if (input.type === "range") {
        input.addEventListener("input", () => {
          updateSliderLabels();
          runAllCalculations();
        });
      } else if (
        [
          "inpSalary",
          "inp401kBal",
          "inpTaxableBal",
          "inpAdvFed",
          "inpAdvSS",
          "inpAdvMed",
          "inpAdvState",
          "inpAdvEscrow",
          "inpAdvMedIns",
          "inpAdvDental",
          "inpAdvVision",
          "inpAdvLife",
          "psGross",
          "psFedTax",
          "psStateTax",
          "psSSTax",
          "psMedTax",
          "psMedIns",
          "psDenIns",
          "psVisIns",
          "psLifeIns",
          "psHsa",
          "ps401k",
          "inpRothBal",
          "psNet",
          "inpRothRetirementAge",
          "inpRothWithdrawalRetAge",
          "propPurchasePrice",
          "propInitLoan",
          "propInterest",
          "propRate",
          "propReconBal",
          "propReconciledBalance",
          "epAmount",
          "lpTotal",
          "lpPrincipal",
          "lpInterest",
          "lpTax",
          "lpInsurance",
          "lpOverage",
          "invValue",
        ].includes(input.id)
      ) {
        input.addEventListener("input", (e) => {
          let val = e.target.value.replace(/[^\d.]/g, "");
          const parts = val.split(".");
          if (parts[0]) {
            parts[0] = parseInt(parts[0]).toLocaleString("en-US");
          }
          if (parts.length > 2) {
            e.target.value = parts[0] + "." + parts.slice(1).join("");
          } else {
            e.target.value = parts.join(".");
          }
        });
        input.addEventListener("keyup", debounce(runAllCalculations, 350));
        input.addEventListener("change", runAllCalculations);
      } else if (input.type === "number") {
        input.addEventListener("keyup", debounce(runAllCalculations, 350));
        input.addEventListener("change", runAllCalculations);
      } else if (input.tagName === "SELECT") {
        input.addEventListener("change", runAllCalculations);
      }
    });

    // Capture Historical Snapshot
    const btnCapture = document.getElementById("btnCaptureSnapshot");
    if (btnCapture) {
      btnCapture.addEventListener("click", pushHistoricalSnapshot);
    }

    // Observability Filters
    if (elements.inpDashboardYear) {
      elements.inpDashboardYear.addEventListener("change", (e) => {
        state.dashboardYearFilter = e.target.value;
        calcObservabilityDashboard();
        renderCharts("tab-observability");
      });
    }

    if (elements.btnSaveProperty) {
      elements.btnSaveProperty.addEventListener("click", async () => {
        if (!elements.propertyForm.checkValidity()) {
          elements.propertyForm.reportValidity();
          return;
        }
        const rawPrice =
          parseFloat(elements.propPurchasePrice.value.replace(/,/g, "")) || 0;
        const rawInitLoan =
          parseFloat(elements.propInitLoan.value.replace(/,/g, "")) || 0;

        const rawRecon =
          parseFloat(elements.propReconBal.value.replace(/,/g, "")) ||
          null;

        const payload = {
          property_type: elements.propType.value,
          address_street: elements.propAddress.value,
          address_city: elements.propCity.value,
          address_state: elements.propState.value,
          address_zip: elements.propZip.value,
          purchase_date: elements.propPurchaseDate.value,
          purchase_price: rawPrice,
          loan_start_date: elements.propLoanDate.value || null,
          loan_term_months: parseInt(elements.propLoanTerm.value) || 360,
          payment_frequency: elements.propPayFreq.value,
          initial_loan_value: rawInitLoan || rawPrice,
          interest_rate: (parseFloat(elements.propRate.value) || 0) / 100,
          loan_type: elements.propLoanType.value,
          reconciled_balance: rawRecon,
          reconciliation_date: elements.propReconciliationDate.value || null,
        };
        const propIdVal = elements.propId.value;
        const url = propIdVal 
          ? API_URL_PROPERTIES + `/${propIdVal}?user_id=1` 
          : API_URL_PROPERTIES + "?user_id=1";
        const method = propIdVal ? "PUT" : "POST";

        try {
          const resp = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (resp.ok) {
            elements.propId.value = "";
            elements.btnSaveProperty.textContent = "Save Property";
            elements.propertyForm.reset();
            // Explicitly clear split fields
            elements.propAddress.value = "";
            elements.propCity.value = "";
            elements.propState.value = "";
            elements.propZip.value = "";
            elements.propReconBal.value = "";
            elements.propReconciledBalance.value = "";
            elements.propReconciliationDate.value = "";
            elements.propLoanType.value = "Conventional";
            await fetchPropertiesFromAPI();
            await fetchAllExtraPayments();
            runAllCalculations();
          } else {
            alert("Failed to save property");
          }
        } catch (e) {
          console.error("Save property error:", e);
        }
      });
    }

    if (elements.btnSaveInvestment) {
      elements.btnSaveInvestment.addEventListener("click", async () => {
        if (!elements.investmentForm.checkValidity()) {
          elements.investmentForm.reportValidity();
          return;
        }

        const rawValue = parseFloat(elements.invValue.value.replace(/,/g, "")) || 0;
        const payload = {
          name: elements.invName.value,
          account_type: elements.invType.value,
          current_value: rawValue,
          growth_target: parseFloat(elements.invGrowth.value) || 0,
        };

        const invIdVal = elements.invId.value;
        const url = invIdVal 
          ? API_URL_INVESTMENTS + `/${invIdVal}?user_id=1` 
          : API_URL_INVESTMENTS + "?user_id=1";
        const method = invIdVal ? "PUT" : "POST";

        try {
          const resp = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (resp.ok) {
            elements.invId.value = "";
            elements.btnSaveInvestment.textContent = "Save Account";
            elements.investmentForm.reset();
            updateSliderLabels();
            await fetchInvestmentsFromAPI();
          } else {
            alert("Failed to save investment account");
          }
        } catch (e) {
          console.error("Save investment error:", e);
        }
      });
    }

    if (elements.loanPaymentForm) {
      elements.loanPaymentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const propId = elements.detailsPropertySelect.value;
        if (!propId) {
          alert("Please select a property first.");
          return;
        }

        const payload = {
          payment_date: elements.lpDate.value,
          principal_amount: parseFloat(elements.lpPrincipal.value.replace(/,/g, "")) || 0,
          interest_amount: parseFloat(elements.lpInterest.value.replace(/,/g, "")) || 0,
          tax_amount: parseFloat(elements.lpTax.value.replace(/,/g, "")) || 0,
          insurance_amount: parseFloat(elements.lpInsurance.value.replace(/,/g, "")) || 0,
          overage_amount: parseFloat(elements.lpOverage.value.replace(/,/g, "")) || 0,
          total_payment: parseFloat(elements.lpTotal.value.replace(/,/g, "")) || 0,
          notes: elements.lpNotes.value || null
        };

        try {
          const resp = await fetch(API_URL_PROPERTIES + `/${propId}/payments?user_id=1`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (resp.ok) {
            elements.loanPaymentForm.reset();
            fetchLoanPayments(propId);
          }
        } catch (err) {
          console.error("Failed to log loan payment:", err);
        }
      });
    }

    if (elements.btnSaveExtraPayment) {
      elements.btnSaveExtraPayment.addEventListener("click", async () => {
        if (!elements.extraPaymentForm.checkValidity()) {
          elements.extraPaymentForm.reportValidity();
          return;
        }
        const propId = elements.epPropertySelect.value;
        const rawAmt =
          parseFloat(elements.epAmount.value.replace(/,/g, "")) || 0;
        const payload = { payment_date: elements.epDate.value, amount: rawAmt };
        try {
          const resp = await fetch(
            API_URL_PROPERTIES + `/${propId}/extra-payments?user_id=1`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            },
          );
          if (resp.ok) {
            elements.extraPaymentForm.reset();
            await fetchAllExtraPayments();
            runAllCalculations();
          } else {
            const err = await resp.json();
            alert(
              "Failed to save extra payment: " +
                (err.detail || "Unknown error"),
            );
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  };

  // --- Core Calculation Engine ---

  const debouncedPushSettings = debounce(pushSettingsToAPI, 1000);

  function renderAmortizationTable() {
    if (!elements.tbMortgage) return;
    elements.tbMortgage.innerHTML = "";

    const isDetailsTab = document
      .getElementById("tab-property-details")
      .classList.contains("active");
    const data = isDetailsTab
      ? state.propertyAmortization[state.selectedPropertyId] || []
      : state.dataMortgage;

    data.forEach((d) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td class="py-2 px-4">${state.currentYear + d.year - 1}</td>
                <td class="py-2 px-4">${state.ageAtStart + d.year - 1}</td>
                <td class="py-2 px-4 text-right">${fmtCurrency.format(d.beginBal)}</td>
                <td class="py-2 px-4 text-right text-green-400 font-medium">+${fmtCurrency.format(d.principalPaid)}</td>
                <td class="py-2 px-4 text-right text-red-400 font-medium">${fmtCurrency.format(d.interestPaid)}</td>
                <td class="py-2 px-4 text-right font-bold text-white border-l border-dark-border/30">${fmtCurrency.format(d.endBal)}</td>
            `;
      elements.tbMortgage.appendChild(row);
    });

    if (isDetailsTab) {
      const propId = state.selectedPropertyId;
      const prop = state.properties.find((p) => p.id == propId);
      if (prop && state.propertyAmortization[propId]) {
        const sched = state.propertyAmortization[propId];
        const actualInt = sched.reduce((sum, d) => sum + d.interestPaid, 0);

        const r = prop.interest_rate / 12;
        const n = prop.loan_term_months;
        const principal = prop.initial_loan_value || prop.purchase_price;
        let pmt = 0;
        if (n > 0 && r > 0) {
          pmt = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
        } else if (n > 0) {
          pmt = principal / n;
        }

        let tempBal = sched.length > 0 ? sched[0].beginBal : 0;
        let baseInt = 0;
        let baseMonths = 0;
        while (tempBal > 0.01 && baseMonths < 600) {
          let intr = tempBal * r;
          baseInt += intr;
          let p = pmt - intr;
          if (tempBal - p < 0) p = tempBal;
          tempBal -= p;
          baseMonths++;
        }

        const savedInt = Math.max(0, baseInt - actualInt);
        const yearsSaved = Math.max(0, Math.ceil(baseMonths / 12) - sched.length);

        elements.outMortgageInterestSaved.textContent = fmtCurrency.format(savedInt);
        elements.outMortgageYearsSaved.textContent = `${yearsSaved} Years`;
      }
    } else {
      elements.outMortgageInterestSaved.textContent = fmtCurrency.format(state.mortgageInterestSaved);
      elements.outMortgageYearsSaved.textContent = `${state.mortgageYearsSaved} Years`;
    }
  }

  function runAllCalculations() {
    const parsed = parseGlobalInputs();
    state.parsedGlobal = parsed;
    state.age = parsed.age;

    calcTab1Split(parsed);
    calcTab2401k(parsed);
    calcTabRothIRA(parsed);
    calcTab3401kWithdrawal(parsed);
    calcTabRothIRAWithdrawal(parsed);
    calcTab3Salary(parsed);
    calcTab4Mortgage(parsed);
    calcTab5NetWorth(parsed);
    window.calcWealthActuals();

    renderTables();
    renderCharts("all"); // Render all if possible, or trigger active
    updateHomeScreenMetrics();

    debouncedPushSettings();
  }

  function updateHomeScreenMetrics() {
    const parsed = parseGlobalInputs();
    if (!parsed) return;

    // 1. Total Estimated Net Worth
    const netWorthEl = document.getElementById("home-networth");
    if (netWorthEl) {
      if (state.dataHistorical && state.dataHistorical.length > 0) {
        // Priority: Pull exact captured Net Worth from the Ledger
        netWorthEl.textContent = fmtCurrency.format(
          state.dataHistorical[0].net_worth,
        );
      } else {
        // Fallback: Estimate from raw global inputs
        let totalNW =
          (parsed.k401Bal || 0) +
          (parsed.rothStartBal || 0) +
          (parsed.taxableBal || 0);

        // Add YTD Net Pay from paystubs
        const currentYear = new Date().getFullYear();
        const ytdData = state.dataPaystubs.filter(
          (d) => new Date(d.pay_date).getFullYear() === currentYear,
        );
        const ytdNet = ytdData.reduce((acc, d) => acc + d.net_pay, 0);

        totalNW += ytdNet;
        netWorthEl.textContent = fmtCurrency.format(totalNW);
      }
    }

    // 2. Effective Pay Rate
    const hourlyEl = document.getElementById("home-hourly");
    if (hourlyEl) {
      // PRIORITY: Pull from the most recent paystub
      const latestPs = state.dataPaystubs[0]; // Sorted descending in fetchHistoricalDataFromAPI
      if (latestPs) {
        let hoursPerPeriod = 80;
        if (parsed.payPeriods) {
          hoursPerPeriod = 2080 / parsed.payPeriods;
        }
        const totalGross =
          (latestPs.gross_pay || 0) + (latestPs.extra_pay || 0);
        const effectiveHourly = totalGross / hoursPerPeriod;
        hourlyEl.textContent = `$${effectiveHourly.toFixed(2)}/hr`;
      } else {
        // FALLBACK: Global theoretical calculation
        const grossPerPeriod =
          parsed.payPeriods > 0 ? (parsed.salary || 0) / parsed.payPeriods : 0;
        const totalTaxes =
          (parsed.fedTaxPct +
            parsed.ssTaxPct +
            parsed.medTaxPct +
            parsed.stateTaxPct) *
          grossPerPeriod;
        const totalIns =
          (parsed.medIns || 0) +
          (parsed.dentalIns || 0) +
          (parsed.visionIns || 0) +
          (parsed.lifeIns || 0) +
          (parsed.otherIns || 0);
        const netPay =
          grossPerPeriod -
          totalTaxes -
          totalIns -
          grossPerPeriod * (parsed.k401PersonalPct || 0);

        // Calculate effective hourly (annualized net pay / 2080 standard hours)
        const effectiveHourly = (netPay * parsed.payPeriods) / 2080;
        hourlyEl.textContent = isNaN(effectiveHourly)
          ? "$0.00/hr"
          : `$${effectiveHourly.toFixed(2)}/hr`;
      }
    }

    // 3. Savings Rate
    const savingsEl = document.getElementById("home-savings");
    if (savingsEl) {
      const matchAmount = Math.min(
        (parsed.salary || 0) *
          (parsed.k401PersonalPct || 0) *
          (parsed.k401MatchType || 0),
        (parsed.salary || 0) * (parsed.k401MatchLimitPct || 0),
      );
      const autoAmount = (parsed.salary || 0) * (parsed.k401AutoPct || 0);
      const personalAmount =
        (parsed.salary || 0) * (parsed.k401PersonalPct || 0);

      const totalAnnualRetirement = personalAmount + matchAmount + autoAmount;
      const salary = parsed.salary || 1; // avoid div by zero
      const savingsPct = (totalAnnualRetirement / salary) * 100;
      savingsEl.textContent = `${savingsPct.toFixed(1)}%`;
    }
  }

  function parseGlobalInputs() {
    let dob = new Date(elements.inpDob.value);
    if (isNaN(dob)) dob = new Date("1986-01-01");
    // Calculate current age context
    const today = new Date();
    let currentAge = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      currentAge--;
    }
    const payPeriods = elements.inpPayPeriod
      ? parseInt(elements.inpPayPeriod.value) || 52
      : 52;
    const salary = elements.inpSalary
      ? parseFloat(elements.inpSalary.value.replace(/,/g, "")) || 0
      : 0;

    let fedTaxPct = 0,
      stateTaxPct = 0,
      insPremiumPay = 0;
    if (
      state.taxMode === "advanced" &&
      elements.inpAdvFed &&
      elements.inpAdvSS &&
      elements.inpAdvMed &&
      elements.inpAdvState
    ) {
      const advFed =
        parseFloat(elements.inpAdvFed.value.replace(/,/g, "")) || 0;
      const advSS = parseFloat(elements.inpAdvSS.value.replace(/,/g, "")) || 0;
      const advMed =
        parseFloat(elements.inpAdvMed.value.replace(/,/g, "")) || 0;
      const advState =
        parseFloat(elements.inpAdvState.value.replace(/,/g, "")) || 0;

      const advMedIns = elements.inpAdvMedIns
        ? parseFloat(elements.inpAdvMedIns.value.replace(/,/g, "")) || 0
        : 0;
      const advDental = elements.inpAdvDental
        ? parseFloat(elements.inpAdvDental.value.replace(/,/g, "")) || 0
        : 0;
      const advVision = elements.inpAdvVision
        ? parseFloat(elements.inpAdvVision.value.replace(/,/g, "")) || 0
        : 0;
      const advLife = elements.inpAdvLife
        ? parseFloat(elements.inpAdvLife.value.replace(/,/g, "")) || 0
        : 0;

      const totalAnnFed = (advFed + advSS + advMed) * payPeriods;
      const totalAnnState = advState * payPeriods;
      fedTaxPct = salary > 0 ? totalAnnFed / salary : 0;
      stateTaxPct = salary > 0 ? totalAnnState / salary : 0;
      insPremiumPay = advMedIns + advDental + advVision + advLife;
    } else if (
      elements.inpFedTax &&
      elements.inpStateTax &&
      elements.inpInsurance
    ) {
      fedTaxPct = parseFloat(elements.inpFedTax.value) / 100 || 0;
      stateTaxPct = parseFloat(elements.inpStateTax.value) / 100 || 0;
      insPremiumPay = parseFloat(elements.inpInsurance.value) || 0;
    }

    return {
      age: currentAge,
      salary: salary,
      raisePct: parseFloat(elements.inpRaise.value) / 100 || 0,
      payPeriods: payPeriods,
      fedTaxPct: fedTaxPct,
      stateTaxPct: stateTaxPct,
      insPremiumPay: insPremiumPay,
      k401PersonalPct: parseFloat(elements.inp401kPersonal.value) / 100 || 0,
      k401MatchType: parseFloat(elements.inp401kMatchType.value) || 0,
      k401MatchLimitPct:
        parseFloat(elements.inp401kMatchLimit.value) / 100 || 0,
      k401AutoPct: parseFloat(elements.inp401kAuto.value) / 100 || 0,
      k401Growth: parseFloat(elements.inp401kGrowth.value) / 100 || 0,
      roth_ira_growth_rate: parseFloat(elements.inpRothGrowth.value) / 100 || 0,
      k401StartBal:
        parseFloat(elements.inp401kBal.value.replace(/,/g, "")) || 0,
      rothStartBal:
        parseFloat(elements.inpRothBal.value.replace(/,/g, "")) || 0,
      taxableStartBal:
        parseFloat(elements.inpTaxableBal.value.replace(/,/g, "")) || 0,
      taxableGrowth: parseFloat(elements.inpTaxableGrowth.value) / 100 || 0,
      targetBonusPct: elements.inpBonus
        ? parseFloat(elements.inpBonus.value) / 100 || 0
        : 0,
      targetRetirementAge: elements.inpRetirementAge
        ? parseInt(elements.inpRetirementAge.value) || 65
        : 65,
      targetRothRetirementAge: elements.inpRothRetirementAge
        ? parseInt(elements.inpRothRetirementAge.value) || 65
        : 65,
      withdrawalRetAge: elements.inpWithdrawalRetAge
        ? parseInt(elements.inpWithdrawalRetAge.value) || 65
        : 65,
      rothWithdrawalRetAge: elements.inpRothWithdrawalRetAge
        ? parseInt(elements.inpRothWithdrawalRetAge.value) || 65
        : 65,
      withdrawalRate: elements.inpWithdrawalRate
        ? parseFloat(elements.inpWithdrawalRate.value) / 100 || 0
        : 0,
      rothWithdrawalRate: elements.inpRothWithdrawalRate
        ? parseFloat(elements.inpRothWithdrawalRate.value) / 100 || 0
        : 0,
      timezone: elements.inpTimezone ? elements.inpTimezone.value : "UTC",
    };
  }

  /**
   * Universal Mortgage Reality Check
   * Calculates the balance of a property as of targetDate (usually projStart)
   * incorporating both state.loanPayments (Actuals) and state.extraPayments (Ad-hoc)
   */
  function calculateMortgageRealityCheck(prop, targetDate) {
    const r = prop.interest_rate / 12;
    const n = prop.loan_term_months;
    const originalBal = prop.initial_loan_value || prop.purchase_price;

    let pmt = 0;
    if (n > 0 && r > 0) {
      pmt = (originalBal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      pmt = originalBal / n;
    }

    let bal = prop.reconciled_balance !== null ? prop.reconciled_balance : originalBal;
    let startDateStr = prop.reconciliation_date || prop.loan_start_date || prop.purchase_date;
    if (!startDateStr) return { bal, pmt, r }; // Safety check

    let simDate = new Date(startDateStr);
    if (isNaN(simDate)) return { bal, pmt, r }; // Safety check
    simDate.setDate(1);

    const expAll = state.extraPayments.filter(ep => ep.property_id === prop.id);
    const actuals = state.loanPayments ? (state.loanPayments[prop.id] || []) : [];

    while (simDate < targetDate && bal > 0.01) {
      simDate.setMonth(simDate.getMonth() + 1);
      
      let interest = bal * r;
      let principal = pmt - interest;
      if (principal < 0 && !actuals.length) {
         // Interest exceeds payment and no actuals to steer; abort simulation
         break;
      }

      // Use ACTUAL payment if logged
      const actualPmt = actuals.find(lp => {
        const d = new Date(lp.payment_date);
        return d.getFullYear() === simDate.getFullYear() && d.getMonth() === simDate.getMonth();
      });

      if (actualPmt && actualPmt.principal_amount > 0) {
        principal = actualPmt.principal_amount;
      }

      const extra = expAll
        .filter(ep => {
          const d = new Date(ep.payment_date);
          return d.getFullYear() === simDate.getFullYear() && d.getMonth() === simDate.getMonth();
        })
        .reduce((sum, ep) => sum + ep.amount, 0);

      let totalP = principal + extra;
      if (bal - totalP < 1) totalP = bal;
      bal -= totalP;
    }
    return { bal, pmt, r };
  }

  function getCurrentMortgageState() {
    const now = new Date();
    const projStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalBal = 0;
    let totalPmt = 0;
    let weightedRateSum = 0;

    state.properties.forEach((prop) => {
      const { bal, pmt, r } = calculateMortgageRealityCheck(prop, projStart);
      if (bal > 0.01) {
        totalBal += bal;
        totalPmt += pmt;
        weightedRateSum += bal * r;
      }
    });

    const avgMonthlyRate = totalBal > 0 ? weightedRateSum / totalBal : 0;
    return { totalBal, totalPmt, avgMonthlyRate };
  }

  // TAB 1: 50/50 Liquidity Split (The Kill Shot)
  function calcTab1Split(p) {
    let currentGross = p.salary;

    let currentFedBucket = currentGross * p.fedTaxPct;
    let currentStateBucket = currentGross * p.stateTaxPct;
    let currentInsBucket = p.insPremiumPay * p.payPeriods;
    let currentRetBucket = currentGross * p.k401PersonalPct;

    const r_inv = p.taxableGrowth / 12;
    const r_roth = p.roth_ira_growth_rate / 12;

    const mortState = getCurrentMortgageState();
    let monthlyMortgagePayment = mortState.totalPmt;
    const r_mort = mortState.avgMonthlyRate;

    state.crossover = {
      fired: false,
      year: null,
      month: null,
      moPayment: monthlyMortgagePayment,
      actualInterestPaid: 0,
    };
    let invBalance = p.taxableStartBal;
    let mortBalance = mortState.totalBal;
    let totalAnnualInvContribStack = 0;

    let actualInterestPaid = 0;

    state.dataSplit = [];

    let currentNetSalary =
      currentGross -
      (currentFedBucket +
        currentStateBucket +
        currentInsBucket +
        currentRetBucket);

    for (let year = 1; year <= state.timelineYears; year++) {
      currentGross = currentGross * (1 + p.raisePct);

      if (year > 1) {
        currentFedBucket *= 1.03; // 3% YoY
        currentStateBucket *= 1.03; // 3% YoY
        currentInsBucket *= 1.05; // 5% YoY
        currentRetBucket = currentGross * p.k401PersonalPct;
      }

      currentNetSalary =
        currentGross -
        (currentFedBucket +
          currentStateBucket +
          currentInsBucket +
          currentRetBucket);

      // 50/50 Math
      const syntheticGrossWithoutRaise = currentGross / (1 + p.raisePct);
      const syntheticNetWithoutRaise =
        syntheticGrossWithoutRaise -
        (currentFedBucket +
          currentStateBucket +
          currentInsBucket +
          currentRetBucket / (1 + p.raisePct));

      let netRaiseAmount = currentNetSalary - syntheticNetWithoutRaise;
      if (netRaiseAmount < 0) netRaiseAmount = 0;

      const newInvestmentAddition = netRaiseAmount / 2;
      totalAnnualInvContribStack += newInvestmentAddition;
      const monthlyContrib = totalAnnualInvContribStack / 12;

      for (let month = 1; month <= 12; month++) {
        invBalance = invBalance * (1 + r_inv) + monthlyContrib;
        if (mortBalance > 0) {
          const interestCharge = mortBalance * r_mort;
          actualInterestPaid += interestCharge;
          const principalReduction = monthlyMortgagePayment - interestCharge;
          mortBalance -= principalReduction;
          if (mortBalance < 0) mortBalance = 0;
        }

        if (
          !state.crossover.fired &&
          invBalance >= mortBalance &&
          mortBalance > 0
        ) {
          state.crossover.fired = true;
          state.crossover.year = year;
          state.crossover.month = month;
          invBalance -= mortBalance;
          mortBalance = 0;
        } else if (state.crossover.fired) {
          mortBalance = 0;
        }
      }

      state.dataSplit.push({
        year,
        grossSalary: currentGross,
        netRaiseAmount,
        monthlyContribAmount: monthlyContrib,
        endInvBal: invBalance,
        endMortBal: mortBalance,
        isCrossoverMarker:
          state.crossover.fired && state.crossover.year === year,
      });
    }

    state.crossover.actualInterestPaid = actualInterestPaid;
  }

  // TAB 2: 401(k) Compounder
  function calcTab2401k(p) {
    let currentGross = p.salary;
    let kBal = p.k401StartBal;
    let rBal = p.rothStartBal;
    state.data401k = [];

    let yearsToRetirement = p.targetRetirementAge - p.age;
    if (yearsToRetirement < 1) yearsToRetirement = 1;

    for (let year = 1; year <= yearsToRetirement; year++) {
      if (year > 1) currentGross *= 1 + p.raisePct;
      let age = p.age + year - 1;

      // Calc Contributions
      let personalAmount = currentGross * p.k401PersonalPct;

      // Match Logic: p.k401MatchType (1.0 or 0.5 or 0)
      let matchPctApplied = 0;
      if (p.k401MatchType === 1.0) {
        matchPctApplied = Math.min(p.k401PersonalPct, p.k401MatchLimitPct);
      } else if (p.k401MatchType === 0.5) {
        // E.g. 50% match up to 5% user limit => max 2.5% total match
        // We use Math.min(personalPct * 0.5, k401MatchLimitPct) - wait, standard is 50% of contributions up to X%.
        // So if limit is 4%. It means they match 50% of your first 8% contribution.
        // Which yields max 4%.
        matchPctApplied = Math.min(
          p.k401PersonalPct * 0.5,
          p.k401MatchLimitPct,
        );
      }

      let matchAmount = currentGross * matchPctApplied;
      let autoAmount = currentGross * p.k401AutoPct;
      let totalAnnualAdd = personalAmount + matchAmount + autoAmount;

      let preGrowthBal = kBal + totalAnnualAdd;
      let interestEarned = preGrowthBal * p.k401Growth;
      kBal = preGrowthBal + interestEarned;

      // Roth IRA Growth (Assume same growth rate for now)
      let rothInterest = rBal * p.roth_ira_growth_rate;
      rBal = rBal + rothInterest;

      state.data401k.push({
        year,
        age,
        grossSalary: currentGross,
        personalContrib: personalAmount,
        companyContrib: matchAmount + autoAmount,
        totalAnnContrib: totalAnnualAdd,
        interestEarned: interestEarned,
        endBal: kBal,
        rothEndBal: rBal,
      });
    }
  }

  // TAB: Roth IRA Compounder
  function calcTabRothIRA(p) {
    let rBal = p.rothStartBal;
    state.dataRoth = [];

    let yearsToRetirement = p.targetRothRetirementAge - p.age;
    if (yearsToRetirement < 1) yearsToRetirement = 1;

    for (let year = 1; year <= yearsToRetirement; year++) {
      let age = p.age + year - 1;

      let interestEarned = rBal * p.roth_ira_growth_rate;
      rBal = rBal + interestEarned;

      state.dataRoth.push({
        year,
        age,
        interestEarned: interestEarned,
        endBal: rBal,
      });
    }
  }

  // TAB 3: 401(k) Withdrawal Simulator
  function calcTab3401kWithdrawal(p) {
    state.data401kWithdrawal = [];
    state.withdrawalSim = {
      startBal: 0,
      startAge: p.withdrawalRetAge,
      yearsLasted: 0,
      depleteAge: null,
    };

    // Find the 401(k) balance at the requested retirement age
    let startingData = state.data401k.find((d) => d.age === p.withdrawalRetAge);
    let startBal = 0;

    if (startingData) {
      startBal = startingData.endBal + (startingData.rothEndBal || 0);
    } else {
      // If the withdrawal age is greater than what tab 2 computed, extrapolate it
      if (state.data401k.length > 0) {
        let lastData = state.data401k[state.data401k.length - 1];
        if (p.withdrawalRetAge > lastData.age) {
          let extraYears = p.withdrawalRetAge - lastData.age;
          let combinedBal = lastData.endBal + (lastData.rothEndBal || 0);
          startBal = combinedBal * Math.pow(1 + p.k401Growth, extraYears);
        } else {
          startBal =
            state.data401k[0].endBal + (state.data401k[0].rothEndBal || 0); // Fallback if age is somehow less
        }
      }
    }

    state.withdrawalSim.startBal = startBal;

    let currentBal = startBal;
    let age = p.withdrawalRetAge;
    let years = 0;

    // Safety break at 100 years or age 99 (per user request)
    while (currentBal > 0.01 && age <= 99) {
      let startYearBal = currentBal;
      let growth = currentBal * p.k401Growth;
      let withdrawal = currentBal * p.withdrawalRate;

      currentBal += growth;

      if (currentBal - withdrawal < 0) {
        withdrawal = currentBal; // Can only withdraw what's left
      }

      currentBal -= withdrawal;

      state.data401kWithdrawal.push({
        age,
        startBal: startYearBal,
        growth,
        withdrawal,
        endBal: currentBal,
      });

      years++;
      age++;

      if (currentBal <= 0.01) {
        state.withdrawalSim.depleteAge = age;
        break;
      }

      if (age >= 99) {
        state.withdrawalSim.hit99 = true;
        state.withdrawalSim.hit99Bal = currentBal;
        break;
      }
    }
    state.withdrawalSim.yearsLasted = years;
  }

  // TAB: Roth IRA Withdrawal Simulator
  function calcTabRothIRAWithdrawal(p) {
    state.dataRothWithdrawal = [];
    state.rothWithdrawalSim = {
      startBal: 0,
      startAge: p.rothWithdrawalRetAge,
      yearsLasted: 0,
      depleteAge: null,
      hit99: false,
      hit99Bal: 0,
    };

    let startingData = state.dataRoth.find(
      (d) => d.age === p.rothWithdrawalRetAge,
    );
    let startBal = 0;

    if (startingData) {
      startBal = startingData.endBal;
    } else {
      if (state.dataRoth.length > 0) {
        let lastData = state.dataRoth[state.dataRoth.length - 1];
        if (p.rothWithdrawalRetAge > lastData.age) {
          let extraYears = p.rothWithdrawalRetAge - lastData.age;
          startBal =
            lastData.endBal * Math.pow(1 + p.roth_ira_growth_rate, extraYears);
        } else {
          startBal = state.dataRoth[0].endBal;
        }
      }
    }

    state.rothWithdrawalSim.startBal = startBal;

    let currentBal = startBal;
    let age = p.rothWithdrawalRetAge;
    let years = 0;

    while (currentBal > 0.01 && age <= 99) {
      let startYearBal = currentBal;
      let growth = currentBal * p.roth_ira_growth_rate;
      let withdrawal = currentBal * p.rothWithdrawalRate;

      currentBal += growth;

      if (currentBal - withdrawal < 0) {
        withdrawal = currentBal;
      }

      currentBal -= withdrawal;

      state.dataRothWithdrawal.push({
        age,
        startBal: startYearBal,
        growth,
        withdrawal,
        endBal: currentBal,
      });

      years++;
      age++;

      if (currentBal <= 0.01) {
        state.rothWithdrawalSim.depleteAge = age;
        break;
      }

      if (age >= 99) {
        state.rothWithdrawalSim.hit99 = true;
        state.rothWithdrawalSim.hit99Bal = currentBal;
        break;
      }
    }
    state.rothWithdrawalSim.yearsLasted = years;
  }

  // TAB 4: Salary Forecaster
  function calcTab3Salary(p) {
    let currentGross = p.salary;
    state.dataSalary = [];
    for (let year = 1; year <= state.timelineYears; year++) {
      if (year > 1) currentGross *= 1 + p.raisePct;
      let bonus = currentGross * p.targetBonusPct;
      state.dataSalary.push({
        year,
        baseSalary: currentGross,
        bonusAmount: bonus,
        totalComp: currentGross + bonus,
      });
    }
  }

  // TAB 4: Mortgage Amortization
  function calcTab4Mortgage(p) {
    state.dataMortgage = [];
    state.propertyAmortization = {};
    state.mortgageTotalStandardInterest = 0;

    const now = new Date();
    const projStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Calculate individual schedules
    state.properties.forEach((prop) => {
      // Universal Reality Check using same logic as getCurrentMortgageState
      const { bal, pmt } = calculateMortgageRealityCheck(prop, projStart);
      const expAll = state.extraPayments.filter(ep => ep.property_id === prop.id);

      // Projection from TODAY onwards
      const schedule = [];
      let tempBal = bal;
      let currentSimDate = new Date(projStart);
      const r = prop.interest_rate / 12;
      let year = 1;
      const maxYears = 50;

      while (tempBal > 0.01 && year <= maxYears) {
        let yearPrin = 0;
        let yearInt = 0;
        let startBal = tempBal;

        for (let m = 1; m <= 12; m++) {
          if (tempBal > 0.01) {
            currentSimDate.setMonth(currentSimDate.getMonth() + 1);
            let interest = tempBal * r;
            let principal = pmt - interest;
            let extra = expAll
              .filter((ep) => {
                let d = new Date(ep.payment_date);
                return (
                  d.getFullYear() === currentSimDate.getFullYear() &&
                  d.getMonth() === currentSimDate.getMonth()
                );
              })
              .reduce((sum, ep) => sum + ep.amount, 0);

            let totalP = principal + extra;
            if (tempBal - totalP < 0.01) totalP = tempBal;
            tempBal -= totalP;
            yearPrin += totalP;
            yearInt += interest;
          }
        }
        schedule.push({
          year,
          beginBal: startBal,
          principalPaid: yearPrin,
          interestPaid: yearInt,
          endBal: Math.max(0, tempBal),
        });
        year++;
      }
      state.propertyAmortization[prop.id] = schedule;
    });

    // 2. Aggregate into state.dataMortgage for global projections
    const years = [];
    const maxYear = Math.max(
      0,
      ...Object.values(state.propertyAmortization).map((s) => s.length),
    );

    for (let y = 1; y <= maxYear; y++) {
      let beginBal = 0,
        prin = 0,
        inter = 0,
        endBal = 0;
      Object.keys(state.propertyAmortization).forEach((id) => {
        const yrData = state.propertyAmortization[id].find((d) => d.year === y);
        if (yrData) {
          beginBal += yrData.beginBal;
          prin += yrData.principalPaid;
          inter += yrData.interestPaid;
          endBal += yrData.endBal;
        }
      });
      state.dataMortgage.push({
        year: y,
        beginBal,
        principalPaid: prin,
        interestPaid: inter,
        endBal,
      });
      state.mortgageTotalStandardInterest += inter;
    }

    // Impact calc (simplified for global)
    let totalBaselineFutureInterest = 0;
    let maxBaselineRemainingYears = 0;
    state.properties.forEach((prop) => {
      const r = prop.interest_rate / 12;
      const n = prop.loan_term_months;
      const principal = prop.initial_loan_value || prop.purchase_price;
      let pmt = 0;
      if (n > 0 && r > 0) {
        pmt = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      } else if (n > 0) {
        pmt = principal / n;
      }

      // Re-run simplified baseline from PROJ_START
      // We already calculated the balance at PROJ_START above but let's re-find it roughly
      const sched = state.propertyAmortization[prop.id];
      if (!sched || sched.length === 0) return;
      let tempBal = sched[0].beginBal;
      let months = 0;
      while (tempBal > 0.01 && months < 600) {
        let interest = tempBal * r;
        totalBaselineFutureInterest += interest;
        let p = pmt - interest;
        if (tempBal - p < 0) p = tempBal;
        tempBal -= p;
        months++;
      }
      maxBaselineRemainingYears = Math.max(
        maxBaselineRemainingYears,
        Math.ceil(months / 12),
      );
    });

    state.mortgageInterestSaved = Math.max(
      0,
      totalBaselineFutureInterest - state.mortgageTotalStandardInterest,
    );
    state.mortgageYearsSaved = Math.max(
      0,
      maxBaselineRemainingYears - state.dataMortgage.length,
    );
  }

  // TAB 5: Total Net Worth Stack
  function calcTab5NetWorth(p) {
    state.dataNetWorth = [];
    // Extract from existing arrays
    const homeStartValue = state.properties.reduce(
      (sum, prop) => sum + (prop.purchase_price || 0),
      0,
    );
    let homeValue = homeStartValue;

    for (let i = 0; i < state.timelineYears; i++) {
      let year = i + 1;
      if (year > 1) homeValue *= 1.02; // 2% Apprec.

      let yrData = state.dataMortgage.filter((d) => d.year === year);
      let mortBal = yrData.length > 0 ? yrData[yrData.length - 1].endBal : 0;
      let homeEquity = homeValue - mortBal;

      let currentAge = p.age + i;
      let k401Entry = state.data401k.find((d) => d.age === currentAge);
      let rothEntry = state.dataRoth.find((d) => d.age === currentAge);

      let k401 = 0;
      let roth = 0;

      if (k401Entry) {
        k401 = k401Entry.endBal;
      } else {
        let wEntry = state.data401kWithdrawal.find((d) => d.age === currentAge);
        if (wEntry) {
          k401 = wEntry.endBal;
        }
      }

      if (rothEntry) {
        roth = rothEntry.endBal;
      } else {
        let rwEntry = state.dataRothWithdrawal.find(
          (d) => d.age === currentAge,
        );
        if (rwEntry) {
          roth = rwEntry.endBal;
        }
      }

      let taxable = state.dataSplit[i]?.endInvBal || 0;
      let actualMortBal = state.dataSplit[i]?.endMortBal || 0;
      homeEquity = homeValue - actualMortBal;

      state.dataNetWorth.push({
        year,
        homeEquity,
        k401,
        roth,
        taxable,
      });
    }
  }

  // --- Observability Dashboard Data Engine ---
  window.calcObservabilityDashboard = function () {
    if (!state.dataPaystubs || state.dataPaystubs.length === 0) return;

    const yearFilter = state.dashboardYearFilter;

    let filteredData = state.dataPaystubs;
    if (yearFilter !== "All") {
      filteredData = state.dataPaystubs.filter(
        (d) => new Date(d.pay_date).getFullYear().toString() === yearFilter,
      );
    }

    // Reset Metrics
    state.observabilityMetrics = {
      totalGross: 0,
      totalTaxes: 0,
      totalIns: 0,
      total401k: 0,
      totalNet: 0,
    };

    // Dictionary to aggregate by Month (for Monthly Bars & Area)
    const monthlyAgg = {}; // format: "YYYY-MM": { gross, net, tax, ins, k401k }

    // Dictionary to aggregate by Year (for YoY Tracker)
    const yearlyAgg = {}; // format: "YYYY": { net }

    filteredData.forEach((d) => {
      const date = new Date(d.pay_date);
      const yyyy = date.getFullYear();
      // Pad month so "2024-01" sorts properly
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yearMonth = `${yyyy}-${mm}`;

      const totalTaxes =
        (d.federal_tax || 0) +
        (d.social_security_tax || 0) +
        (d.medicare_tax || 0) +
        (d.state_tax || 0) +
        (d.state_other_tax || 0);
      const totalIns =
        (d.medical_insurance || 0) +
        (d.dental_insurance || 0) +
        (d.vision_insurance || 0) +
        (d.life_insurance || 0) +
        (d.other_insurance || 0) +
        (d.hsa_contribution || 0);

      const totalGross = (d.gross_pay || 0) + (d.extra_pay || 0);
      const net = d.net_pay || 0;
      const k401 = d.k401k_contribution || 0;

      // Global metrics updates
      state.observabilityMetrics.totalGross += totalGross;
      state.observabilityMetrics.totalTaxes += totalTaxes;
      state.observabilityMetrics.totalIns += totalIns;
      state.observabilityMetrics.total401k += k401;
      state.observabilityMetrics.totalNet += net;

      // Build Monthly map
      if (!monthlyAgg[yearMonth]) {
        monthlyAgg[yearMonth] = { gross: 0, net: 0, tax: 0, ins: 0, k401k: 0 };
      }
      monthlyAgg[yearMonth].gross += totalGross;
      monthlyAgg[yearMonth].net += net;
      monthlyAgg[yearMonth].tax += totalTaxes;
      monthlyAgg[yearMonth].ins += totalIns;
      monthlyAgg[yearMonth].k401k += k401;

      // Build Yearly map (Full dataset so we can compare YoY properly regardless of filter)
    });

    // Special Full-Dataset Loop for YoY Tracker
    // (If filtered to 2024, we still want to see 2023 vs 2024 if we can, but we'll stick to displaying all years always for the YoY chart to be useful)
    state.dataPaystubs.forEach((d) => {
      const yyyy = new Date(d.pay_date).getFullYear();
      if (!yearlyAgg[yyyy]) yearlyAgg[yyyy] = { net: 0 };
      yearlyAgg[yyyy].net += d.net_pay || 0;
    });

    // Update KPI DOM
    const denom = state.observabilityMetrics.totalGross || 1; // avoid divide by zero
    if (elements.kpiTaxRate)
      elements.kpiTaxRate.textContent =
        ((state.observabilityMetrics.totalTaxes / denom) * 100).toFixed(1) +
        "%";
    if (elements.kpiInsRate)
      elements.kpiInsRate.textContent =
        ((state.observabilityMetrics.totalIns / denom) * 100).toFixed(1) + "%";
    if (elements.kpiRetRate)
      elements.kpiRetRate.textContent =
        ((state.observabilityMetrics.total401k / denom) * 100).toFixed(1) + "%";

    // Shape Monthly Array
    const sortedMonths = Object.keys(monthlyAgg).sort();
    state.dashboardMonthlyData = sortedMonths.map((m) => {
      // Format "2024-01" -> "Jan '24"
      const dateObj = new Date(m + "-01T00:00:00"); // strict parse
      const label = dateObj.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      return {
        label: label,
        rawMonth: m,
        ...monthlyAgg[m],
      };
    });

    // Shape YoY Array
    const sortedYears = Object.keys(yearlyAgg).sort();
    state.dashboardYoYData = sortedYears.map((y) => {
      return {
        year: y,
        net: yearlyAgg[y].net,
      };
    });
  };

  window.calcWealthActuals = function () {
    try {
      const timeframe = elements.inpWealthTimeframe
        ? elements.inpWealthTimeframe.value
        : "monthly";

      let iterations = 0; // Move to higher scope for logging

      // 1. Data Prep
      const snapshots = [...(state.dataHistorical || [])].sort(
        (a, b) => new Date(a.snapshot_date) - new Date(b.snapshot_date),
      );

      const paystubs = [...(state.dataPaystubs || [])].sort(
        (a, b) => new Date(a.pay_date) - new Date(b.pay_date),
      );

      const projectionsData = state.dataNetWorth || [];

      // 2. Safeguard: If absolutely no data, return early
      if (snapshots.length === 0 && paystubs.length === 0 && projectionsData.length === 0) {
        console.warn("calcWealthActuals: No snapshots, paystubs, or projections found.");
        state.wealthActualsData = [];
        return;
      }

      // 3. Projections Preparation
      const projections = [];
      const startYear = new Date().getFullYear();
      const todayDate = new Date();
      
      // Find the latest actual value to anchor to
      let anchoredStartNW = null;
      if (snapshots.length > 0) {
        const s = snapshots[snapshots.length - 1];
        let currentTotalPropValue = 0;
        (state.properties || []).forEach(prop => {
          const propVals = state.valuations[prop.id] || [];
          const latestVal = [...propVals].reverse().find(v => v.valuation_date <= s.snapshot_date);
          currentTotalPropValue += latestVal ? latestVal.estimated_value : (prop.purchase_price || 0);
        });
        
        let snapPropValue = s.property_value || 0;
        if (snapPropValue === 0 && (state.properties || []).length > 0) {
          snapPropValue = (state.properties || [])
            .filter(p => String(p.purchase_date) <= String(s.snapshot_date))
            .reduce((sum, p) => sum + (p.purchase_price || 0), 0);
        }
        
        anchoredStartNW = (s.net_worth || 0) - snapPropValue + currentTotalPropValue;
      }

      if (projectionsData.length > 0) {
        const d0 = projectionsData[0];
        const startNW = anchoredStartNW !== null 
          ? anchoredStartNW 
          : ((d0.homeEquity || 0) + (d0.k401 || 0) + (d0.roth || 0) + (d0.taxable || 0));

        // Point 0: Today (Anchored)
        projections.push({
          date: todayDate,
          netWorth: startNW
        });
        
        // Annual Markers
        projectionsData.forEach((d) => {
          projections.push({
            date: new Date(startYear + d.year - 1, 11, 31),
            netWorth: (d.homeEquity || 0) + (d.k401 || 0) + (d.roth || 0) + (d.taxable || 0),
          });
        });
      }

      // 4. Grouping & Aggregation
      const grouped = {}; // key -> { actualNW, projNW, date }

      const getPeriodKey = (date, mode) => {
        const d = new Date(date);
        if (mode === "daily") return d.toISOString().split("T")[0];
        if (mode === "weekly") {
          const startOfYear = new Date(d.getFullYear(), 0, 1);
          const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
          return `${d.getFullYear()}-W${week.toString().padStart(2, "0")}`;
        }
        if (mode === "monthly") return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        if (mode === "quarterly") {
          const q = Math.floor(d.getMonth() / 3) + 1;
          return `${d.getFullYear()}-Q${q}`;
        }
        if (mode === "yearly") return `${d.getFullYear()}`;
        return d.toISOString().split("T")[0];
      };

      // 4b. Max Duration Filtering (Windowing)
      const now = new Date();
      let minDate, maxDate;
      const dayMs = 86400000;

      if (timeframe === "daily") {
        minDate = new Date(now.getTime() - 45 * dayMs);
        maxDate = new Date(now.getTime() + 45 * dayMs);
      } else if (timeframe === "weekly") {
        minDate = new Date(now.getTime() - 13 * 7 * dayMs);
        maxDate = new Date(now.getTime() + 13 * 7 * dayMs);
      } else if (timeframe === "monthly") {
        minDate = new Date(now.getFullYear(), now.getMonth() - 18, now.getDate());
        maxDate = new Date(now.getFullYear(), now.getMonth() + 18, now.getDate());
      } else if (timeframe === "quarterly") {
        minDate = new Date(now.getFullYear(), now.getMonth() - 10 * 3, now.getDate());
        maxDate = new Date(now.getFullYear(), now.getMonth() + 10 * 3, now.getDate());
      } else if (timeframe === "yearly") {
        minDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
        maxDate = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
      } else {
        minDate = new Date(0);
        maxDate = new Date(8640000000000000);
      }

      // --- Fill Actuals (if any) ---
      const allValuations = [];
      Object.keys(state.valuations || {}).forEach((propId) => {
        allValuations.push(...(state.valuations[propId] || []));
      });

      const allActualDates = new Set();
      snapshots.forEach((s) => allActualDates.add(s.snapshot_date));
      allValuations.forEach((v) => allActualDates.add(v.valuation_date));
      paystubs.forEach((p) => allActualDates.add(p.pay_date));
      Object.keys(state.loanPayments || {}).forEach(propId => {
        (state.loanPayments[propId] || []).forEach(lp => allActualDates.add(lp.payment_date));
      });

      const sortedActualDates = Array.from(allActualDates)
        .filter(dateStr => new Date(dateStr) >= minDate)
        .sort();

      sortedActualDates.forEach((dateStr) => {
        const d = new Date(dateStr);
        const key = getPeriodKey(d, timeframe);

        // 1. Find the most recent snapshot on or before this date
        const lastSnapshot = [...snapshots].reverse().find(s => s.snapshot_date <= dateStr);
        if (!lastSnapshot) return;

        // 2. Calculate "Financial Net Worth" (Snap NW - Prop Value)
        // Fallback: Old snapshots have property_value=0.0 by default. If 0 and
        // properties exist, estimate the purchase-price-based value at snapshot time.
        let snapPropValue = lastSnapshot.property_value || 0;
        const hasProperties = (state.properties || []).length > 0;
        if (snapPropValue === 0 && hasProperties) {
          // Reason: Old snapshots didn't store property_value; use purchase price as baseline
          snapPropValue = (state.properties || [])
            .filter(p => String(p.purchase_date) <= String(lastSnapshot.snapshot_date))
            .reduce((sum, p) => sum + (p.purchase_price || 0), 0);
        }

        let financialNW = (lastSnapshot.net_worth || 0) - snapPropValue;

        // 3. Add Paystubs that happened AFTER the snapshot but BEFORE OR ON dateStr
        const sDate = new Date(lastSnapshot.snapshot_date);
        const intermediatePay = paystubs
          .filter(p => {
            const pDate = new Date(p.pay_date);
            return pDate > sDate && pDate <= d;
          })
          .reduce((sum, p) => sum + (p.net_pay || 0), 0);

        financialNW += intermediatePay;

        // 4. Add Principal Reductions (Loan Payments) that happened AFTER the snapshot
        let intermediatePrincipal = 0;
        Object.keys(state.loanPayments || {}).forEach(propId => {
          const paid = (state.loanPayments[propId] || [])
            .filter(lp => {
              const lpDate = new Date(lp.payment_date);
              return lpDate > sDate && lpDate <= d;
            })
            .reduce((sum, lp) => sum + (lp.principal_amount || 0) + (lp.overage_amount || 0), 0);
          intermediatePrincipal += paid;
        });

        financialNW += intermediatePrincipal;

        // 5. Add "Live" Property Valuations for this date
        let currentTotalPropValue = 0;
        (state.properties || []).forEach(prop => {
          const propVals = state.valuations[prop.id] || [];
          const latestVal = [...propVals].reverse().find(v => v.valuation_date <= dateStr);
          currentTotalPropValue += latestVal ? latestVal.estimated_value : (prop.purchase_price || 0);
        });

        const currentNW = financialNW + currentTotalPropValue;

        // Use the latest date for each bucket (e.g., end of month)
        if (!grouped[key]) {
          grouped[key] = { actualNW: currentNW, projNW: null, date: d };
        } else if (d >= grouped[key].date) {
          grouped[key].actualNW = currentNW;
          grouped[key].date = d;
        }
      });

      // --- Fill Projections (if any) ---
      if (projections.length > 0) {
        const pStart = projections[0];
        const pEnd = projections[projections.length - 1];
        let currDay = new Date(pStart.date);
        
        const maxProjectionDate = new Date(Math.min(pEnd.date.getTime(), maxDate.getTime()));

        // Protection against infinity loops
        const maxIterations = 1000; 

        while (currDay <= maxProjectionDate && iterations < maxIterations) {
          iterations++;
          const key = getPeriodKey(currDay, timeframe);

          // Only process projections within the [minDate, maxDate] window
          if (currDay >= minDate && currDay <= maxDate) {
            const idx = projections.findIndex(p => p.date >= currDay);
            let interpolatedNW = 0;
            if (idx <= 0) interpolatedNW = projections[0].netWorth;
            else {
              const p1 = projections[idx - 1];
              const p2 = projections[idx];
              const t = (currDay - p1.date) / (p2.date - p1.date);
              interpolatedNW = p1.netWorth + (p2.netWorth - p1.netWorth) * t;
            }

            if (!grouped[key]) grouped[key] = { actualNW: null, projNW: interpolatedNW, date: new Date(currDay) };
            else grouped[key].projNW = interpolatedNW;
          }

          if (timeframe === "daily") currDay.setDate(currDay.getDate() + 1);
          else if (timeframe === "weekly") currDay.setDate(currDay.getDate() + 7);
          else if (timeframe === "monthly") currDay.setMonth(currDay.getMonth() + 1);
          else if (timeframe === "quarterly") currDay.setMonth(currDay.getMonth() + 3);
          else currDay.setFullYear(currDay.getFullYear() + 1);
        }
      }

      // 5. Finalize
      const finalKeys = Object.keys(grouped).sort();
      state.wealthActualsData = finalKeys.map(k => ({ label: k, ...grouped[k] }));
      console.log("calcWealthActuals Finalized:", { 
        dataLength: state.wealthActualsData.length,
        firstFew: state.wealthActualsData.slice(0, 3)
      });

    } catch (err) {
      console.error("Critical error in calcWealthActuals:", err);
      state.wealthActualsData = [];
    }
  };

  // --- Chart Rendering Logic ---
  function renderCharts(target) {
    Chart.defaults.color = "#94a3b8";
    Chart.defaults.font.family = "Inter";

    // Enforce 2 decimal places globally for tooltips
    if (!Chart.defaults.plugins.tooltip)
      Chart.defaults.plugins.tooltip = { callbacks: {} };
    if (!Chart.defaults.plugins.tooltip.callbacks)
      Chart.defaults.plugins.tooltip.callbacks = {};
    Chart.defaults.plugins.tooltip.callbacks.label = function (context) {
      let label = context.dataset.label || "";
      if (label) {
        label += ": ";
      }
      if (context.parsed.y !== null) {
        label += new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(context.parsed.y);
      }
      return label;
    };

    // Enforce 2 decimal places globally for Y-Axis labels
    if (!Chart.defaults.scale) Chart.defaults.scale = {};
    if (!Chart.defaults.scale.ticks) Chart.defaults.scale.ticks = {};
    Chart.defaults.scale.ticks.callback = function (value, index, values) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: "compact", // Keeps the 'K' and 'M' suffixes clean
      }).format(value);
    };

    if (
      (target === "all" || target === "tab-split") &&
      document.getElementById("tab-split")?.classList.contains("active")
    ) {
      const ctx = document.getElementById("chartSplit").getContext("2d");
      if (charts.split) charts.split.destroy();
      charts.split = new Chart(ctx, {
        type: "line",
        data: {
          labels: state.dataSplit.map(
            (d) => `${state.currentYear + d.year - 1}`,
          ),
          datasets: [
            {
              label: "Investment Balance",
              data: state.dataSplit.map((d) => d.endInvBal),
              borderColor: "#2dd4bf",
              backgroundColor: "rgba(45,212,191,0.1)",
              fill: true,
              tension: 0.3,
            },
            {
              label: "Mortgage Balance",
              data: state.dataSplit.map((d) => d.endMortBal),
              borderColor: "#f87171",
              backgroundColor: "transparent",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
        },
      });
    }

    if (
      (target === "all" || target === "tab-401k") &&
      document.getElementById("tab-401k")?.classList.contains("active")
    ) {
      const ctx = document.getElementById("chart401k").getContext("2d");
      if (charts.k401) charts.k401.destroy();
      charts.k401 = new Chart(ctx, {
        type: "bar",
        data: {
          labels: state.data401k.map((d) => `Age ${d.age}`),
          datasets: [
            {
              label: "401(k) Balance",
              data: state.data401k.map((d) => d.endBal),
              backgroundColor: "#14b8a6",
              borderRadius: 4,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    if (
      (target === "all" || target === "tab-401k-withdrawal") &&
      document.getElementById("tab-401k-withdrawal")?.classList.contains("active")
    ) {
      const ctx = document
        .getElementById("chart401kWithdrawal")
        .getContext("2d");
      if (charts.k401Withdrawal) charts.k401Withdrawal.destroy();
      charts.k401Withdrawal = new Chart(ctx, {
        type: "bar",
        data: {
          labels: state.data401kWithdrawal.map((d) => `Age ${d.age}`),
          datasets: [
            {
              label: "Withdrawal",
              data: state.data401kWithdrawal.map((d) => d.withdrawal),
              backgroundColor: "#f87171",
              stack: "Stack 0",
            },
            {
              label: "Growth",
              data: state.data401kWithdrawal.map((d) => d.growth),
              backgroundColor: "#4ade80",
              stack: "Stack 0",
            },
            {
              type: "line",
              label: "Remaining Balance",
              data: state.data401kWithdrawal.map((d) => d.endBal),
              borderColor: "#14b8a6",
              backgroundColor: "transparent",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
        },
      });
    }

    if (
      (target === "all" || target === "tab-roth") &&
      document.getElementById("tab-roth")?.classList.contains("active")
    ) {
      const ctx = document.getElementById("chartRoth").getContext("2d");
      if (charts.roth) charts.roth.destroy();
      charts.roth = new Chart(ctx, {
        type: "bar",
        data: {
          labels: state.dataRoth.map((d) => `Age ${d.age}`),
          datasets: [
            {
              label: "Roth IRA Balance",
              data: state.dataRoth.map((d) => d.endBal),
              backgroundColor: "#14b8a6",
              borderRadius: 4,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    if (
      (target === "all" || target === "tab-roth-withdrawal") &&
      document.getElementById("tab-roth-withdrawal")?.classList.contains("active")
    ) {
      const ctx = document
        .getElementById("chartRothWithdrawal")
        .getContext("2d");
      if (charts.rothWithdrawal) charts.rothWithdrawal.destroy();
      charts.rothWithdrawal = new Chart(ctx, {
        type: "bar",
        data: {
          labels: state.dataRothWithdrawal.map((d) => `Age ${d.age}`),
          datasets: [
            {
              label: "Withdrawal",
              data: state.dataRothWithdrawal.map((d) => d.withdrawal),
              backgroundColor: "#f87171",
              stack: "Stack 0",
            },
            {
              label: "Growth",
              data: state.dataRothWithdrawal.map((d) => d.growth),
              backgroundColor: "#4ade80",
              stack: "Stack 0",
            },
            {
              type: "line",
              label: "Remaining Balance",
              data: state.dataRothWithdrawal.map((d) => d.endBal),
              borderColor: "#14b8a6",
              backgroundColor: "transparent",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
        },
      });
    }

    // --- Tab: Property Details ---
    if (
      (target === "all" || target === "tab-property-details") &&
      document.getElementById("tab-property-details")?.classList.contains("active")
    ) {
      const propId = state.selectedPropertyId;
      if (!propId) return;
      const prop = state.properties.find((p) => p.id == propId);
      // Reason: keep this declaration here — charts 3 & 4 (Principal vs Interest,
      // Escrow Trends) still use this variable for their datasets.
      const amortization = state.propertyAmortization[propId] || [];
      // Reason: anchor the equity chart to the property purchase date so users can see the
      // full mortgage lifetime (past + future), not just the remaining projection from today.
      const originDateStr = prop.loan_start_date || prop.purchase_date;

      const originYear = originDateStr
        ? new Date(originDateStr).getFullYear()
        : state.currentYear;

      // Total loan term in years (how many labels to show)
      const loanTermYears = prop.loan_term_months
        ? Math.ceil(prop.loan_term_months / 12)
        : amortization.length || 30;

      // Build a label for every year from origin through full term
      const fullLabels = Array.from(
        { length: loanTermYears },
        (_, i) => `${originYear + i}`
      );

      // Project home value at 2% appreciation starting from purchase_price at origin year
      let runningVal = prop?.purchase_price || 0;
      const projectedValues = fullLabels.map((_, i) => {
        if (i > 0) runningVal *= 1.02;
        return runningVal;
      });

      // Build full loan balance schedule from purchase date.
      // Years already elapsed (before today) use the historical amortization formula;
      // remaining years come from state.propertyAmortization (today → payoff).
      const todayYear = state.currentYear;
      const yearsElapsed = Math.max(0, todayYear - originYear);
      const r = (prop.interest_rate || 0) / 12;
      const n = prop.loan_term_months || 360;
      const loanPV = prop.initial_loan_value || prop.purchase_price || 0;
      let pmt = 0;
      if (n > 0 && r > 0) {
        pmt = (loanPV * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      } else if (n > 0) {
        pmt = loanPV / n;
      }

      // Reconstruct the historical balance year-by-year from loan start
      const fullLoanBalances = [];
      let histBal = loanPV;
      for (let y = 0; y < loanTermYears; y++) {
        if (y < yearsElapsed) {
          // Past years: compute remaining balance after y+1 years of payments
          // Formula: B_n = PV*(1+r)^n - PMT*((1+r)^n - 1)/r
          const paymentsElapsed = (y + 1) * 12;
          const compound = Math.pow(1 + r, paymentsElapsed);
          histBal = r > 0
            ? loanPV * compound - pmt * (compound - 1) / r
            : loanPV - pmt * paymentsElapsed;
          fullLoanBalances.push(Math.max(0, histBal));
        } else {
          // Future years: pull from the pre-computed amortization schedule
          const futureIdx = y - yearsElapsed;
          const amorRow = amortization[futureIdx];
          fullLoanBalances.push(amorRow ? Math.max(0, amorRow.endBal) : 0);
        }
      }

      const labels = fullLabels;


      // 1. Equity Growth Chart
      try {
        const ctxEquity = document.getElementById("chartEquityGrowth")?.getContext("2d");
        if (ctxEquity) {
          if (charts.equityGrowth) charts.equityGrowth.destroy();

          charts.equityGrowth = new Chart(ctxEquity, {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: "Original Purchase Price",
                  data: labels.map(() => prop.purchase_price || 0),
                  borderColor: "#94a3b8",
                  borderDash: [5, 5],
                  fill: false,
                  pointRadius: 0,
                },
                {
                  label: "Projected Value (2% Apprec)",
                  data: projectedValues,
                  borderColor: "#4ade80",
                  backgroundColor: "rgba(74, 222, 128, 0.1)",
                  fill: true,
                  tension: 0.3,
                },
                {
                  label: "Loan Balance",
                  data: fullLoanBalances,
                  borderColor: "#f87171",
                  backgroundColor: "rgba(248, 113, 113, 0.2)",
                  fill: true,
                  tension: 0.3,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
            },
          });
        }
      } catch (err) {
        console.error("Equity Growth Chart Error:", err);
      }

      // 2. Valuation History Chart
      try {
        const ctxValuations = document
          .getElementById("chartPropertyValuations")
          .getContext("2d");
        if (charts.propertyValuations) charts.propertyValuations.destroy();

        const valData = state.valuations[propId] || [];
        charts.propertyValuations = new Chart(ctxValuations, {
          type: "line",
          data: {
            labels: valData.map((v) => v.valuation_date),
            datasets: [
              {
                label: "Estimated Value",
                data: valData.map((v) => v.estimated_value),
                borderColor: "#2dd4bf",
                backgroundColor: "rgba(45, 212, 191, 0.1)",
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: { display: false },
              },
            },
          },
        });
      } catch (err) {
        console.error("Valuation History Chart Error:", err);
      }

      // 3. Principal vs Interest (Mini)
      try {
        const ctxMort = document.getElementById("chartMortgage").getContext("2d");
        if (charts.mortgage) charts.mortgage.destroy();

        // Build full-term P&I arrays aligned with fullLabels (purchase year → payoff).
        // Past years: compute from closed-form amortization (balance diff = principal paid).
        // Future years: use the pre-computed amortization schedule (from today forward).
        const fullPrincipalData = [];
        const fullInterestData  = [];
        for (let y = 0; y < loanTermYears; y++) {
          if (y < yearsElapsed) {
            // Closed-form balance at start and end of year y
            const startPayments = y * 12;
            const endPayments   = (y + 1) * 12;
            const cmpStart = Math.pow(1 + r, startPayments);
            const cmpEnd   = Math.pow(1 + r, endPayments);
            const balStart = r > 0
              ? loanPV * cmpStart - pmt * (cmpStart - 1) / r
              : loanPV - pmt * startPayments;
            const balEnd = r > 0
              ? loanPV * cmpEnd - pmt * (cmpEnd - 1) / r
              : loanPV - pmt * endPayments;
            const princYear    = Math.max(0, balStart - Math.max(0, balEnd));
            const interestYear = Math.max(0, 12 * pmt - princYear);
            fullPrincipalData.push(princYear);
            fullInterestData.push(interestYear);
          } else {
            const futureIdx = y - yearsElapsed;
            const row = amortization[futureIdx];
            fullPrincipalData.push(row ? row.principalPaid : 0);
            fullInterestData.push(row ? row.interestPaid  : 0);
          }
        }

        charts.mortgage = new Chart(ctxMort, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Principal",
                data: fullPrincipalData,
                backgroundColor: "#4ade80",
              },
              {
                label: "Interest",
                data: fullInterestData,
                backgroundColor: "#f87171",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { stacked: true }, y: { stacked: true } },
          },
        });
      } catch (err) {
        console.error("Mortgage Chart Error:", err);
      }

      // 4. Escrow Trends (Only if container exists)
      try {
        renderEscrowTrendsChart(propId);
      } catch (err) {
        console.error("Escrow Trends Chart Error:", err);
      }
    }

    // --- Tab: Net Worth (Home) ---
    if (
      (target === "all" || target === "tab-networth") &&
      document.getElementById("tab-networth")?.classList.contains("active")
    ) {
      try {
        const ctx = document.getElementById("chartNetWorth")?.getContext("2d");
        if (ctx) {
          if (charts.networth) charts.networth.destroy();
          const datasetsNW = [
            {
              label: "Brokerage Acct",
              data: state.dataNetWorth.map((d) => d.taxable),
              borderColor: "#2dd4bf",
              backgroundColor: "#2dd4bf",
              fill: true,
            },
            {
              label: "401(k)",
              data: state.dataNetWorth.map((d) => d.k401),
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f6",
              fill: true,
            },
          ];

          // Conditionally append Roth IRA band if balance exists in timeline
          const hasRoth = Math.max(...state.dataNetWorth.map((d) => d.roth)) > 0;
          if (hasRoth) {
            datasetsNW.push({
              label: "Roth IRA",
              data: state.dataNetWorth.map((d) => d.roth),
              borderColor: "#f59e0b",
              backgroundColor: "#f59e0b",
              fill: true,
            });
          }

          // Home equity stays on top visually
          datasetsNW.push({
            label: "Home Equity",
            data: state.dataNetWorth.map((d) => d.homeEquity),
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf6",
            fill: true,
          });

          charts.networth = new Chart(ctx, {
            type: "line",
            data: {
              labels: state.dataNetWorth.map(
                (d) => `${state.currentYear + d.year - 1}`,
              ),
              datasets: datasetsNW,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: { x: { stacked: true }, y: { stacked: true } },
              interaction: { mode: "index" },
              elements: { line: { tension: 0.3, borderWidth: 1 } },
            },
          });
        }
      } catch (err) {
        console.error("Net Worth Chart Error:", err);
      }
    }

    // --- Tab: Observability ---
    if (
      (target === "all" || target === "tab-observability") &&
      document.getElementById("tab-observability")?.classList.contains("active")
    ) {
      try {
        console.log("Observability check:", { 
          hasMonthly: !!state.dashboardMonthlyData, 
          hasYoY: !!state.dashboardYoYData 
        });
        if (!state.dashboardMonthlyData || !state.dashboardYoYData) return;

        // 1. Cash Flow Pipeline (Horizontal Stacked Bar)
        // Represent a single summary bar: Base = 0, Taxes -> Insurance -> 401k -> Net Pay
        const ctxCashFlow = document
          .getElementById("chartCashFlow")
          .getContext("2d");
        if (charts.cashFlow) charts.cashFlow.destroy();
        charts.cashFlow = new Chart(ctxCashFlow, {
          type: "bar",
          data: {
            labels: ["Cash Flow"],
            datasets: [
              {
                label: "Taxes",
                data: [state.observabilityMetrics.totalTaxes],
                backgroundColor: "#f87171",
              },
              {
                label: "Ins & Ded",
                data: [state.observabilityMetrics.totalIns],
                backgroundColor: "#fbbf24",
              },
              {
                label: "401(k)",
                data: [state.observabilityMetrics.total401k],
                backgroundColor: "#3b82f6",
              },
              {
                label: "Net Pay",
                data: [state.observabilityMetrics.totalNet],
                backgroundColor: "#4ade80",
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { stacked: true, display: false },
              y: { stacked: true, display: false },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) label += ": ";
                    if (context.parsed.x !== null) {
                      label += fmtCurrency.format(context.parsed.x);
                    }
                    return label;
                  },
                },
              },
            },
          },
        });

        // 2. Gross vs Net vs Deductions (Monthly Stacked Bar)
        const ctxMonthly = document
          .getElementById("chartMonthlyBars")
          .getContext("2d");
        if (charts.monthlyBars) charts.monthlyBars.destroy();
        charts.monthlyBars = new Chart(ctxMonthly, {
          type: "bar",
          data: {
            labels: state.dashboardMonthlyData.map((d) => d.label),
            datasets: [
              {
                label: "Net Pay",
                data: state.dashboardMonthlyData.map((d) => d.net),
                backgroundColor: "#4ade80",
              },
              {
                label: "401(k)",
                data: state.dashboardMonthlyData.map((d) => d.k401k),
                backgroundColor: "#3b82f6",
              },
              {
                label: "Ins & Ded",
                data: state.dashboardMonthlyData.map((d) => d.ins),
                backgroundColor: "#fbbf24",
              },
              {
                label: "Taxes",
                data: state.dashboardMonthlyData.map((d) => d.tax),
                backgroundColor: "#f87171",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
            plugins: {
              tooltip: { mode: "index", intersect: false },
            },
          },
        });

        // 3. YTD Accumulation (Area Chart)
        const ctxYTD = document.getElementById("chartYtdArea").getContext("2d");
        if (charts.ytdArea) charts.ytdArea.destroy();

        let rNet = 0,
          rTax = 0,
          r401 = 0,
          rGross = 0;
        const ytdNet = [],
          ytdTax = [],
          ytd401 = [],
          ytdGross = [];

        state.dashboardMonthlyData.forEach((d) => {
          rNet += d.net;
          rTax += d.tax;
          r401 += d.k401k;
          rGross += d.gross;
          ytdNet.push(rNet);
          ytdTax.push(rTax);
          ytd401.push(r401);
          ytdGross.push(rGross);
        });

        charts.ytdArea = new Chart(ctxYTD, {
          type: "line",
          data: {
            labels: state.dashboardMonthlyData.map((d) => d.label),
            datasets: [
              {
                label: "YTD Gross",
                data: ytdGross,
                borderColor: "#94a3b8",
                backgroundColor: "transparent",
                borderDash: [5, 5],
              },
              {
                label: "YTD Net",
                data: ytdNet,
                borderColor: "#4ade80",
                backgroundColor: "rgba(74, 222, 128, 0.1)",
                fill: true,
              },
              {
                label: "YTD Taxes",
                data: ytdTax,
                borderColor: "#f87171",
                backgroundColor: "rgba(248, 113, 113, 0.1)",
                fill: true,
              },
              {
                label: "YTD 401(k)",
                data: ytd401,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: { line: { tension: 0.3 } },
            plugins: {
              tooltip: { mode: "index", intersect: false },
            },
          },
        });

        // 4. YoY Delta Tracker
        const ctxYoY = document.getElementById("chartYoYDelta").getContext("2d");
        const emptyState = document.getElementById("chartYoYEmptyState");

        if (charts.yoyDelta) charts.yoyDelta.destroy();

        // If filtering by a single year, don't show the chart, show empty state instead to force "All Time"
        if (state.dashboardYearFilter !== "All") {
          ctxYoY.canvas.style.display = "none";
          if (emptyState) emptyState.classList.remove("hidden");
        } else {
          ctxYoY.canvas.style.display = "block";
          if (emptyState) emptyState.classList.add("hidden");

          const yoyLabels = state.dashboardYoYData.map((d) => d.year);
          const yoyNet = state.dashboardYoYData.map((d) => d.net);

          const raiseDeltas = yoyNet.map((n, i) => {
            if (i === 0) return 0;
            const delta = n - yoyNet[i - 1];
            return delta > 0 ? delta : 0; // only charting positive raises for 50/50 alloc visual
          });

          // 50/50 visual split
          const killShotHalf = raiseDeltas.map((d) => d / 2);
          const lifestyleHalf = raiseDeltas.map((d) => d / 2);

          charts.yoyDelta = new Chart(ctxYoY, {
            type: "bar",
            data: {
              labels: yoyLabels,
              datasets: [
                {
                  label: "Total Net Pay",
                  data: yoyNet,
                  backgroundColor: "#334155",
                  maxBarThickness: 40,
                },
                {
                  label: "50% To Investment",
                  data: killShotHalf,
                  backgroundColor: "#2dd4bf",
                  stack: "Delta",
                  xAxisID: "x2",
                },
                {
                  label: "50% To Lifestyle",
                  data: lifestyleHalf,
                  backgroundColor: "#f59e0b",
                  stack: "Delta",
                  xAxisID: "x2",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { stacked: false },
                x2: { stacked: true, display: false, offset: true },
                y: { beginAtZero: true },
              },
              plugins: {
                tooltip: { mode: "index", intersect: false },
              },
            },
          });
        }
      } catch (err) {
        console.error("Observability Chart Error:", err);
      }
    }

    // --- Tab: Wealth Growth (Actuals vs Projections) ---
    if (
      (target === "all" || target === "tab-wealth-actuals") &&
      document.getElementById("tab-wealth-actuals")?.classList.contains("active")
    ) {
      try {
        const ctxWealth = document.getElementById("chartWealthActuals")?.getContext("2d");
        if (ctxWealth) {
          console.log("Rendering WealthActuals Chart:", {
            dataCount: state.wealthActualsData.length,
            firstPoint: state.wealthActualsData[0],
            timeframe: elements.inpWealthTimeframe?.value || "monthly"
          });

          const labels = state.wealthActualsData.map((d) => d.label);
          const actuals = state.wealthActualsData.map((d) => d.actualNW);
          const projected = state.wealthActualsData.map((d) => d.projNW);

          if (labels.length === 0) {
            console.warn("renderCharts: labels are empty for WealthActuals");
          }

          if (charts.wealthActuals) charts.wealthActuals.destroy();
          charts.wealthActuals = new Chart(ctxWealth, {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: "Actual Net Worth",
                  data: actuals,
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fill: true,
                  tension: 0.1,
                  pointRadius: 2,
                  spanGaps: true
                },
                {
                  label: "Projected Net Worth",
                  data: projected,
                  borderColor: "#94a3b8",
                  borderDash: [5, 5],
                  fill: false,
                  tension: 0.1,
                  pointRadius: 0,
                  spanGaps: true
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: (val) => fmtCurrency.format(val),
                  },
                },
              },
            },
          });

          // Trigger a resize after a small delay to ensure the canvas fills the container
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 50);
        }
      } catch (err) {
        console.error("Wealth Actuals Chart Error:", err);
      }
    }
  }

  function renderEscrowTrendsChart(propId) {
    const ctx = document.getElementById("chartEscrowTrends")?.getContext("2d");
    if (!ctx) return;

    if (charts.escrowTrends) charts.escrowTrends.destroy();

    const payments = (state.loanPayments[propId] || [])
      .sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date));

    if (payments.length === 0) {
      charts.escrowTrends = new Chart(ctx, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: { responsive: true, maintainAspectRatio: false }
      });
      return;
    }

    const labels = payments.map((p) => p.payment_date);
    const taxData = payments.map((p) => p.tax_amount);
    const insuranceData = payments.map((p) => p.insurance_amount);

    charts.escrowTrends = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Monthly Tax",
            data: taxData,
            borderColor: "#f87171",
            backgroundColor: "rgba(248, 113, 113, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Monthly Insurance",
            data: insuranceData,
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96, 165, 250, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#94a3b8", font: { size: 10 } },
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: { size: 9 } },
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#64748b",
              font: { size: 9 },
              callback: (v) => fmtCurrency.format(v),
            },
          },
        },
      },
    });
  }

  // --- Table HTML Rendering ---
  function renderTables() {
    // Tab 1 UI Update
    document.getElementById("outSplitMoPayment").textContent =
      fmtCurrency.format(state.crossover.moPayment);

    let interestSavedDisplay = "N/A";

    if (state.crossover.fired) {
      document.getElementById("outSplitCrossover").textContent =
        `${state.crossover.year - 1} Yrs ${state.crossover.month} Mos`;
      document.getElementById("outSplitBadge").style.opacity = "1";

      const saved =
        state.mortgageTotalStandardInterest -
        state.crossover.actualInterestPaid;
      interestSavedDisplay = fmtCurrency.format(Math.max(0, saved));
    } else {
      document.getElementById("outSplitCrossover").innerHTML =
        `<span class="text-2xl text-slate-400">Not within ${state.timelineYears} yrs</span>`;
      document.getElementById("outSplitBadge").style.opacity = "0";
      interestSavedDisplay = fmtCurrency.format(0);
    }

    const outSaved = document.getElementById("outSplitInterestSaved");
    if (outSaved) outSaved.textContent = interestSavedDisplay;

    let tbSplit = document.getElementById("tbSplit");
    tbSplit.innerHTML = state.dataSplit
      .map(
        (d) => `
            <tr class="${d.isCrossoverMarker ? "bg-brand-500/10 transition-colors" : "hover:bg-white/5 transition-colors"}">
                <td class="py-3 px-4 font-medium">${d.isCrossoverMarker ? '<span class="text-brand-400 mr-2">★</span>' : ""}${state.currentYear + d.year - 1}</td>
                <td class="py-3 px-4">Age ${state.age + d.year - 1}</td>
                <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.grossSalary)}</td>
                <td class="py-3 px-4 text-right"><span class="bg-brand-500/10 px-2 py-1 rounded text-brand-300">${fmtCurrency.format(d.netRaiseAmount / 2)}</span></td>
                <td class="py-3 px-4 text-right text-brand-400">+${fmtCurrency.format(d.monthlyContribAmount)}</td>
                <td class="py-3 px-4 text-right bg-slate-800/20">${fmtCurrency.format(d.endInvBal)}</td>
                <td class="py-3 px-4 text-right text-slate-400">${fmtCurrency.format(d.endMortBal)}</td>
            </tr>
        `,
      )
      .join("");

    // Tab 2 UI Update
    const age55Data = state.data401k.find((d) => d.age === 55);
    const retData =
      state.data401k.length > 0
        ? state.data401k[state.data401k.length - 1]
        : null;

    document.getElementById("out401k55").textContent = age55Data
      ? fmtCurrency.format(age55Data.endBal)
      : "N/A";

    const retLabel = document.getElementById("label401kRet");
    if (retLabel && retData) {
      retLabel.textContent = `Balance at Projected Retirement (Age ${retData.age})`;
    }

    const outRet = document.getElementById("out401kRet");
    if (outRet) {
      outRet.textContent = retData ? fmtCurrency.format(retData.endBal) : "N/A";
    }

    document.getElementById("tb401k").innerHTML = state.data401k
      .map(
        (d) => `
            <tr class="hover:bg-white/5 transition-colors">
                <td class="py-3 px-4">${state.currentYear + d.year - 1}</td>
                <td class="py-3 px-4">Age ${d.age}</td>
                <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.grossSalary)}</td>
                <td class="py-3 px-4 text-right text-emerald-400">+${fmtCurrency.format(d.personalContrib)}</td>
                <td class="py-3 px-4 text-right text-brand-400">+${fmtCurrency.format(d.companyContrib)}</td>
                <td class="py-3 px-4 text-right text-amber-400">+${fmtCurrency.format(d.interestEarned)}</td>
                <td class="py-3 px-4 text-right font-medium">${fmtCurrency.format(d.endBal)}</td>
            </tr>
        `,
      )
      .join("");

    // Tab 3: Withdrawal UI Update
    document.getElementById("outWithdrawalStartAge").textContent =
      state.withdrawalSim.startAge;
    document.getElementById("outWithdrawalStartBal").textContent =
      fmtCurrency.format(state.withdrawalSim.startBal);

    const lblResult = document.getElementById("lblWithdrawalResult");
    const outResultVal = document.getElementById("outWithdrawalResultVal");
    const lblResultSub = document.getElementById("lblWithdrawalResultSub");

    if (state.withdrawalSim.hit99) {
      lblResult.textContent = "Remaining Balance at 99";
      outResultVal.textContent = fmtCurrency.format(
        state.withdrawalSim.hit99Bal,
      );
      outResultVal.className = "text-4xl font-bold text-brand-400";
      lblResultSub.innerHTML = `Preserved <span class="text-white">${state.withdrawalSim.yearsLasted}</span> years of safe withdrawals`;
    } else {
      lblResult.textContent = "Years Until Depleted";
      outResultVal.textContent =
        state.withdrawalSim.yearsLasted > 0
          ? state.withdrawalSim.yearsLasted
          : "--";
      outResultVal.className = "text-4xl font-bold text-red-400";
      lblResultSub.innerHTML = `Depleted at Age <span id="outWithdrawalDepleteAge" class="text-white">${state.withdrawalSim.depleteAge ? state.withdrawalSim.depleteAge : "--"}</span>`;
    }

    document.getElementById("tb401kWithdrawal").innerHTML =
      state.data401kWithdrawal
        .map(
          (d) => `
            <tr class="hover:bg-white/5 transition-colors">
                <td class="py-3 px-4">${state.currentYear + (d.age - state.age)}</td>
                <td class="py-3 px-4">Age ${d.age}</td>
                <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.startBal)}</td>
                <td class="py-3 px-4 text-right font-medium text-brand-400">+${fmtCurrency.format(d.growth)}</td>
                <td class="py-3 px-4 text-right text-red-400">-${fmtCurrency.format(d.withdrawal)}</td>
                <td class="py-3 px-4 text-right font-medium text-slate-200">${fmtCurrency.format(d.endBal)}</td>
            </tr>
        `,
      )
      .join("");

    // Tab Roth UI Update
    const r55 = state.dataRoth.find((d) => d.age === 55);
    const p = state.parsedGlobal || parseGlobalInputs();
    const rRet =
      state.dataRoth.length > 0
        ? state.dataRoth[state.dataRoth.length - 1]
        : null;

    elements.outRoth55.textContent = r55
      ? fmtCurrency.format(r55.endBal)
      : "N/A";
    const outRothRet = document.getElementById("outRothRet");
    if (outRothRet) {
      outRothRet.textContent = rRet ? fmtCurrency.format(rRet.endBal) : "N/A";
    }
    const labelRothRet = document.getElementById("labelRothRet");
    if (labelRothRet && rRet) {
      labelRothRet.textContent = `Balance at Projected Retirement (Age ${rRet.age})`;
    }

    elements.tbRoth.innerHTML = state.dataRoth
      .map(
        (d) => `
            <tr class="hover:bg-white/5 transition-colors">
                <td class="py-3 px-4">${state.currentYear + d.year - 1}</td>
                <td class="py-3 px-4">Age ${d.age}</td>
                <td class="py-3 px-4 text-right text-brand-400">+${fmtCurrency.format(d.interestEarned)}</td>
                <td class="py-3 px-4 text-right font-bold text-white">${fmtCurrency.format(d.endBal)}</td>
            </tr>
        `,
      )
      .join("");

    // Roth Withdrawal Update
    const rSim = state.rothWithdrawalSim;
    elements.outRothWithdrawalStartAge.textContent = rSim.startAge;
    elements.outRothWithdrawalStartBal.textContent = fmtCurrency.format(
      rSim.startBal,
    );

    const outRothResVal = elements.outRothWithdrawalResultVal;
    const lblRothResult = document.getElementById("lblRothWithdrawalResult");
    const lblRothResultSub = document.getElementById(
      "lblRothWithdrawalResultSub",
    );

    if (rSim.hit99) {
      if (lblRothResult) lblRothResult.textContent = "Balance at Age 99";
      if (outRothResVal) {
        outRothResVal.className = "text-4xl font-bold text-green-400";
        outRothResVal.textContent = fmtCurrency.format(rSim.hit99Bal);
      }
      if (lblRothResultSub)
        lblRothResultSub.textContent = "Sustainability: Permanent";
    } else {
      if (outRothResVal) outRothResVal.textContent = rSim.yearsLasted + " Yrs";
      if (lblRothResult) lblRothResult.textContent = "Years Until Depleted";
      if (outRothResVal)
        outRothResVal.className = "text-4xl font-bold text-red-400";
      if (lblRothResultSub)
        lblRothResultSub.innerHTML = `Depleted at Age <span id="outRothWithdrawalDepleteAge" class="text-white">${rSim.depleteAge}</span>`;
    }

    elements.tbRothWithdrawal.innerHTML = state.dataRothWithdrawal
      .map(
        (d) => `
            <tr class="hover:bg-white/5 transition-colors">
                <td class="py-3 px-4">${state.currentYear + (d.age - state.age)}</td>
                <td class="py-3 px-4">Age ${d.age}</td>
                <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.startBal)}</td>
                <td class="py-3 px-4 text-right font-medium text-brand-400">+${fmtCurrency.format(d.growth)}</td>
                <td class="py-3 px-4 text-right text-red-400">-${fmtCurrency.format(d.withdrawal)}</td>
                <td class="py-3 px-4 text-right font-medium text-slate-200">${fmtCurrency.format(d.endBal)}</td>
            </tr>
        `,
      )
      .join("");

    // Tab 4 UI Update
    document.getElementById("tbSalary").innerHTML = state.dataSalary
      .map(
        (d) => `
            <tr class="hover:bg-white/5 transition-colors">
                <td class="py-3 px-4">${state.currentYear + d.year - 1}</td>
                <td class="py-3 px-4">Age ${state.age + d.year - 1}</td>
                <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.baseSalary)}</td>
                <td class="py-3 px-4 text-right text-slate-400">${fmtCurrency.format(d.bonusAmount)}</td>
                <td class="py-3 px-4 text-right font-bold text-brand-400">${fmtCurrency.format(d.totalComp)}</td>
            </tr>
        `,
      )
      .join("");

    renderAmortizationTable();
  }

  // --- API Sync ---
  const API_URL_SETTINGS = "http://localhost:8000/api/settings";
  const API_URL_HISTORICAL = "http://localhost:8000/api/historical";
  const API_URL_PAYSTUBS = "http://localhost:8000/api/paystubs";
  const API_URL_PROPERTIES = "http://localhost:8000/api/properties";
  const API_URL_INVESTMENTS = "http://localhost:8000/api/investments";
  const API_URL_LOAN_PAYMENTS = "http://localhost:8000/api/loan-payments";

  async function fetchPropertiesFromAPI() {
    try {
      const resp = await fetch(API_URL_PROPERTIES + "?user_id=1");
      if (resp.ok) {
        state.properties = await resp.json();
        renderPropertiesTable();
        populatePropertyDropdown();
        // Trigger full recalculation so mortgage/kill-shot tabs and
        // net worth chart all reflect the newly loaded property data
        if (!state.isInitialLoad) {
          runAllCalculations();
        }
      }
    } catch (e) {
      console.error("Failed to fetch properties:", e);
    }
  }

  async function fetchInvestmentsFromAPI() {
    try {
      const resp = await fetch(API_URL_INVESTMENTS + "?user_id=1");
      if (resp.ok) {
        state.investments = await resp.json();
        renderInvestmentsTable();
      }
    } catch (e) {
      console.error("Failed to fetch investments:", e);
    }
  }

  function renderInvestmentsTable() {
    if (!elements.tbInvestments) return;
    if (state.investments.length === 0) {
      elements.tbInvestments.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-500 italic">No investment accounts logged yet.</td></tr>`;
      return;
    }

    elements.tbInvestments.innerHTML = state.investments
      .map((inv) => `
        <tr class="hover:bg-white/5 transition-colors group">
          <td class="py-3 px-4 text-slate-400 font-medium">${inv.account_type}</td>
          <td class="py-3 px-4 text-slate-200 font-bold">${inv.name}</td>
          <td class="py-3 px-4 text-right text-brand-300 font-mono font-bold">${fmtCurrency.format(inv.current_value)}</td>
          <td class="py-3 px-4 text-right text-slate-400 font-mono">${inv.growth_target.toFixed(2)}%</td>
          <td class="py-3 px-4 text-center">
            <div class="flex justify-center gap-2">
              <button onclick="editInvestment(${inv.id})" class="text-slate-400 hover:text-brand-400 transition-colors" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onclick="deleteInvestment(${inv.id})" class="text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join("");
  }

  window.editInvestment = (id) => {
    const inv = state.investments.find((i) => i.id === id);
    if (!inv) return;
    elements.invId.value = inv.id;
    elements.invName.value = inv.name;
    elements.invType.value = inv.account_type;
    elements.invValue.value = inv.current_value.toLocaleString("en-US", { minimumFractionDigits: 2 });
    elements.invGrowth.value = inv.growth_target;
    if (elements.valInvGrowth) elements.valInvGrowth.textContent = `${inv.growth_target.toFixed(2)}%`;
    elements.btnSaveInvestment.textContent = "Update Account";
    elements.investmentForm.scrollIntoView({ behavior: "smooth" });
  };

  window.deleteInvestment = async (id) => {
    if (!confirm("Are you sure you want to delete this investment account?")) return;
    try {
      const resp = await fetch(API_URL_INVESTMENTS + `/${id}?user_id=1`, {
        method: "DELETE",
      });
      if (resp.ok) {
        fetchInvestmentsFromAPI();
      }
    } catch (e) {
      console.error("Delete investment error:", e);
    }
  };

  async function fetchExtraPaymentsFromAPI(propertyId) {
    try {
      const resp = await fetch(
        API_URL_PROPERTIES + `/${propertyId}/extra-payments?user_id=1`,
      );
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.error(
        `Failed to fetch extra payments for property ${propertyId}`,
        e,
      );
    }
    return [];
  }

  async function fetchValuationsFromAPI(propertyId) {
    try {
      const resp = await fetch(
        API_URL_PROPERTIES + `/${propertyId}/valuations?user_id=1`,
      );
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.error(`Failed to fetch valuations for property ${propertyId}`, e);
    }
    return [];
  }

  async function fetchAllExtraPayments() {
    state.extraPayments = [];
    state.valuations = {};
    for (const p of state.properties) {
      const payments = await fetchExtraPaymentsFromAPI(p.id);
      state.extraPayments.push(...payments);

      const valuationsRow = await fetchValuationsFromAPI(p.id);
      state.valuations[p.id] = valuationsRow.sort(
        (a, b) => new Date(a.valuation_date) - new Date(b.valuation_date),
      );
    }
    renderExtraPaymentsTable();
    // Recalculate after all extra payments + valuations are loaded so
    // amortization data and charts reflect the latest DB state
    if (!state.isInitialLoad) {
      runAllCalculations();
    }
  }

  function renderPropertiesTable() {
    if (!elements.tbProperties) return;
    if (state.properties.length === 0) {
      elements.tbProperties.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-500">No properties saved yet.</td></tr>`;
      return;
    }
    elements.tbProperties.innerHTML = state.properties
      .map((p) => {
        const fullAddress = p.address_street
          ? `${p.address_street}, ${p.address_city}, ${p.address_state} ${p.address_zip}`
          : p.address || "N/A";
        return `
      <tr class="hover:bg-white/5 transition-colors group">
        <td class="w-12 px-4 py-3">
            <button
              onclick="togglePropertyDetails('prop-details-${p.id}', this)"
              class="w-6 h-6 rounded flex items-center justify-center bg-slate-800 hover:bg-brand-500/20 text-slate-400 hover:text-brand-400 transition-colors"
              title="Toggle Details"
            >
              <svg class="w-3 h-3 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
        </td>
        <td class="py-3 pr-4">${p.property_type || "N/A"}</td>
        <td class="py-3 pr-4">${fullAddress}</td>
        <td class="py-3 pr-4 text-right">${fmtCurrency.format(p.purchase_price || 0)}</td>
        <td class="py-3 pr-4 text-right">${(p.interest_rate * 100).toFixed(2)}%</td>
        <td class="py-3 text-center flex items-center justify-center gap-2">
            <button onclick="editProperty(${p.id})" class="text-brand-400 hover:text-brand-300">Edit</button>
            <button onclick="deleteProperty(${p.id})" class="text-red-400 hover:text-red-500">Delete</button>
        </td>
      </tr>
      <tr id="prop-details-${p.id}" class="hidden bg-slate-900/50 border-t border-dark-border/30">
        <td colspan="6" class="px-8 py-4">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div>
                    <h5 class="text-slate-500 uppercase tracking-widest font-bold mb-2">Loan Logistics</h5>
                    <div class="space-y-1">
                        <p><span class="text-slate-400">Term:</span> <span class="text-slate-200">${p.loan_term_months || 360} mo</span></p>
                        <p><span class="text-slate-400">Frequency:</span> <span class="text-slate-200">${p.payment_frequency || "Monthly"}</span></p>
                        <p><span class="text-slate-400">Loan Start:</span> <span class="text-slate-200">${p.loan_start_date || "N/A"}</span></p>
                        <p><span class="text-slate-400">Initial Loan:</span> <span class="text-slate-200">${fmtCurrency.format(p.initial_loan_value || 0)}</span></p>
                    </div>
                </div>
                 <div>
                    <h5 class="text-slate-500 uppercase tracking-widest font-bold mb-2">Payment Breakdown (Est.)</h5>
                    <div class="space-y-1 text-brand-300">
                        ${(() => {
                          const rExp = (p.interest_rate || 0) / 12;
                          const nExp = p.loan_term_months || 0;
                          const pvExp = p.initial_loan_value || p.purchase_price || 0;
                          let pmtExp = 0;
                          if (nExp > 0 && rExp > 0) {
                            pmtExp = (pvExp * (rExp * Math.pow(1 + rExp, nExp))) / (Math.pow(1 + rExp, nExp) - 1);
                          } else if (nExp > 0) {
                            pmtExp = pvExp / nExp;
                          }
                          const intExp = pvExp * rExp;
                          const prinExp = pmtExp - intExp;
                          return `
                            <p><span class="text-slate-400">Principal (Pmt 1):</span> <span>${fmtCurrency.format(prinExp)}</span></p>
                            <p><span class="text-slate-400">Interest (Pmt 1):</span> <span>${fmtCurrency.format(intExp)}</span></p>
                            <p class="text-[10px] text-slate-500 italic">Tax & Insurance: see logged payments</p>
                          `;
                        })()}
                    </div>
                </div>
                <div>
                    <h5 class="text-slate-500 uppercase tracking-widest font-bold mb-2">Reconciliation</h5>
                    <div class="space-y-1">
                        <p><span class="text-slate-400">Last Reconciled:</span> <span class="text-slate-200">${p.reconciliation_date || "N/A"}</span></p>
                        <p><span class="text-slate-400">Reconciled Bal:</span> <span class="text-slate-200">${fmtCurrency.format(p.reconciled_balance || 0)}</span></p>
                    </div>
                </div>
                 <div>
                    <h5 class="text-slate-500 uppercase tracking-widest font-bold mb-2">Created</h5>
                    <div class="space-y-1">
                        <p><span class="text-slate-400">Added:</span> <span class="text-slate-200">${new Date(p.created_at).toLocaleDateString()}</span></p>
                        <p><span class="text-slate-400">Database ID:</span> <span class="text-slate-600 font-mono">${p.id}</span></p>
                    </div>
                </div>
            </div>
        </td>
      </tr>
    `;
      })
      .join("");
  }

  function populatePropertyDropdown() {
    if (!elements.epPropertySelect) return;
    elements.epPropertySelect.innerHTML =
      `<option value="">-- Choose Property --</option>` +
      state.properties
        .map((p) => {
          const displayAddr = p.address_street
            ? `${p.address_street}, ${p.address_city}`
            : p.address || "Unknown Property";
          return `<option value="${p.id}">${displayAddr}</option>`;
        })
        .join("");
    populateDetailsPropertySelect();
  }

  function renderExtraPaymentsTable() {
    if (!elements.tbExtraPayments) return;
    if (state.extraPayments.length === 0) {
      elements.tbExtraPayments.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-slate-500">No extra payments recorded.</td></tr>`;
      return;
    }

    // Sort descending by date
    state.extraPayments.sort(
      (a, b) => new Date(b.payment_date) - new Date(a.payment_date),
    );

    elements.tbExtraPayments.innerHTML = state.extraPayments
      .map((ep) => {
        const p = state.properties.find((prop) => prop.id === ep.property_id);
        const address = p
          ? p.address_street
            ? `${p.address_street}, ${p.address_city}`
            : p.address
          : "Unknown Property";
        return `
      <tr class="hover:bg-white/5 transition-colors">
        <td class="py-3 pr-4">${ep.payment_date}</td>
        <td class="py-3 pr-4">${address}</td>
        <td class="py-3 pr-4 text-right text-brand-400 font-bold">${fmtCurrency.format(ep.amount)}</td>
        <td class="py-3 text-center">
            <button onclick="deleteExtraPayment(${ep.property_id}, ${ep.id})" class="text-red-400 hover:text-red-500">Delete</button>
        </td>
      </tr>
      `;
      })
      .join("");
  }

  window.editProperty = (id) => {
    const p = state.properties.find((prop) => prop.id === id);
    if (!p) return;

    elements.propId.value = p.id;
    elements.propType.value = p.property_type;
    elements.propAddress.value = p.address_street || "";
    elements.propCity.value = p.address_city || "";
    elements.propState.value = p.address_state || "";
    elements.propZip.value = p.address_zip || "";
    elements.propPurchaseDate.value = p.purchase_date;
    elements.propPurchasePrice.value = (p.purchase_price || 0).toLocaleString();
    elements.propLoanDate.value = p.loan_start_date || "";
    elements.propLoanTerm.value = p.loan_term_months || 360;
    elements.propPayFreq.value = p.payment_frequency || "Monthly";
    elements.propInitLoan.value = (p.initial_loan_value || 0).toLocaleString();
    elements.propRate.value = (p.interest_rate * 100).toFixed(3);
    elements.propLoanType.value = p.loan_type || "Conventional";
    elements.propReconBal.value = (p.reconciled_balance || 0).toLocaleString();
    elements.propReconciliationDate.value = p.reconciliation_date || "";

    elements.btnSaveProperty.textContent = "Update Property";
    // Scroll to form
    elements.propertyForm.scrollIntoView({ behavior: "smooth" });
  };

  window.deleteProperty = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const resp = await fetch(API_URL_PROPERTIES + `/${id}?user_id=1`, {
        method: "DELETE",
      });
      if (resp.ok) {
        await fetchPropertiesFromAPI();
        await fetchAllExtraPayments();
        runAllCalculations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  window.deleteLoanPayment = async function (id, propertyId) {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    try {
      const resp = await fetch(
        `http://localhost:8000/api/properties/${propertyId}/payments/${id}?user_id=1`,
        { method: "DELETE" }
      );
      if (resp.ok) {
        // Refresh local state
        await fetchAllLoanPayments();
        updatePropertyDetailsUI();
      }
    } catch (e) {
      console.error("Delete payment failed:", e);
    }
  };

  window.deletePaystub = async (id) => {
    if (!confirm("Are you sure you want to delete this historical wage entry?"))
      return;
    try {
      const resp = await fetch(API_URL_PAYSTUBS + `/${id}?user_id=1`, {
        method: "DELETE",
      });
      if (resp.ok) {
        // Refresh local data
        await fetchHistoricalEntries();
        await fetchAllPaystubs();
        runAllCalculations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  window.deleteHistoricalSnapshot = async (id) => {
    if (!confirm("Are you sure you want to delete this historical snapshot?"))
      return;
    try {
      const resp = await fetch(API_URL_HISTORICAL + `/${id}?user_id=1`, {
        method: "DELETE",
      });
      if (resp.ok) {
        await fetchHistoricalDataFromAPI();
      }
    } catch (e) {
      console.error(e);
    }
  };

  window.deleteExtraPayment = async (propId, paymentId) => {
    if (!confirm("Are you sure you want to delete this extra payment?")) return;
    try {
      const resp = await fetch(
        API_URL_PROPERTIES + `/${propId}/extra-payments/${paymentId}?user_id=1`,
        { method: "DELETE" },
      );
      if (resp.ok) {
        await fetchAllExtraPayments();
        runAllCalculations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function fetchSettingsFromAPI() {
    console.log("Fetching settings from API...");
    try {
      const resp = await fetch(API_URL_SETTINGS + "?user_id=1");
      if (resp.ok) {
        state.isInitialLoad = true;
        const data = await resp.json();
        console.log("Restoring settings from API:", data);

        // Restore Core Profile
        if (data.dob !== undefined) elements.inpDob.value = data.dob;
        if (typeof data.base_salary === "number")
          elements.inpSalary.value = data.base_salary.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
        if (typeof data.expected_raise_percent === "number")
          elements.inpRaise.value = data.expected_raise_percent * 100;
        if (data.pay_periods !== undefined)
          elements.inpPayPeriod.value = data.pay_periods;

        // Restore Modes & Toggle UI
        if (data.tax_mode === "advanced" && state.taxMode === "simple") {
          elements.btnTaxMode.click(); // Trigger UI toggle
        } else if (data.tax_mode === "simple" && state.taxMode === "advanced") {
          elements.btnTaxMode.click();
        }

        // Restore Simple Tax & Deductions
        if (typeof data.federal_tax_rate === "number")
          elements.inpFedTax.value = data.federal_tax_rate * 100;
        if (typeof data.state_tax_rate === "number")
          elements.inpStateTax.value = data.state_tax_rate * 100;
        if (typeof data.insurance_premium === "number")
          elements.inpInsurance.value = data.insurance_premium;

        // Restore Advanced Tax (Per Pay Period)
        if (typeof data.adv_fed_tax === "number")
          elements.inpAdvFed.value = data.adv_fed_tax.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
        if (typeof data.adv_ss_tax === "number")
          elements.inpAdvSS.value = data.adv_ss_tax.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
        if (typeof data.adv_med_tax === "number")
          elements.inpAdvMed.value = data.adv_med_tax.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
        if (typeof data.adv_state_tax === "number")
          elements.inpAdvState.value = data.adv_state_tax.toLocaleString(
            "en-US",
            { minimumFractionDigits: 0, maximumFractionDigits: 2 },
          );
        if (typeof data.adv_state_other === "number")
          elements.inpAdvStateOther.value = data.adv_state_other.toLocaleString(
            "en-US",
            { minimumFractionDigits: 0, maximumFractionDigits: 2 },
          );

        // Restore Advanced Insurance (Per Pay Period)
        if (typeof data.adv_med_ins === "number")
          elements.inpAdvMedIns.value = data.adv_med_ins.toLocaleString(
            "en-US",
            { minimumFractionDigits: 0, maximumFractionDigits: 2 },
          );
        if (typeof data.adv_dental === "number")
          elements.inpAdvDental.value = data.adv_dental.toLocaleString(
            "en-US",
            { minimumFractionDigits: 0, maximumFractionDigits: 2 },
          );
        if (typeof data.adv_vision === "number")
          elements.inpAdvVision.value = data.adv_vision.toLocaleString(
            "en-US",
            { minimumFractionDigits: 0, maximumFractionDigits: 2 },
          );
        if (typeof data.adv_life === "number")
          elements.inpAdvLife.value = data.adv_life.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
        if (typeof data.adv_other_ins === "number")
          elements.inpAdvOtherIns.value = data.adv_other_ins.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            },
          );
        if (typeof data.adv_hsa === "number")
          elements.inpAdvHsa.value = data.adv_hsa.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

        // Restore 401(k) / Investments
        if (typeof data.contribution_401k_percent === "number")
          elements.inp401kPersonal.value = data.contribution_401k_percent * 100;
        if (data.k401_match_type !== undefined)
          elements.inp401kMatchType.value = data.k401_match_type;
        if (typeof data.k401_match_limit_percent === "number")
          elements.inp401kMatchLimit.value =
            data.k401_match_limit_percent * 100;
        if (typeof data.k401_auto_contribution_percent === "number")
          elements.inp401kAuto.value =
            data.k401_auto_contribution_percent * 100;
        if (typeof data.k401_start_balance === "number")
          elements.inp401kBal.value = data.k401_start_balance.toLocaleString(
            "en-US",
            { minimumFractionDigits: 0, maximumFractionDigits: 2 },
          );
        if (typeof data.k401_growth_rate === "number")
          elements.inp401kGrowth.value = data.k401_growth_rate * 100;
        if (typeof data.roth_ira_start_balance === "number")
          elements.inpRothBal.value =
            data.roth_ira_start_balance.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
        if (typeof data.roth_ira_growth_rate === "number")
          elements.inpRothGrowth.value = data.roth_ira_growth_rate * 100;

        // Restore Taxable
        if (typeof data.taxable_start_balance === "number")
          elements.inpTaxableBal.value =
            data.taxable_start_balance.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
        if (typeof data.taxable_growth_rate === "number")
          elements.inpTaxableGrowth.value = data.taxable_growth_rate * 100;

        // Restore Retirement Goals
        if (typeof data.target_bonus_percent === "number")
          elements.inpBonus.value = data.target_bonus_percent * 100;
        if (data.target_retirement_age !== undefined)
          elements.inpRetirementAge.value = data.target_retirement_age;
        if (data.target_roth_retirement_age !== undefined)
          elements.inpRothRetirementAge.value = data.target_roth_retirement_age;
        if (data.withdrawal_retirement !== undefined)
          elements.inpWithdrawalRetAge.value = data.withdrawal_retirement;
        if (data.roth_withdrawal_retirement !== undefined)
          elements.inpRothWithdrawalRetAge.value =
            data.roth_withdrawal_retirement;
        if (typeof data.withdrawal_rate === "number")
          elements.inpWithdrawalRate.value = data.withdrawal_rate * 100;
        if (typeof data.roth_withdrawal_rate === "number")
          elements.inpRothWithdrawalRate.value =
            data.roth_withdrawal_rate * 100;
        if (data.timezone !== undefined)
          elements.inpTimezone.value = data.timezone;
      }
    } catch (e) {
      console.error("Failed to fetch settings", e);
      throw e; // Rethrow so boot() knows it failed
    }
  }

  async function pushSettingsToAPI() {
    if (state.isInitialLoad) return;
    const parsed = parseGlobalInputs();

    // Helper to get raw numeric value from UI inputs (that might have commas or % signs)
    const getRaw = (id) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      return parseFloat(el.value.replace(/,/g, "")) || 0;
    };

    const payload = {
      dob: elements.inpDob.value,
      base_salary: parsed.salary,
      expected_raise_percent: parsed.raisePct,
      pay_periods: parsed.payPeriods,

      tax_mode: state.taxMode,
      mortgage_mode: state.mortMode,

      federal_tax_rate: parsed.fedTaxPct,
      state_tax_rate: parsed.stateTaxPct,
      insurance_premium: parsed.insPremiumPay,

      adv_fed_tax: getRaw("inpAdvFed"),
      adv_ss_tax: getRaw("inpAdvSS"),
      adv_med_tax: getRaw("inpAdvMed"),
      adv_state_tax: getRaw("inpAdvState"),
      adv_state_other: getRaw("inpAdvStateOther"),

      adv_med_ins: getRaw("inpAdvMedIns"),
      adv_dental: getRaw("inpAdvDental"),
      adv_vision: getRaw("inpAdvVision"),
      adv_life: getRaw("inpAdvLife"),
      adv_other_ins: getRaw("inpAdvOtherIns"),
      adv_hsa: getRaw("inpAdvHsa"),

      contribution_401k_percent: parsed.k401PersonalPct,
      k401_match_type: parsed.k401MatchType,
      k401_match_limit_percent: parsed.k401MatchLimitPct,
      k401_auto_contribution_percent: parsed.k401AutoPct,
      k401_start_balance: parsed.k401StartBal,
      k401_growth_rate: parsed.k401Growth,
      roth_ira_start_balance: parsed.rothStartBal,
      roth_ira_growth_rate: parsed.roth_ira_growth_rate,
      target_roth_retirement_age: parsed.targetRothRetirementAge,
      roth_withdrawal_retirement: parsed.rothWithdrawalRetAge,
      roth_withdrawal_rate: parsed.rothWithdrawalRate,
      timezone: parsed.timezone,

      taxable_start_balance: parsed.taxableStartBal,
      taxable_growth_rate: parsed.taxableGrowth,

      target_bonus_percent: parsed.targetBonusPct,
      target_retirement_age: parsed.targetRetirementAge,
      withdrawal_retirement: parsed.withdrawalRetAge,
      withdrawal_rate: parsed.withdrawalRate,
    };

    console.log("Syncing settings to API...", payload);

    try {
      const resp = await fetch(API_URL_SETTINGS + "?user_id=1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        console.log("Settings synced successfully.");
      } else {
        console.error("Failed to sync settings", resp.statusText);
      }
    } catch (e) {
      console.error("Failed to push settings", e);
    }
  }

  async function fetchHistoricalDataFromAPI() {
    try {
      // 1. Fetch Snapshots
      const respSnap = await fetch(API_URL_HISTORICAL + "?user_id=1");
      if (respSnap.ok) {
        const data = await respSnap.json();
        const tbody = document.getElementById("tbHistorical");
        if (tbody) {
          if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-500">No historical data recorded yet. Capture a snapshot!</td></tr>`;
          } else {
            // Sort Descending (Newest date first)
            data.sort(
              (a, b) => new Date(b.snapshot_date) - new Date(a.snapshot_date),
            );
            state.dataHistorical = data;
            tbody.innerHTML = data
              .map(
                (d) => `
                <tr class="hover:bg-white/5 transition-colors group">
                  <td class="py-3 px-4">${d.snapshot_date}</td>
                  <td class="py-3 px-4 text-right font-bold text-white">${fmtCurrency.format(d.net_worth)}</td>
                  <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.balance_401k)}</td>
                  <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.balance_roth_ira)}</td>
                  <td class="py-3 px-4 text-right text-slate-300">${fmtCurrency.format(d.investment_balance)}</td>
                  <td class="py-3 px-4 text-right text-red-400">${fmtCurrency.format(d.mortgage_balance)}</td>
                  <td class="py-3 px-4 text-right">
                    <button
                      onclick="deleteHistoricalSnapshot(${d.id})"
                      class="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Snapshot"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
            `,
              )
              .join("");

            // Refresh Home KPIs since they depend on historical data
            updateHomeScreenMetrics();
          }
        }
      }

      // 2. Fetch Paystubs
      const respPs = await fetch(API_URL_PAYSTUBS + "?user_id=1");
      if (respPs.ok) {
        const data = await respPs.json();

        // Sort data chronologically (Descending: newest first)
        data.sort((a, b) => new Date(b.pay_date) - new Date(a.pay_date));
        state.dataPaystubs = data;

        // Auto-populate the Year dropdown in the Observability Tab
        const yearsSet = new Set(
          data.map((d) => new Date(d.pay_date).getFullYear()),
        );
        const yearsArr = Array.from(yearsSet).sort().reverse();
        if (elements.inpDashboardYear) {
          const currentSelected = elements.inpDashboardYear.value;
          elements.inpDashboardYear.innerHTML =
            `<option value="All">All Time</option>` +
            yearsArr.map((y) => `<option value="${y}">${y}</option>`).join("");

          // Re-select if it still exists
          if (
            currentSelected === "All" ||
            yearsArr.includes(parseInt(currentSelected))
          ) {
            elements.inpDashboardYear.value = currentSelected;
          }
        }

        const tbody = document.getElementById("tbPaystubs");
        if (tbody) {
          if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-500">No paystubs recorded yet.</td></tr>`;
          } else {
            // Need global settings for 401k match calc
            const p = parseGlobalInputs();

            // 1. Pre-calculate Annual Totals
            const annualTotals = {};
            data.forEach((d) => {
              const year = new Date(d.pay_date).getFullYear();
              if (!annualTotals[year]) {
                annualTotals[year] = {
                  gross: 0,
                  extra: 0,
                  taxes: 0,
                  deductions: 0,
                  k401k: 0,
                  match: 0,
                  net: 0,
                  count: 0,
                };
              }
              const totals = annualTotals[year];
              totals.gross += d.gross_pay || 0;
              totals.extra += d.extra_pay || 0;

              const t =
                (d.federal_tax || 0) +
                (d.social_security_tax || 0) +
                (d.medicare_tax || 0) +
                (d.state_tax || 0) +
                (d.state_other_tax || 0);
              const dens =
                (d.medical_insurance || 0) +
                (d.dental_insurance || 0) +
                (d.vision_insurance || 0) +
                (d.life_insurance || 0) +
                (d.other_insurance || 0) +
                (d.hsa_contribution || 0);

              totals.taxes += t;
              totals.deductions += dens;
              totals.k401k += d.k401k_contribution || 0;
              totals.net += d.net_pay || 0;

              let cm = 0;
              if (p) {
                const empContribPct =
                  d.gross_pay > 0
                    ? (d.k401k_contribution || 0) / d.gross_pay
                    : 0;
                let matchPctApplied = 0;
                if (p.k401MatchType === 1.0) {
                  matchPctApplied = Math.min(
                    empContribPct,
                    p.k401MatchLimitPct,
                  );
                } else if (p.k401MatchType === 0.5) {
                  matchPctApplied = Math.min(
                    empContribPct * 0.5,
                    p.k401MatchLimitPct,
                  );
                }
                const matchAmount = (d.gross_pay || 0) * matchPctApplied;
                const autoAmount = (d.gross_pay || 0) * p.k401AutoPct;
                cm = matchAmount + autoAmount;
              }
              totals.match += cm;
              totals.count++;
            });

            // 2. Render Main Table with Headers
            let html = "";
            let currentBlockYear = null;

            data.forEach((d, index) => {
              const rowYear = new Date(d.pay_date).getFullYear();

              // Insert year transition summary row
              if (rowYear !== currentBlockYear) {
                const t = annualTotals[rowYear];
                html += `
                  <tr class="bg-brand-500/10 border-y border-brand-500/20 group">
                    <td class="py-4 px-4">
                      <div class="flex items-center gap-2">
                         <div class="w-8 h-8 rounded bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs shadow-inner shadow-brand-500/20">${rowYear}</div>
                         <div class="text-[9px] uppercase tracking-widest text-slate-500 font-bold leading-tight">Yearly<br/>Totals</div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-[10px] text-slate-500 italic font-medium uppercase tracking-wider">Entries: ${t.count}</td>
                    <td class="py-4 px-4 text-right font-bold text-white font-mono">${fmtCurrency.format(t.gross)}</td>
                    <td class="py-4 px-4 text-right font-bold text-emerald-400 font-mono">${fmtCurrency.format(t.extra)}</td>
                    <td class="py-4 px-4 text-right font-bold text-red-500 font-mono">${fmtCurrency.format(t.taxes)}</td>
                    <td class="py-4 px-4 text-right font-bold text-amber-500 font-mono">${fmtCurrency.format(t.deductions)}</td>
                    <td class="py-4 px-4 text-right font-bold text-brand-400 font-mono">${fmtCurrency.format(t.k401k)}</td>
                    <td class="py-4 px-4 text-right font-bold text-brand-600/60 font-mono bg-slate-800/10 border-x border-dark-border/10">${fmtCurrency.format(t.match)}</td>
                    <td class="py-4 px-4 text-right font-black text-brand-300 bg-brand-500/10 font-mono ring-1 ring-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]">${fmtCurrency.format(t.net)}</td>
                    <td class="py-4 px-4 text-right text-slate-600 text-[10px] italic">ANNUAL SUM</td>
                  </tr>
                `;
                currentBlockYear = rowYear;
              }

              const totalTaxes =
                (d.federal_tax || 0) +
                (d.social_security_tax || 0) +
                (d.medicare_tax || 0) +
                (d.state_tax || 0) +
                (d.state_other_tax || 0);
              const totalDeductions =
                (d.medical_insurance || 0) +
                (d.dental_insurance || 0) +
                (d.vision_insurance || 0) +
                (d.life_insurance || 0) +
                (d.other_insurance || 0) +
                (d.hsa_contribution || 0);

              // --- Calculate Paycheck Details ---
              let hoursPerPeriod = 80;
              if (p && p.payPeriods) {
                hoursPerPeriod = 2080 / p.payPeriods;
              }
              const totalGross = (d.gross_pay || 0) + (d.extra_pay || 0);
              const effectiveHourly = totalGross / hoursPerPeriod;
              const taxPercent =
                totalGross > 0 ? (totalTaxes / totalGross) * 100 : 0;
              const insPercent =
                totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0;

              // 3. Company 401(k) Match Contribution
              let companyMatch = 0;
              if (p) {
                const empContribPct =
                  d.gross_pay > 0
                    ? (d.k401k_contribution || 0) / d.gross_pay
                    : 0;
                let matchPctApplied = 0;
                if (p.k401MatchType === 1.0) {
                  matchPctApplied = Math.min(
                    empContribPct,
                    p.k401MatchLimitPct,
                  );
                } else if (p.k401MatchType === 0.5) {
                  matchPctApplied = Math.min(
                    empContribPct * 0.5,
                    p.k401MatchLimitPct,
                  );
                }
                const matchAmount = (d.gross_pay || 0) * matchPctApplied;
                const autoAmount = (d.gross_pay || 0) * p.k401AutoPct;
                companyMatch = matchAmount + autoAmount;
              }

              html += `
                <tr class="hover:bg-white/5 transition-colors group">
                  <td class="w-16 px-4 flex items-center gap-2 py-3">
                    <button
                      onclick="togglePaystubDetails('ps-details-${index}', this)"
                      class="w-6 h-6 rounded flex items-center justify-center bg-slate-800 hover:bg-brand-500/20 text-slate-400 hover:text-brand-400 transition-colors"
                      title="Toggle Details"
                    >
                      <svg class="w-3 h-3 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onclick="deletePaystub(${d.id})"
                      class="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Entry"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                  <td class="py-3 px-4 text-slate-200 font-medium">${d.pay_date}</td>
                  <td class="py-3 px-4 text-right text-slate-300 font-mono">${fmtCurrency.format(d.gross_pay)}</td>
                  <td class="py-3 px-4 text-right text-emerald-400 font-mono relative group">
                    <span class="${d.notes ? "border-b border-dotted border-emerald-500/50 cursor-help" : ""}">
                      +${fmtCurrency.format(d.extra_pay || 0)}
                    </span>
                    ${
                      d.notes
                        ? `
                      <div class="absolute bottom-full right-4 mb-2 hidden group-hover:block z-50 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                        <div class="bg-slate-900/95 border border-emerald-500/30 text-slate-200 text-[10px] px-3 py-2 rounded shadow-2xl backdrop-blur-md pointer-events-none">
                          <div class="flex items-start gap-2">
                            <svg class="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                            <span class="leading-relaxed">${d.notes}</span>
                          </div>
                          <div class="absolute top-full right-4 -mt-px w-2 h-2 bg-slate-900 border-r border-b border-emerald-500/30 rotate-45"></div>
                        </div>
                      </div>
                    `
                        : ""
                    }
                  </td>
                  <td class="py-3 px-4 text-right text-red-400 font-mono">-${fmtCurrency.format(totalTaxes)}</td>
                  <td class="py-3 px-4 text-right text-amber-500 font-mono">-${fmtCurrency.format(totalDeductions)}</td>
                  <td class="py-3 px-4 text-right text-brand-400 font-mono">-${fmtCurrency.format(d.k401k_contribution)}</td>
                  <td class="py-3 px-4 text-right bg-slate-800/10 text-slate-500 font-mono">+${fmtCurrency.format(companyMatch)}</td>
                  <td class="py-3 px-4 text-right font-bold text-brand-300 bg-brand-500/5 font-mono">${fmtCurrency.format(d.net_pay)}</td>
                  <td class="py-3 px-4 text-right text-slate-500 text-[10px] italic border-l border-dark-border/30 font-mono">$${effectiveHourly.toFixed(2)}</td>
                </tr>
                <tr id="ps-details-${index}" class="hidden bg-slate-900/50 border-x border-dark-border/30">
                  <td colspan="10" class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                      
                      <!-- Paycheck Details -->
                      <div class="space-y-3">
                        <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-1">Paycheck Details</h4>
                        <div class="space-y-2">
                          <div class="flex justify-between text-xs text-slate-400"><span>Effective Hourly Rate (40hr)</span><span class="font-mono">${fmtCurrency.format(effectiveHourly)}/hr</span></div>
                          <div class="flex justify-between text-xs text-slate-400"><span>Tax Burden</span><span class="font-mono">${taxPercent.toFixed(1)}%</span></div>
                          <div class="flex justify-between text-xs text-slate-400"><span>Insurance Burden</span><span class="font-mono">${insPercent.toFixed(1)}%</span></div>
                          <div class="flex justify-between text-xs text-slate-400" title="Auto-calculated from Global 401(k) Match Setup"><span>Company 401(k) Match</span><span class="font-mono text-brand-400">${fmtCurrency.format(companyMatch)}</span></div>
                        </div>
                      </div>

                      <!-- Breakdown -->
                      <div class="space-y-3">
                        <h4 class="text-xs font-bold text-brand-400 uppercase tracking-widest border-b border-brand-500/20 pb-1">Tax Breakdown</h4>
                        <div class="space-y-2">
                          <div class="flex justify-between text-xs text-slate-400"><span>Federal Income Tax</span><span class="font-mono">-${fmtCurrency.format(d.federal_tax || 0)}</span></div>
                          <div class="flex justify-between text-xs text-slate-400"><span>Social Security</span><span class="font-mono">-${fmtCurrency.format(d.social_security_tax || 0)}</span></div>
                          <div class="flex justify-between text-xs text-slate-400"><span>Medicare</span><span class="font-mono">-${fmtCurrency.format(d.medicare_tax || 0)}</span></div>
                          <div class="flex justify-between text-xs text-slate-400"><span>State Income Tax</span><span class="font-mono">-${fmtCurrency.format(d.state_tax || 0)}</span></div>
                          ${d.state_other_tax > 0 ? `<div class="flex justify-between text-xs text-slate-400"><span>Other State/Local</span><span class="font-mono">-${fmtCurrency.format(d.state_other_tax)}</span></div>` : ""}
                        </div>
                      </div>

                      <!-- Deductions -->
                      <div class="space-y-3">
                        <h4 class="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-1">Insurance & HSA</h4>
                        <div class="space-y-2">
                          ${d.medical_insurance > 0 ? `<div class="flex justify-between text-xs text-slate-400"><span>Medical Insurance</span><span class="font-mono">-${fmtCurrency.format(d.medical_insurance)}</span></div>` : ""}
                          ${d.dental_insurance > 0 ? `<div class="flex justify-between text-xs text-slate-400"><span>Dental Insurance</span><span class="font-mono">-${fmtCurrency.format(d.dental_insurance)}</span></div>` : ""}
                          ${d.vision_insurance > 0 ? `<div class="flex justify-between text-xs text-slate-400"><span>Vision Insurance</span><span class="font-mono">-${fmtCurrency.format(d.vision_insurance)}</span></div>` : ""}
                          ${d.other_insurance > 0 ? `<div class="flex justify-between text-xs text-slate-400"><span>Other Insurance</span><span class="font-mono">-${fmtCurrency.format(d.other_insurance)}</span></div>` : ""}
                          ${d.hsa_contribution > 0 ? `<div class="flex justify-between text-xs text-slate-400 text-emerald-400"><span>HSA Contribution</span><span class="font-mono">-${fmtCurrency.format(d.hsa_contribution)}</span></div>` : ""}
                        </div>
                      </div>

                    </div>
                    ${d.notes ? `<div class="mt-4 p-3 bg-slate-800/50 rounded text-xs text-slate-300 italic border-l-2 border-brand-500/30">${d.notes}</div>` : ""}
                  </td>
                </tr>
              `;
            });
            tbody.innerHTML = html;

            // Update Home screen metrics now that we have paystub data
            updateHomeScreenMetrics();
          }
        }
      }

      // Always trigger a recalc and render after background fetches, even if they return empty
      window.calcWealthActuals();
      renderCharts("tab-wealth-actuals");
    } catch (e) {
      console.error("Failed to fetch historical data", e);
    }
  }

  // Paystub Auto-Calculation
  const updatePaystubNetPay = () => {
    const getVal = (id) => {
      const input = document.getElementById(id);
      if (!input) return 0;
      return parseFloat(input.value.replace(/,/g, "")) || 0;
    };

    const gross = getVal("psGross") + getVal("psExtraPay");
    const taxes =
      getVal("psFedTax") +
      getVal("psStateTax") +
      getVal("psSSTax") +
      getVal("psMedTax") +
      getVal("psStateOther");
    const deductions =
      getVal("psMedIns") +
      getVal("psDenIns") +
      getVal("psVisIns") +
      getVal("psLifeIns") +
      getVal("psOtherIns") +
      getVal("psHsa");
    const k401k = getVal("ps401k");

    const net = gross - taxes - deductions - k401k;
    const netEl = document.getElementById("psNet");
    if (netEl) {
      netEl.value = net.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  // Paystub Form Handler
  if (elements.paystubForm) {
    const psInputs = [
      "psGross",
      "psExtraPay",
      "psFedTax",
      "psStateTax",
      "psSSTax",
      "psMedTax",
      "psStateOther",
      "psMedIns",
      "psDenIns",
      "psVisIns",
      "psLifeIns",
      "psOtherIns",
      "psHsa",
      "ps401k",
    ];
    psInputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", updatePaystubNetPay);
    });

    elements.paystubForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const getVal = (id) => {
        const input = document.getElementById(id);
        if (!input) return 0;
        const val = input.value.replace(/,/g, "");
        return parseFloat(val) || 0;
      };

      const payload = {
        pay_date: elements.psDate.value,
        gross_pay: getVal("psGross"),
        extra_pay: getVal("psExtraPay"),
        federal_tax: getVal("psFedTax"),
        social_security_tax: getVal("psSSTax"),
        medicare_tax: getVal("psMedTax"),
        state_tax: getVal("psStateTax"),
        state_other_tax: getVal("psStateOther"),
        medical_insurance: getVal("psMedIns"),
        dental_insurance: getVal("psDenIns"),
        vision_insurance: getVal("psVisIns"),
        life_insurance: getVal("psLifeIns"),
        other_insurance: getVal("psOtherIns"),
        hsa_contribution: getVal("psHsa"),
        k401k_contribution: getVal("ps401k"),
        net_pay: getVal("psNet"),
        notes: elements.psNotes.value,
      };

      try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Saving...";

        const resp = await fetch(API_URL_PAYSTUBS + "?user_id=1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (resp.ok) {
          submitBtn.innerHTML = "Saved!";
          elements.paystubForm.reset();
          fetchHistoricalDataFromAPI();
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }, 2000);
        } else {
          alert("Failed to capture paystub.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      } catch (err) {
        console.error("Paystub POST error:", err);
      }
    });
  }

  async function pushHistoricalSnapshot() {
    const parsed = parseGlobalInputs();
    const mortState = getCurrentMortgageState();
    // We compute the current Year 1 state to capture the immediate snapshot
    const homeValue = state.properties.reduce(
      (sum, p) => sum + (p.purchase_price || 0),
      0,
    );
    const k401Bal = parsed.k401StartBal;
    const rothBal = parsed.rothStartBal;
    const invBal = parsed.taxableStartBal;
    const mortBal = mortState.totalBal;
    const netWorth = homeValue + k401Bal + rothBal + invBal - mortBal;

    const now = new Date();
    // Use en-CA to safely get YYYY-MM-DD
    const localDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: parsed.timezone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const payload = {
      snapshot_date: localDate,
      net_worth: netWorth,
      property_value: homeValue,
      balance_401k: k401Bal,
      investment_balance: invBal,
      mortgage_balance: mortBal,
      balance_roth_ira: rothBal,
    };

    try {
      const btn = document.getElementById("btnCaptureSnapshot");
      if (btn) btn.textContent = "Saving...";

      const resp = await fetch(API_URL_HISTORICAL + "?user_id=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        if (btn) btn.textContent = "Captured!";
        setTimeout(() => {
          if (btn) btn.textContent = "Capture Current View";
        }, 2000);
        fetchHistoricalDataFromAPI(); // Refresh table
      }
    } catch (e) {
      console.error("Failed to push historical snapshot", e);
    }
  }

  // Paystub Toggle Handler
  window.togglePaystubDetails = (id, btn) => {
    const row = document.getElementById(id);
    const svg = btn.querySelector("svg");
    if (row.classList.contains("hidden")) {
      row.classList.remove("hidden");
      svg.style.transform = "rotate(45deg)";
      btn.classList.add("bg-brand-500/20", "text-brand-400");
    } else {
      row.classList.add("hidden");
      svg.style.transform = "rotate(0deg)";
      btn.classList.remove("bg-brand-500/20", "text-brand-400");
    }
  };

  window.togglePropertyDetails = (id, btn) => {
    const row = document.getElementById(id);
    const svg = btn.querySelector("svg");
    if (row.classList.contains("hidden")) {
      row.classList.remove("hidden");
      svg.style.transform = "rotate(45deg)";
      btn.classList.add("bg-brand-500/20", "text-brand-400");
    } else {
      row.classList.add("hidden");
      svg.style.transform = "rotate(0deg)";
      btn.classList.remove("bg-brand-500/20", "text-brand-400");
    }
  };

  async function fetchAllLoanPayments() {
    try {
      const resp = await fetch(API_URL_LOAN_PAYMENTS + "?user_id=1");
      if (resp.ok) {
        const allPayments = await resp.json();
        state.loanPayments = {};
        allPayments.forEach((p) => {
          if (!state.loanPayments[p.property_id])
            state.loanPayments[p.property_id] = [];
          state.loanPayments[p.property_id].push(p);
        });
      }
    } catch (e) {
      console.error("Failed to fetch all loan payments:", e);
    }
  }

  // --- Boot ---
  async function boot() {
    try {
      attachInputListeners();
      
      // Parallel fetch for speed
      await Promise.all([
        fetchSettingsFromAPI(),
        fetchPropertiesFromAPI(),
        fetchInvestmentsFromAPI(),
        fetchAllExtraPayments(),
        fetchAllLoanPayments()
      ]);

      state.isInitialLoad = false;
      updateSliderLabels();
      runAllCalculations();
      
      // Secondary data
      fetchHistoricalDataFromAPI();

      const savedTab = localStorage.getItem("activeTab") || "tab-home";
      const tabBtn = Array.from(elements.tabButtons).find(
        (b) => b.getAttribute("data-tab") === savedTab,
      );
      if (tabBtn) tabBtn.click();

      if (elements.inpWealthTimeframe) {
        elements.inpWealthTimeframe.addEventListener("change", () => {
          window.calcWealthActuals();
          renderCharts("tab-wealth-actuals");
        });
      }
    } catch (e) {
      console.error("Boot failed critically.", e);
    }
  }

  // --- Paystub Helper: Auto-Populate from Globals ---
  function populatePaystubFromGlobals() {
    const parsed = parseGlobalInputs();
    if (!parsed) return;

    const formatSafe = (val) => {
      if (typeof val !== "number" || isNaN(val)) return "0.00";
      return val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Auto-calculate expected Gross Pay per period
    const grossPerPeriod =
      parsed.payPeriods > 0 ? parsed.salary / parsed.payPeriods : 0;

    // Auto-calculate expected 401(k) Contribution based on %
    const k401kExpected = grossPerPeriod * parsed.k401PersonalPct;

    // Use current date for Pay Date
    const today = new Date().toISOString().split("T")[0];
    if (elements.psDate) elements.psDate.value = today;

    // Fill standard mapped inputs
    if (elements.psGross) elements.psGross.value = formatSafe(grossPerPeriod);
    if (elements.ps401k) elements.ps401k.value = formatSafe(k401kExpected);

    // Grab raw values directly from the advanced block in the UI to match perfectly
    const getAdvancedRaw = (id) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      return parseFloat(el.value.replace(/,/g, "")) || 0;
    };

    if (elements.psFedTax)
      elements.psFedTax.value = formatSafe(getAdvancedRaw("inpAdvFed"));
    if (elements.psMedTax)
      elements.psMedTax.value = formatSafe(getAdvancedRaw("inpAdvMed"));
    if (elements.psSSTax)
      elements.psSSTax.value = formatSafe(getAdvancedRaw("inpAdvSS"));
    if (elements.psStateTax)
      elements.psStateTax.value = formatSafe(getAdvancedRaw("inpAdvState"));
    if (elements.psStateOther)
      elements.psStateOther.value = formatSafe(
        getAdvancedRaw("inpAdvStateOther"),
      );

    if (elements.psMedIns)
      elements.psMedIns.value = formatSafe(getAdvancedRaw("inpAdvMedIns"));
    if (elements.psDenIns)
      elements.psDenIns.value = formatSafe(getAdvancedRaw("inpAdvDental"));
    if (elements.psVisIns)
      elements.psVisIns.value = formatSafe(getAdvancedRaw("inpAdvVision"));
    if (elements.psLifeIns)
      elements.psLifeIns.value = formatSafe(getAdvancedRaw("inpAdvLife"));
    if (elements.psOtherIns)
      elements.psOtherIns.value = formatSafe(getAdvancedRaw("inpAdvOtherIns"));
    if (elements.psHsa)
      elements.psHsa.value = formatSafe(getAdvancedRaw("inpAdvHsa"));

    // Ensure ad-hoc tracking fields are clearly zeroed out for a fresh entry
    if (elements.psExtraPay) elements.psExtraPay.value = "0.00";
    if (elements.psNotes) elements.psNotes.value = "";

    updatePaystubNetPay();
  }

  // Bind the manual 'Reset Defaults' button on the Paystub Tab that we just added
  const btnResetDefaults = document.getElementById("btnResetPaystubDefaults");
  if (btnResetDefaults) {
    btnResetDefaults.addEventListener("click", () => {
      populatePaystubFromGlobals();
    });
  }

  boot();
});
