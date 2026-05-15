import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const styles = {
  primary:
    "bg-ink text-paper shadow-[0_14px_34px_rgb(31_42_36_/_0.18)] hover:-translate-y-0.5 hover:bg-moss-dark",
  secondary:
    "soft-border bg-paper/70 text-ink hover:-translate-y-0.5 hover:border-moss/35 hover:bg-white/70",
};

export default function LinkButton({
  children,
  to,
  href,
  variant = "primary",
  showIcon = true,
}) {
  const className = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${styles[variant]}`;
  const content = (
    <>
      {children}
      {showIcon && <ArrowRight aria-hidden="true" size={17} strokeWidth={2} />}
    </>
  );

  if (href) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <Link className={className} to={to}>
      {content}
    </Link>
  );
}
