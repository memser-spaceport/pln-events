import { usePostHog } from "posthog-js/react";

export default function useHeaderAnalytics() {
  const posthog = usePostHog();
  const events = {
    HEADER_HOSTEVENT_CLICKED: "HEADER_HOSTEVENT_CLICKED",
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

  function onHostEventClicked(){
    captureEvent(events.HEADER_HOSTEVENT_CLICKED)
  }

  return {
    onHostEventClicked,
  };
}
