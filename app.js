const STORAGE_KEY = "haven-swiss-portfolio-v2";
const THEME_KEY = "haven-swiss-theme";
const SETTINGS = { amberContractDays: 60, redVacancyDays: 30 };

const documentGroups = [
  {
    id: "legal",
    label: "Legale & Amministrativo",
    items: [
      ["landRegistry", "Estratto registro fondiario"],
      ["regulations", "Regolamento condominiale"],
      ["pppPlan", "Piano di ripartizione PPP"],
      ["meetingMinutes", "Verbali assemblee"]
    ]
  },
  {
    id: "technical",
    label: "Tecnico",
    items: [
      ["floorPlans", "Planimetrie"],
      ["rasi", "Certificazione RaSi"],
      ["radon", "Certificazione Radon"],
      ["other", "Altro documento"]
    ]
  },
  {
    id: "mortgage",
    label: "Ipoteca",
    items: [
      ["mortgageDeed", "Cartella ipotecaria"],
      ["interestDetails", "Dettaglio interessi e penali"]
    ]
  }
];

function dateFromToday(offset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

const sampleProperties = [
  {
    id: "lugano-cassarate",
    street: "Via delle Scuole 18",
    postalCode: "6900",
    city: "Lugano",
    purchaseDate: "2019-06-14",
    purchasePrice: 745000,
    targetRent: 2350,
    occupancy: "occupied",
    pppNumber: "PPP 1842",
    pppSheet: "Foglio 92",
    constructionYear: 2008,
    renovationYear: 2021,
    lease: { type: "open", tenant: "Luca e Sara Bianchi", start: "2022-03-01", end: "", actualRent: 2280 },
    vacancy: { start: "" },
    mortgage: { amount: 472000, rate: 1.42, expiry: dateFromToday(410), details: "Ipoteca fissa." },
    renovationFund: 28600,
    assembly: { lastMinutes: "2026-04-18", nextMeeting: dateFromToday(74) },
    documents: {
      landRegistry: { name: "estratto-registro-fondiario.pdf", date: "2026-01-12", size: 428000 },
      regulations: { name: "regolamento-ppp.pdf", date: "2025-11-08", size: 814000 },
      floorPlans: { name: "planimetria-appartamento.pdf", date: "2025-11-08", size: 1250000 },
      mortgageDeed: { name: "cartella-ipotecaria.pdf", date: "2026-02-03", size: 630000 }
    }
  },
  {
    id: "zurigo-wiedikon",
    street: "Birmensdorferstrasse 214",
    postalCode: "8003",
    city: "Zürich",
    purchaseDate: "2017-09-22",
    purchasePrice: 980000,
    targetRent: 3100,
    occupancy: "occupied",
    pppNumber: "STWE 3371",
    pppSheet: "Blatt 401",
    constructionYear: 1998,
    renovationYear: 2020,
    lease: { type: "fixed", tenant: "Anna Keller", start: "2023-10-01", end: dateFromToday(42), actualRent: 2980 },
    vacancy: { start: "" },
    mortgage: { amount: 620000, rate: 1.18, expiry: dateFromToday(190), details: "SARON." },
    renovationFund: 41300,
    assembly: { lastMinutes: "2026-05-07", nextMeeting: dateFromToday(126) },
    documents: {
      landRegistry: { name: "grundbuchauszug.pdf", date: "2026-02-18", size: 380000 },
      meetingMinutes: { name: "protokoll-2026.pdf", date: "2026-05-08", size: 920000 },
      radon: { name: "radon-nachweis.pdf", date: "2024-09-11", size: 260000 }
    }
  },
  {
    id: "locarno-muralto",
    street: "Via del Sole 7",
    postalCode: "6600",
    city: "Muralto",
    purchaseDate: "2021-02-05",
    purchasePrice: 515000,
    targetRent: 1780,
    occupancy: "vacant",
    pppNumber: "PPP 908",
    pppSheet: "Foglio 55",
    constructionYear: 1986,
    renovationYear: 2019,
    lease: { type: "open", tenant: "", start: "", end: "", actualRent: 0 },
    vacancy: { start: dateFromToday(-47) },
    mortgage: { amount: 310000, rate: 1.65, expiry: dateFromToday(305), details: "Ipoteca fissa." },
    renovationFund: 17450,
    assembly: { lastMinutes: "2025-11-16", nextMeeting: dateFromToday(18) },
    documents: {
      landRegistry: { name: "registro-fondiario.pdf", date: "2025-10-02", size: 515000 },
      floorPlans: { name: "planimetrie.zip", date: "2025-10-02", size: 2410000 }
    }
  },
  {
    id: "bellinzona-centro",
    street: "Viale Stazione 31",
    postalCode: "6500",
    city: "Bellinzona",
    purchaseDate: "2024-11-19",
    purchasePrice: 625000,
    targetRent: 2050,
    occupancy: "vacant",
    pppNumber: "PPP 2204",
    pppSheet: "Foglio 118",
    constructionYear: 2015,
    renovationYear: null,
    lease: { type: "open", tenant: "", start: "", end: "", actualRent: 0 },
    vacancy: { start: dateFromToday(-12) },
    mortgage: { amount: 395000, rate: 1.31, expiry: dateFromToday(580), details: "Ipoteca fissa." },
    renovationFund: 9800,
    assembly: { lastMinutes: "2026-03-22", nextMeeting: dateFromToday(211) },
    documents: {
      landRegistry: { name: "estratto-rf.pdf", date: "2025-01-09", size: 395000 },
      regulations: { name: "regolamento.pdf", date: "2025-01-09", size: 755000 },
      rasi: { name: "certificato-rasi.pdf", date: "2025-01-09", size: 310000 }
    }
  }
];

const elements = {
  propertyList: document.querySelector("#propertyList"),
  search: document.querySelector("#searchInput"),
  filter: document.querySelector("#statusFilter"),
  portfolioView: document.querySelector("#portfolioView"),
  analyticsView: document.querySelector("#analyticsView"),
  portfolioDonut: document.querySelector("#portfolioDonut"),
  portfolioLegend: document.querySelector("#portfolioLegend"),
  rentGapChart: document.querySelector("#rentGapChart"),
  ltvChart: document.querySelector("#ltvChart"),
  deadlinesList: document.querySelector("#deadlinesList"),
  drawer: document.querySelector("#detailDrawer"),
  drawerBackdrop: document.querySelector("#drawerBackdrop"),
  drawerContent: document.querySelector("#drawerContent"),
  dialog: document.querySelector("#propertyDialog"),
  form: document.querySelector("#propertyForm"),
  attachmentInput: document.querySelector("#attachmentInput"),
  toast: document.querySelector("#toast")
};

let properties = loadProperties();
let activePropertyId = null;
let attachmentTarget = null;
let toastTimer;
let drawerReturnFocus = null;
let drawerBackdropTimer;

function loadProperties() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : sampleProperties;
  } catch {
    return sampleProperties;
  }
}

function persistProperties() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysFromToday(value) {
  const date = toDate(value);
  if (!date) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.ceil((date - today) / 86400000);
}

function formatCurrency(value, compact = false) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard"
  }).format(Number(value) || 0);
}

function formatDate(value) {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat("it-CH", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date)
    : "Non indicata";
}

function formatFileSize(size) {
  if (!size) return "";
  return size >= 1000000 ? `${(size / 1000000).toFixed(1)} MB` : `${Math.round(size / 1000)} KB`;
}

function propertyYield(property) {
  const annualRent = property.occupancy === "occupied" ? Number(property.lease.actualRent) * 12 : 0;
  return property.purchasePrice ? (annualRent / Number(property.purchasePrice)) * 100 : 0;
}

function statusFor(property) {
  if (property.occupancy === "vacant") {
    const vacancyOffset = daysFromToday(property.vacancy.start);
    if (vacancyOffset === null) return { level: "amber", label: "Attenzione", detail: "Data sfitto non indicata" };
    const vacantDays = Math.max(0, -vacancyOffset);
    if (vacantDays > SETTINGS.redVacancyDays) {
      return { level: "red", label: "Critico", detail: `Sfitto da ${vacantDays} giorni` };
    }
    return { level: "amber", label: "Attenzione", detail: `Sfitto da ${vacantDays} giorni` };
  }

  if (property.lease.type === "fixed") {
    const days = daysFromToday(property.lease.end);
    if (days === null) return { level: "amber", label: "Attenzione", detail: "Scadenza non indicata" };
    if (days < 0) return { level: "red", label: "Critico", detail: `Contratto scaduto da ${Math.abs(days)} giorni` };
    if (days <= SETTINGS.amberContractDays) return { level: "amber", label: "Attenzione", detail: `Scade tra ${days} giorni` };
    return { level: "green", label: "Regolare", detail: `Scade tra ${days} giorni` };
  }

  return { level: "green", label: "Regolare", detail: "Contratto indeterminato" };
}

function renderDashboard() {
  const monthlyIncome = properties.reduce((sum, property) => sum + (property.occupancy === "occupied" ? Number(property.lease.actualRent) : 0), 0);
  const vacant = properties.filter((property) => property.occupancy === "vacant");
  const criticalVacant = vacant.filter((property) => statusFor(property).level === "red");
  const expiring = properties.filter((property) => {
    if (property.occupancy !== "occupied" || property.lease.type !== "fixed") return false;
    const days = daysFromToday(property.lease.end);
    return days !== null && days >= 0 && days <= 90;
  });
  const portfolioYield = properties.length
    ? properties.reduce((sum, property) => sum + propertyYield(property), 0) / properties.length
    : 0;

  document.querySelector("#monthlyIncome").textContent = formatCurrency(monthlyIncome);
  document.querySelector("#totalProperties").textContent = properties.length;
  document.querySelector("#vacantProperties").textContent = vacant.length;
  document.querySelector("#vacancySummary").textContent = criticalVacant.length ? `${criticalVacant.length} oltre ${SETTINGS.redVacancyDays} giorni` : "Nessuna criticità";
  document.querySelector("#expiringContracts").textContent = expiring.length;
  document.querySelector("#expirySummary").textContent = expiring.length ? "richiedono attenzione" : "Nessuna scadenza";
  document.querySelector("#portfolioYield").textContent = `${portfolioYield.toFixed(2)}%`;
  document.querySelector("#portfolioCaption").textContent = `${properties.length} ${properties.length === 1 ? "immobile" : "immobili"} · Stato aggiornato a oggi`;

  renderPropertyList();
  renderAnalytics();
}

function renderAnalytics() {
  const totalValue = properties.reduce((sum, property) => sum + Number(property.purchasePrice), 0);
  const totalMortgage = properties.reduce((sum, property) => sum + Number(property.mortgage.amount), 0);
  const actualRent = properties.reduce((sum, property) => sum + (property.occupancy === "occupied" ? Number(property.lease.actualRent) : 0), 0);
  const targetRent = properties.reduce((sum, property) => sum + Number(property.targetRent), 0);
  const rentGap = targetRent - actualRent;
  const aggregateLtv = totalValue ? totalMortgage / totalValue * 100 : 0;

  document.querySelector("#analysisTotalValue").textContent = formatCurrency(totalValue, true);
  document.querySelector("#analysisMortgage").textContent = formatCurrency(totalMortgage, true);
  document.querySelector("#analysisEquity").textContent = formatCurrency(totalValue - totalMortgage, true);
  document.querySelector("#analysisRentGap").textContent = formatCurrency(rentGap);
  document.querySelector("#donutTotal").textContent = formatCurrency(totalValue, true);
  document.querySelector("#aggregateLtv").textContent = `${aggregateLtv.toFixed(1)}%`;

  renderPortfolioDonut(totalValue);
  renderRentGapChart();
  renderLtvChart();
  renderDeadlines();
}

function renderPortfolioDonut(totalValue) {
  const accessibleTitle = '<title id="donutTitle">Composizione del valore del portafoglio</title><desc id="donutDescription">Ripartizione del prezzo di acquisto totale tra gli immobili.</desc>';
  if (!properties.length || totalValue <= 0) {
    elements.portfolioDonut.innerHTML = `${accessibleTitle}<circle cx="110" cy="110" r="80" fill="none" stroke="var(--border)" stroke-width="30"/>`;
    elements.portfolioLegend.innerHTML = '<div class="analytics-empty">Aggiungi un immobile per visualizzare la composizione.</div>';
    return;
  }

  let angle = -90;
  const segments = properties.map((property, index) => {
    const percentage = Number(property.purchasePrice) / totalValue;
    const endAngle = angle + percentage * 360;
    const path = donutPath(110, 110, 95, 62, angle, Math.min(endAngle, angle + 359.999));
    const color = `var(--chart-${index % 5 + 1})`;
    const markup = `<path class="donut-segment" d="${path}" fill="${color}" tabindex="0" role="button" data-analytics-property="${escapeHtml(property.id)}" aria-label="${escapeHtml(property.street)}: ${(percentage * 100).toFixed(1)}%, ${formatCurrency(property.purchasePrice)}"><title>${escapeHtml(property.street)} · ${(percentage * 100).toFixed(1)}%</title></path>`;
    angle = endAngle;
    return markup;
  });
  elements.portfolioDonut.innerHTML = `${accessibleTitle}${segments.join("")}<circle class="donut-hole" cx="110" cy="110" r="60"/>`;

  elements.portfolioLegend.innerHTML = properties.map((property, index) => {
    const percentage = Number(property.purchasePrice) / totalValue * 100;
    return `
      <button class="legend-row" type="button" data-analytics-property="${escapeHtml(property.id)}" style="--legend-color: var(--chart-${index % 5 + 1})" aria-label="Apri ${escapeHtml(property.street)}">
        <span class="legend-swatch" aria-hidden="true"></span>
        <span class="legend-copy"><strong class="legend-property">${escapeHtml(property.street)}</strong><small class="legend-city">${escapeHtml(property.city)}</small></span>
        <span class="legend-value"><strong>${formatCurrency(property.purchasePrice, true)}</strong><small>${percentage.toFixed(1)}%</small></span>
      </button>`;
  }).join("");
}

function donutPath(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
  const point = (radius, angle) => {
    const radians = angle * Math.PI / 180;
    return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
  };
  const outerStart = point(outerRadius, startAngle);
  const outerEnd = point(outerRadius, endAngle);
  const innerEnd = point(innerRadius, endAngle);
  const innerStart = point(innerRadius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
}

function renderRentGapChart() {
  const maximumRent = Math.max(1, ...properties.flatMap((property) => [Number(property.targetRent), Number(property.lease.actualRent)]));
  elements.rentGapChart.innerHTML = properties.length
    ? properties.map((property) => {
      const actual = property.occupancy === "occupied" ? Number(property.lease.actualRent) : 0;
      const target = Number(property.targetRent);
      const gap = target - actual;
      const gapLabel = gap > 0 ? `− ${formatCurrency(gap)}` : gap < 0 ? `+ ${formatCurrency(Math.abs(gap))}` : "In linea";
      return `
        <div class="comparison-row">
          <div class="chart-row-label"><strong>${escapeHtml(property.street)}</strong><small>${escapeHtml(property.city)}</small></div>
          <div class="comparison-track" role="img" aria-label="${escapeHtml(property.street)}: target ${formatCurrency(target)}, effettivo ${formatCurrency(actual)}">
            <span class="target-bar" style="width:${target / maximumRent * 100}%"></span>
            <span class="actual-bar" style="width:${actual / maximumRent * 100}%"></span>
          </div>
          <span class="chart-row-value ${gap > 0 ? "negative" : ""}">${gapLabel}</span>
        </div>`;
    }).join("")
    : '<div class="analytics-empty">Nessun dato sui canoni disponibile.</div>';
}

function renderLtvChart() {
  elements.ltvChart.innerHTML = properties.length
    ? properties.map((property) => {
      const ltv = property.purchasePrice ? Number(property.mortgage.amount) / Number(property.purchasePrice) * 100 : 0;
      const riskClass = ltv >= 85 ? "critical" : ltv >= 70 ? "warning" : "";
      return `
        <div class="ltv-row">
          <div class="chart-row-label"><strong>${escapeHtml(property.street)}</strong><small>${formatCurrency(property.mortgage.amount, true)} ipoteca</small></div>
          <div class="ltv-track" role="img" aria-label="Loan-to-value ${escapeHtml(property.street)}: ${ltv.toFixed(1)}%"><span class="ltv-threshold" aria-hidden="true"></span><span class="ltv-fill ${riskClass}" style="width:${Math.min(ltv, 100)}%"></span></div>
          <span class="chart-row-value">${ltv.toFixed(1)}%</span>
        </div>`;
    }).join("")
    : '<div class="analytics-empty">Nessun dato ipotecario disponibile.</div>';
}

function renderDeadlines() {
  const deadlines = properties
    .filter((property) => property.occupancy === "occupied" && property.lease.type === "fixed")
    .map((property) => ({ property, days: daysFromToday(property.lease.end) }))
    .filter(({ days }) => days !== null && days >= 0 && days <= 90)
    .sort((a, b) => a.days - b.days);

  document.querySelector("#deadlineCount").textContent = deadlines.length;
  elements.deadlinesList.innerHTML = deadlines.length
    ? deadlines.map(({ property, days }) => `
      <button class="deadline-item" type="button" data-analytics-property="${escapeHtml(property.id)}" aria-label="Apri ${escapeHtml(property.street)}, contratto in scadenza tra ${days} giorni">
        <span class="deadline-days"><strong>${days}</strong><small>giorni</small></span>
        <span class="deadline-copy"><strong>${escapeHtml(property.street)}</strong><small>${escapeHtml(property.lease.tenant || "Inquilino non indicato")} · ${formatDate(property.lease.end)}</small></span>
        <span class="deadline-arrow" aria-hidden="true">›</span>
      </button>`).join("")
    : '<div class="analytics-empty">Nessun contratto in scadenza nei prossimi 90 giorni.</div>';
}

function switchMainView(view, updateHash = true) {
  const analyticsActive = view === "analytics";
  elements.portfolioView.hidden = analyticsActive;
  elements.analyticsView.hidden = !analyticsActive;
  document.querySelectorAll("[data-view]").forEach((tab) => {
    const selected = tab.dataset.view === view;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelector("#mobileAddButton").hidden = analyticsActive;
  if (updateHash) history.replaceState(null, "", analyticsActive ? "#analytics" : "#portfolio");
}

function renderPropertyList() {
  const query = elements.search.value.trim().toLocaleLowerCase("it");
  const statusFilter = elements.filter.value;
  const filtered = properties.filter((property) => {
    const status = statusFor(property);
    const searchable = `${property.street} ${property.postalCode} ${property.city} ${property.lease.tenant}`.toLocaleLowerCase("it");
    return searchable.includes(query) && (statusFilter === "all" || status.level === statusFilter);
  });

  elements.propertyList.innerHTML = filtered.length
    ? filtered.map(propertyRowTemplate).join("")
    : '<div class="empty-state"><strong>Nessun immobile trovato</strong><p>Modifica la ricerca o il filtro selezionato.</p></div>';
}

function propertyRowTemplate(property) {
  const status = statusFor(property);
  const purchaseYear = toDate(property.purchaseDate)?.getFullYear() || "—";
  const contractLabel = property.occupancy === "vacant"
    ? status.detail
    : property.lease.type === "fixed" ? status.detail : "Indeterminato";
  const rent = property.occupancy === "occupied" ? property.lease.actualRent : property.targetRent;
  const rentLabel = property.occupancy === "occupied" ? "effettivo / mese" : "target / mese";

  return `
    <button class="property-row status-${status.level}" type="button" data-property-id="${escapeHtml(property.id)}" aria-label="Apri ${escapeHtml(property.street)}, ${escapeHtml(property.city)}">
      <span class="property-address">
        <strong>${escapeHtml(property.street)}</strong>
        <small>${escapeHtml(property.postalCode)} ${escapeHtml(property.city)} · <span class="status-badge ${status.level}">${status.label}</span></small>
      </span>
      <span class="property-cell purchase-cell"><span class="property-value">${purchaseYear}</span><small>${formatCurrency(property.purchasePrice, true)}</small></span>
      <span class="property-cell contract-cell"><span class="property-value">${escapeHtml(contractLabel)}</span><small>${property.occupancy === "occupied" ? escapeHtml(property.lease.tenant || "Inquilino non indicato") : "Disponibile"}</small></span>
      <span class="property-cell rent-cell"><span class="property-value">${formatCurrency(rent)}</span><small>${rentLabel}</small></span>
      <span class="property-cell yield-cell"><span class="property-value">${propertyYield(property).toFixed(2)}%</span><small>lordo</small></span>
      <span class="chevron" aria-hidden="true">›</span>
    </button>`;
}

function openDrawer(propertyId, trigger) {
  const property = properties.find((item) => item.id === propertyId);
  if (!property) return;
  activePropertyId = propertyId;
  drawerReturnFocus = trigger || document.activeElement;
  renderDrawer(property);
  clearTimeout(drawerBackdropTimer);
  elements.drawer.inert = false;
  elements.drawerBackdrop.hidden = false;
  requestAnimationFrame(() => {
    elements.drawerBackdrop.classList.add("visible");
    elements.drawer.classList.add("open");
  });
  elements.drawer.setAttribute("aria-hidden", "false");
  document.querySelector(".app-shell").inert = true;
  document.body.classList.add("locked");
  document.querySelector("#closeDrawerButton").focus();
}

function closeDrawer() {
  elements.drawer.classList.remove("open");
  elements.drawerBackdrop.classList.remove("visible");
  elements.drawer.setAttribute("aria-hidden", "true");
  elements.drawer.inert = true;
  document.querySelector(".app-shell").inert = false;
  document.body.classList.remove("locked");
  clearTimeout(drawerBackdropTimer);
  drawerBackdropTimer = setTimeout(() => { elements.drawerBackdrop.hidden = true; }, 220);
  drawerReturnFocus?.focus();
}

function renderDrawer(property) {
  const status = statusFor(property);
  document.querySelector("#detailTitle").textContent = property.street;
  document.querySelector("#detailCity").textContent = `${property.postalCode} ${property.city}`;
  document.querySelector("#detailStatus").innerHTML = `<span class="status-badge ${status.level}">${status.label} · ${escapeHtml(status.detail)}</span>`;

  const mortgageDays = daysFromToday(property.mortgage.expiry);
  const meetingDays = daysFromToday(property.assembly.nextMeeting);
  const leaseValue = property.occupancy === "vacant"
    ? "Sfitto"
    : property.lease.type === "fixed" ? "Determinato" : "Indeterminato";
  const leaseDetail = property.occupancy === "vacant"
    ? status.detail
    : `${formatCurrency(property.lease.actualRent)} / mese${property.lease.end ? ` · fino al ${formatDate(property.lease.end)}` : ""}`;

  elements.drawerContent.innerHTML = `
    <section class="drawer-section">
      <div class="drawer-section-title"><h3>Panoramica</h3></div>
      <div class="overview-grid">
        ${overviewCard("Ipoteca", formatCurrency(property.mortgage.amount), `${Number(property.mortgage.rate).toFixed(2)}% · ${countdownLabel(mortgageDays, "alla scadenza", "scaduta da")}`, "bank")}
        ${overviewCard("Fondo di rinnovamento", formatCurrency(property.renovationFund), "Saldo attuale dichiarato", "fund")}
        ${overviewCard("Locazione", leaseValue, leaseDetail, "lease")}
        ${overviewCard("Prossimi eventi", formatDate(property.assembly.nextMeeting), countdownLabel(meetingDays, "all'assemblea", "assemblea trascorsa da"), "calendar")}
      </div>
    </section>
    <section class="drawer-section">
      <div class="drawer-section-title"><h3>Dati amministrativi</h3></div>
      <div class="property-facts">
        ${factTemplate("Numero PPP", property.pppNumber || "—")}
        ${factTemplate("Foglio PPP", property.pppSheet || "—")}
        ${factTemplate("Costruzione", property.constructionYear || "—")}
        ${factTemplate("Ristrutturazione", property.renovationYear || "—")}
        ${factTemplate("Acquisto", formatDate(property.purchaseDate))}
        ${factTemplate("Prezzo", formatCurrency(property.purchasePrice))}
      </div>
    </section>
    <section class="drawer-section">
      <div class="drawer-section-title"><h3>Documenti</h3></div>
      <div class="document-folders">${documentGroups.map((group, index) => folderTemplate(property, group, index === 0)).join("")}</div>
    </section>`;
}

function countdownLabel(days, futureLabel, pastLabel) {
  if (days === null) return "Data non indicata";
  if (days < 0) return `${pastLabel} ${Math.abs(days)} giorni`;
  if (days === 0) return "Oggi";
  return `${days} giorni ${futureLabel}`;
}

function overviewCard(label, value, detail, icon) {
  const icons = {
    bank: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M2 21h20M12 3 3 8h18Z"/></svg>',
    fund: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16v12H4zM7 7V5h10v2M8 13h8"/></svg>',
    lease: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6zM9 11h6M9 15h6M15 3v4h4"/></svg>',
    calendar: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v15H4zM8 3v6M16 3v6M4 10h16"/></svg>'
  };
  return `<article class="overview-card"><div class="overview-card-label"><span>${label}</span>${icons[icon]}</div><strong class="metric-value">${value}</strong><p class="metric-detail">${detail}</p></article>`;
}

function factTemplate(label, value) {
  return `<div class="fact"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function folderTemplate(property, group, expanded) {
  const fileCount = group.items.filter(([key]) => property.documents?.[key]).length;
  const technicalFacts = group.id === "technical"
    ? `<div class="document-row"><div class="document-copy"><strong>Anno di costruzione</strong><small class="mono">${escapeHtml(property.constructionYear || "Non indicato")}</small></div></div>
       <div class="document-row"><div class="document-copy"><strong>Anno di ristrutturazione</strong><small class="mono">${escapeHtml(property.renovationYear || "Non indicato")}</small></div></div>`
    : "";
  return `
    <div class="document-folder">
      <button class="folder-toggle" type="button" aria-expanded="${expanded}" data-folder="${group.id}">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v11H3z"/></svg>
        <strong>${group.label}</strong><span class="folder-count">${fileCount}/${group.items.length}</span><span class="folder-chevron">›</span>
      </button>
      <div class="folder-content" ${expanded ? "" : "hidden"}>${technicalFacts}${group.items.map(([key, label]) => documentRowTemplate(property, key, label)).join("")}</div>
    </div>`;
}

function documentRowTemplate(property, key, label) {
  const file = property.documents?.[key];
  return `
    <div class="document-row">
      <div class="document-copy"><strong>${file ? escapeHtml(file.name) : label}</strong><small>${file ? `${formatFileSize(file.size)} · ${formatDate(file.date)}` : "Nessun allegato"}</small></div>
      <button class="upload-button" type="button" data-document-key="${key}" aria-label="${file ? "Sostituisci" : "Aggiungi"} ${escapeHtml(label)}">${file ? "Sostituisci" : "+ Aggiungi"}</button>
    </div>`;
}

function updateConditionalFields() {
  const occupied = document.querySelector("#occupancyInput").value === "occupied";
  const fixed = document.querySelector("#leaseTypeInput").value === "fixed";
  document.querySelector("#leaseFields").hidden = !occupied;
  document.querySelector("#vacancyFields").hidden = occupied;
  document.querySelector("#leaseEndField").hidden = !fixed;
  document.querySelector("#leaseStartInput").required = occupied;
  document.querySelector("#actualRentInput").required = occupied;
  document.querySelector("#leaseEndInput").required = occupied && fixed;
  document.querySelector("#vacancyStartInput").required = !occupied;
}

function openPropertyDialog(propertyId = null) {
  elements.form.reset();
  document.querySelector("#propertyId").value = "";
  document.querySelector("#dialogTitle").textContent = "Aggiungi immobile";
  document.querySelector("#deletePropertyButton").hidden = true;
  document.querySelector("#occupancyInput").value = "occupied";
  document.querySelector("#leaseTypeInput").value = "open";

  if (propertyId) {
    const property = properties.find((item) => item.id === propertyId);
    if (!property) return;
    document.querySelector("#dialogTitle").textContent = "Modifica immobile";
    document.querySelector("#deletePropertyButton").hidden = false;
    setInputValues(property);
  }
  updateConditionalFields();
  elements.dialog.showModal();
}

function setInputValues(property) {
  const values = {
    propertyId: property.id,
    streetInput: property.street,
    postalCodeInput: property.postalCode,
    cityInput: property.city,
    purchaseDateInput: property.purchaseDate,
    purchasePriceInput: property.purchasePrice,
    targetRentInput: property.targetRent,
    occupancyInput: property.occupancy,
    pppNumberInput: property.pppNumber,
    pppSheetInput: property.pppSheet,
    constructionYearInput: property.constructionYear,
    renovationYearInput: property.renovationYear,
    leaseTypeInput: property.lease.type,
    tenantInput: property.lease.tenant,
    leaseStartInput: property.lease.start,
    leaseEndInput: property.lease.end,
    actualRentInput: property.lease.actualRent,
    vacancyStartInput: property.vacancy.start,
    mortgageAmountInput: property.mortgage.amount,
    mortgageRateInput: property.mortgage.rate,
    mortgageExpiryInput: property.mortgage.expiry,
    renovationFundInput: property.renovationFund,
    nextMeetingInput: property.assembly.nextMeeting
  };
  Object.entries(values).forEach(([id, value]) => { document.querySelector(`#${id}`).value = value ?? ""; });
}

function inputValue(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function numericInput(id) {
  return Number(document.querySelector(`#${id}`).value) || 0;
}

function saveProperty(event) {
  event.preventDefault();
  const id = inputValue("propertyId");
  const existing = properties.find((item) => item.id === id);
  const occupancy = inputValue("occupancyInput");
  const property = {
    id: id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    street: inputValue("streetInput"),
    postalCode: inputValue("postalCodeInput"),
    city: inputValue("cityInput"),
    purchaseDate: inputValue("purchaseDateInput"),
    purchasePrice: numericInput("purchasePriceInput"),
    targetRent: numericInput("targetRentInput"),
    occupancy,
    pppNumber: inputValue("pppNumberInput"),
    pppSheet: inputValue("pppSheetInput"),
    constructionYear: numericInput("constructionYearInput") || null,
    renovationYear: numericInput("renovationYearInput") || null,
    lease: {
      type: inputValue("leaseTypeInput"),
      tenant: occupancy === "occupied" ? inputValue("tenantInput") : "",
      start: occupancy === "occupied" ? inputValue("leaseStartInput") : "",
      end: occupancy === "occupied" && inputValue("leaseTypeInput") === "fixed" ? inputValue("leaseEndInput") : "",
      actualRent: occupancy === "occupied" ? numericInput("actualRentInput") : 0
    },
    vacancy: { start: occupancy === "vacant" ? inputValue("vacancyStartInput") : "" },
    mortgage: {
      amount: numericInput("mortgageAmountInput"),
      rate: numericInput("mortgageRateInput"),
      expiry: inputValue("mortgageExpiryInput"),
      details: existing?.mortgage.details || ""
    },
    renovationFund: numericInput("renovationFundInput"),
    assembly: { lastMinutes: existing?.assembly.lastMinutes || "", nextMeeting: inputValue("nextMeetingInput") },
    documents: existing?.documents || {}
  };

  properties = existing
    ? properties.map((item) => item.id === id ? property : item)
    : [property, ...properties];
  persistProperties();
  elements.dialog.close();
  renderDashboard();
  if (existing && activePropertyId === id) renderDrawer(property);
  showToast(existing ? "Immobile aggiornato" : "Immobile aggiunto");
}

function deleteActiveProperty() {
  const id = inputValue("propertyId");
  const property = properties.find((item) => item.id === id);
  if (!property || !window.confirm(`Eliminare ${property.street}? L'operazione non può essere annullata.`)) return;
  properties = properties.filter((item) => item.id !== id);
  persistProperties();
  elements.dialog.close();
  if (activePropertyId === id) closeDrawer();
  renderDashboard();
  showToast("Immobile eliminato");
}

function handleAttachment(file) {
  if (!file || !attachmentTarget) return;
  const property = properties.find((item) => item.id === attachmentTarget.propertyId);
  if (!property) return;
  property.documents ||= {};
  property.documents[attachmentTarget.key] = {
    name: file.name,
    size: file.size,
    date: new Date().toISOString().slice(0, 10)
  };
  persistProperties();
  renderDrawer(property);
  showToast("Nome allegato salvato; il contenuto richiede il backend");
  attachmentTarget = null;
  elements.attachmentInput.value = "";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector("meta[name='theme-color']").content = theme === "dark" ? "#17181a" : "#f6f6f4";
  document.querySelector("#themeButton").setAttribute("aria-label", theme === "dark" ? "Attiva tema chiaro" : "Attiva tema scuro");
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2400);
}

document.querySelectorAll("[data-view]").forEach((tab) => {
  tab.addEventListener("click", () => switchMainView(tab.dataset.view));
  tab.addEventListener("keydown", (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const nextView = tab.dataset.view === "portfolio" ? "analytics" : "portfolio";
    switchMainView(nextView);
    document.querySelector(`[data-view="${nextView}"]`).focus();
  });
});

elements.search.addEventListener("input", renderPropertyList);
elements.filter.addEventListener("change", renderPropertyList);
elements.propertyList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-property-id]");
  if (row) openDrawer(row.dataset.propertyId, row);
});

elements.analyticsView.addEventListener("click", (event) => {
  const propertyControl = event.target.closest("[data-analytics-property]");
  if (propertyControl) openDrawer(propertyControl.dataset.analyticsProperty, propertyControl);
});
elements.portfolioDonut.addEventListener("keydown", (event) => {
  const propertyControl = event.target.closest("[data-analytics-property]");
  if (propertyControl && ["Enter", " "].includes(event.key)) {
    event.preventDefault();
    openDrawer(propertyControl.dataset.analyticsProperty, propertyControl);
  }
});

elements.drawerContent.addEventListener("click", (event) => {
  const folderButton = event.target.closest("[data-folder]");
  if (folderButton) {
    const expanded = folderButton.getAttribute("aria-expanded") === "true";
    folderButton.setAttribute("aria-expanded", String(!expanded));
    folderButton.nextElementSibling.hidden = expanded;
  }
  const uploadButton = event.target.closest("[data-document-key]");
  if (uploadButton) {
    attachmentTarget = { propertyId: activePropertyId, key: uploadButton.dataset.documentKey };
    elements.attachmentInput.click();
  }
});

document.querySelector("#closeDrawerButton").addEventListener("click", closeDrawer);
elements.drawerBackdrop.addEventListener("click", closeDrawer);
document.querySelector("#editPropertyButton").addEventListener("click", () => openPropertyDialog(activePropertyId));
document.querySelector("#exportDocumentsButton").addEventListener("click", () => showToast("L'esportazione richiede il collegamento al backend"));
document.querySelector("#exportAccountantButton").addEventListener("click", () => showToast("Il report commercialista richiede il collegamento al backend"));

["#headerAddButton", "#mobileAddButton"].forEach((selector) => {
  document.querySelector(selector).addEventListener("click", () => openPropertyDialog());
});
document.querySelector("#closeDialogButton").addEventListener("click", () => elements.dialog.close());
document.querySelector("#cancelDialogButton").addEventListener("click", () => elements.dialog.close());
document.querySelector("#deletePropertyButton").addEventListener("click", deleteActiveProperty);
document.querySelector("#occupancyInput").addEventListener("change", updateConditionalFields);
document.querySelector("#leaseTypeInput").addEventListener("change", updateConditionalFields);
elements.form.addEventListener("submit", saveProperty);
elements.dialog.addEventListener("click", (event) => { if (event.target === elements.dialog) elements.dialog.close(); });
elements.attachmentInput.addEventListener("change", () => handleAttachment(elements.attachmentInput.files[0]));

document.querySelector("#themeButton").addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
});

document.addEventListener("keydown", (event) => {
  if (!elements.drawer.classList.contains("open") || elements.dialog.open) return;
  if (event.key === "Escape") closeDrawer();
  if (event.key === "Tab") {
    const focusable = [...elements.drawer.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const initialTheme = localStorage.getItem(THEME_KEY)
  || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(initialTheme);
document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("it-CH", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
}).format(new Date());
document.querySelector("#analyticsDate").textContent = new Intl.DateTimeFormat("it-CH", {
  day: "2-digit", month: "2-digit", year: "numeric"
}).format(new Date());
window.addEventListener("hashchange", () => {
  if (location.hash === "#analytics") switchMainView("analytics", false);
  if (location.hash === "#portfolio") switchMainView("portfolio", false);
});
switchMainView(location.hash === "#analytics" ? "analytics" : "portfolio", false);
renderDashboard();
