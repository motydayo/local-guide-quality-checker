import { evaluatePlace, summarizePlaces } from "./quality.js";

const records = [
  {
    name: "Harbor Community Hall",
    category: "community",
    address: "1 Sample Street",
    officialUrl: "https://example.com/hall",
    sourceCheckedAt: "2026-06-15",
    summary: "A fictional venue for workshops and neighborhood events.",
    reviewStatus: "verified",
    extraVerification: false,
  },
  {
    name: "Maple Family Clinic",
    category: "medical",
    address: "24 Demo Avenue",
    officialUrl: "https://example.com/clinic",
    sourceCheckedAt: "2026-06-12",
    summary: "A fictional clinic record requiring an additional check.",
    reviewStatus: "verified",
    extraVerification: false,
  },
  {
    name: "Station Reading Room",
    category: "library",
    address: "",
    officialUrl: "https://example.com/library",
    sourceCheckedAt: "",
    summary: "A fictional reading space with intentionally incomplete data.",
    reviewStatus: "pending",
    extraVerification: false,
  },
];

const samples = [
  {
    name: "Riverside Learning Studio",
    category: "education",
    address: "8 Example Lane",
    officialUrl: "https://example.com/studio",
    sourceCheckedAt: "2026-06-15",
    summary: "A fictional learning space added as an interactive sample.",
    reviewStatus: "pending",
    extraVerification: false,
  },
  {
    name: "Cedar Legal Desk",
    category: "legal",
    address: "5 Placeholder Road",
    officialUrl: "https://example.com/legal",
    sourceCheckedAt: "2026-06-15",
    summary: "A fictional legal service that needs enhanced verification.",
    reviewStatus: "verified",
    extraVerification: false,
  },
];

const metricDefinitions = [
  ["total", "Total records"],
  ["publishable", "Ready to publish"],
  ["drafts", "Kept as drafts"],
  ["averageScore", "Average score", "%"],
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMetrics() {
  const summary = summarizePlaces(records);
  const container = document.querySelector("#metrics");

  container.innerHTML = metricDefinitions
    .map(([key, label, suffix = ""]) => {
      return `
        <article class="metric">
          <span>${label}</span>
          <strong>${summary[key]}${suffix}</strong>
        </article>
      `;
    })
    .join("");
}

function renderRecords() {
  const container = document.querySelector("#record-grid");

  container.innerHTML = records
    .map((record) => {
      const result = evaluatePlace(record);
      const statusClass = result.publishable ? "ready" : "draft";
      const statusLabel = result.publishable ? "Ready" : "Draft";
      const issueCount = result.missing.length + result.warnings.length;
      const detail =
        issueCount === 0
          ? "All publication checks passed."
          : [...result.missing.map((item) => `Missing: ${item}`), ...result.warnings]
              .map(escapeHtml)
              .join("<br />");

      return `
        <article class="record-card">
          <div class="record-topline">
            <span class="status ${statusClass}">${statusLabel}</span>
            <strong>${result.score}/100</strong>
          </div>
          <div>
            <p class="category">${escapeHtml(record.category)}</p>
            <h3>${escapeHtml(record.name)}</h3>
            <p class="summary">${escapeHtml(record.summary)}</p>
          </div>
          <div class="record-meta">
            <span>${escapeHtml(record.address || "Address not entered")}</span>
            <span>Checked: ${escapeHtml(record.sourceCheckedAt || "Not yet")}</span>
          </div>
          <p class="record-detail">${detail}</p>
        </article>
      `;
    })
    .join("");
}

function render() {
  renderMetrics();
  renderRecords();
}

document.querySelector("#add-record").addEventListener("click", (event) => {
  const next = samples.shift();
  if (!next) {
    event.currentTarget.disabled = true;
    event.currentTarget.textContent = "All samples added";
    return;
  }

  records.push(next);
  render();

  if (samples.length === 0) {
    event.currentTarget.textContent = "Add final sample";
  }
});

render();
