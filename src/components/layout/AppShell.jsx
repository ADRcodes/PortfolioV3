import { Outlet, useLocation } from "react-router";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";
import RouteScroll from "./RouteScroll.jsx";

export default function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen">
      <RouteScroll />
      {!isHome && <SiteHeader />}
      <Outlet key={location.pathname} />
      {!isHome && <SiteFooter />}
    </div>
  );
}
