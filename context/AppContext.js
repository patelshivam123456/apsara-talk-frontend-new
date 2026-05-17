"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // global data (example)
  const [data] = useState([
    { type: "astro", name: "Aryan Sharma" },
    { type: "astro", name: "Neha Iyer" },
    { type: "topic", name: "Love Horoscope" },
    { type: "topic", name: "Career Prediction" },
  ]);

  return (
    <AppContext.Provider
      value={{
        chatOpen,
        setChatOpen,
        notifOpen,
        setNotifOpen,
        searchQuery,
        setSearchQuery,
        data,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);