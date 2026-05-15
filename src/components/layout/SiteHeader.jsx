import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { navigationItems } from "../../data/navigation.js";

function NavItems({ onNavigate }) {
  return navigationItems.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `rounded-full px-3.5 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-ink text-paper"
            : "text-ink-soft hover:bg-white/60 hover:text-ink"
        }`
      }
    >
      {item.label}
    </NavLink>
  ));
}

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <NavLink
          to="/"
          className="group flex items-center gap-3 rounded-full bg-paper/28 pr-3 text-sm font-semibold text-ink backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        >
          <span className="grid h-10 w-10 place-items-center rounded-[42%_58%_50%_50%] bg-ink text-paper shadow-[0_14px_34px_rgb(31_42_36_/_0.18)] transition group-hover:rotate-3">
            AR
          </span>
          <span className="hidden sm:block">Alex Russell</span>
        </NavLink>

        <div className="hidden items-center gap-1 rounded-full border border-line/70 bg-paper/44 p-1 shadow-[0_18px_65px_rgb(31_42_36_/_0.08)] backdrop-blur-xl lg:flex">
          <NavItems />
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-line/80 bg-paper/58 text-ink shadow-[0_14px_34px_rgb(31_42_36_/_0.12)] backdrop-blur-xl lg:hidden"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="mx-4 mb-4 grid gap-1 rounded-[1.5rem] border border-line/70 bg-paper/96 p-2 shadow-soft backdrop-blur-xl lg:hidden">
          <NavItems onNavigate={() => setIsOpen(false)} />
        </div>
      )}
    </header>
  );
}
