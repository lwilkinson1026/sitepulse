import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_NEWSLETTER_DISCOUNT_AMOUNT_USD,
  DEFAULT_NEWSLETTER_DISCOUNT_CODE,
  isHoneypot,
  newsletterOffer,
  offerHeadline,
  parseNewsletterInput,
  promoPaidEmailLine,
  promoStripeMetadata,
  quoteDelivery,
  welcomeEmail,
} from "./newsletter.ts";
import { DELIVERY_FEE_USD, DUE_TODAY_USD, RENT_MONTHLY_USD } from "./rental.ts";

test("newsletterOffer defaults to $100 / DELIVERY100", () => {
  const prevAmount = process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD;
  const prevCode = process.env.NEWSLETTER_DISCOUNT_CODE;
  delete process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD;
  delete process.env.NEWSLETTER_DISCOUNT_CODE;
  try {
    assert.deepEqual(newsletterOffer(), {
      amountUsd: DEFAULT_NEWSLETTER_DISCOUNT_AMOUNT_USD,
      code: DEFAULT_NEWSLETTER_DISCOUNT_CODE,
    });
  } finally {
    if (prevAmount !== undefined) process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD = prevAmount;
    else delete process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD;
    if (prevCode !== undefined) process.env.NEWSLETTER_DISCOUNT_CODE = prevCode;
    else delete process.env.NEWSLETTER_DISCOUNT_CODE;
  }
});

test("newsletterOffer reads env overrides", () => {
  const prevAmount = process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD;
  const prevCode = process.env.NEWSLETTER_DISCOUNT_CODE;
  process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD = "75";
  process.env.NEWSLETTER_DISCOUNT_CODE = "FIELD75";
  try {
    assert.deepEqual(newsletterOffer(), { amountUsd: 75, code: "FIELD75" });
  } finally {
    if (prevAmount !== undefined) process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD = prevAmount;
    else delete process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD;
    if (prevCode !== undefined) process.env.NEWSLETTER_DISCOUNT_CODE = prevCode;
    else delete process.env.NEWSLETTER_DISCOUNT_CODE;
  }
});

test("newsletterOffer ignores invalid amount", () => {
  const prev = process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD;
  process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD = "-10";
  try {
    assert.equal(newsletterOffer().amountUsd, DEFAULT_NEWSLETTER_DISCOUNT_AMOUNT_USD);
  } finally {
    if (prev !== undefined) process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD = prev;
    else delete process.env.NEWSLETTER_DISCOUNT_AMOUNT_USD;
  }
});

test("offerHeadline is a flat dollar amount, not a percent", () => {
  assert.equal(
    offerHeadline(100),
    "Sign up for updates and get $100 off delivery",
  );
  assert.equal(offerHeadline(100).includes("%"), false);
});

test("parseNewsletterInput requires a real email and lowercases it", () => {
  const bad = parseNewsletterInput({ email: "not-an-email" });
  assert.equal(bad.ok, false);

  const good = parseNewsletterInput({
    email: "  Landon@Hostshare.co ",
    firstName: " Landon ",
    website: "",
    event_id: "lead:abc",
    source: "homepage",
  });
  assert.equal(good.ok, true);
  if (good.ok) {
    assert.equal(good.value.email, "landon@hostshare.co");
    assert.equal(good.value.firstName, "Landon");
    assert.equal(good.value.source, "homepage");
  }
});

test("honeypot trips when website is filled", () => {
  assert.equal(isHoneypot(""), false);
  assert.equal(isHoneypot("https://spam.example"), true);
});

test("welcome email includes the code and checkout redemption", () => {
  const mail = welcomeEmail(
    { amountUsd: 100, code: "DELIVERY100" },
    { firstName: "Landon", origin: "https://www.sitepulse.space" },
  );
  assert.match(mail.subject, /\$100/);
  assert.match(mail.text, /DELIVERY100/);
  assert.match(mail.text, /\/plan/);
  assert.match(mail.text, /review step/i);
  assert.match(mail.text, /\$50/);
  assert.match(mail.html, /DELIVERY100/);
  assert.doesNotMatch(mail.text, /promo-code box/i);
  assert.doesNotMatch(mail.text, /% off/);
});

test("quoteDelivery applies a matching code and ignores case/space", () => {
  const q = quoteDelivery("  delivery100 ", {
    amountUsd: 100,
    code: "DELIVERY100",
  });
  assert.equal(q.applied, true);
  assert.equal(q.invalid, false);
  assert.equal(q.discountUsd, 100);
  assert.equal(q.deliveryUsd, DELIVERY_FEE_USD - 100);
  assert.equal(q.dueTodayUsd, RENT_MONTHLY_USD + (DELIVERY_FEE_USD - 100));
});

test("quoteDelivery empty code is a no-op", () => {
  const q = quoteDelivery("   ");
  assert.equal(q.applied, false);
  assert.equal(q.invalid, false);
  assert.equal(q.deliveryUsd, DELIVERY_FEE_USD);
  assert.equal(q.dueTodayUsd, DUE_TODAY_USD);
});

test("quoteDelivery amounts stay locked to rental.ts", () => {
  const q = quoteDelivery("");
  assert.equal(q.deliveryUsd, DELIVERY_FEE_USD);
  assert.equal(q.dueTodayUsd, DUE_TODAY_USD);
  assert.equal(RENT_MONTHLY_USD + DELIVERY_FEE_USD, DUE_TODAY_USD);
});

test("quoteDelivery invalid code still checks out at full delivery", () => {
  const q = quoteDelivery("WRONG");
  assert.equal(q.applied, false);
  assert.equal(q.invalid, true);
  assert.equal(q.deliveryUsd, DELIVERY_FEE_USD);
  assert.equal(q.dueTodayUsd, DUE_TODAY_USD);
});

test("quoteDelivery never drops delivery below zero", () => {
  const q = quoteDelivery("BIG", { amountUsd: 999, code: "BIG" });
  assert.equal(q.applied, true);
  assert.equal(q.deliveryUsd, 0);
  assert.equal(q.dueTodayUsd, RENT_MONTHLY_USD);
});

test("promoStripeMetadata is omitted unless the code applied", () => {
  assert.deepEqual(promoStripeMetadata(quoteDelivery("")), {});
  assert.deepEqual(promoStripeMetadata(quoteDelivery("NOPE")), {});
  assert.deepEqual(
    promoStripeMetadata(
      quoteDelivery("DELIVERY100", { amountUsd: 100, code: "DELIVERY100" }),
    ),
    {
      promo_code: "DELIVERY100",
      promo_amount_usd: "100",
      delivery_usd: String(DELIVERY_FEE_USD - 100),
    },
  );
});

test("promoPaidEmailLine reads session metadata", () => {
  assert.equal(promoPaidEmailLine({}), "(none)");
  assert.equal(
    promoPaidEmailLine({
      promo_code: "DELIVERY100",
      promo_amount_usd: "100",
      delivery_usd: "50",
    }),
    "DELIVERY100 (−$100 delivery, charged $50)",
  );
});
