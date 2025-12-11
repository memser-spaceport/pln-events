import moment, { Moment } from "moment-timezone";
import { COLOR_PAIRS, DEFAULT_TAGS, EVENT_YEARS, URL_QUERY_VALUE_SEPARATOR } from "./constants";

export function stringToSlug(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); 
    str = str.toLowerCase();
  
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
  
    str = str.replace(/[^a-z0-9 -]/g, '')
             .replace(/\s+/g, '-')
             .replace(/-+/g, '-')
    return str;
}


/**
 * Converts a UTC date-time string to a specified format based on the given IANA timezone.
 *
 * @param utcDate - The UTC date-time string (e.g., "2025-03-06T14:30:00Z").
 * @param timeZone - The IANA time zone (e.g., "America/New_York", "Asia/Kolkata").
 * @param format - The desired format (e.g., "MMM D, YYYY h:mm A", "HH:mm").
 * @returns The formatted date or time as a string.
 */
export function formatDateTime(utcDate: string, timeZone: string): Moment;
export function formatDateTime(utcDate: string, timeZone: string, format: string): string;
export function formatDateTime(utcDate: string, timeZone: string, format?: string): string | Moment {
  if (!utcDate || !timeZone) {
    console.error("Invalid date or time zone provided:", { utcDate, timeZone });
    return format ? "" : moment.invalid();
  }

  const momentDate = moment.utc(utcDate);
  if (!momentDate.isValid()) {
    console.error("Invalid date format:", utcDate);
    return format ? "" : moment.invalid();
  }

  const formattedDate = momentDate.tz(timeZone);
  return format ? formattedDate.format(format) : formattedDate;
}


/**
 * Formats a date range for a schedule.
 *
 * @param startDateString - Start date in UTC format.
 * @param endDateString - End date in UTC format.
 * @param timeZone - The IANA timezone.
 * @returns Formatted date range (e.g., "1st Jan - 3rd Jan").
 */
export const formatDateForSchedule = (startDateString: string, endDateString: string, timeZone: string): string => {
  const startDay = parseInt(formatDateTime(startDateString, timeZone, "D"), 10);
  const endDay = parseInt(formatDateTime(endDateString, timeZone, "D"), 10);

  const startMonth = formatDateTime(startDateString, timeZone, "MMM");
  const endMonth = formatDateTime(endDateString, timeZone, "MMM");

  const startDaySuffix = getDaySuffix(startDay);
  const endDaySuffix = getDaySuffix(endDay);

  const formattedStartDate = `${startDay}${startDaySuffix}`;
  const formattedEndDate = `${endDay}${endDaySuffix}`;

  if (startDay === endDay && startMonth === endMonth) {
    return `${formattedStartDate} ${startMonth}`;
  } else if (startMonth !== endMonth) {
    return `${formattedStartDate} ${startMonth} - ${formattedEndDate} ${endMonth}`;
  } else {
    return `${formattedStartDate} - ${formattedEndDate} ${startMonth}`;
  }
};

export const formatDateForDetail = (startDateString: string, endDateString: string, timeZone: string): string => {
  const startDay = parseInt(formatDateTime(startDateString, timeZone, "D"), 10);
  const endDay = parseInt(formatDateTime(endDateString, timeZone, "D"), 10);

  const startYear = formatDateTime(startDateString, timeZone, "YYYY");
  const endYear = formatDateTime(endDateString, timeZone, "YYYY");

  const startMonth = formatDateTime(startDateString, timeZone, "MMM");
  const endMonth = formatDateTime(endDateString, timeZone, "MMM");

  const startDaySuffix = getDaySuffix(startDay);
  const endDaySuffix = getDaySuffix(endDay);

  const formattedStartDate = `${startDay}${startDaySuffix}`;
  const formattedEndDate = `${endDay}${endDaySuffix}`;

  if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
    return `${formattedStartDate} ${startMonth} ${startYear}, ${getTime(startDateString, timeZone)} - ${getTime(endDateString, timeZone)} (${getUTCOffset(timeZone)})`;
  } else if (startMonth !== endMonth) {
    return `${formattedStartDate} ${startMonth} ${startYear}, ${getTime(startDateString, timeZone)} - ${formattedEndDate} ${endMonth} ${endYear}, ${getTime(endDateString, timeZone)} (${getUTCOffset(timeZone)})`;
  } else {
    return `${formattedStartDate} ${startMonth} ${startYear}, ${getTime(startDateString, timeZone)} - ${formattedEndDate} ${endMonth} ${endYear}, ${getTime(endDateString, timeZone)} (${getUTCOffset(timeZone)})`;
  }
};


/**
 * Formats a given UTC date-time string to 24-hour format based on the provided timezone.
 *
 * @param date - The UTC date-time string.
 * @param timeZone - The IANA timezone.
 * @returns The formatted time in "HH:mm" format.
 */
export const getTime = (date: string, timeZone: string): string => {
  return formatDateTime(date, timeZone, "HH:mm");
};

/**
 * Returns the ordinal suffix for a given day (e.g., 1st, 2nd, 3rd, 4th).
 *
 * @param day - The day of the month.
 * @returns The day with its appropriate suffix.
 */
const getDaySuffix = (day: number): string => {
  if ([11, 12, 13].includes(day)) return "th";
  return ["st", "nd", "rd"][day % 10 - 1] || "th";
};

export const differenceInDays = (startDate: string, endDate: string, timeZone: string): number => {
  const start = formatDateTime(startDate, timeZone, "YYYY-MM-DD");
  const end = formatDateTime(endDate, timeZone, "YYYY-MM-DD");

  const startDateObj = new Date(start);
  const endDateObj = new Date(end);

  const timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const replaceWhitespaceAndRemoveSpecialCharacters = (text: string) => 
  text.replace(/[^\w\s]|(\s+)/g, (_, space) => (space ? '-' : ''));

export const getFilterCount = (selectedFilterValues: any) => {
  let count = 0;

  if (selectedFilterValues?.isFeatured) {
    count++;
  }

  if (selectedFilterValues?.modes?.length > 0 && selectedFilterValues?.modes[0] !== "All") {
    count++;
  }

  if (selectedFilterValues?.year) {
    const currentYear = new Date().getFullYear();
    const selectedYear = parseInt(selectedFilterValues.year, 10);
    if (selectedYear !== currentYear) {
      count++;
    }
  }

  if (selectedFilterValues?.location?.length > 0) {
    count++;
  }

  if (selectedFilterValues?.allHost?.length > 0) {
    count++;
  }

  if (selectedFilterValues?.tags?.length > 0) {
    count++;
  }

  if (selectedFilterValues?.accessOption?.length > 0) {
    count++;
  }

  return count;
};


export const getQueryParams = (searchParams: any) => {
  const queryString = Object.keys(searchParams)
    .map((paramKey) => encodeURIComponent(paramKey) + "=" + encodeURIComponent(searchParams[paramKey]))
    .join("&");
  return queryString;
};

const generateUniqueObjects = (events: any) => {
  const uniqueNames = {
    location: new Set(),
    allHost: new Set(),
    tags: new Set(),
  };
  const filterValues: any = {
    isFeatured: false,
    // years: EVENT_YEARS,
    dayFilter: "all",
    location: [],
    allHost: [],
    accessOption: [
      { name: "OPEN", label: "Free W/ RSVP" },
      { name: "INVITE", label: "Invite Only" },
      { name: "PAID", label: "Paid" },
    ],
    tags: [],
    modes: [
      { name: "All", label: "All" },
      {
        name: "IN-PERSON",
        label: "In person",
        activeImg: "/icons/inperson_white.svg",
        inActiveImg: "/icons/inperson_black.svg",
      },
      {
        name: "VIRTUAL",
        label: "Virtual",
        activeImg: "/icons/virtual_white.svg",
        inActiveImg: "/icons/virtual_black.svg",
      },
      {
        name: "HYBRID",
        label: "Hybrid",
        activeImg: "/icons/hybrid_white.svg",
        inActiveImg: "/icons/hybrid_black.svg",
      },
    ],
  };
  
  const configLocations = events.configLocations;
  events.forEach(({ location, hostName, hostLogo, accessOption, tags, coHosts }: any) => {
    //TODO
    // if (!uniqueNames.location.has(location)) {
    //   if (location.trim().length > 0) {
    //     uniqueNames.location.add(location);
    //     filterValues.location.push({ name: location, label: location });
    //   }
    // }
    if (!uniqueNames.allHost.has(hostName)) {
      if (hostName.trim().length > 0) {
        uniqueNames.allHost.add(hostName);
        filterValues.allHost.push({
          name: hostName,
          label: hostName,
          img: hostLogo,
        });
      }
    }

    coHosts.map((host: any) => {
      if (!uniqueNames.allHost.has(host.name)) {
        uniqueNames.allHost.add(host.name);
        if (host?.name.trim().length > 0) {
          filterValues.allHost.push({
            name: host.name,
            label: host.name,
            img: host.logo,
          });
        }
      }
    });

    tags.forEach((tag: any) => {
      if (!uniqueNames.tags.has(tag)) {
        uniqueNames.tags.add(tag);
        filterValues.tags.push({ name: tag, label: tag });
      }
    });
  });

  if (!Array.isArray(filterValues.configLocations)) {
    filterValues.configLocations = [];
  }
  configLocations?.forEach((configLocation: any) => {
    filterValues.location.push({ name: configLocation?.name, label: configLocation?.title });
  });

  return filterValues;
};

const filterUniqueObjects = (initialValues: any, rawValues: any, queryParams: any) => {
  const filteredObjects = { ...initialValues };
  const rawFilters = { ...rawValues };
  if (queryParams.isFeatured) {
    filteredObjects.isFeatured = Boolean(queryParams.isFeatured);
  }
  if (queryParams.location) {
    const locationValues = queryParams.location.split(URL_QUERY_VALUE_SEPARATOR);
    filteredObjects.location = rawFilters.location.filter((item: any) => locationValues.includes(item.name));
  }

  if (queryParams.host) {
    const allHostValues = queryParams.host.split(URL_QUERY_VALUE_SEPARATOR);
    filteredObjects.allHost = rawFilters.allHost.filter((item: any) => allHostValues.includes(item.name));
  }

  if (queryParams.accessOption) {
    const accessOptionsValues = queryParams.accessOption.split(URL_QUERY_VALUE_SEPARATOR);
    filteredObjects.accessOption = rawFilters.accessOption.filter((item: any) =>
      accessOptionsValues.includes(item.name)
    );
  }

  if (queryParams.tags) {
    const tagValues = queryParams.tags.split(URL_QUERY_VALUE_SEPARATOR);
    filteredObjects.tags = rawFilters.tags.filter((item: any) => tagValues.includes(item.name));
  }
  if (queryParams.modes) {
    if (queryParams.modes === "All") {
      filteredObjects.modes = initialValues.modes;
    } else {
      const modeValues = queryParams.modes.split(URL_QUERY_VALUE_SEPARATOR);
      filteredObjects.modes = rawFilters.modes.filter((item: any) => modeValues.includes(item.name));
    }
  }

  if (queryParams.dayFilter) {
    filteredObjects.dayFilter = queryParams.dayFilter;
  }

  // if (queryParams.year) {
  //   filteredObjects.year = queryParams.year;
  // }
  
  filteredObjects.location = filteredObjects.location.map((item: any) => item.name);
  filteredObjects.allHost = filteredObjects.allHost.map((item: any) => item.name);
  filteredObjects.accessOption = filteredObjects.accessOption.map((item: any) => item.name);
  filteredObjects.tags = filteredObjects.tags.map((item: any) => item.name);
  filteredObjects.modes = filteredObjects.modes.map((item: any) => item.name);
  return filteredObjects;
};

export const getFilterValuesFromEvents = (events: any, queryParams = {}) => {
  const rawFilterValues = generateUniqueObjects(events);

  const filterValues = {
    isFeatured: false,
    dayFilter: "all",
    location: [],
    allHost: [],
    accessOption: [],
    tags: [],
    modes: [
      {
        name: "All",
      },
    ],
  };
  const selectedFilterValues = filterUniqueObjects(filterValues, rawFilterValues, queryParams);

  return {
    rawFilterValues,
    selectedFilterValues,
    initialFilters: filterValues,
  };
};

export const getFilteredEvents = (events: any, queryParams: any, type?: string) => {
  let filteredEvents = [...events].filter((event) => {
    if (type === "calendar" || type === "list") {
      if (event.isHidden) {
        return false;
      }
    }

    if (queryParams.dayFilter === "single" && event.multiday === true) {
      return false;
    } else if (queryParams.dayFilter === "multi" && event.multiday === false) {
      return false;
    }

      

    if (queryParams.isFeatured) {
      if (!event.isFeatured) {
        return false;
      }
    }

    if (queryParams.host) {
      const allHostValues = queryParams.host.split(URL_QUERY_VALUE_SEPARATOR);
      if (
        !allHostValues.includes(event.hostName) &&
        !event.coHosts?.some((host: any) => allHostValues.includes(host.name))
      ) {
        return false;
      }
    }

    if (queryParams.accessOption) {
      const accessOptionsValues = queryParams.accessOption.split(URL_QUERY_VALUE_SEPARATOR);
      if (!accessOptionsValues.includes(event.accessOption)) {
        return false;
      }
    }

    if (queryParams.tags) {
      const tagValues = queryParams.tags.split(URL_QUERY_VALUE_SEPARATOR);
      const hasMatchingValue = tagValues.some((value: any) => event.tags.includes(value));
      if (!hasMatchingValue) {
        return false;
      }
    }

    if (queryParams.modes && queryParams.modes.toLowerCase() !== "all") {
      const modeValues = queryParams.modes.split(URL_QUERY_VALUE_SEPARATOR).map((value: any) => value.toUpperCase());
      if (!modeValues.includes(event.format.toUpperCase())) {
        return false;
      }
    }


    return true;
  });
  return filteredEvents;
};

export const getRefreshStatus = (event: string) => {
  const refreshRestrictedEvents = process.env.REFRESH_DISABLED_EVENTS?.split(',') || [];
  const refreshAllowedEvents = process.env.REFRESH_ENABLED_EVENTS?.split(',') || [];
  
  if (refreshRestrictedEvents.includes(event)) {
    return true; 
  } else if (refreshAllowedEvents.includes(event)) {
    return false; 
  } else {
    return true;
  }
}

export const stringToUniqueInteger = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = (hash << 5) - hash + str?.charCodeAt(i);
    hash |= 0;
  }
  const minValue = 1;
  const maxValue = 15;
  const range = maxValue - minValue + 1;
  const mappedValue = (((hash % range) + range) % range) + minValue;
  return mappedValue;
};

export function groupByStartDate(objects: any) {
  return objects.reduce((acc: any, obj: any) => {
    const startDate = formatDateTime(obj?.startDate, obj.timezone, "MMM");

    if (!acc[startDate]) {
      acc[startDate] = [];
    }
    acc[startDate].push(obj);
    return acc;
  }, {});
}

export function sortEventsByStartDate(events: any) {
  return [...events].sort((a, b) => {
    const startTimeA = formatDateTime(a.startDate, a.timezone) as Moment;
    const startTimeB = formatDateTime(b.startDate, b.timezone) as Moment;

    if (!startTimeA.isValid() || !startTimeB.isValid()) {
      console.error("Invalid event start date:", { startTimeA, startTimeB });
      return 0;
    }

    return startTimeA.isBefore(startTimeB) ? -1 : startTimeA.isAfter(startTimeB) ? 1 : 0;
  });
}

export const getBackgroundColor = (tags: any) => {
  const defaultTags: any = DEFAULT_TAGS;
  if (tags && tags.length && DEFAULT_TAGS != undefined) {
    return defaultTags[tags[0]]?.length ? defaultTags[tags[0]][2] : COLOR_PAIRS[stringToUniqueInteger(tags[0])][2];
  }
};

export const getHoverColor = (tags: any) => {
  const defaultTags: any = DEFAULT_TAGS;
  if (tags && tags.length) {
    return defaultTags[tags[0]] ? defaultTags[tags[0]][0] : COLOR_PAIRS[stringToUniqueInteger(tags[0])][0];
  }
};

export const getUTCOffset = (timezone: string) => {
  const offsetMinutes = moment.tz(timezone).utcOffset();
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;
  const sign = offsetMinutes >= 0 ? "+" : "-";
  return `UTC ${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
}