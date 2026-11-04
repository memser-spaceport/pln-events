const PROD_LABOS_ORIGIN = "https://os.pl.xyz";
const PROD_EVENTS_HOST = "events.plnetwork.io";
const DEV_LABOS_ORIGINS = ["https://directoryv2.dev.os.pl.xyz", "https://directory-local.dev.os.pl.xyz"];
const PREVIEW_HOST_SUFFIX = ".preview.dev.os.pl.xyz";

/**
 * LabOS origin that may serve `/ai-apps/bridge/v1.js` into an events embed.
 * The bridge obeys only the origin that served it, so the script must come
 * from the directory that framed this page. Production events accepts the
 * production directory, localhost, and `NEXT_PUBLIC_LABOS_ORIGINS` only.
 */
export function labosBridgeOrigin(referer: string | null | undefined, eventsHost?: string | null): string | null {
  const origin = originOf(referer);
  if (!origin) return null;
  if (origin === PROD_LABOS_ORIGIN || isLocalOrigin(origin) || configuredOrigins().includes(origin)) return origin;
  if (isProductionEventsHost(eventsHost)) return null;
  if (DEV_LABOS_ORIGINS.includes(origin) || isPreviewOrigin(origin)) return origin;
  return null;
}

export function labosBridgeScriptUrl(origin: string): string {
  return `${origin}/ai-apps/bridge/v1.js`;
}

function originOf(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

function isLocalOrigin(origin: string): boolean {
  const { hostname, protocol } = new URL(origin);
  if (protocol !== "http:" && protocol !== "https:") return false;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isPreviewOrigin(origin: string): boolean {
  const url = new URL(origin);
  return url.protocol === "https:" && url.hostname.endsWith(PREVIEW_HOST_SUFFIX);
}

function isProductionEventsHost(eventsHost: string | null | undefined): boolean {
  return hostnameOf(eventsHost) === PROD_EVENTS_HOST;
}

function hostnameOf(eventsHost: string | null | undefined): string {
  if (!eventsHost) return "";
  return eventsHost.split(":")[0].toLowerCase();
}

function configuredOrigins(): string[] {
  const raw = process.env.NEXT_PUBLIC_LABOS_ORIGINS ?? "";
  const origins: string[] = [];
  for (const part of raw.split(",")) {
    const origin = originOf(part.trim());
    if (origin) origins.push(origin);
  }
  return origins;
}
