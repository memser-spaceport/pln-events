import React from "react";
import Head from "next/head";
import { Header } from "./header";
import { Footer } from "./footer";
import layoutData from "../../content/global/index.json";

export const Layout = ({ rawData, data = layoutData, children }) => {
  const global = rawData.global

  return (
    <>    
      <Head>
        <title>Tina Page Title</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <style
          id="customProperties"
          // There is logic in the TypeControl component that figures out the custom property
          // names to populate the font option labels.
          // The typecontrol component should be revised with more direct access to data in 
          // the future and then this comment should be removed.
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --site-width: ${global?.desktopWidth}px;
              --edge-width: calc((100% - var(--site-width)) / 2);
              --background-color: ${global?.backgroundColor};
              --primary-color: ${global?.colors?.primary};
              --accent1-color: ${global?.colors?.accent1};
              --accent2-color: ${global?.colors?.accent2};
              --accent3-color: ${global?.colors?.accent3};
              --accent4-color: ${global?.colors?.accent4};
              --white-color: ${global?.colors?.white};
              --black-color: ${global?.colors?.black};
              --gray-light-color: ${global?.colors?.grayLight};
              --gray-color: ${global?.colors?.gray};
              --gray-dark-color: ${global?.colors?.grayDark};              
              --link-color: ${global?.links?.color};              
            }
            html {
              background-color: var(--${global?.backgroundColor}-color);
              scroll-behavior: smooth;
            }
            .markdown a:not(.button) {
              color: var(--${global?.links?.color}-color);
            }
            .markdown ul {
              list-style: disc;
              margin-left: 1.5rem;
            }
            .markdown ul li,
            .markdown ol li {
              margin-bottom: .5rem;
            }
            .markdown a {
              text-decoration: underline;
            }
          `,
          }}
        />

      </Head>
      <div
        className={`min-h-screen flex flex-col`}
      >
        <Header data={data?.header} />
        <div className={`min-h-screen flex flex-col`}>
          {children}
        </div>
      </div>
    </>
  );
};
