"use client";

import { useEffect, useState } from "react";
import HpFilterHead from "./hp-filter-head";
import HpTimeline from "./timeline-view";
import { getMonthWiseEvents } from "./hp-helper";
import HpCalendar from "./hp-calendar";
import { IEvent, ISelectedItem } from "@/types/events.type";

interface IEvents {
  selectedItems: ISelectedItem;
  events: IEvent[];
  rawEvents: IEvent[];
  viewType: string;
  showBanner: boolean;
}
const Events = (props: IEvents) => {
  const selectedItems = props?.selectedItems;
  const events = props?.events ?? [];
  const rawEvents = props?.rawEvents;
  const showBanner = props?.showBanner;

  const viewType = selectedItems?.viewType;
  const filterdListCount = events?.length ?? 0;
  const monthWiseEvents = getMonthWiseEvents(events ?? []);


  const finalEvents = [...events].map((f) => {
    const endDateValue = new Date(f.endDateValue);
    endDateValue.setSeconds(endDateValue.getSeconds() + 10);
    return {
      title: f.eventName,
      start: f.startDateValue,
      end: endDateValue,
      ...f,
    };
  });

  const [isScrollupStatus, setIsScrollupStatus] = useState(false);

  useEffect(() => {
    document.addEventListener('scroll', function(event) {
      const container: HTMLElement | null =
      document.querySelector("html");
    if (container) {
      if (container.scrollTop > 5) {
        setIsScrollupStatus(true);
      } else {
        setIsScrollupStatus(false);
      }
    }
  });
  }, [])

  return (
    <>
      <div
        id="main-content"
        className="hp__maincontent"
      >
        <HpFilterHead selectedItems={selectedItems} showBanner={showBanner} />
        {(viewType === "timeline" && isScrollupStatus) && (
          <div className="hmt__scollup">
            <img
              className="hmt__scollup__img"
              src="/icons/scroll-up-icon.svg"
            />
            <p className="hmt__scollup__text">Scroll up to view past events</p>
          </div>
        )}

        {/**** TIMELINE VIEW ****/}
        {viewType === "timeline" && (
          <HpTimeline selectedItems={selectedItems} events={events} showBanner={showBanner} />
        )}

        {/**** CALENDAR VIEW ****/}
        {viewType === "calendar" && (
          <HpCalendar
          showBanner={showBanner}
            eventItems={finalEvents}
            rawEvents={rawEvents}
            filters={selectedItems}
            monthWiseEvents={monthWiseEvents}
            filterdListCount={filterdListCount}
          />
        )}
      </div>

      <style jsx>
        {`
          .hp {
            width: 100%;
            height: 100%;
            display: flex;
          }
          .hmt__scollup {
            width: 100%;
            display: flex;
            position: sticky;
            z-index: 5;
            top: ${showBanner ?  '268px' : '105px' };
            justify-content: center;
            align-items: center;
            padding: 13px 0;
            background: linear-gradient(
              180deg,
              #f1f5f9 0%,
              rgba(241, 245, 249, 0.92) 39.05%
            );
            color: #0f172a;
            font-size: 13px;
          }
          .hmt__scollup__img {
            width: 8px;
            margin-right: 8px;
            height: 8px;
          }
          .hmt__scollup__text {
            font-size: 12px;
          }

          .hp__maincontent {
          }

          @media (min-width: 1200px) {
            .hmt__scollup {
              top: ${showBanner ? '100px' : '60px'}
            }
          }
          @media (max-width: 1200px) and (min-width: 639px) {
            .hmt__scollup {
              top: 105px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Events;
