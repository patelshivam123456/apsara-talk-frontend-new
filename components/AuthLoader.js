"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "@/redux/slices/authSlice";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");

    if (savedAuth) {
      dispatch(restoreAuth(JSON.parse(savedAuth)));
      // Ensure the cookie exists so getServerSideProps can read it on next load
      document.cookie = "isLoggedIn=1; path=/; max-age=604800; SameSite=Lax";
    }
  }, [dispatch]);

  return null;
}