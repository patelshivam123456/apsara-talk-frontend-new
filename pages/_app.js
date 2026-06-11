import "@/styles/globals.css";

import { Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

import AuthLoader from "@/components/AuthLoader";
import RoleRouteGuard from "@/components/RoleRouteGuard";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={poppins.variable} style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
      <Provider store={store}>
        <AppProvider>
          <LanguageProvider>
            <ThemeProvider>

            {/* Restore auth from the cookie-backed server session */}
            <AuthLoader />
            <RoleRouteGuard />
            <LanguageSwitcher />

            <Component {...pageProps} />

            </ThemeProvider>
          </LanguageProvider>
        </AppProvider>
      </Provider>
    </div>
  );
}
