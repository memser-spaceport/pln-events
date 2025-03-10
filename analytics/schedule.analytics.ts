import { usePostHog } from "posthog-js/react";

export const useSchedulePageAnalytics = () => {
  const postHog = usePostHog();
  const events = {
    EVENT_DETAIL_CLICKED: "EVENT_DETAIL_CLICKED",
    SCHEDULE_HEADER_FILTER_MENU_CLICKED: "SCHEDULE_HEADER_FILTER_MENU_CLICKED",
    SCHEDULE_FILTER_CLEAR_BTN_CLICKED: "SCHEDULE_FILTER_CLEAR_BTN_CLICKED",
    SCHEDULE_HEADER_LEGEND_INFO_CLICKED: "SCHEDULE_HEADER_LEGEND_INFO_CLICKED",
    EVENT_CALENDAR_MONTH_NAV: "EVENT_CALENDAR_MONTH_NAV",
    SCHEDULE_HEADER_EVENTSVIEW_CLICKED: "SCHEDULE_HEADER_EVENTSVIEW_CLICKED",
    SCHEDULE_FILTER_APPLIED: "SCHEDULE_FILTER_APPLIED",
    PROGRAM_VIEW_EVENT_CLICK: "PROGRAM_VIEW_EVENT_CLICK",
    PROGRAM_VIEW_CHANGE_CLICK: "PROGRAM_VIEW_CHANGE_CLICK"
  };

  const captureEvent = (eventName: string, eventParams = {}) => {
    try {
      if (postHog.capture) {
        const params = { ...eventParams };
        postHog.capture(eventName, { ...params });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onEventClicked = (from: string, eventId: string, eventName: string) => {
    const params = {
      from,
      eventId,
      eventName
    };
    captureEvent(events.EVENT_DETAIL_CLICKED, params);
  };

  const onFilterMenuClicked = (type: string) => {
    captureEvent(
        events.SCHEDULE_HEADER_FILTER_MENU_CLICKED, { type }
    );
  };

  const onFilterClearAllBtnClicked = () => {
    captureEvent(
        events.SCHEDULE_FILTER_CLEAR_BTN_CLICKED, {}
    );
  };

  const onLegendInfoClicked = (from: string) => {
    captureEvent(
        events.SCHEDULE_HEADER_LEGEND_INFO_CLICKED,
      { from }
    );
  };

  const onSchduleViewClicked = (name: string) => {
    const params = {
      name,
    };
    captureEvent(
        events.SCHEDULE_HEADER_EVENTSVIEW_CLICKED,
      params
    );
  };

  const onScheduleFilterClicked = (
    key: string,
    value: string,
    type: string
  ) => {
    const params = {
      from: type,
      name: key,
      value,
      nameAndValue: `${key}-${value}`,
    };

    captureEvent(
        events.SCHEDULE_FILTER_APPLIED,
      params
    );
  };

  const captureEventCardClick = (id: string, name: string) => {
    const params = {
      id,
      name
    };
    captureEvent(events.PROGRAM_VIEW_EVENT_CLICK, params);
  };

  const captureViewChangeClick = (name: string) => {
    const params = {
      name
    };
    captureEvent(events.PROGRAM_VIEW_CHANGE_CLICK, params);
  }

  return {
    onEventClicked,
    onFilterMenuClicked,
    onFilterClearAllBtnClicked,
    onLegendInfoClicked,
    onSchduleViewClicked,
    onScheduleFilterClicked,
    captureEventCardClick,
    captureViewChangeClick
  };
};
