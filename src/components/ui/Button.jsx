"use client";

import { Link } from "../../utils/navigation";
import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-teal-brand hover:bg-teal-dark text-white shadow-[0_8px_20px_-6px_rgba(0,168,150,0.5)]",
  navy: "bg-navy hover:bg-navy-800 text-white shadow-[0_8px_20px_-6px_rgba(11,37,69,0.45)]",
  outline: "bg-white border border-line text-navy hover:border-teal-brand hover:text-teal-dark",
  outlineLight: "bg-transparent border border-white/40 text-white hover:bg-white hover:text-navy",
  ghost: "bg-transparent text-navy hover:bg-navy-50",
  emerald: "bg-emerald-brand hover:bg-emerald-dark text-white",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-[52px] px-8 text-base",
};

export function Button({ variant = "primary", size = "md", className, to, href, onClick, children, type = "button", disabled, ...rest }) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold tracking-tight transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export function ArrowButton({ children, ...props }) {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}
