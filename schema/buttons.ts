export const buttonsSchema = {
  label: "Buttons",
  name: "buttons",
  type: "object",
  list: true,
  fields: [
    {
      label: "Label",
      name: "label",
      type: "string",
    },
    {
      label: "Link",
      name: "link",
      type: "string",
    },
    {
      label: "Type",
      name: "type",
      type: "string",
      ui: {
        component: "select",
      },
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Minor", value: "minor" },
      ],
    },
  ],
}
