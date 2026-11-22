import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_NEWSLETTER_DISCOUNT_AMOUNT_USD,
  DEFAULT_NEWSLETTER_DISCOUNT_CODE,
  isHoneypot,
  newsletterOffer,
  offerHeadline,
  parseNewsletterInput,
  welcomeEmail,
} from "./newsletter.ts";

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

test("welcome email includes the code and redemption path", () => {
  const mail = welcomeEmail(
    { amountUsd: 100, code: "DELIVERY100" },
    { firstName: "Landon", origin: "https://www.sitepulse.space" },
  );
  assert.match(mail.subject, /\$100/);
  assert.match(mail.text, /DELIVERY100/);
  assert.match(mail.text, /\/plan/);
  assert.match(mail.text, /doesn.t have a promo-code box/i);
  assert.match(mail.html, /DELIVERY100/);
  assert.doesNotMatch(mail.text, /% off/);
});
