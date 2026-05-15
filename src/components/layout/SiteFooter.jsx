import { contactLinks } from "../../data/navigation.js";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-ink-soft sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>PortfolioV3, a static foundation for practical AI and full-stack work.</p>
        <div className="flex flex-wrap gap-4">
          {contactLinks.map((link) => (
            <a key={link.label} className="font-medium text-ink hover:text-clay" href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
