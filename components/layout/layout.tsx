import React from "react";
import Head from "next/head";
import { Header } from "./header";
import { Footer } from "./footer";
import layoutData from "../../content/global/index.json";

const systemFonts = ['Arial','Courier','Geneva','Georgia', 'Helvetica','Impact','Lucida Console','Lucida Grande','Monaco','Palatino','Tahoma','Times New Roman','Verdana']
const customFonts = ['Suisse Intl']

const googleFontsLink = (fonts) => {
  const uniqueFontList = fonts
  const googleFontList = uniqueFontList.filter(item => !systemFonts.includes(item)).filter(item => !customFonts.includes(item))
  const formattedFontList = googleFontList.map(item => item.split(' ').join('+'))
  const familyString = formattedFontList.join('&family=')
  const fontLink = `https://fonts.googleapis.com/css2?family=${familyString}&display=swap`
  return uniqueFontList.length > 0 ?  fontLink : ''
}

export const Layout = ({ rawData, data = layoutData, children }) => {
  const global = rawData.global
  const headlineXs = JSON.parse(global?.typography?.headlineXs) || {}
  const headlineSm = JSON.parse(global?.typography?.headlineSm) || {}
  const headlineMd = JSON.parse(global?.typography?.headlineMd) || {}
  const headlineLg = JSON.parse(global?.typography?.headlineLg) || {}
  const headlineXl = JSON.parse(global?.typography?.headlineXl) || {}
  const bodyXs = JSON.parse(global?.typography?.bodyXs) || {}
  const bodySm = JSON.parse(global?.typography?.bodySm) || {}
  const bodyMd = JSON.parse(global?.typography?.bodyMd) || {}
  const bodyLg = JSON.parse(global?.typography?.bodyLg) || {}
  const bodyXl = JSON.parse(global?.typography?.bodyXl) || {}
  const typeStyles = ["headlineXs", "headlineSm", "headlineMd", "headlineLg", "headlineXl"]
  const fontFamilies = typeStyles.map(type => getFontFamily(type))
  const uniqueFontFamilies =  unique(fontFamilies);


  function unique(list) {
    return list.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
  }

  function getFontFamily(type:string) {
    const jsonString = global.typography[type]
    if (jsonString) {
      const fontObject = JSON.parse(jsonString)
      return fontObject.family || ""
    } else {
      return ""
    }
  }

  function stripFontWeight(fontName) {
    const parts = fontName.split(":wght")
    return parts[0]
  }

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
            .mg-headline-xs {
              font-family: "${stripFontWeight(headlineXs.family)}";
              font-size: ${headlineXs.size}px;
              line-height: ${headlineXs.lineHeight}px;
              letter-spacing: ${headlineXs.letterSpacing}px;
              margin-bottom: ${headlineXs.margin}px;
            }
            .mg-headline-sm {
              font-family: "${stripFontWeight(headlineSm.family)}";
              font-size: ${headlineSm.size}px;
              line-height: ${headlineSm.lineHeight}px;
              letter-spacing: ${headlineSm.letterSpacing}px;
              margin-bottom: ${headlineSm.margin}px;
            }
            .mg-headline-md {
              font-family: "${stripFontWeight(headlineMd.family)}";
              font-size: ${headlineMd.size}px;
              line-height: ${headlineMd.lineHeight}px;
              letter-spacing: ${headlineMd.letterSpacing}px;
              margin-bottom: ${headlineMd.margin}px;
            }
            .mg-headline-lg {
              font-family: "${stripFontWeight(headlineLg.family)}";
              font-size: ${headlineLg.size}px;
              line-height: ${headlineLg.lineHeight}px;
              letter-spacing: ${headlineLg.letterSpacing}px;
              margin-bottom: ${headlineLg.margin}px;
            }
            .mg-headline-xl {
              font-family: "${stripFontWeight(headlineXl.family)}";
              font-size: ${headlineXl.size}px;
              line-height: ${headlineXl.lineHeight}px;
              letter-spacing: ${headlineXl.letterSpacing}px;
              margin-bottom: ${headlineXl.margin}px;
            }
            .mg-body-xs {
              font-family: "${stripFontWeight(bodyXs.family)}";
              font-size: ${bodyXs.size}px;
              line-height: ${bodyXs.lineHeight}px;
              letter-spacing: ${bodyXs.letterSpacing}px;
              margin-bottom: ${bodyXs.margin}px;
            }
            .mg-body-sm {
              font-family: "${stripFontWeight(bodySm.family)}";
              font-size: ${bodySm.size}px;
              line-height: ${bodySm.lineHeight}px;
              letter-spacing: ${bodySm.letterSpacing}px;
              margin-bottom: ${bodySm.margin}px;
            }
            .mg-body-md {
              font-family: "${stripFontWeight(bodyMd.family)}";
              font-size: ${bodyMd.size}px;
              line-height: ${bodyMd.lineHeight}px;
              letter-spacing: ${bodyMd.letterSpacing}px;
              margin-bottom: ${bodyMd.margin}px;
            }
            .mg-body-lg {
              font-family: "${stripFontWeight(bodyLg.family)}";
              font-size: ${bodyLg.size}px;
              line-height: ${bodyLg.lineHeight}px;
              letter-spacing: ${bodyLg.letterSpacing}px;
              margin-bottom: ${bodyLg.margin}px;
            }
            .mg-body-xl {
              font-family: "${stripFontWeight(bodyXl.family)}";
              font-size: ${bodyXl.size}px;
              line-height: ${bodyXl.lineHeight}px;
              letter-spacing: ${bodyXl.letterSpacing}px;
              margin-bottom: ${bodyXl.margin}px;
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
        {/* Google Fonts */ }
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        {googleFontsLink(uniqueFontFamilies) && (
          <link href={googleFontsLink(uniqueFontFamilies)} rel="stylesheet"></link>
        )}
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
