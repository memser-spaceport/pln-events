import AppHeader from "@/components/core/app-header";
import { PHProvider } from "@/components/core/posthog-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./globals.css";
import StyledJsxRegistry from "./registry";
import AnnouncementBanner from "@/components/core/announcement-banner";
import { getBannerData } from "@/service/events.service";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PL Events",
  description: "Explore and connect with the teams across the ecosystem",
  openGraph: {
    title: "PL Events",
    description:
      "Explore and connect with the teams across the ecosystem",
    images: [
      {
        url: "https://plabs-assets.s3.us-west-1.amazonaws.com/EdgeCity-Thumbnail.jpg",
        width: 1200,
        height: 600,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bannerData = await getBannerData();
  return (
    <html lang="en">
      <body className={`${inter.className} applayout`}>
        <PHProvider>
          <StyledJsxRegistry>
            <header className="applayout__header">
              {/* <AnnouncementBanner bannerData={bannerData?.data} /> */}
              <AppHeader />
            </header>
            <main className="applayout__main">{children}</main>
          </StyledJsxRegistry>
        </PHProvider>
      </body>
    </html>
  );
}
