import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Section } from "../section";
import { Content } from "../content"
import { minHeightOptions } from "../../schema/options"
import { backgroundSchema } from "../../schema/background"
import { navigationLabelSchema } from "../../schema/navigation-label";

export const EventTimeline = ({ data, events, parentField = "" }) => {
  const styles = data.style
  const padding = data.style?.padding
  const width = data.style?.fullWidth ? "" : "max-w-desktop-full mx-auto"
  const sortedEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  let labels = []

  return (
    <Section
      background={data.background}
      navigationLabel={data.navigationLabel}
    >
      <div className={`${width} ${padding} ${data.style?.minHeight}`}>
        <div className="relative max-w-desktop-full mx-auto border-l border-primary mb-10 ml-60">
          {sortedEvents && sortedEvents.map((event, index) => {
            const headline = event.website ? <a href={event.website} target="_blank">{event.eventName}</a> : event.eventName
            const startDate = new Date(event.startDate)
            const endDate = new Date(event.endDate)
            const startMonth = months[startDate?.getMonth()]
            const date = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            const hideMonthLabel = labels.includes(startMonth)
            if (!hideMonthLabel) {
              labels = [...labels, startMonth]
            }
            return (
              <div className={`mb-5 ml-4 ${!hideMonthLabel && index !== 0 &&  "mt-16"}`} key={index}>
                {(!hideMonthLabel &&
                  <div className="absolute -left-36 w-32 text-right">{startMonth}</div>
                )}
                <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5"></div>
                {date &&
                  <span className={`${styles.labelStyles}`} data-tinafield={`${parentField}.label`}>
                    {date}
                  </span>
                }
                {headline &&
                  <h2 className={`${styles.headlineStyles}`} data-tinafield={`${parentField}.headline`}>
                    {headline}
                  </h2>
                }
                {event.location &&
                  <h4 className={`${styles.subheadStyles}`} data-tinafield={`${parentField}.subhead`}>
                    {event.location}
                  </h4>
                }
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  );
};

export const eventTimelineBlockSchema: any = {
  label: "Event Timeline",
  name: "eventTimeline",
  fields: [
    {
      label: "Section Style",
      name: "style",
      type: "object",
      fields: [
        {
          label: "Full Width",
          name: "fullWidth",
          type: "boolean",
        },
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
          label: "Padding",
          name: "padding",
          type: "string",
          ui: {
            component: "paddingControl",
          }
        },
        {
          label: "Typography",
          name: "typographyTitle",
          type: "string",
          ui: {
            component: "ruledTitle",
          },
        },
        {
          type: "string",
          label: "Label",
          name: "labelStyles",
          ui: {
            component: "typeControl"
          }
        },
        {
          type: "string",
          label: "Headline",
          name: "headlineStyles",
          ui: {
            component: "typeControl"
          }
        },
        {
          type: "string",
          label: "Subhead",
          name: "subheadStyles",
          ui: {
            component: "typeControl"
          }
        },
        {
          type: "string",
          label: "Text",
          name: "textStyles",
          ui: {
            component: "typeControl"
          }
        }
      ],
    },
    backgroundSchema,
    navigationLabelSchema,
  ],
};