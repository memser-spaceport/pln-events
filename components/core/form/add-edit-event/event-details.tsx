import FormToogle from "@/components/core/form/form-toogle";
import FormDropdown from "../form-dropdown";
import { useState } from "react";

const EventDetails = (props: any) => {
  const formData = props?.formData;
  const mainEvents = props?.mainEvents ?? [];
  const errorSections = props?.errorSections;
  const isPartOfMainEvent = formData?.isPartOfMainEvent ?? false;
  const mainEventName = formData?.mainEventName;

  const [isMainEventDropdown, setIsMainEventDropdown] =
    useState(isPartOfMainEvent);

  const isPartOfMainEventClickHandler = (status: boolean) => {
    setIsMainEventDropdown(status);
  };

  return (
    <>
      <div
        className={`evd ${
          errorSections.includes("eventDetails") ? "error" : ""
        }`}
      >
        <h2>Event Details</h2>
        Is this event part of main event
        <FormToogle
          callback={isPartOfMainEventClickHandler}
          name="isPartOfMainEvent"
          activeItem={isPartOfMainEvent}
        />
        {isMainEventDropdown && (
          <div>
            <FormDropdown
              placeholder="Select Main Event"
              selectedValue={mainEventName}
              name={"mainEventName"}
              options={mainEvents}
              isError={errorSections.includes('mainEvent')}
            />
          </div>
        )}

        {/* Event Name */}
        <div className="evd__evnc">
          <label>Event Name*</label>
          <input
            name="eventName"
            className={`${errorSections.includes("eventName")  ? "error" : ""}`}
          ></input>
        </div>

        {/* Event description */}
        <div className="evd__evdesc">
          <label>Event Description*</label>
          <textarea
            name="eventDescription"
            className={`${errorSections.includes("eventDescription") ? "error" : ""}`}
          ></textarea>

        </div>

        {/*  */}
      </div>

      <style jsx>
        {`
          .error {
            border: 1px solid red;
          }

          .error {
            border: 1px solid red;
          }
        `}
      </style>
    </>
  );
};

export default EventDetails;
