import { IEvent, IEventResponse, ISelectedItem } from "@/types/events.type";
import { IEventHost } from "@/types/shared.type";
import {
  CURRENT_YEAR,
  EVENT_TYPES,
  EVENT_YEARS,
  MONTH_VIEW_COLORS_LENGTH,
  MONTHS,
  URL_QUERY_VALUE_SEPARATOR,
} from "@/utils/constants";
import {
  differenceInDays,
  formatDateForSchedule,
  formatDateTime,
  getTime,
  getUTCOffset,
  replaceWhitespaceAndRemoveSpecialCharacters,
  stringToSlug,
} from "@/utils/helper";
import { chownSync } from "fs";

export const getBannerData = async () => {
  if (
    process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_URL &&
    process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_TOKEN
  ) {
    const bannerResponse = await fetch(
      process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_URL,
      {
        method: "GET",
        headers: {
          Authorization: process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_TOKEN,
        },
      }
    );

    if (!bannerResponse.ok) {
      return { isError: true, message: "Something went wrong" };
    }

    return bannerResponse.json();
  }
};

export const getEvents = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/eventjson`,
    {
      method: "GET",
      // next: { tags: ["pln-events-tina-service"] },
    }
  );
  if (!response.ok) {
    return { isError: true, message: "Something went wrong!" };
  }
  return response.json();
};

export const getFilterValues = (
  events: IEvent[],
  selectedItems: ISelectedItem
) => {
  const uniqueValues = getUniqueValuesFromEvents(events);
  return [
    {
      name: "Year",
      type: "single-select",
      items: uniqueValues.years,
      selectedItem: selectedItems.year,
      placeholder: "Filter by year",
      dropdownImgUrl: "/icons/pln-arrow-down.svg",
      identifierId: "year",
      iconUrl: "/icons/pl-calender-icon.svg",
    },
    {
      name: "Locations",
      type: "multi-select",
      items: uniqueValues.locations,
      selectedItems: selectedItems.locations,
      placeholder: "Filter by location",
      dropdownImgUrl: "/icons/pln-arrow-down.svg",
      identifierId: "locations",
      iconUrl: "/icons/pl-location-icon.svg",
    },
    {
      name: "Date Range",
      type: "date-range",
      dateRange: {
        startDate: selectedItems.startDate,
        endDate: selectedItems.endDate,
      },
      identifierId: "dateRange",
      iconUrl: "/icons/pl-calender-icon.svg",
    },
    {
      name: "Event Hosts",
      type: "multi-select",
      items: uniqueValues.eventHosts,
      selectedItems: selectedItems.eventHosts,
      placeholder: "Filter by Host Name",
      dropdownImgUrl: "/icons/pln-arrow-down.svg",
      identifierId: "eventHosts",
      iconUrl: "/icons/pln-hosts-icon.svg",
    },
    {
      name: "Event Type",
      type: "tags",
      items: EVENT_TYPES,
      selectedItem: selectedItems.eventType,
      identifierId: "eventType",
    },
    {
      name: "Topics",
      type: "multi-select",
      items: uniqueValues.topics,
      selectedItems: selectedItems.topics,
      placeholder: "Filter by topics",
      dropdownImgUrl: "/icons/pln-arrow-down.svg",
      identifierId: "topics",
      iconUrl: "/icons/pl-topics-icon.svg",
    },
  ];
};

export const getUniqueValuesFromEvents = (allEvents: IEvent[]) => {
  const filterValues: any = {
    years: EVENT_YEARS,
    locations: [],
    eventHosts: [],
    topics: [],
  };

  allEvents?.map((event: IEvent) => {
    // Location
    if (event?.location) {
      if (!filterValues.locations.includes(event.location)) {
        filterValues.locations.push(event.location);
      }
    }
    // Hosts
    if (event?.eventHosts?.length > 0) {
      event.eventHosts.map((host: IEventHost) => {
        if (!filterValues.eventHosts.includes(host?.name)) {
          filterValues.eventHosts.push(host?.name);
        }
      });
    }

    // Topics
    if (event?.topics?.length > 0) {
      event.topics.map((topic: string) => {
        if (!filterValues.topics.includes(topic)) {
          filterValues.topics.push(topic);
        }
      });
    }
  });
  return filterValues;
};

export const getInitialSelectedItems = () => {
  return {
    viewType: "timeline",
    year: CURRENT_YEAR,
    locations: [],
    startDate: `01/01/${CURRENT_YEAR}`,
    endDate: `12/31/${CURRENT_YEAR}`,
    eventHosts: [],
    eventType: "",
    topics: [],
    isPlnEventOnly: false,
  };
};

export const getSelectedItems = (searchParams: any) => {
  const year = searchParams.year ?? CURRENT_YEAR;
  return {
    viewType: searchParams?.viewType ?? "timeline",
    year,
    locations: getValuesFromQuery(searchParams.locations),
    startDate: searchParams.start ?? `01/01/${year}`,
    endDate: searchParams.end ?? `12/31/${year}`,
    eventHosts: getValuesFromQuery(searchParams.eventHosts),
    eventType: searchParams.eventType ?? "",
    topics: getValuesFromQuery(searchParams.topics),
    isPlnEventOnly: searchParams.isPlnEventOnly === "true" ? true : false,
  };
};

export const getValuesFromQuery = (query: string) => {
  try {
    if (query) {
      return decodeURIComponent(query).split(URL_QUERY_VALUE_SEPARATOR);
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const getFormattedEvents = (events: IEventResponse[]) => {
  const allEvents = events ?? [];
  const formattedEvents = allEvents?.map((event: any) => {
    // Start Date
    const startDateValue = new Date(event?.startDate);
    const startDateTimeStamp = startDateValue.getTime();
    const startMonthIndex = startDateValue.getMonth();
    const startDay = startDateValue.getDate();
    const startDayString = startDateValue.toLocaleDateString("us-en", {
      weekday: "short",
    });
    const startYear = startDateValue.getFullYear();

    // End Date
    const endDateValue = new Date(event.endDate);
    const endDateTimeStamp = endDateValue.getTime();
    const endMonthIndex = endDateValue.getMonth();
    const endDay = endDateValue.getDate();

    // Event date format
    const showEndDate = startDay === endDay ? false : true;
    const fullDateFormat =
      startMonthIndex === endMonthIndex
        ? `${MONTHS[startMonthIndex]} ${startDateValue.getDate()}${
            showEndDate ? " - " : ""
          }${
            showEndDate ? endDateValue.getDate() : ""
          }, ${endDateValue.getFullYear()} `
        : `${MONTHS[startMonthIndex]} ${startDateValue.getDate()} - ${
            MONTHS[endMonthIndex]
          } ${endDateValue.getDate()}, ${endDateValue.getFullYear()}`;

    // Host names
    const tempEventNames: string[] = [];
    const eventHosts: IEventHost[] = [];
    event?.eventHosts?.forEach((hs: string) => {
      const splitted = hs.split("|");
      if (splitted.length === 1) {
        splitted.push("pln-default-host-logo.svg");
      }

      if (!tempEventNames.includes(splitted[0])) {
        tempEventNames.push(splitted[0]);
        const newHostEmtry = {
          name: splitted[0],
          logo: `/uploads/${splitted[1]}`,
          primaryIcon: `/icons/pln-primary-host.svg`,
        };
        eventHosts.push(newHostEmtry);
      }
    });

    // Preferred Contacts
    const preferredContacts =
      event?.preferredContacts?.map((pc: string) => {
        const splitted = pc.split("|");
        const supportedLinks = [
          "twitter",
          "discord",
          "telegram",
          "whatsapp",
          "facebook",
          "instagram",
          "linkedin",
          "email",
        ];
        return {
          name: splitted[0],
          logo: supportedLinks.includes(splitted[0].toLowerCase().trim())
            ? `/icons/pln-contacts-${splitted[0]}.svg`
            : `/icons/pln-contacts-default.svg`,
          link: splitted[1],
        };
      }) ?? [];

    //trimming topics
    const allTopics = event.eventTopic ?? [];
    const trimmedTopics = allTopics.slice(0, 4);

    // Logos/images
    const locationLogo = "/icons/pln-location-icon.svg";
    const calenderLogo = "/icons/calender-icon.svg";
    let tagLogo = "";

    if (
      event?.tag?.toLowerCase().trim() === "pln event" ||
      event?.tag?.toLowerCase().trim() === "pl event"
    ) {
      event.tag = "PL Event";
      tagLogo = "/icons/pln-event-icon.svg";
    } else if (event?.tag?.toLowerCase().trim() === "industry event") {
      tagLogo = "/icons/pln-industry-icon.svg";
    }
    const eventSlug = `${stringToSlug(event.eventName)}-${new Date(
      event.startDate
    ).getTime()}-${new Date(event.endDate).getTime()}`;
    return {
      eventName: event.eventName,
      website: event.website,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      dateTBD: event.dateTBD,
      dri: event.dri,
      tag: event.tag,
      description: event?.eventDescription,
      juanSpeaking: event.juanSpeaking,
      eventOrg: event?.eventOrg,
      eventLogo: event?.eventLogo,
      eventType: event?.eventType,
      venueName: event?.venueName,
      venueMapsLink: event?.venueMapsLink,
      venueAddress: event?.venueAddress,
      isFeaturedEvent: event?.isFeaturedEvent ?? false,
      topics: [...trimmedTopics],
      eventHosts: eventHosts ?? [],
      preferredContacts,
      startDateTimeStamp,
      startMonthIndex,
      startDay,
      startDayString,
      startYear: startYear.toString(),
      endDateTimeStamp,
      endMonthIndex,
      endDay,
      fullDateFormat,
      tagLogo,
      calenderLogo,
      startDateValue,
      endDateValue,
      locationLogo,
      slug: eventSlug,
      externalLinkIcon: "/icons/pl-external-icon.svg",
    };
  });

  return formattedEvents;
};

export const getFilteredEvents = (
  allEvents: IEvent[],
  selectedItems: ISelectedItem
) => {
  const filteredItems = [...allEvents].filter((item) => {
    if (item?.startYear !== selectedItems?.year) {
      return false;
    }

    if (
      selectedItems?.locations?.length > 0 &&
      !selectedItems.locations.includes(item.location)
    ) {
      return false;
    }

    if (
      selectedItems?.isPlnEventOnly &&
      item?.tag?.toLowerCase().trim() !== "pln event" &&
      item?.tag?.toLowerCase().trim() !== "pl event"
    ) {
      return false;
    }

    if (
      selectedItems?.eventType !== "" &&
      selectedItems?.eventType?.toLowerCase().trim() !==
        item?.eventType?.toLowerCase().trim()
    ) {
      return false;
    }

    if (selectedItems?.startDate) {
      if (
        new Date(selectedItems.startDate).getTime() !==
          new Date(`01/01/${selectedItems.year}`).getTime() &&
        new Date(selectedItems.startDate).getTime() > item?.endDateTimeStamp
      ) {
        return false;
      }
    }

    if (selectedItems?.endDate) {
      if (
        new Date(selectedItems.endDate).getTime() !==
          new Date(`12/31/${selectedItems.year}`).getTime() &&
        new Date(selectedItems.endDate).getTime() < item?.startDateTimeStamp
      ) {
        return false;
      }
    }

    if (selectedItems?.topics?.length > 0) {
      let result = false;
      const eventTopics = item?.topics ?? [];
      eventTopics.forEach((topic: string) => {
        if (selectedItems.topics.includes(topic)) {
          result = true;
        }
      });
      if (!result) {
        return false;
      }
    }

    if (selectedItems?.eventHosts?.length > 0) {
      let result = false;
      const eventHosts = item?.eventHosts ?? [];
      eventHosts.forEach((eh: IEventHost) => {
        if (selectedItems.eventHosts.includes(eh.name)) {
          result = true;
        }
      });
      if (!result) {
        return false;
      }
    }

    return true;
  });

  return filteredItems;
};

function getEventDates(event: any) {
  const dates: string[] = [];
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function assignColorsToEvents(events: any[]) {
  const dayColorAssignments: Record<string, Set<string>> = {};
  let colorIndex = 0;

  events.forEach((event) => {
    if (event.isFeatured) {
      event.calendarId = "featured";
    } else {
      const eventDates = getEventDates(event);
      let assignedColor: string | undefined;

      // Iterate over colors and find the first one that is not taken on any of the event's dates
      for (let i = 0; i < MONTH_VIEW_COLORS_LENGTH; i++) {
        const potentialColor = `color${colorIndex % MONTH_VIEW_COLORS_LENGTH}`; // Get the color in circular fashion
        const isColorAvailable = eventDates.every(
          (date) => !dayColorAssignments[date]?.has(potentialColor)
        );

        if (isColorAvailable) {
          assignedColor = potentialColor;
          break;
        }

        // Increment colorIndex to move to the next color in the next iteration
        colorIndex++;
      }

      // Fallback to a color in case all were taken
      assignedColor =
        assignedColor || `color${colorIndex % MONTH_VIEW_COLORS_LENGTH}`;

      // Assign the color to the event and mark it for each day the event spans
      event.calendarId = assignedColor;
      eventDates.forEach((date) => {
        if (!dayColorAssignments[date]) {
          dayColorAssignments[date] = new Set();
        }
        dayColorAssignments[date].add(assignedColor!);
      });

      colorIndex++;
    }
  });

  return events;
}

export const getAllEvents = async () => {
  const result = await fetch(
    `${process.env.WEB_API_BASE_URL}/events?conference=pl-events&status=APPROVED&sortByPriority=true&type=EventAndSession`,
    {
      headers: {
        Authorization: `Bearer ${process.env.WEB_API_TOKEN}`,
        "x-client-secret": process.env.EVENT_CLIENT_SECRET ?? "",
        "x-conference": "pl-events",
      },
      method: "GET",
      next: { tags: ["pl-events"] },
    }
  );

  if (!result.ok) {
    return { isError: true };
  }

  const allEvents = await result.json();
  let formattedEvents = allEvents?.map((event: any, index: number) => {
    let dayDifference = differenceInDays(
      event.start_date,
      event.end_date,
      event.timezone
    );

    return {
      name: event.event_name ?? "",
      title: event.event_name ?? "",
      id: event.event_id,
      isFeatured: event.is_featured ?? false,
      conference: event.conference ?? "",
      meetingPlatform: event.meeting_platform ?? "",
      registrationLink: event.registration_link ?? "",
      websiteLink: event.website_link ?? "",
      updatedAt: event.updatedAt,
      description: event.description ?? "",
      tags: event.tags ?? [],
      startDate: event.start_date,
      // timing: formatTimeRange(event.agenda?.sessions ?? [], event.start_date, event.end_date, weekStart, weekEnd),
      dateRange: formatDateForSchedule(
        event.start_date,
        event.end_date,
        event.timezone
      ),
      endDate: event.end_date,
      multiday: dayDifference > 0,
      accessType: event.access_type,
      accessOption: event.access_option,
      status: event.status,
      format: event.format,
      location: event.location ?? "",
      locationUrl: event.location_url ?? "",
      sponsors: event.sponsors ?? [],
      seatCount: event.seat_count ?? "",
      hostName: event.host ?? "",
      hostLogo: event.host_logo ?? "",
      coHosts: event.co_hosts ?? [],
      secondaryContacts: event.secondary_contacts ?? [],
      meetingLink: event.meeting_link ?? "",
      contactName: event.event_contact_name ?? "",
      contactEmail: event.event_contact_email ?? "",
      contactInfos: event.contact_infos,
      eventLogo: event.event_logo,
      isHidden: event.is_hidden ?? false,
      startTime: getTime(event.start_date, event.timezone),
      agenda: event.agenda,
      slug: stringToSlug(event.event_name),
      endTime: getTime(event.end_date, event.timezone),
      timezone: event.timezone,
      utcOffset: getUTCOffset(event.timezone),
      sessions: event.agenda?.sessions?.map((session: any, index: number) => {
        return {
          id:
            replaceWhitespaceAndRemoveSpecialCharacters(session?.name) + index,
          startDate: session.start_date,
          endDate: session.end_date,
          name: session.name ?? "",
          description: session?.description ?? "",
        };
      }),
      irlLink: event.additionalInfo?.irlLink ?? "",
    };
  });
  formattedEvents = assignColorsToEvents(formattedEvents);
  return { data: formattedEvents };
};

// export const getAgendaView = (events: any) => {
//   return events
//     .map((event: any) => {
//       const allDays = getAllDaysBetween(event.startDate, event.endDate);

//       return allDays
//         .map((day: string) => {
//           // Get all sessions for the current day
//           const sessions = event.sessions.filter((session: any) => isSameDay(session.startDate, day));
//           if (sessions.length > 0) {
//             // Map through all the sessions for that day
//             return sessions.map((session: any) => ({
//               title: `${getEventNameAbbreviation(event.name)}-${session.name}`,
//               start: getMonthViewTimeFormat(session.startDate),
//               end: getMonthViewTimeFormat(session.endDate),
//               calendarId: event.calendarId,
//               sessionId: session.id,
//               slug: event.slug,
//               id: event.id,
//               _customContent: {
//                 monthAgenda: `
//                 <div class="custom-event">
//                   <div class="sx__month-agenda-event__title  cal-agenda-title">${getEventNameAbbreviation(
//                     event.name
//                   )} <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M2.45 5C2.45 4.75147 2.24853 4.55 2 4.55C1.75147 4.55 1.55 4.75147 1.55 5H2.45ZM12.6515 9.3182C12.8273 9.14246 12.8273 8.85754 12.6515 8.6818L9.78775 5.81802C9.61201 5.64228 9.32709 5.64228 9.15135 5.81802C8.97562 5.99376 8.97562 6.27868 9.15135 6.45442L11.6969 9L9.15135 11.5456C8.97562 11.7213 8.97562 12.0062 9.15135 12.182C9.32709 12.3577 9.61201 12.3577 9.78775 12.182L12.6515 9.3182ZM1.55 5V8.6H2.45V5H1.55ZM2.4 9.45H12.3333V8.55H2.4V9.45ZM1.55 8.6C1.55 9.06944 1.93056 9.45 2.4 9.45V8.55C2.42761 8.55 2.45 8.57239 2.45 8.6H1.55Z" fill="#156FF7"/>
//                   </svg> ${session.name}</div>
//                   <div class="sx__month-agenda-event__time sx__month-agenda-event__has-icon">
//                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sx__event-icon">
//                       <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
//                       <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
//                       <g id="SVGRepo_iconCarrier">
//                         <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
//                         <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
//                       </g>
//                     </svg>
//                     ${getFormattedTimeRange(session.startDate, session.endDate)}
//                   </div>
//                 </div>
//               `,
//                 timeGrid: `
//               <div class="custom-event">
//                 <div class="sx__time-grid-event-title cal-agenda-title">${getEventNameAbbreviation(
//                   event.name
//                 )} <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M2.45 5C2.45 4.75147 2.24853 4.55 2 4.55C1.75147 4.55 1.55 4.75147 1.55 5H2.45ZM12.6515 9.3182C12.8273 9.14246 12.8273 8.85754 12.6515 8.6818L9.78775 5.81802C9.61201 5.64228 9.32709 5.64228 9.15135 5.81802C8.97562 5.99376 8.97562 6.27868 9.15135 6.45442L11.6969 9L9.15135 11.5456C8.97562 11.7213 8.97562 12.0062 9.15135 12.182C9.32709 12.3577 9.61201 12.3577 9.78775 12.182L12.6515 9.3182ZM1.55 5V8.6H2.45V5H1.55ZM2.4 9.45H12.3333V8.55H2.4V9.45ZM1.55 8.6C1.55 9.06944 1.93056 9.45 2.4 9.45V8.55C2.42761 8.55 2.45 8.57239 2.45 8.6H1.55Z" fill="#156FF7"/>
//                 </svg> ${session.name}</div>
//                 <div class="sx__time-grid-event-timetime sx__month-agenda-event__has-icon">
//                   <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sx__event-icon">
//                     <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
//                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
//                     <g id="SVGRepo_iconCarrier">
//                       <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
//                       <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
//                     </g>
//                   </svg>
//                   ${getFormattedTimeRange(session.startDate, session.endDate)}
//                 </div>
//               </div>
//             `,
//                 dateGrid: `
//             <div class="custom-event">
//               <div class="sx__time-grid-event-title cal-agenda-title">${getEventNameAbbreviation(
//                 event.name
//               )} <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M2.45 5C2.45 4.75147 2.24853 4.55 2 4.55C1.75147 4.55 1.55 4.75147 1.55 5H2.45ZM12.6515 9.3182C12.8273 9.14246 12.8273 8.85754 12.6515 8.6818L9.78775 5.81802C9.61201 5.64228 9.32709 5.64228 9.15135 5.81802C8.97562 5.99376 8.97562 6.27868 9.15135 6.45442L11.6969 9L9.15135 11.5456C8.97562 11.7213 8.97562 12.0062 9.15135 12.182C9.32709 12.3577 9.61201 12.3577 9.78775 12.182L12.6515 9.3182ZM1.55 5V8.6H2.45V5H1.55ZM2.4 9.45H12.3333V8.55H2.4V9.45ZM1.55 8.6C1.55 9.06944 1.93056 9.45 2.4 9.45V8.55C2.42761 8.55 2.45 8.57239 2.45 8.6H1.55Z" fill="#156FF7"/>
//               </svg> ${session.name}</div>
//               <div class="sx__time-grid-event-time sx__month-agenda-event__has-icon">
//                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sx__event-icon">
//                   <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
//                   <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
//                   <g id="SVGRepo_iconCarrier">
//                     <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
//                     <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
//                   </g>
//                 </svg>
//                 ${getFormattedTimeRange(session.startDate, session.endDate)}
//               </div>
//             </div>
//           `,
//               },
//             }));
//           } else {
//             // Return an entry for the day without a session
//             return {
//               title: event.title,
//               start: `${day} ${event.startTime}`, // Using day for date and event startTime
//               end: `${day} ${event.endTime}`, // Using day for date and event endTime
//               calendarId: event.calendarId,
//               slug: event.slug,
//               id: event.id,
//               _customContent: {
//                 monthAgenda: `
//                 <div class="custom-event">
//                   <div class="sx__month-agenda-event__title ">${event.name}</div>
//                   <div class="sx__month-agenda-event__time sx__month-agenda-event__has-icon">
//                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sx__event-icon">
//                       <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
//                       <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
//                       <g id="SVGRepo_iconCarrier">
//                         <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
//                         <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
//                       </g>
//                     </svg>
//                     ${getFormattedTimeRange(`${event.startDate}`, `${event.endDate}`)}
//                   </div>
//                 </div>
//               `,
//               },
//             };
//           }
//         })
//         .flat(); // Flatten the nested array from sessions mapping
//     })
//     .flat();
// };
export const getRefreshedAgenda = async (eventId: string) => {
  const result = await fetch(
    `${process.env.EVENT_AGENDA_REFRESH_URL}/api/event/${eventId}`,
    {
      // headers: { Authorization: `Bearer ${process.env.IRL_BEARER_TOKEN}` },
      method: "GET",
      cache: "no-store",
      headers: {
        // Authorization: `Bearer ${process.env.IRL_BEARER_TOKEN}`,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
  if (!result.ok) {
    console.error("Error:", result.status, await result.text());
    return;
  }
  const jsonResponse = await result.json();
  return jsonResponse;
};
