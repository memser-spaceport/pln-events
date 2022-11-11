import React from "react";
import Head from "next/head";
import { Header } from "./header";
import { Footer } from "./footer";
import layoutData from "../../content/global/index.json";
import { Theme } from "./theme";

export const Layout = ({ rawData, data = layoutData, children }) => {
  const global = rawData.global

  return (
    <>
      <Theme data={data?.theme}>
        <Head>
          <title>Tina Page Title</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          {data.theme.font === "nunito" && (
            <>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link
                href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;0,800;1,400;1,700;1,800&display=swap"
                rel="stylesheet"
              />
            </>
          )}
          {data.theme.font === "lato" && (
            <>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link
                href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"
                rel="stylesheet"
              />
            </>
          )}

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
          className={`min-h-screen flex flex-col ${
            data.theme.font === "nunito" && "font-nunito"
          } ${data.theme.font === "lato" && "font-lato"} ${
            data.theme.font === "sans" && "font-sans"
          }`}
        >
          <Header data={data?.header} />
          <div className={`min-h-screen flex flex-col`}>
            {children}
          </div>
          <Footer
            rawData={rawData}
            data={data?.footer}
            icon={data?.header.icon}
          />
        </div>
      </Theme>
    </>
  );
};
