import { labosBridgeOrigin, labosBridgeScriptUrl } from "@/utils/labos-origin";

const PROD_EVENTS = "events.plnetwork.io";
const DEV_EVENTS = "pln-events-dev.vercel.app";

describe("labosBridgeOrigin", () => {
  const previous = process.env.NEXT_PUBLIC_LABOS_ORIGINS;

  afterEach(() => {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_LABOS_ORIGINS;
    else process.env.NEXT_PUBLIC_LABOS_ORIGINS = previous;
  });

  it("trusts the production directory from a full referer", () => {
    expect(labosBridgeOrigin("https://os.pl.xyz/events?embedPath=%2Fembed%2Fmap%2F", PROD_EVENTS)).toBe(
      "https://os.pl.xyz"
    );
  });

  it("trusts localhost even when events is production", () => {
    expect(labosBridgeOrigin("http://localhost:3000/events", PROD_EVENTS)).toBe("http://localhost:3000");
  });

  it("does not trust a dev or preview directory on production events", () => {
    expect(labosBridgeOrigin("https://directoryv2.dev.os.pl.xyz/events", PROD_EVENTS)).toBeNull();
    expect(labosBridgeOrigin("https://pr-12.preview.dev.os.pl.xyz/events", PROD_EVENTS)).toBeNull();
    expect(labosBridgeOrigin("https://os.pl.xyz.evil.com/events", PROD_EVENTS)).toBeNull();
    expect(labosBridgeOrigin("http://os.pl.xyz/events", PROD_EVENTS)).toBeNull();
  });

  it("trusts the dev directory and a PR preview on non-production events", () => {
    expect(labosBridgeOrigin("https://directoryv2.dev.os.pl.xyz/events", DEV_EVENTS)).toBe(
      "https://directoryv2.dev.os.pl.xyz"
    );
    expect(labosBridgeOrigin("https://directory-local.dev.os.pl.xyz/", DEV_EVENTS)).toBe(
      "https://directory-local.dev.os.pl.xyz"
    );
    expect(labosBridgeOrigin("https://pr-4.preview.dev.os.pl.xyz/events", DEV_EVENTS)).toBe(
      "https://pr-4.preview.dev.os.pl.xyz"
    );
  });

  it("trusts an origin from NEXT_PUBLIC_LABOS_ORIGINS on production events", () => {
    process.env.NEXT_PUBLIC_LABOS_ORIGINS = "https://pr-9.preview.dev.os.pl.xyz, not a url";
    expect(labosBridgeOrigin("https://pr-9.preview.dev.os.pl.xyz/events", PROD_EVENTS)).toBe(
      "https://pr-9.preview.dev.os.pl.xyz"
    );
  });

  it("returns nothing when the referer is missing", () => {
    expect(labosBridgeOrigin(null, DEV_EVENTS)).toBeNull();
    expect(labosBridgeOrigin("", DEV_EVENTS)).toBeNull();
  });
});

describe("labosBridgeScriptUrl", () => {
  it("points at the LabOS bridge script", () => {
    expect(labosBridgeScriptUrl("https://os.pl.xyz")).toBe("https://os.pl.xyz/ai-apps/bridge/v1.js");
  });
});
