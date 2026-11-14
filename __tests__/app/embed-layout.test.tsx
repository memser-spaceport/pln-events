import { render, screen } from "@testing-library/react";
import { headers } from "next/headers";
import EmbedLayout from "@/app/embed/layout";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

const mockHeaders = headers as jest.Mock;

function setHeaders(values: Record<string, string | null>) {
  // Next 16: headers() is async.
  mockHeaders.mockResolvedValue({
    get: (name: string) => values[name] ?? null,
  });
}

describe("EmbedLayout", () => {
  it("serves the LabOS bridge when the directory framed this page", async () => {
    setHeaders({ referer: "https://os.pl.xyz/events", host: "events.plnetwork.io" });
    render(await EmbedLayout({ children: "calendar" }));
    const script = document.querySelector("script");
    expect(script?.getAttribute("src")).toBe("https://os.pl.xyz/ai-apps/bridge/v1.js");
    expect(script?.hasAttribute("defer")).toBe(true);
    expect(screen.getByText("calendar")).toBeInTheDocument();
  });

  it("does not load a script for an untrusted referer", async () => {
    setHeaders({ referer: "https://evil.example/events", host: "events.plnetwork.io" });
    render(await EmbedLayout({ children: "calendar" }));
    expect(document.querySelector("script")).toBeNull();
    expect(screen.getByText("calendar")).toBeInTheDocument();
  });
});
