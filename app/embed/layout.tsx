import type { ReactNode } from "react";
import { headers } from "next/headers";
import { labosBridgeOrigin, labosBridgeScriptUrl } from "@/utils/labos-origin";

/**
 * The bridge script must be in the server HTML. It reads `document.currentScript`
 * and trusts only the LabOS origin that served the file. A script inserted later
 * has no `currentScript`, so it would not start.
 */
export default function EmbedLayout({ children }: { children: ReactNode }) {
  const requestHeaders = headers();
  const origin = labosBridgeOrigin(requestHeaders.get("referer"), requestHeaders.get("host"));

  return (
    <>
      {origin ? <script src={labosBridgeScriptUrl(origin)} defer /> : null}
      {children}
    </>
  );
}
