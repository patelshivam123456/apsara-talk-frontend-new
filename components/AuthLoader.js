"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "@/redux/slices/authSlice";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("auth");

      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);

        dispatch(
          restoreAuth({
            isLoggedIn: parsedAuth?.isLoggedIn || false,
            user: parsedAuth?.user || null,
            token: parsedAuth?.token || null,
          })
        );

        document.cookie =
          "isLoggedIn=1; path=/; max-age=604800; SameSite=Lax";

        if (parsedAuth?.token) {
          document.cookie = `token=${parsedAuth.token}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else {
        // ✅ IMPORTANT: force auth completion even if nothing exists
        dispatch(
          restoreAuth({
            isLoggedIn: false,
            user: null,
            token: null,
          })
        );
      }
    } catch (error) {
      console.log("Auth Restore Error:", error);

      // fallback safety
      dispatch(
        restoreAuth({
          isLoggedIn: false,
          user: null,
          token: null,
        })
      );
    }
  }, [dispatch]);

  return null;
}