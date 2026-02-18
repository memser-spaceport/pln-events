"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const PLN_EMBED_URL_MESSAGE = "pln-embed-url";

export function EmbedUrlSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hash, setHash] = useState(
    typeof window === "undefined" ? "" : window?.location?.hash
  );

  useEffect(() => {
    if (!pathname?.startsWith("/embed")) return;

    const interval = setInterval(() => {
      if (window?.location?.hash !== hash) {
        setHash(window?.location?.hash || "");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname?.startsWith("/embed")) return;

    const search = searchParams?.toString()
      ? `?${searchParams.toString()}`
      : "";
    const url = `${pathname}${search}${hash}`;

    window.parent.postMessage({ type: PLN_EMBED_URL_MESSAGE, url }, "*");
  }, [pathname, searchParams?.toString(), hash]);

  return null;
}
