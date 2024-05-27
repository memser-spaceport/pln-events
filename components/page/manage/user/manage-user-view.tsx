"use client";

import { useState } from "react";
import UserFilterOptions from "./user-filter-options";
import ManageEventCard from "../manage-event-card";

export const ManageUserView = (props: any) => {
    const events = props?.events;

    const [filteredEvents, setFilteredEvents] = useState(events);
  return (
    <>
      <div className="muv">
        <div className="muv__header">
          <img
            height={16}
            width={16}
            className="muv__header__bckbtn"
            alt="back"
            src="/icons/left-arrow-blue.svg"
          />
          <h1 className="muv__title">Manage Events</h1>
        </div>
        <UserFilterOptions setFilteredEvents={setFilteredEvents} rawEvents={events} events={filteredEvents} />

        <div className="adminview__events">
          {filteredEvents?.length > 0 && (
            <>
              {filteredEvents?.map((event: any, index: number) => (
                <div
                  key={`${event} + ${index}`}
                  className="adminview__events__event"
                >
                  <ManageEventCard event={event} selectedTab={""} />
                </div>
              ))}
            </>
          )}

          {filteredEvents?.length === 0 && (
            <div className="adminview__events__noresult">
              No matching events found.
            </div>
          )}
        </div>
      </div>

      <style jsx>
        {`
          .muv__header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: white;
          }

          .muv__title {
            font-size: 13px;
            font-weight: 500;
            line-height: 20px;
            color: #156ff7;
          }

          .muv__events {
            margin-top: 14px;
          }

          .adminview__events {
            margin-top: 14px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 0px 16px 16px 16px;
          }
  
          .adminview__events__noresult {
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            text-align: center;
            color: #475569;
            margin-top: 24px;
          }

          @media (min-width: 1200px) {
            .muv__header {
              padding: unset;
              background-color: unset;
            }

            .muv__header__bckbtn {
              display: none;
            }

            .muv__title {
              font-size: 32px;
              font-weight: 600;
              line-height: 24px;
              color: black;
            }

            .muv__events {
                margin-top: 24px;
            }

            .adminview__events {
                margin-top: 24px;
                gap: 8px;
                padding: 0px;
              }
          }
        `}
      </style>
    </>
  );
};
