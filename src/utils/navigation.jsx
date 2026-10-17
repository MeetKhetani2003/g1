"use client";

import NextLink from "next/link";
import {
  usePathname,
  useRouter,
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { forwardRef, Suspense } from "react";

export const Link = forwardRef(function Link({ to, href, children, ...props }, ref) {
  const target = href || to || "#";
  return (
    <NextLink ref={ref} href={target} {...props}>
      {children}
    </NextLink>
  );
});

export const NavLink = forwardRef(function NavLink({ to, href, className, children, ...props }, ref) {
  const pathname = usePathname();
  const target = href || to || "#";
  const isActive = pathname === target || (target !== "/" && pathname?.startsWith(target));
  const computedClass = typeof className === "function" ? className({ isActive }) : className;

  return (
    <NextLink ref={ref} href={target} className={computedClass} {...props}>
      {children}
    </NextLink>
  );
});

export function useNavigate() {
  const router = useRouter();
  return (path) => {
    if (path === -1) {
      if (typeof window !== "undefined") {
        window.history.back();
      }
    } else {
      router.push(path);
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  return {
    pathname: pathname || "/",
    search: typeof window !== "undefined" ? window.location.search : "",
    hash: typeof window !== "undefined" ? window.location.hash : "",
    state: null,
  };
}

export function useParams() {
  return useNextParams() || {};
}

export function useSearchParams() {
  let searchParams;
  try {
    searchParams = useNextSearchParams();
  } catch {
    searchParams = null;
  }
  const router = useRouter();
  const pathname = usePathname();

  const setParams = (next, options) => {
    const qs = next?.toString() || "";
    const url = qs ? `${pathname}?${qs}` : pathname;
    if (typeof window !== "undefined") {
      if (options?.replace) {
        window.history.replaceState(null, "", url);
      } else {
        router.push(url);
      }
    }
  };

  const paramsObject = searchParams || (typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams());

  return [paramsObject, setParams];
}

export default Link;
