import "../styles.css";
import React, { useEffect } from "react";
import Router from "next/router";
import * as Fathom from "fathom-client";
import Head from "next/head";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  // For the first page load
  Fathom.trackPageview();
  // Subsequent route changes
  Router.events.on("routeChangeComplete", (as, routeProps) => {
    if (!routeProps.shallow) {
      Fathom.trackPageview();
    }
  });
}

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

const App = ({ Component, pageProps }) => {
  // Initialize Fathom when the app loads
  useEffect(() => {
    Fathom.load("RBFTFNYG", {
      includedDomains: ["events.plnetwork.io"],
    });
  }, []);

  return (
    <>
      <PostHogProvider client={posthog}>
        <Component {...pageProps} />
      </PostHogProvider>
      <Head>
        <meta charSet="UTF-8" />
        <title>PL Network Events</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1,maximum-scale=1"
        />
        <meta
          name="description"
          content="A listing of all PL Network events"
        ></meta>
      </Head>
      <style jsx>
        {`
          body > div {
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </>
  );
};

export default App;
