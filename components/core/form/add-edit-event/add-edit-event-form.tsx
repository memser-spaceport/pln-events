"use client";
import { useState } from "react";
import ContactDetails from "./contact-detail";
import EventDetails from "./event-details";
import HostDetails from "./host-details";
import RegistrationDetails from "./registrationDetails";

const AddEditEventForm = (props: any) => {
  const formData = props?.formData;

  const title = props?.title ?? "Submit an Event";
  const from = props?.from;
  const [errorSections, setErrorSections]: any = useState([]);
  const mainEvents = [
    {
      title: "welcome to magic show",
    },
    {
      title: "welcome to magic show1",
    },
    {
      title: "welcome to magic show2",
    },
    {
      title: "welcome to magic show3",
    },
    {
      title: "welcome to magic show4",
    },
    {
      title: "welcome to magic show5",
    },
    {
      title: "welcome to magic show6",
    },
    {
      title: "welcome to magic show7",
    },
    {
      title: "welcome to magic show8",
    },
    {
      title: "welcome to magic sho9",
    },
    {
      title: "welcome to magic show10",
    },
  ];

  const onFormSubmit = (event: any) => {
    event.preventDefault();
    const formData: any = new FormData(event.target);
    let allErrorSections = [...errorSections];

    let formValues = {};

    const contactDetails: any = [];
    let contact: any = {};

    formData.forEach((value: string, key: string) => {
      if (key === "contactName") {
        if (value === "") {
          allErrorSections = [...allErrorSections, "ContactDetails"];
        }
        contact.contactName = value;
      } else if (key === "contactEmail") {
        if (value.trim() === "") {
          allErrorSections = [...allErrorSections, "ContactDetails"];
        }
        contact.contactEmail = value;
        contactDetails.push(contact);
        contact = {};
      }
    });

    const isPartOfMainEvent = formData.get("isPartOfMainEvent") === "on";
    const mainEventName = formData.get("mainEventName");
    const eventName = formData.get("eventName");
    const eventDescription = formData.get("eventDescription");

    if (isPartOfMainEvent) {
      if (mainEventName === "Select Main Event") {
        allErrorSections = [...allErrorSections, "eventDetails", "mainEvent"];
      } else {
        allErrorSections = [...allErrorSections].filter(
          (section: string) => section !== "eventDetails" && section !== "mainEvent"
        );
      }
    }

    if (!eventName.trim()) {
      allErrorSections = [...allErrorSections, "eventName", "eventDetails"];
    } else {
      allErrorSections = [...allErrorSections].filter(
        (section: any) => section !== "eventName" && section !== "eventDetails"
      );
    }

    if (!eventDescription.trim()) {
      allErrorSections = [
        ...allErrorSections,
        "eventDescription",
        "eventDetails",
      ];
    } else {
        allErrorSections = [...allErrorSections].filter(
            (section: any) => section !== "eventDescription" && section !== "eventDetails"
          );
    }

    console.log(allErrorSections)
    if (allErrorSections.length > 0) {
      setErrorSections(allErrorSections);
      return;
    }

    formValues = {
      ...formValues,
      contactDetails,
      isPartOfMainEvent: isPartOfMainEvent,
      mainEventName: mainEventName,
      eventDescription: eventDescription,
    };

    console.log(formValues);
  };

  return (
    <>
      <div className="efc">
        <form
          id="event-form"
          name="Event Form"
          onSubmit={onFormSubmit}
          className="efc__ef"
        >
          <h1>{title}</h1>
          <div className="efc__ef__sections">
            <ContactDetails formData={formData} errorSections={errorSections} />
            <EventDetails
              formData={formData}
              mainEvents={mainEvents}
              errorSections={errorSections}
            />
            <HostDetails formData={formData} />
            <RegistrationDetails formData={formData} />
          </div>

          <button type="submit"> onSubmit</button>
        </form>

        <style jsx>
          {`
            .efc {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
            }

            .efc__ef__sections {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            @media (min-width: 1200px) {
              .efc__ef {
                width: 640px;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default AddEditEventForm;
