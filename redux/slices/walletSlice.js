import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 520,
  transactions: [
    { type: "credit", desc: "Wallet Recharge",          amount: 200, date: "May 9" },
    { type: "debit",  desc: "Chat · Dr. Aryan Sharma",  amount: -96, date: "May 9" },
    { type: "credit", desc: "Cashback Reward",           amount: 50,  date: "May 8" },
    { type: "debit",  desc: "Call · Neha Iyer",         amount: -56, date: "May 7" },
    { type: "credit", desc: "Wallet Recharge",           amount: 500, date: "May 5" },
  ],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addMoney: (state, action) => {
      const amt = parseFloat(action.payload);
      if (!amt || amt <= 0) return;
      state.balance = parseFloat((state.balance + amt).toFixed(2));
      state.transactions.unshift({
        type: "credit",
        desc: "Wallet Recharge",
        amount: amt,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      });
    },
    deductMoney: (state, action) => {
      const { amount, desc } = action.payload;
      state.balance = parseFloat((state.balance - amount).toFixed(2));
      state.transactions.unshift({
        type: "debit",
        desc,
        amount: -amount,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      });
    },
  },
});

export const { addMoney, deductMoney } = walletSlice.actions;
export default walletSlice.reducer;
