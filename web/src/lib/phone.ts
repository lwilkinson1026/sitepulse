/**
 * Digits with country code, no plus. 10-digit numbers are treated as US.
 * Shared by Meta CAPI hashing; keep this isomorphic (no node:crypto).
 */
export function normalizePhone(phone: string): string | undefined {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length < 10) return undefined;
  if (digits.length === 10) return `1${digits}`;
  return digits;
}
