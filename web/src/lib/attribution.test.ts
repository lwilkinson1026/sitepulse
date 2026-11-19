import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import {
  buildFbc,
  hasAdSource,
  mergeAttribution,
  parseAttribution,
  serializeAttribution,
  toAnalyticsProps,
  toStripeMetadata,
  touchFromSearch,
  type Attribution,
} from "./attribution.ts";
import { normalizePhone } from "./phone.ts";

test("touchFromSearch captures UTMs and click IDs", () => {
  const touch = touchFromSearch(
    "?utm_source=facebook&utm_medium=paid_social&utm_campaign=launch&fbclid=abc123&twclid=tw1",
    "/",
    1_700_000_000_000,
  );
  assert.ok(touch);
  assert.equal(touch?.utm_source, "facebook");
  assert.equal(touch?.utm_medium, "paid_social");
  assert.equal(touch?.utm_campaign, "launch");
  assert.equal(touch?.fbclid, "abc123");
  assert.equal(touch?.twclid, "tw1");
  assert.equal(touch?.fbc, "fb.1.1700000000000.abc123");
});

test("touchFromSearch returns null when the URL is clean", () => {
  assert.equal(touchFromSearch("", "/rent"), null);
  assert.equal(touchFromSearch("?foo=bar", "/rent"), null);
});

test("mergeAttribution keeps first ad source and updates last", () => {
  const first = touchFromSearch("?utm_source=twitter&utm_medium=paid_social", "/", 1)!;
  const second = touchFromSearch("?utm_source=facebook&utm_medium=paid_social", "/rent", 2)!;
  const merged = mergeAttribution({ first, last: first }, second, "/rent", 2);
  assert.equal(merged.first.utm_source, "twitter");
  assert.equal(merged.last.utm_source, "facebook");
  assert.equal(merged.last.landing, "/rent");
});

test("mergeAttribution upgrades an organic first-touch when an ad arrives", () => {
  const organic: Attribution = {
    first: { ts: 1, landing: "/" },
    last: { ts: 1, landing: "/" },
  };
  const ad = touchFromSearch("?utm_source=facebook&fbclid=xyz", "/", 2)!;
  const merged = mergeAttribution(organic, ad, "/", 2);
  assert.equal(merged.first.utm_source, "facebook");
  assert.equal(merged.last.fbclid, "xyz");
});

test("round-trips through JSON", () => {
  const touch = touchFromSearch("?utm_source=x&gclid=g1", "/field-unit", 9)!;
  const attr = mergeAttribution(null, touch, "/field-unit", 9);
  const parsed = parseAttribution(serializeAttribution(attr));
  assert.deepEqual(parsed, attr);
});

test("toStripeMetadata flattens first/last and click IDs", () => {
  const first = touchFromSearch("?utm_source=twitter&utm_campaign=x_launch", "/", 1)!;
  const last = touchFromSearch(
    "?utm_source=facebook&utm_medium=paid_social&utm_campaign=meta_lpv&fbclid=fb1",
    "/",
    2,
  )!;
  const meta = toStripeMetadata({ first, last }, { fbp: "fb.1.2.cookie" });
  assert.equal(meta.utm_source, "facebook");
  assert.equal(meta.utm_campaign, "meta_lpv");
  assert.equal(meta.first_utm_source, "twitter");
  assert.equal(meta.first_utm_campaign, "x_launch");
  assert.equal(meta.fbclid, "fb1");
  assert.equal(meta.fbp, "fb.1.2.cookie");
  assert.equal(meta.fbc, last.fbc);
});

test("toAnalyticsProps prefixes first-touch with initial_", () => {
  const last = touchFromSearch("?utm_source=facebook&utm_medium=paid_social", "/", 2)!;
  const first = touchFromSearch("?utm_source=twitter", "/", 1)!;
  const props = toAnalyticsProps({ first, last });
  assert.equal(props.utm_source, "facebook");
  assert.equal(props.initial_utm_source, "twitter");
});

test("hasAdSource / buildFbc helpers", () => {
  assert.equal(hasAdSource({ ts: 1, landing: "/" }), false);
  assert.equal(hasAdSource({ ts: 1, landing: "/", fbclid: "x" }), true);
  assert.equal(buildFbc("clid", 42), "fb.1.42.clid");
});

test("normalizePhone adds a US country code", () => {
  assert.equal(normalizePhone("(208) 555-0123"), "12085550123");
  assert.equal(normalizePhone("+1 208 555 0123"), "12085550123");
  assert.equal(normalizePhone("555-01"), undefined);
});

test("Meta email hash vector", () => {
  const hashed = createHash("sha256")
    .update("john_smith@gmail.com")
    .digest("hex");
  assert.equal(
    hashed,
    "62a14e44f765419d10fea99367361a727c12365e2520f32218d505ed9aa0f62f",
  );
});
