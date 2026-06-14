import test from "node:test";
import assert from "node:assert/strict";

import { evaluatePlace, summarizePlaces } from "./quality.js";

const completePlace = {
  name: "Harbor Community Hall",
  category: "community",
  address: "1 Sample Street",
  officialUrl: "https://example.com/hall",
  sourceCheckedAt: "2026-06-15",
  summary: "A fictional public hall used only for this demonstration.",
  reviewStatus: "verified",
  extraVerification: false,
};

test("publishes a complete, verified, non-sensitive record", () => {
  const result = evaluatePlace(completePlace);

  assert.equal(result.score, 100);
  assert.equal(result.publishable, true);
  assert.deepEqual(result.missing, []);
});

test("keeps an incomplete record as a draft", () => {
  const result = evaluatePlace({
    ...completePlace,
    address: "",
    reviewStatus: "pending",
  });

  assert.equal(result.score, 85);
  assert.equal(result.publishable, false);
  assert.deepEqual(result.missing, ["Address"]);
});

test("requires extra verification for sensitive categories", () => {
  const result = evaluatePlace({
    ...completePlace,
    category: "medical",
  });

  assert.equal(result.sensitive, true);
  assert.equal(result.publishable, false);
  assert.match(result.warnings.join(" "), /additional verification/i);
});

test("summarizes a mixed dataset", () => {
  const summary = summarizePlaces([
    completePlace,
    { ...completePlace, name: "", reviewStatus: "pending" },
  ]);

  assert.deepEqual(summary, {
    total: 2,
    publishable: 1,
    drafts: 1,
    averageScore: 90,
  });
});
