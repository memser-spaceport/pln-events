// Blocks
import { featureBlockSchema } from "../../components/blocks/feature";
import { cardsBlockSchema } from "../../components/blocks/cards";
import { embedBlockSchema } from "../../components/blocks/embed";
import { tailwindFeatureBlockSchema } from "../../components/blocks/tailwind-feature"
import { tailwindCardsBlockSchema } from "../../components/blocks/tailwind-cards"

import { colorOptions, roundedOptions } from "../options";

export const globalCollectionSchema: any = {
  label: "Global",
  name: "global",
  path: "content/global",
  format: "json",
  ui: {
    global: true,
  },
  fields: [
    {
      type: "string",
      label: "Site Url",
      name: "siteUrl",
    },
    {
      type: "string",
      label: "Google Tag Manager ID",
      name: "gtmId",
    },
    {
      type: "image",
      label: "Favicon",
      name: "favicon",
      description: "Should be a 48x48px png",
    },
    {
      type: "string",
      label: "Desktop Width",
      name: "desktopWidth",
    },
    {
      type: "string",
      label: "Background Color",
      name: "backgroundColor",
      ui: {
        component: "colorControl",
      },
      options: colorOptions,
    },
    {
      label: "",
      name: "rule",
      type: "string",
      ui: {
        component: "ruledTitle",
      },
    },    
    {
      type: "string",
      label: "Link Color",
      name: "linkColor",
      ui: {
        component: "colorControl",
      },
      options: colorOptions,
    },
    {
      type: "object",
      label: "Typography",
      name: "typography",
      fields: [
        {
          type: "string",
          label: "XS Headline",
          name: "headlineXs",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "SM Headline",
          name: "headlineSm",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "MD Headline",
          name: "headlineMd",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "LG Headline",
          name: "headlineLg",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "XL Headline",
          name: "headlineXl",
          ui: {
            component: "typographyControl",
          },
        },
        {
          label: "",
          name: "rule",
          type: "string",
          ui: {
            component: "ruledTitle",
          },
        },
        {
          type: "string",
          label: "XS Body",
          name: "bodyXs",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "SM Body",
          name: "bodySm",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "MD Body",
          name: "bodyMd",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "LG Body",
          name: "bodyLg",
          ui: {
            component: "typographyControl",
          },
        },
        {
          type: "string",
          label: "XL Body",
          name: "bodyXl",
          ui: {
            component: "typographyControl",
          },
        },
      ]
    },
    {
      type: "object",
      label: "Colors",
      name: "colors",
      fields: [
        {
          type: "string",
          label: "Primary",
          name: "primary",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Accent 1",
          name: "accent1",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Accent 2",
          name: "accent2",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Accent 3",
          name: "accent3",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Accent 4",
          name: "accent4",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "White",
          name: "white",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Gray Light",
          name: "grayLight",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Gray",
          name: "gray",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Gray Dark",
          name: "grayDark",
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          label: "Black",
          name: "black",
          ui: {
            component: "color",
          },
        },
      ]
    },
    {
      type: "object",
      label: "Buttons",
      name: "buttons",
      list: true,
      ui: {
        component: "itemListField"
      },
      fields: [
        {
          label: "Label",
          name: "label",
          type: "string",
        },
        {
          label: "Fill",
          name: "fill",
          type: "string",
          ui: {
            component: "fillControl",
          },
        },
        {
          label: "Typography",
          name: "typography",
          type: "string",
          ui: {
            component: "buttonTypographyControl",
          },
        },
        {
          label: "Padding",
          name: "padding",
          type: "string",
          ui: {
            component: "paddingControl",
          }
        },
        {
          label: "Border",
          name: "primaryBorder",
          type: "string",
          ui: {
            component: "borderControl",
          },
        },
        {
          label: "Rounded",
          name: "primaryRounded",
          type: "string",
          ui: {
            component: "selectField",
          },
          options: roundedOptions,
        },
      ]
    },
    {
      type: "object",
      label: "Logo",
      name: "logo",
      fields: [
        {
          type: "string",
          label: "Logo Type",
          name: "logoType",
          description: "Only visible if there is no image."
        },
        {
          type: "string",
          label: "Logo Type Style",
          name: "logoTypeStyle",
          ui: {
            component: "typeControl"
          }
        },
        {
          type: "image",
          label: "Logo Image",
          name: "image",
        },
        {
          type: "string",
          label: "Logo Width",
          name: "imageWidth",
        },
        {
          type: "string",
          label: "Logo Height",
          name: "imageHeight",
        },
        {
          type: "string",
          label: "Logo Margin",
          description: "Space between logo and nav",
          name: "imageMargin",
        },
      ]
    },          
    {
      type: "object",
      label: "Header",
      name: "nav",
      fields: [
        {
          label: "Navigation",
          description: "Additional links in the header",
          name: "navItems",
          list: true,
          type: "object",
          ui: {
            component: "itemListField",
            defaultItem: {
              label: "Nav Item",
              link: "/",
            },
          },
          fields: [
            {
            label: "Label",
            name: "label",
            type: "string"
            }, {
              label: "Link",
              name: "link",
              description: "Items with Sub Navigation will ignore this link",
              type: "string",
            }, {
              label: "Sub Navigation",
              description: "Links below the main nav item",
              name: "subNavItems",
              list: true,
              type: "object",
              ui: {
                component: "itemListField",
                defaultItem: {
                  label: "Sub Nav Item",
                  link: "/",
                },
              },
              fields: [
                {
                  label: "Label",
                  name: "label",
                  type: "string"
                }, {
                  label: "Link",
                  name: "link",
                  type: "string",
                }
              ]
            }
          ]
        },
        {
          label: "Alignment",
          name: "navAlignment",
          type: "string",
          ui: {
            component: "select",
          },
          options: [
            { label: "Left", value: "text-left" },
            { label: "Center", value: "text-center" },
            { label: "Right", value: "text-right" },
          ],
        },
        {
          type: "string",
          label: "Navigation Style",
          name: "navTypeStyle",
          ui: {
            component: "typeControl"
          }
        },
        {
          label: "Mobile Background Color",
          name: "navBackgroundColor",
          type: "string",
          ui: {
            component: "fillControl"
          }
        },
        {
          label: "Header Padding",
          name: "padding",
          type: "string",
          ui: {
            component: "paddingControl",
          }
        },
      ]
    },          
    {
      type: "object",
      list: true,
      label: "Footer",
      name: "blocks",
      templates: [
        cardsBlockSchema,
        embedBlockSchema,
        featureBlockSchema,
        tailwindFeatureBlockSchema,
        tailwindCardsBlockSchema,
      ],
    }
    ,
  ],
}