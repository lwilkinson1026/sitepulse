import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import TwitterPurchaseEvent from "./TwitterPurchaseEvent";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

async function fetchSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const stripe = getStripe();
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("Failed to retrieve session:", err);
    return null;
  }
}

export default async function ReserveSuccess({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const session = await fetchSession(session_id);
  const paid = session?.payment_status === "paid";
  const email = session?.customer_details?.email;
  const meta = session?.metadata ?? {};

  return (
    <main className="relative min-h-screen overflow-hidden">
      {paid && session && (
        <TwitterPurchaseEvent
          conversionId={session.id}
          value={(session.amount_total ?? 0) / 100}
          currency={(session.currency ?? "usd").toUpperCase()}
        />
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

      <div className="relative max-w-[900px] mx-auto px-8 pt-32 pb-24">
        <div className="mono text-[11px] tracking-[.22em] uppercase text-[var(--hi)]">
          {paid ? "RESERVATION CONFIRMED" : "RESERVATION RECEIVED"}
        </div>
        <h1
          className="display-x mt-6 leading-[.95] tracking-[-.045em]"
          style={{ fontSize: "clamp(48px, 8vw, 104px)" }}
        >
          {paid ? "Your slot is held." : "We're processing your reservation."}
        </h1>
        <p className="mt-8 max-w-[600px] text-[17px] leading-[1.65] text-zinc-400">
          {paid
            ? "Your $100 deposit is processed. Build slot locked. We'll email you a confirmation, and follow up with shipping details before the Q3 ship date."
            : "Your payment is being processed. You'll receive a confirmation email shortly."}
          {email && (
            <>
              {" "}
              Receipt sent to{" "}
              <span className="text-zinc-200">{email}</span>.
            </>
          )}
        </p>

        {Object.keys(meta).length > 0 && (
          <div
            className="mt-12 border p-6"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <div className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
              YOUR BUILD
            </div>
            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-[14px] mono">
              {meta.build_label && (
                <>
                  <dt className="text-zinc-500">Tier</dt>
                  <dd className="text-zinc-200">{meta.build_label}</dd>
                </>
              )}
              {meta.addons && meta.addons !== "(none)" && (
                <>
                  <dt className="text-zinc-500">Add-ons</dt>
                  <dd className="text-zinc-200 break-all">{meta.addons}</dd>
                </>
              )}
              {meta.build_subtotal_usd && (
                <>
                  <dt className="text-zinc-500">Build subtotal</dt>
                  <dd className="text-zinc-200">
                    ${Number(meta.build_subtotal_usd).toLocaleString()}
                  </dd>
                </>
              )}
            </dl>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link href="/" className="btn btn-ghost">
            ← BACK TO SITE
          </Link>
        </div>
      </div>
    </main>
  );
}
