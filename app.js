const STORAGE_KEY = "haven-properties-v1";

const sampleProperties = [
  {
    id: "willow-house",
    name: "Willow House",
    address: "18 Willow Lane, Portland",
    type: "House",
    rent: 2450,
    occupancy: "occupied",
    rentStatus: "paid",
    tenant: "Maya & James Wilson",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "northline-loft",
    name: "Northline Loft",
    address: "204 Northline Ave, Seattle",
    type: "Apartment",
    rent: 1950,
    occupancy: "occupied",
    rentStatus: "pending",
    tenant: "Alex Rivera",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cedar-studio",
    name: "Cedar Studio",
    address: "77 Cedar Street, Portland",
    type: "Studio",
    rent: 1380,
    occupancy: "vacant",
    rentStatus: "pending",
    tenant: "",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "garden-court",
    name: "Garden Court",
    address: "9 Garden Court, Tacoma",
    type: "Townhouse",
    rent: 2180,
    occupancy: "occupied",
    rentStatus: "overdue",
    tenant: "Noah Carter",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80"
  }
];

const elements = {
  dialog: document.querySelector("#propertyDialog"),
  form: document.querySelector("#propertyForm"),
  dashboardList: document.querySelector("#dashboardPropertyList"),
  allList: document.querySelector("#allPropertyList"),
  activityList: document.querySelector("#activityList"),
  search: document.querySelector("#searchInput"),
  filter: document.querySelector("#statusFilter"),
  toast: document.querySelector("#toast")
};

let properties = loadProperties();
let toastTimer;

function loadProperties() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : sampleProperties;
  } catch {
    return sampleProperties;
  }
}

function saveProperties() {
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

function safeImage(value = "") {
  if (!/^https?:\/\//i.test(value)) return "";
  return `background-image: url(&quot;${escapeHtml(value)}&quot;)`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function renderDashboard() {
  const occupied = properties.filter((property) => property.occupancy === "occupied");
  const totalRent = occupied.reduce((total, property) => total + Number(property.rent), 0);
  const collected = occupied
    .filter((property) => property.rentStatus === "paid")
    .reduce((total, property) => total + Number(property.rent), 0);

  document.querySelector("#propertyCount").textContent = properties.length;
  document.querySelector("#occupancyText").textContent = properties.length
    ? `${occupied.length} of ${properties.length} occupied`
    : "No properties yet";
  document.querySelector("#monthlyRent").textContent = formatCurrency(totalRent);
  document.querySelector("#collectionText").textContent = `${formatCurrency(collected)} collected`;
  document.querySelector("#heroSupport").textContent = properties.length
    ? `${occupied.length} occupied home${occupied.length === 1 ? "" : "s"}, with ${formatCurrency(totalRent)} in monthly rent.`
    : "Add your first rental property to start managing your portfolio.";

  const featured = properties.slice(0, 3);
  elements.dashboardList.innerHTML = featured.length
    ? featured.map(propertyRowTemplate).join("")
    : emptyStateTemplate("No properties yet", "Add a house or apartment to begin.");

  const activity = properties.filter((property) => property.occupancy === "occupied").slice(0, 4);
  elements.activityList.innerHTML = activity.length
    ? activity.map(activityTemplate).join("")
    : '<div class="activity-row"><div class="activity-copy"><strong>No rent activity</strong><small>Occupied properties will appear here.</small></div></div>';
}

function renderProperties() {
  const query = elements.search.value.trim().toLowerCase();
  const filter = elements.filter.value;
  const filtered = properties.filter((property) => {
    const matchesQuery = [property.name, property.address, property.tenant, property.type]
      .some((field) => field.toLowerCase().includes(query));
    const matchesFilter = filter === "all"
      || property.occupancy === filter
      || property.rentStatus === filter;
    return matchesQuery && matchesFilter;
  });

  document.querySelector("#resultCount").textContent = `${filtered.length} ${filtered.length === 1 ? "property" : "properties"}`;
  elements.allList.innerHTML = filtered.length
    ? filtered.map(propertyCardTemplate).join("")
    : emptyStateTemplate("Nothing found", "Try changing your search or property filter.");
}

function propertyRowTemplate(property) {
  return `
    <article class="property-row">
      <div class="property-thumb" style="${safeImage(property.image)}"></div>
      <div>
        <h3>${escapeHtml(property.name)}</h3>
        <p>${escapeHtml(property.type)} · ${escapeHtml(property.address.split(",").pop().trim())}</p>
        <span class="status-pill status-${escapeHtml(property.rentStatus)}">${escapeHtml(property.rentStatus)}</span>
      </div>
      <div class="row-rent"><strong>${formatCurrency(property.rent)}</strong><small>per month</small></div>
    </article>`;
}

function propertyCardTemplate(property) {
  const tenantText = property.occupancy === "occupied"
    ? `Tenant: ${escapeHtml(property.tenant || "Not specified")}`
    : "Ready for a new tenant";
  return `
    <article class="property-card">
      <div class="card-image" style="${safeImage(property.image)}"><span class="card-type">${escapeHtml(property.type)}</span></div>
      <div class="card-body">
        <div class="card-title-row">
          <div><h3>${escapeHtml(property.name)}</h3><p>${escapeHtml(property.address)}</p></div>
          <div class="card-rent"><strong>${formatCurrency(property.rent)}</strong><small>/ month</small></div>
        </div>
        <p class="tenant-line">${tenantText}</p>
        <div class="card-footer">
          <span class="status-pill status-${escapeHtml(property.occupancy)}">${escapeHtml(property.occupancy)}</span>
          <div class="card-actions">
            ${property.occupancy === "occupied" ? `<button class="small-button" type="button" data-rent-id="${escapeHtml(property.id)}">${property.rentStatus === "paid" ? "Set pending" : "Mark paid"}</button>` : ""}
            <button class="small-button" type="button" data-edit-id="${escapeHtml(property.id)}">Edit</button>
            <button class="small-button danger" type="button" data-delete-id="${escapeHtml(property.id)}">Delete</button>
          </div>
        </div>
      </div>
    </article>`;
}

function activityTemplate(property) {
  const labels = { paid: "Rent received", pending: "Payment pending", overdue: "Payment overdue" };
  return `
    <div class="activity-row">
      <span class="activity-icon">${escapeHtml(property.name.charAt(0))}</span>
      <div class="activity-copy"><strong>${escapeHtml(property.name)}</strong><small>${labels[property.rentStatus]} · ${escapeHtml(property.tenant || "Tenant")}</small></div>
      <div class="activity-amount">${formatCurrency(property.rent)}<br><span class="status-pill status-${escapeHtml(property.rentStatus)}">${escapeHtml(property.rentStatus)}</span></div>
    </div>`;
}

function emptyStateTemplate(title, copy) {
  return `<div class="empty-state"><span>H</span><h3>${title}</h3><p>${copy}</p></div>`;
}

function render() {
  renderDashboard();
  renderProperties();
}

function switchView(viewName) {
  const isDashboard = viewName === "dashboard";
  document.querySelector("#dashboardView").hidden = !isDashboard;
  document.querySelector("#propertiesView").hidden = isDashboard;
  document.querySelector("#pageTitle").textContent = isDashboard ? greeting() : "Property manager";
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function openDialog(propertyId) {
  elements.form.reset();
  document.querySelector("#propertyId").value = "";
  document.querySelector("#dialogTitle").textContent = "Add a property";
  document.querySelector("#occupancyInput").value = "occupied";
  document.querySelector("#rentStatusInput").value = "pending";

  if (propertyId) {
    const property = properties.find((item) => item.id === propertyId);
    if (!property) return;
    document.querySelector("#dialogTitle").textContent = "Edit property";
    document.querySelector("#propertyId").value = property.id;
    document.querySelector("#nameInput").value = property.name;
    document.querySelector("#addressInput").value = property.address;
    document.querySelector("#typeInput").value = property.type;
    document.querySelector("#rentInput").value = property.rent;
    document.querySelector("#occupancyInput").value = property.occupancy;
    document.querySelector("#rentStatusInput").value = property.rentStatus;
    document.querySelector("#tenantInput").value = property.tenant;
    document.querySelector("#imageInput").value = property.image;
  }
  elements.dialog.showModal();
}

function closeDialog() {
  elements.dialog.close();
}

function saveProperty(event) {
  event.preventDefault();
  const id = document.querySelector("#propertyId").value;
  const occupancy = document.querySelector("#occupancyInput").value;
  const property = {
    id: id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: document.querySelector("#nameInput").value.trim(),
    address: document.querySelector("#addressInput").value.trim(),
    type: document.querySelector("#typeInput").value,
    rent: Number(document.querySelector("#rentInput").value),
    occupancy,
    rentStatus: occupancy === "vacant" ? "pending" : document.querySelector("#rentStatusInput").value,
    tenant: occupancy === "vacant" ? "" : document.querySelector("#tenantInput").value.trim(),
    image: document.querySelector("#imageInput").value.trim()
  };

  if (id) {
    properties = properties.map((item) => item.id === id ? property : item);
  } else {
    properties = [property, ...properties];
  }
  saveProperties();
  render();
  closeDialog();
  showToast(id ? "Property updated" : "Property added");
}

function deleteProperty(id) {
  const property = properties.find((item) => item.id === id);
  if (!property || !window.confirm(`Delete ${property.name}? This cannot be undone.`)) return;
  properties = properties.filter((item) => item.id !== id);
  saveProperties();
  render();
  showToast("Property deleted");
}

function toggleRentStatus(id) {
  properties = properties.map((property) => property.id === id
    ? { ...property, rentStatus: property.rentStatus === "paid" ? "pending" : "paid" }
    : property);
  saveProperties();
  render();
  showToast("Rent status updated");
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2200);
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

["#heroAddButton", "#addPropertyButton", "#mobileAddButton"].forEach((selector) => {
  document.querySelector(selector).addEventListener("click", () => openDialog());
});

["#closeDialogButton", "#cancelDialogButton"].forEach((selector) => {
  document.querySelector(selector).addEventListener("click", closeDialog);
});

elements.form.addEventListener("submit", saveProperty);
elements.search.addEventListener("input", renderProperties);
elements.filter.addEventListener("change", renderProperties);
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) closeDialog();
});

elements.allList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-id]");
  const deleteButton = event.target.closest("[data-delete-id]");
  const rentButton = event.target.closest("[data-rent-id]");
  if (editButton) openDialog(editButton.dataset.editId);
  if (deleteButton) deleteProperty(deleteButton.dataset.deleteId);
  if (rentButton) toggleRentStatus(rentButton.dataset.rentId);
});

document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric"
}).format(new Date());
document.querySelector("#pageTitle").textContent = greeting();
render();
