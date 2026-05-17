"use client";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMoney } from "@/redux/slices/walletSlice";

const AMOUNTS = [100, 200, 500, 1000];

export default function WalletPage() {
  const dispatch               = useDispatch();
  const { balance, transactions } = useSelector((state) => state.wallet);

  const [custom, setCustom]   = useState("");
  const [flash,  setFlash]    = useState(null);   // which amount just added

  const handleAdd = (amt) => {
    const n = parseFloat(amt);
    if (!n || n <= 0) return;
    dispatch(addMoney(n));
    setFlash(n);
    setCustom("");
    setTimeout(() => setFlash(null), 1800);
  };

  return (
    <PageLayout title="Wallet & Payments" icon="💰">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">

        {/* Balance card + recharge */}
        <div className="space-y-4">
          <div className="bg-linear-to-br from-purple-700/30 to-[#0f1535] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Current Balance</p>
            <h2 className="text-4xl font-bold">₹ {balance.toFixed(2)}</h2>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {transactions[0]?.date ?? "—"}
            </p>
          </div>

          {/* Quick add */}
          <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Quick Add Money</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => handleAdd(a)}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                    flash === a
                      ? "bg-green-500/20 border-green-500/40 text-green-400"
                      : "border-white/10 bg-white/5 hover:bg-purple-600/20 hover:border-purple-500/40"
                  }`}
                >
                  {flash === a ? "✓ Added" : `₹${a}`}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="flex gap-2">
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/\D/, ""))}
                placeholder="Enter custom amount"
                className="flex-1 bg-[#121735] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-white"
              />
              <button
                onClick={() => handleAdd(custom)}
                disabled={!custom || Number(custom) <= 0}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  flash === parseFloat(custom) && flash !== null
                    ? "bg-green-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 disabled:opacity-40"
                }`}
              >
                {flash === parseFloat(custom) && flash !== null ? "✓" : "Add"}
              </button>
            </div>

            {/* Confirmation toast */}
            {flash !== null && (
              <p className="mt-2 text-xs text-green-400 text-center">
                ₹{flash} added to your wallet!
              </p>
            )}
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Transaction History</p>
          <div className="space-y-1 max-h-105 overflow-y-auto pr-1">
            {transactions.map((t, i) => {
              const isCredit = t.type === "credit";
              return (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border shrink-0 ${
                      isCredit ? "bg-green-500/15 border-green-500/30" : "bg-red-500/15 border-red-500/30"
                    }`}>
                      {isCredit ? "↓" : "↑"}
                    </div>
                    <div>
                      <p className="text-sm">{t.desc}</p>
                      <p className="text-xs text-gray-500">{t.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${isCredit ? "text-green-400" : "text-red-400"}`}>
                    {isCredit ? "+" : "−"}₹{Math.abs(t.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
