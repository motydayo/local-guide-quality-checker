export const SENSITIVE_CATEGORIES = new Set([
  "medical",
  "childcare",
  "legal",
  "financial",
  "care",
  "funeral",
]);

const FIELD_RULES = [
  { key: "name", label: "Name", weight: 20 },
  { key: "category", label: "Category", weight: 15 },
  { key: "address", label: "Address", weight: 15 },
  { key: "officialUrl", label: "Official URL", weight: 15 },
  { key: "sourceCheckedAt", label: "Source check date", weight: 15 },
  { key: "summary", label: "Useful summary", weight: 20 },
];

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpUrl(value) {
  if (!hasValue(value)) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function evaluatePlace(place) {
  const missing = FIELD_RULES.filter(({ key }) => !hasValue(place[key])).map(
    ({ label }) => label,
  );

  let score = FIELD_RULES.reduce((total, rule) => {
    return total + (hasValue(place[rule.key]) ? rule.weight : 0);
  }, 0);

  const warnings = [];

  if (hasValue(place.officialUrl) && !isHttpUrl(place.officialUrl)) {
    score -= 15;
    warnings.push("Official URL must use http or https.");
  }

  const sensitive = SENSITIVE_CATEGORIES.has(place.category);
  if (sensitive && !place.extraVerification) {
    warnings.push("Sensitive categories require an additional verification.");
  }

  const reviewComplete =
    place.reviewStatus === "verified" &&
    (!sensitive || Boolean(place.extraVerification));
  const publishable = missing.length === 0 && warnings.length === 0 && reviewComplete;

  if (!reviewComplete) {
    warnings.push("Keep this record as a draft until review is complete.");
  }

  return {
    score: Math.max(0, score),
    missing,
    warnings,
    sensitive,
    publishable,
  };
}

export function summarizePlaces(places) {
  const results = places.map(evaluatePlace);
  const total = results.length;
  const publishable = results.filter((result) => result.publishable).length;
  const averageScore = total
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / total)
    : 0;

  return {
    total,
    publishable,
    drafts: total - publishable,
    averageScore,
  };
}
