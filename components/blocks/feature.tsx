import * as React from "react";
import { Section } from "../section";

import { minHeightOptions } from "../util/options"
import { backgroundSchema } from "../../.tina/schema/background"
import { navigationLabelSchema } from "../../.tina/schema/navigation-label";

export const Feature = ({ data, parentField = "" }) => {
  const padding = data.style?.padding
  const width = data.style?.fullWidth ? "" : "max-w-desktop-full mx-auto"

  return (
    <Section
      background={data.background}
      navigationLabel={data.navigationLabel}
    >
      <div className={`border ${width} ${padding} ${data.style?.minHeight}`}>
        <div dangerouslySetInnerHTML={{ __html: data.markup }}></div>
      </div>
    </Section>
  );
};

export const featureBlockSchema: any = {
  label: "Feature",
  name: "feature",
  fields: [
    {
      label: "Section Style",
      name: "style",
      type: "object",
      fields: [
        {
          label: "Minimum Height",
          name: "minHeight",
          type: "string",
          ui: {
            component: "selectField",
            mobileMode: true,
          },
          options: minHeightOptions,
        },
        {
          label: "Full Width",
          name: "fullWidth",
          type: "boolean",
        },
        {
          label: "Padding",
          name: "padding",
          type: "string",
          ui: {
            component: "paddingControl",
          }
        },
      ],
    },
    backgroundSchema,
    {
      label: "Html",
      name: "markup",
      description: "Any valid html, you can also use tailwind.",
      type: "string",
      ui: {
        component: "textarea"
      }
    },
    navigationLabelSchema,
  ],
};