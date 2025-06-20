import AppHeader from "@/components/core/app-header";
import { PHProvider } from "@/components/core/posthog-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./globals.css";
import StyledJsxRegistry from "./registry";
import AnnouncementBanner from "@/components/core/announcement-banner";
import { getBannerData } from "@/service/events.service";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

// TODO: Replace with your actual S3 bucket URL
const S3_THEME_URL = 'https://plabs-assets.s3.us-west-1.amazonaws.com/theme.css'

export const metadata: Metadata = {
  title: "PL Events",
  description: "Explore and connect with the teams across the ecosystem",
  openGraph: {
    title: "PL Events",
    description: "Explore and connect with the teams across the ecosystem",
    images: [
      {
        url: "https://plabs-assets.s3.us-west-1.amazonaws.com/plevents-socialThumbnail.jpg",
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
  const headersList = headers();
  const shouldHideHeader = headersList.get("x-hide-header") === "true";
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={S3_THEME_URL} />
      </head>
      <body className={`${inter.className} applayout`}>
        <PHProvider>
          <StyledJsxRegistry>
            <header className="applayout__header">
              {/* <AnnouncementBanner bannerData={bannerData?.data} /> */}
              {!shouldHideHeader && <AppHeader />}
            </header>
            <main className="applayout__main">{children}</main>
          </StyledJsxRegistry>
        </PHProvider>
      </body>
    </html>
  );
}
