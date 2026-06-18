"use client";

import PublicPageLayout from "@/components/PublicPageLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { addMoney } from "@/redux/slices/walletSlice";

const AMOUNTS = [100, 200, 500, 1000];
const BENEFITS = [
  ["Instant recharge", "Balance updates immediately for the current session."],
  ["Clear history", "Credits and debits are listed in one simple timeline."],
  ["Session ready", "Keep enough balance before starting chat or call guidance."],
];

export default function WalletPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { balance, transactions } = useSelector((state) => state.wallet);
  const { isLoggedIn, isAuthLoaded } = useSelector((state) => state.auth);

  const [custom, setCustom] = useState("");
  const [flash, setFlash] = useState(null);

  const handleAdd = (amt) => {
    const n = parseFloat(amt);
    if (!n || n <= 0) return;
    dispatch(addMoney(n));
    setFlash(n);
    setCustom("");
    setTimeout(() => setFlash(null), 1800);
  };

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isAuthLoaded, isLoggedIn, router]);

  if (!isAuthLoaded || !isLoggedIn) {
    return null;
  }

  return (
    <PublicPageLayout
      eyebrow="Wallet and payments"
      title="Add Money"
      description="Recharge your ApsaraAstro wallet, review transaction history, and keep your balance ready for chat or call sessions."
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[#211704] p-6 text-white shadow-[0_22px_54px_rgba(33,23,4,0.18)]">
            <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full border border-[#dfff00]/25" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#dfff00]">
              Current balance
            </p>
            <h2 className="mt-4 text-3xl text-[#f4e7bd] font-black">₹ {Number(balance || 0).toFixed(2)}</h2>
            <p className="mt-3 text-sm text-[#f4e7bd]">
              Last updated: {transactions[0]?.date ?? "No transactions yet"}
            </p>
          </div>

          <div className="rounded-[28px] border border-[#eadcae] bg-white/92 p-5 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)]">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
              Quick add money
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAdd(amount)}
                  className={`min-h-14 rounded-2xl border px-4 text-sm font-black transition ${
                    flash === amount
                      ? "border-[#9fd56d] bg-[#e8f8d7] text-[#236b24]"
                      : "border-[#d8ce76] bg-[#fbf8cc] text-[#312d1e] hover:bg-[#fff8a8]"
                  }`}
                >
                  {flash === amount ? "Added" : `₹${amount}`}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter custom amount"
                className="min-w-0 flex-1 rounded-2xl border border-[#eadcae] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#211704] outline-none focus:border-[#d8ce76]"
              />
              <button
                onClick={() => handleAdd(custom)}
                disabled={!custom || Number(custom) <= 0}
                className="rounded-2xl bg-[#dfff00] px-5 py-3 text-sm font-black text-[#312d1e] transition hover:bg-[#cdf000] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>

            {flash !== null && (
              <p className="mt-3 rounded-2xl bg-[#e8f8d7] px-4 py-3 text-center text-xs font-bold text-[#236b24]">
                ₹{flash} added to your wallet.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {BENEFITS.map(([title, body]) => (
              <article
                key={title}
                className="rounded-[22px] border border-[#eadcae] bg-white/92 p-4 text-[#211704] shadow-[0_12px_28px_rgba(94,70,12,0.08)]"
              >
                <h2 className="text-sm font-extrabold">{title}</h2>
                <p className="mt-2 text-xs leading-5 text-[#60481f]">{body}</p>
              </article>
            ))}
          </div>

          <div className="rounded-[28px] border border-[#eadcae] bg-white/92 p-5 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
                  Transaction history
                </p>
                <h2 className="mt-1 text-xl font-extrabold">Recent activity</h2>
              </div>
              <span className="rounded-full bg-[#fbf8cc] px-3 py-1 text-xs font-bold text-[#8a6106]">
                {transactions.length} items
              </span>
            </div>

            <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
              {transactions.length === 0 && (
                <div className="rounded-[22px] bg-[#fff8dc] p-8 text-center text-sm font-medium text-[#60481f]">
                  No wallet activity yet.
                </div>
              )}

              {transactions.map((transaction, index) => {
                const isCredit = transaction.type === "credit";

                return (
                  <div
                    key={`${transaction.date}-${transaction.amount}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-[18px] border border-[#eee8d5] bg-[#fffdf8] px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                          isCredit
                            ? "bg-[#e8f8d7] text-[#236b24]"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{transaction.desc}</p>
                        <p className="mt-0.5 text-xs text-[#8a7a55]">{transaction.date}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-sm font-black ${
                        isCredit ? "text-[#236b24]" : "text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}₹{Math.abs(transaction.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
