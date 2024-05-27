"use client";
import { ADMIN_VIEW_TAB_OPTIONS } from "@/utils/constants";
import { useState } from "react";
import ManageEventCard from "../manage-event-card";
import { AdminFilterOptions } from "./admin-filter-options";

interface IManageAdminView {
  events: any;
}
export const ManageAdminView = (props: IManageAdminView) => {
  const defaultSelectedTab = ADMIN_VIEW_TAB_OPTIONS[0].label;
  const rawEvents = props?.events ?? {
    pending: [],
    approved: [],
    rejected: [],
  };
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);
  const [events, setEvents] = useState(
    rawEvents[selectedTab] ?? rawEvents[selectedTab.toLowerCase()]
  );
  const [searchText, setSearchText] = useState("");
  const [selectedMainEvent, setSelectedMainEvent] = useState("All Events");

  return (
    <>
      <div className="adminview">
        <div className="adminview__opcontainer">
          <div className="adminview__opcontainer__titlec">
            <button className="adminview__opcontainer__titlec__backbtn">
              <img
                loading="lazy"
                alt="back"
                src="/icons/left-arrow-blue.svg"
              />
            </button>
            <h1 className="adminview__title">Manage Events</h1>
          </div>
          <AdminFilterOptions
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            setEvents={setEvents}
            rawEvents={rawEvents}
            events={events}
            searchText={searchText}
            selectedMainEvent={selectedMainEvent}
            setSelectedMainEvent={setSelectedMainEvent}
            setSearchText={setSearchText}
          />
        </div>
        <div className="adminview__events">
          {events?.length > 0 && (
            <>
              {events?.map((event: any, index: number) => (
                <div
                  key={`${event} + ${index}`}
                  className="adminview__events__event"
                >
                  <ManageEventCard event={event} selectedTab={selectedTab} />
                </div>
              ))}
            </>
          )}

          {events?.length === 0 && (
            <div className="adminview__events__noresult">
              No matching events found.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .adminview__title {
          font-size: 13px;
          font-weight: 500;
          line-height: 20px;
          color: #156ff7;
          padding: 10px 0px 10px 0px;
        }

        .adminview__opcontainer {
          background-color: white;
          padding: 0px 16px 16px 16px;
        }

        .adminview__opcontainer__titlec {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 64px;
        }

        .adminview__opcontainer__titlec__backbtn {
          border: none;
          background: inherit;
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
          .adminview__title {
            color: #0f172a;
            font-size: 32px;
            font-weight: 600;
            line-height: 32px;
            padding: unset;
          }

          .adminview__opcontainer__titlec {
            height: unset;
          }
          .adminview__opcontainer__titlec__backbtn {
            display: none;
          }

          .adminview__opcontainer {
            background-color: unset;
            padding: 0px;
          }

          .adminview__events {
            margin-top: 24px;
            gap: 8px;
            padding: 0px;
          }
        }
      `}</style>
    </>
  );
};
