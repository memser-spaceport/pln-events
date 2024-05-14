import { IEvent, IMonthwiseEvent, ISelectedItem } from "@/types/events.type";
import { EVENT_TYPES, MONTHS } from "@/utils/constants";
import { createContext } from "react";

export const HpContext = createContext(null);

export const getNoFiltersApplied = (filters: ISelectedItem) => {
  let count = 0;
  if (filters?.locations?.length > 0) {
    count++;
  }
  if (filters?.topics?.length > 0) {
    count++;
  }

  if (filters?.year !== `${new Date().getFullYear()}`) {
    count++;
  }

  if (filters?.eventType !== "") {
    if (EVENT_TYPES.includes(filters?.eventType)) {
      count++;
    }
  }

  if (filters?.eventHosts?.length > 0) {
    count++;
  }
  if (filters?.isPlnEventOnly === true) {
    count++;
  }

  if (
    new Date(filters?.startDate).toLocaleDateString() !==
      new Date(`01/01/${filters?.year}`).toLocaleDateString() ||
    new Date(filters.endDate).toLocaleDateString() !==
      new Date(`12/31/${filters?.year}`).toLocaleDateString()
  ) {
    count++;
  }

  return count;
};

export const getInitialState = (events: IEvent[]) => {
  return {
    filteredItems: {
      year: `${new Date().getFullYear()}`,
      location: [],
      isPlnEventOnly: false,
      topics: [],
      eventHosts: [],
      eventType: "",
      dateRange: {
        start: new Date(`01/01/${new Date().getFullYear()}`),
        end: new Date(`12/31/${new Date().getFullYear()}`),
      },
    },
    filters: {
      year: `${new Date().getFullYear()}`,
      isPlnEventOnly: false,
      locations: [],
      topics: [],
      eventHosts: [],
      eventType: "",
      dateRange: {
        start: new Date(`01/01/${new Date().getFullYear()}`),
        end: new Date(`12/31/${new Date().getFullYear()}`),
      },
    },
    flags: {
      isMobileFilterActive: false,
      isScrolledUp: false,
      eventMenu: "timeline",
    },
    events: [...events],
    filteredEvents: [...events],
  };
};

export const getDaysValue = (count: number, monthValue: string) => {
  const newDate = new Date(`${monthValue}/01/2023`);
  const items = [];
  const countForEmpty = newDate?.getUTCDay();
  if (count === 0) {
    return [];
  }
  for (let j = 1; j <= countForEmpty; j++) {
    items.push("");
  }
  for (let i = 1; i <= count; i++) {
    items.push(i);
  }

  return items;
};

export const daysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};
export const getMonthWiseEvents = (filterdList: IEvent[]) => {
  const monthWiseEvents: IMonthwiseEvent[] = [];
  MONTHS.forEach((m, i) => {
    const forSpecificMonth = [...filterdList].filter(
      (e) => e.startMonthIndex === i
    );
    const newMonthData = {
      name: m,
      index: i,
      events: [...forSpecificMonth],
    };
    if (forSpecificMonth.length > 0) {
      monthWiseEvents.push(newMonthData);
    }
  });

  return monthWiseEvents;
};
