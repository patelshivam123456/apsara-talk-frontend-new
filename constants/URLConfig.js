export const config = {
    "loginClient":process.env.NEXT_PUBLIC_APP_API_IP_URL+"authorization/auth/login",
    "registerClient":process.env.NEXT_PUBLIC_APP_API_IP_URL+"authorization/auth/create-user",
    "getClientProfile":process.env.NEXT_PUBLIC_APP_API_IP_URL+"authorization/client/profile-me",
    "updateClientProfile":process.env.NEXT_PUBLIC_APP_API_IP_URL+"authorization/client/update-profile-data",
    "deleteClientProfile":process.env.NEXT_PUBLIC_APP_API_IP_URL+"authorization/client/delete-profile-data",
    "getAstrologersList":process.env.NEXT_PUBLIC_APP_API_IP_URL+"authorization/info/get-all-astrologers",
}