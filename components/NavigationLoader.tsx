"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ZetaLoader } from "@/components/ZetaLoader";

export function NavigationLoader() {
  const pathname = usePathname();
  const search = useSearchParams();
  const route = `${pathname}?${search.toString()}`;
  const previousRoute = useRef(route);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const fallbackTimer = useRef<ReturnType<typeof setTimeout>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stop = () => { clearTimeout(showTimer.current); clearTimeout(fallbackTimer.current); setLoading(false); };
    const start = () => {
      clearTimeout(showTimer.current);
      clearTimeout(fallbackTimer.current);
      showTimer.current = setTimeout(() => setLoading(true), 150);
      fallbackTimer.current = setTimeout(stop, 15000);
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const element = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(element instanceof HTMLAnchorElement) || element.hasAttribute("download") || (element.target && element.target !== "_self")) return;
      const url = new URL(element.href, window.location.href);
      if (url.origin !== window.location.origin || (url.pathname === window.location.pathname && url.search === window.location.search)) return;
      start();
    };
    const onPopState = () => {
      const nextRoute = `${window.location.pathname}?${new URLSearchParams(window.location.search).toString()}`;
      if (nextRoute !== previousRoute.current) start();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => { document.removeEventListener("click", onClick); window.removeEventListener("popstate", onPopState); clearTimeout(showTimer.current); clearTimeout(fallbackTimer.current); };
  }, []);

  useEffect(() => {
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    clearTimeout(showTimer.current);
    clearTimeout(fallbackTimer.current);
    setLoading(false);
  }, [route]);

  return <ZetaLoader active={loading} />;
}
