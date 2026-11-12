import { basicExplain } from "../src/explain.ts";
import { SAMPLE_NOTICE } from "../src/data.ts";
import assert from "node:assert/strict";

const r = basicExplain(SAMPLE_NOTICE);
assert.equal(r.asks.length, 4, "finds 4 amounts");
assert.equal(r.asks[0].amount, "₹62,000");
assert.equal(r.deadline, "Reply within 30 days of receiving it");
assert.equal(r.source, "basic");
const none = basicExplain("Hello there, this has no figures in it at all, just words.");
assert.equal(none.asks.length, 0);
assert.equal(none.deadline, null);
console.log("explain tests passed");
