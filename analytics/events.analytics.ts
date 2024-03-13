import { usePostHog } from "posthog-js/react";

export default function useEventsAnalytics() {
  const posthog = usePostHog();
  const events = {
    EVENT_CARD_CLICKED: "EVENT_CARD_CLICKED",
    EVENT_CARD_LINK_CLICKED: "EVENT_CARD_LINK_CLICKED",
    EVENT_TIMELINE_MONTH_MENU_CLICKED: "EVENT_TIMELINE_MONTH_MENU_CLICKED",
    EVENT_TIMELINE_MONTH_MENUITEM_CLICKED: "EVENT_TIMELINE_MONTH_MENUITEM_CLICKED",
    EVENT_CALENDAR_MONTH_NAV: "EVENT_CALENDAR_MONTH_NAV"
  };

  const captureEvent = (eventName: string, eventParams = {}) => {
    try {
      if (posthog?.capture) {
        const allParams = { ...eventParams };
        posthog.capture(eventName, { ...allParams });
      }
    } catch (e) {
      console.error(e);
    }
  };

  function onCardLinkClicked(type, url, viewType){
    captureEvent(events.EVENT_CARD_LINK_CLICKED, {
        linkType: type,
        linkUrl: url,
        viewType
    })
  }

  function onMonthSelected(type, value) {
    captureEvent(events.EVENT_TIMELINE_MONTH_MENUITEM_CLICKED, {
        menuType: type,
        menuValue: value
    })
  }

  function onMonthMenuClicked() {
    captureEvent(events.EVENT_TIMELINE_MONTH_MENU_CLICKED)
  }

  function onCalendarMonthNav(direction) {
    captureEvent(events.EVENT_CALENDAR_MONTH_NAV, {
      direction
    })
  }

  function onCalendarCardClicked(eventInfo) {
    captureEvent(events.EVENT_CARD_CLICKED, {
        type: 'calendar',
        ...eventInfo
    })
  }

  return {
    onCardLinkClicked,
    onMonthSelected,
    onMonthMenuClicked,
    onCalendarCardClicked,
    onCalendarMonthNav
  };
}
