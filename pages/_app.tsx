import "../styles.css";
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}




const App = ({ Component, pageProps }) => {
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return <>
    <PostHogProvider client={posthog}>
      <Component {...pageProps} />
    </PostHogProvider>
    <Head>
      <meta charSet="UTF-8" />
      <title>PL network events</title>
      <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1" />
      <meta name="description" content="A listing of all PL network events"></meta>
    </Head>
    <style jsx>
      {
        `
      body > div {width: 100%; height:100%;}


      `
      }
    </style>
  </>
};

export default App;
