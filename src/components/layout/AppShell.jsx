import { Outlet, useLocation } from "react-router";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";

export default function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen">
      {!isHome && <SiteHeader />}
      <Outlet key={location.pathname} />
      {!isHome && <SiteFooter />}
    </div>
  );
}
