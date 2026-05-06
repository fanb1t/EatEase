import { ChefHat, ClipboardList, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminPage } from "./pages/AdminPage";
import { CustomerPage } from "./pages/CustomerPage";
import { KitchenPage } from "./pages/KitchenPage";
import { LocaleToggle } from "./components/LocaleToggle";
import type { Locale } from "./types";
import { t } from "./i18n/messages";

type Route =
  | { name: "customer"; tableSlug: string }
  | { name: "kitchen" }
  | { name: "admin" }
  | { name: "home" };

function readRoute(): Route {
  const path = window.location.pathname;
  const tableMatch = path.match(/^\/table\/([^/]+)$/);
  if (tableMatch) return { name: "customer", tableSlug: decodeURIComponent(tableMatch[1]) };
  if (path === "/kitchen") return { name: "kitchen" };
  if (path === "/admin") return { name: "admin" };
  return { name: "home" };
}

export function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem("eatease-locale") as Locale) || "th");

  useEffect(() => {
    const onPop = () => setRoute(readRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    localStorage.setItem("eatease-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const nav = useMemo(
    () => [
      { href: "/table/a1", label: "Table 1", icon: ClipboardList },
      { href: "/kitchen", label: t(locale, "kitchen"), icon: ChefHat },
      { href: "/admin", label: t(locale, "admin"), icon: Settings },
    ],
    [locale]
  );

  function navigate(href: string) {
    window.history.pushState(null, "", href);
    setRoute(readRoute());
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => navigate("/table/a1")} type="button">
          <ChefHat size={24} />
          <span>{t(locale, "appName")}</span>
        </button>
        <nav className="topnav" aria-label="Primary">
          {nav.map(({ href, label, icon: Icon }) => (
            <button className="icon-tab" key={href} onClick={() => navigate(href)} type="button" title={label}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <LocaleToggle locale={locale} onChange={setLocale} />
      </header>

      {route.name === "customer" && <CustomerPage locale={locale} tableSlug={route.tableSlug} />}
      {route.name === "kitchen" && <KitchenPage locale={locale} />}
      {route.name === "admin" && <AdminPage locale={locale} />}
      {route.name === "home" && <CustomerPage locale={locale} tableSlug="a1" />}
    </div>
  );
}
