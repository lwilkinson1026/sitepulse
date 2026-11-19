import type { Metadata } from "next";
import Link from "next/link";
import {
  formatCoords,
  mapsLink,
  ONLINE_WINDOW_LABEL,
  orderNumber,
  RENT_MONTHLY_USD,
} from "@/lib/rental";
import { getStripe } from "@/lib/stripe";
import PurchaseEvents from "../../components/PurchaseEvents";
import { ClearRentDraft } from "../ClearRentDraft";
import { OnlineWindow } from "../OnlineWindow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sitepulse — Subscription confirmed",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

async function fetchSession(sessionId: string | undefined) {
  if (!sessionId || !sessionId.startsWith("cs_")) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("[plan/confirmed] failed to retrieve session:", err);
    return null;
  }
}

export default async function RentConfirmed({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const session = await fetchSession(session_id);
  const paid = session?.payment_status === "paid";
  const email = session?.customer_details?.email;
  const meta = session?.metadata ?? {};
  const pin = { lat: Number(meta.site_lat), lng: Number(meta.site_lng) };
  const hasPin = Number.isFinite(pin.lat) && Number.isFinite(pin.lng) && !!meta.site_lat;
  const paidAtMs = (session?.created ?? 0) * 1000;
  const wantsFuel = meta.fuel_service === "quote_requested";

  const steps: ReadonlyArray<readonly [string, string]> = [
    ["Now", "Payment received. Your unit is assigned and being prepped."],
    [
      "Next",
      `We'll call or text ${meta.phone ? meta.phone : "you"} to confirm the drop-off time and site access.`,
    ],
    [
      ONLINE_WINDOW_LABEL,
      "We deliver to your pin, set the unit up and bring Starlink online.",
    ],
    [
      "After",
      wantsFuel
        ? "We'll send your per-gallon fuel service quote. Until it's in place, keep an eye on the tank."
        : "Keep the tank topped up and it keeps running. Want us to handle fuel? Just ask.",
    ],
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {paid && session && (
        <>
          <PurchaseEvents
            conversionId={session.id}
            value={(session.amount_total ?? 0) / 100}
            currency={(session.currency ?? "usd").toUpperCase()}
            email={email}
          />
          <ClearRentDraft />
        </>
      )}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="stars opacity-50" />
      <div
        className="nebula"
        style={{
          width: 800,
          height: 800,
          left: "50%",
          top: "40%",
          transform: "translate(-50%,-50%)",
          opacity: 0.3,
        }}
      />

      <div className="relative max-w-[900px] mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-24">
        <div className="mono text-[11px] tracking-[.22em] uppercase text-[var(--hi)]">
          {paid && session
            ? `SUBSCRIPTION CONFIRMED · ${orderNumber(session.id, new Date(paidAtMs).getFullYear())}`
            : "SUBSCRIPTION NOT CONFIRMED YET"}
        </div>
        <h1
          className="display-x mt-6 leading-[.95] tracking-[-.045em]"
          style={{ fontSize: "clamp(44px, 8vw, 104px)" }}
        >
          {paid ? (
            <>
              You&apos;re in.
              <br />
              Online in {ONLINE_WINDOW_LABEL}.
            </>
          ) : (
            "We couldn't confirm your payment."
          )}
        </h1>

        {paid ? (
          <>
            <p className="mt-8 max-w-[620px] text-[17px] leading-[1.65] text-zinc-400">
              Your first month and delivery are paid.
              {email && (
                <>
                  {" "}
                  The receipt is on its way to <span className="text-zinc-200">{email}</span>.
                </>
              )}{" "}
              Your subscription renews at ${RENT_MONTHLY_USD}/month for as long as you keep the unit.
            </p>

            <div
              className="mt-10 border p-6 sm:p-8"
              style={{ borderColor: "var(--line-strong)", background: "rgba(0,0,0,.5)" }}
            >
              <div className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
                Your unit will be online between
              </div>
              <div className="mt-3 text-[20px] sm:text-[26px] font-semibold leading-[1.3]">
                <OnlineWindow fromMs={paidAtMs} />
              </div>
              {hasPin && (
                <div
                  className="mt-6 pt-5 border-t flex flex-wrap items-baseline justify-between gap-3"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div>
                    <div className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
                      Delivering to
                    </div>
                    <div className="num mt-2 text-[15px]">{formatCoords(pin)}</div>
                    {meta.site_place && meta.site_place !== "(none)" && (
                      <div className="text-[13px] text-zinc-400 mt-1">
                        Near {meta.site_place}
                      </div>
                    )}
                  </div>
                  <a
                    href={mapsLink(pin)}
                    target="_blank"
                    rel="noreferrer"
                    className="ulink mono text-[11px] tracking-[.12em] uppercase text-zinc-300"
                  >
                    View pin on map ↗
                  </a>
                </div>
              )}
            </div>

            <ol className="list-none p-0 m-0 mt-10">
              {steps.map(([when, what]) => (
                <li
                  key={when}
                  className="grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] gap-4 py-4 border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="mono text-[11px] tracking-[.14em] uppercase text-[var(--hi)] pt-0.5">
                    {when}
                  </span>
                  <span className="text-[15px] leading-[1.55] text-zinc-300">{what}</span>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-[14px] leading-[1.6] text-zinc-500">
              Wrong pin, or something changed on site?{" "}
              <Link href="/contact" className="text-[var(--hi)] hover:underline">
                Tell us right away
              </Link>{" "}
              so the truck goes to the right place.
            </p>
          </>
        ) : (
          <p className="mt-8 max-w-[620px] text-[17px] leading-[1.65] text-zinc-400">
            If you just paid, give it a minute and refresh this page. If you backed out of
            checkout, nothing was charged — you can{" "}
            <Link href="/plan" className="text-[var(--hi)] hover:underline">
              pick up where you left off
            </Link>
            . Still stuck?{" "}
            <Link href="/contact" className="text-[var(--hi)] hover:underline">
              Contact us
            </Link>
            .
          </p>
        )}

        <div className="mt-12">
          <Link href="/" className="btn btn-ghost">
            ← BACK TO SITE
          </Link>
        </div>
      </div>
    </main>
  );
}
