"use client";

import { useEffect, useState } from "react";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from "@schedule-x/calendar";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { formatDateTime } from "@/utils/helper";
import { PROGRAM_VIEW_EVENT_COLORS, CUSTOM_EVENTS } from "@/utils/constants";
import { useRouter, useSearchParams } from "next/navigation";
// import { useWeb3MonthViewAnalytics } from "@/analytics/24-web3/month-view-analytics";
// import { useWeb3MonthViewGoogleAnalytics } from "@/analytics/24-web3/month-view-google-analytics";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";
import useFilterHook from "@/hooks/use-filter-hook";

interface IProgramView{
  events: any;
  viewType: string;
}

const isMobile = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth < 768;
  }
  return false;
};

const ProgramView = (props: IProgramView) => {
  const {searchParams, setQuery} = useFilterHook();
  const currentDate = new Date().toISOString().split('T')[0];

  let initialView = searchParams.get("view") || "month-grid";

  if (initialView === "month" && isMobile()) {
    initialView = "month-agenda";
  } else if (initialView === "week" && isMobile()) {
    initialView = "month-agenda";
  } else if (initialView === "month") {
    initialView = "month-grid";
  }
  let initialDate = searchParams.get("date") || currentDate;

  const events = props?.events.map((event: any) => {
    return {
      title: event.title ?? "",
      id: event.id,
      start: formatDateTime(event.startDate, event.timezone, "YYYY-MM-DD HH:mm"),
      end: formatDateTime(event.endDate, event.timezone, "YYYY-MM-DD HH:mm"),
      ...event,
    };
  });
  const calendarControls = createCalendarControlsPlugin();
  const eventsServicePlugin = createEventsServicePlugin();
  const scrollController = createScrollControllerPlugin({
    initialScroll: "07:55",
  });
//   const analytics = useWeb3MonthViewAnalytics();
//   const googleAnalytics = useWeb3MonthViewGoogleAnalytics();
  const router = useRouter();
  const [viewType, setViewType] = useState(initialView || "month-grid");

  const calendarApp = useNextCalendarApp({
    views: [createViewMonthAgenda(), createViewMonthGrid()],
    selectedDate: initialDate,
    defaultView: viewType ? viewType : viewMonthGrid.name,
    monthGridOptions: {
      nEventsPerDay: 20,
    },
    calendars: PROGRAM_VIEW_EVENT_COLORS,
    events: events,
    plugins: [calendarControls, eventsServicePlugin, scrollController],
    callbacks: {
      onEventClick(calEvent: any) {
        let viewEvent = calEvent;
        let sessionId = calEvent?.sessionId ?? "";
        const view = calendarControls.getView();
        if (view !== "month-grid") {
          viewEvent = props.events.find((event: any) => event.id === calEvent.id);
        }
        // analytics.captureEventCardClick(viewEvent?.id, viewEvent?.name, "24-web3");
        // googleAnalytics.captureEventCardClick(viewEvent?.id, viewEvent?.name, "24-web3");
        if (viewEvent.slug) {
          document.dispatchEvent(
            new CustomEvent(CUSTOM_EVENTS.SHOW_EVENT_DETAIL_MODAL, {
              detail: { isOpen: true, event: viewEvent },
            })
          );
          const sessionParam = sessionId ? `${window.location.search ? "&" : "?"}session=${sessionId}` : "";
          router.push(`${window.location.pathname}${window.location.search}${sessionParam}#${viewEvent.slug}`, {
            scroll: false,
          });
        }
      },
      onRangeUpdate(_cal: any) {
        let view = calendarControls.getView();
        const viewType = view === "month-grid" || view === "month-agenda" ? "month" : view;
        // analytics.captureViewChangeClick(view, "24-web3");
        // googleAnalytics.captureViewChangeClick(view, "24-web3");
        setViewType(view);
        setQuery({ view: viewType, date: calendarControls.getDate() });
      },
    },
  });

  useEffect(() => {
    let events = [];
    // if (viewType === "month-grid" && !isMobile()) {
      events = props?.events.map((event: any) => {
        return {
          title: event.title ?? "",
          id: event.id,
          start: formatDateTime(event.startDate, event.timezone, "YYYY-MM-DD HH:mm"),
          end: formatDateTime(event.endDate, event.timezone, "YYYY-MM-DD HH:mm"),           
          ...event,
        };
      });
    // } else {
    //   events = getAgendaView(props.events);
    // }
    calendarApp?.events.set(events);
  }, [calendarApp?.events, props.events, viewType]);

  useEffect(() => {
    //To disable the typing in the date field
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          const inputField = document.querySelector(".sx__date-input");
          if (inputField && !inputField.hasAttribute("data-keydown-added")) {
            inputField.addEventListener("mousedown", (event) => {
              event.preventDefault();
            });
            inputField.addEventListener("keydown", (event) => event.preventDefault());
            inputField.setAttribute("data-keydown-added", "true"); // Avoid adding multiple listeners
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
};

export default ProgramView;
