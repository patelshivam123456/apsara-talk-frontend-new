"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  canAccessRoute,
  getPrimaryDashboardRoute,
  getUserRoles,
} from "@/utils/roleAccess";
import { getStoredRoles } from "@/utils/tokenStore";

export default function RoleRouteGuard() {
  const router = useRouter();
  const { isLoggedIn, isAuthLoaded, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthLoaded || !isLoggedIn) {
      return;
    }

    const roles = [
      ...new Set([
        ...getUserRoles(user),
        ...getStoredRoles(),
      ]),
    ];

    if (!canAccessRoute(router.pathname, roles)) {
      router.replace(getPrimaryDashboardRoute(roles));
    }
  }, [isAuthLoaded, isLoggedIn, router, user]);

  return null;
}
