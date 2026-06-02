"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "@/redux/slices/authSlice";
import api from "@/utils/api";
import { stripAuthFields } from "@/utils/authState";
import {
  clearAccessToken,
  extractAccessToken,
  setAccessToken,
} from "@/utils/tokenStore";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    async function restoreCookieSession() {
      try {
        const refreshRes = await api.get("/authorization/auth/refresh-token");
        const accessToken = extractAccessToken(refreshRes);

        if (accessToken) {
          setAccessToken(accessToken);
        }

        const res = await api.get("/authorization/client/profile-me");

        if (cancelled) {
          return;
        }

        dispatch(
          restoreAuth({
            isLoggedIn: !!res?.success,
            user: res?.success ? stripAuthFields(res?.data) : null,
            accessToken,
          })
        );
      } catch {
        clearAccessToken();

        if (!cancelled) {
          dispatch(
            restoreAuth({
              isLoggedIn: false,
              user: null,
            })
          );
        }
      }
    }

    restoreCookieSession();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return null;
}
