const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const CLIENT_API_BASE_URL = "/api/proxy";
const apiUrl = (path) =>
    `${
        typeof window === "undefined"
            ? API_BASE_URL.replace(/\/$/, "")
            : CLIENT_API_BASE_URL
    }/${path.replace(/^\//, "")}`;

export const config = {
    "registerClient": apiUrl("authorization/auth/create-user"),
    "getClientProfile": apiUrl("authorization/client/profile-me"),
    "updateClientProfile": apiUrl("authorization/client/update-profile-data"),
    "deleteClientProfile": apiUrl("authorization/client/delete-profile-data"),
    "getAstrologersList": apiUrl("authorization/info/get-all-astrologers"),
    "getAstrologerProfile": apiUrl("authorization/astrologer/profile-me"),
    "getAstrologerClients": apiUrl("authorization/astrologer/clients"),
}
