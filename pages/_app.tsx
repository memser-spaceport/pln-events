import "../styles.css";
import React, { useEffect } from 'react';
import Router from 'next/router';
import * as Fathom from 'fathom-client';
import Head from 'next/head'
import "react-responsive-carousel/lib/styles/carousel.min.css";

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  // For the first page load
  Fathom.trackPageview()
  // Subsequent route changes
  Router.events.on('routeChangeComplete', (as, routeProps) => {
    if (!routeProps.shallow) {
      Fathom.trackPageview()
    }
  });
}

const App = ({ Component, pageProps }) => {
  // Initialize Fathom when the app loads
  useEffect(() => {
    Fathom.load('RBFTFNYG', {
      includedDomains: ['events.plnetwork.io']
    })
  }, [])

  return <>
    <Component {...pageProps} />
    <Head>
      <meta charSet="UTF-8" />
      <title>PL Network Events</title>
      <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1" />
      <meta name="description" content="A listing of all PL Network events"></meta>
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
