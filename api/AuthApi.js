import api from "@/utils/api";

export async function clearServerSession() {
  await api
    .get("/authorization/auth/logout")
    .catch((error) => console.error("Failed to clear server session:", error));
}
