"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "@/redux/slices/authSlice";
import api from "@/utils/api";
import { stripAuthFields } from "@/utils/authState";
import {
  clearAccessToken,
  decodeAccessToken,
  extractAccessToken,
  setAccessToken,
} from "@/utils/tokenStore";

const ASTROLOGER_ROLE = "ROLE_ASTROLOGER";

function normalizeRoles(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((role) => String(role).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

function hasAstrologerRole(payload) {
  return [
    ...normalizeRoles(payload?.roles),
    ...normalizeRoles(payload?.authorities),
  ].includes(ASTROLOGER_ROLE);
}

async function loadSessionProfile(isAstrologer, claims) {
  if (isAstrologer) {
    try {
      const res = await api.get("/authorization/astrologer/profile-me");

      if (res?.success && res?.data) {
        return stripAuthFields(res.data);
      }
    } catch {
      try {
        const astrologersRes = await api.get(
          "/authorization/info/get-all-astrologers"
        );
        const astrologers = Array.isArray(astrologersRes?.data)
          ? astrologersRes.data
          : [];

        const match = astrologers.find((astro) =>
          [
            astro?.publicId,
            astro?.userId,
            astro?.username,
            astro?.email,
            astro?.phone,
          ].some((value) => value && String(value) === String(claims?.uid))
        );

        if (match) {
          return match;
        }
      } catch {
        return {
          username: claims?.sub,
          publicId: claims?.uid,
        };
      }
    }

    return {
      username: claims?.sub,
      publicId: claims?.uid,
    };
  }

  const res = await api.get("/authorization/client/profile-me");

  return res?.success ? stripAuthFields(res?.data) : null;
}

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

        const claims = decodeAccessToken(accessToken);
        const isAstrologer = hasAstrologerRole(claims);
        const profile = await loadSessionProfile(isAstrologer, claims);

        if (cancelled) {
          return;
        }

        dispatch(
          restoreAuth({
            isLoggedIn: !!profile,
            user: profile
              ? {
                  ...profile,
                  roles: claims?.roles || profile?.roles,
                  authorities: claims?.authorities || profile?.authorities,
                }
              : null,
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
