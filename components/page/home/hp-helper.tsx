import { createContext } from 'react';

export const HpContext = createContext(null);
export const getUniqueValuesFromEvents = (key, allEvents) => {
  const items = [];
  switch (key) {
    case 'startYear':
    case 'location':
    case 'eventType':
      allEvents.forEach(event => {
        if (!items.includes(event[key])) {
          items.push(event[key])
        }
      })
      break;
    case 'topics':
      allEvents.forEach(event => {
        const eventTopics = event?.topics ?? [];
        eventTopics.forEach(topic => {
          if (!items.includes(topic)) {
            items.push(topic)
          }
        })
      })
      break;
    case 'eventHosts':
      allEvents.forEach(event => {
        event.eventHosts.forEach(v => {
          if (!items.includes(v.name)) {
            items.push(v.name)
          }

        })
      })
      break;
  }

  return items;
}

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getFormattedEvents = (events) => {
  const allEvents = events ?? [];
  const formattedEvents = allEvents.map(event => {

    // Start Date
    const startDateValue = new Date(event.node?.startDate);
    const startDateTimeStamp = startDateValue.getTime()
    const startMonthIndex = startDateValue.getMonth();
    const startDay = startDateValue.getDate();
    const startDayString = startDateValue.toLocaleDateString('us-en', { weekday: 'short' });
    const startYear = startDateValue.getFullYear()

    // End Date
    const endDateValue = new Date(event.node?.endDate);
    const endDateTimeStamp = endDateValue.getTime();
    const endMonthIndex = endDateValue.getMonth();
    const endDay = endDateValue.getDate();

    // Event date format
    const showEndDate = startDay === endDay ? false : true;
    const fullDateFormat = startMonthIndex === endMonthIndex ? `${months[startMonthIndex]} ${startDateValue.getDate()}${showEndDate ? ' - ' : ''}${showEndDate ? endDateValue.getDate() : ''}, ${endDateValue.getFullYear()} ` : `${months[startMonthIndex]} ${startDateValue.getDate()} - ${months[endMonthIndex]} ${endDateValue.getDate()}, ${endDateValue.getFullYear()}`

    // Host names
    const tempEventNames = []
    const eventHosts = []
    event?.node?.eventHosts?.forEach(hs => {
      const splitted = hs.split('|');
      if (splitted.length === 1) {
        splitted.push('pln-default-host-logo.svg')
      }

      if (!tempEventNames.includes(splitted[0])) {
        tempEventNames.push(splitted[0])
        const newHostEmtry = { name: splitted[0], logo: `/uploads/${splitted[1]}`, primaryIcon: `/icons/pln-primary-host.svg` }
        eventHosts.push(newHostEmtry)
      }
    })

    // Preferred Contacts
    const preferredContacts = event?.node?.preferredContacts?.map(pc => {
      const splitted = pc.split('|');
      const supportedLinks = ['twitter', 'discord', 'telegram', 'whatsapp', 'facebook', 'instagram', 'linkedin', 'email']
      return {
        name: splitted[0],
        logo: supportedLinks.includes(splitted[0].toLowerCase().trim()) ? `/icons/pln-contacts-${splitted[0]}.svg` : `/icons/pln-contacts-default.svg`,
        link: splitted[1]
      }
    }) ?? []

    //trimming topics
    const allTopics = event.node?.eventTopic ?? []
    const trimmedTopics = allTopics.slice(0, 4);

    // Logos/images
    const locationLogo = '/icons/pln-location-icon.svg'
    const calenderLogo = '/icons/calender-icon.svg'
    let tagLogo = ''

    if (event?.node?.tag?.toLowerCase().trim() === 'pln event') {
      tagLogo = '/icons/pln-event-icon.svg'
    } else if (event?.node?.tag?.toLowerCase().trim() === 'industry event') {
      tagLogo = '/icons/pln-industry-icon.svg'
    }

    return {
      eventName: event.node?.eventName,
      website: event.node?.website,
      location: event.node?.location,
      startDate: event.node?.startDate,
      endDate: event.node?.endDate,
      dateTBD: event.node?.dateTBD,
      dri: event.node?.dri,
      tag: event.node?.tag,
      description: event?.node?.eventDescription,
      juanSpeaking: event.node?.juanSpeaking,
      eventOrg: event?.node?.eventOrg,
      eventLogo: event?.node?.eventLogo,
      eventType: event?.node?.eventType,
      venueName: event?.node?.venueName,
      venueMapsLink: event?.node?.venueMapsLink,
      venueAddress: event?.node?.venueAddress,
      isFeaturedEvent: event?.node?.isFeaturedEvent ?? false,
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
      externalLinkIcon: '/icons/pl-external-icon.svg'
    }
  })

  return formattedEvents;
}

export const reducerFunction = (oldstate, action) => {
  const resetted = getInitialState(oldstate.events);
  const newState = { ...oldstate }
  switch (action.type) {
    case 'addMultiItemToFilter':
      newState.filters[action.key].push(action.value)
      return newState;
    case 'removeMultiItemFromFilter':
      newState.filters[action.key] = oldstate.filters[action.key].filter(item => item !== action.value);
      return newState;
    case 'clearMultiSelect':
      newState.filters[action.key] = [];
      return newState;
    case 'setSingleSelectFilter':
      if (oldstate.filters[action.key] === action.value && action.key !== 'year') {
        newState.filters[action.key] = '';
      } else {
        newState.filters[action.key] = action.value;
      }

      return newState;
    case 'toggleMobileFilter':
      newState.flags.isMobileFilterActive = !oldstate.flags.isMobileFilterActive;
      return newState;
    case 'clearAllFilters':
      newState.filters = resetted.filters;
      newState.filteredItems = resetted.filteredEvents;
      return newState;
    case 'setScrollupStatus':
      newState.flags.isScrolledUp = action.value;
      return newState;
    case 'setStartDateRange':
      newState.filters.dateRange.start = action.value;
      return newState;
    case 'setEndDateRange':
      newState.filters.dateRange.end = action.value;
      return newState;
    case 'setEventMenu':
      newState.flags.eventMenu = action.value;
      return newState;

  }
}

export const getNoFiltersApplied = (filters) => {
  let count = 0;
  if (filters.locations.length > 0) {
    count++
  }
  if (filters.topics.length > 0) {
    count++
  }

  if (filters.year !== `${new Date().getFullYear()}`) {
    count++
  }

  if (filters.eventType !== '') {
    count++
  }

  if (filters.eventHosts.length > 0) {
    count++
  }
  if (filters.isPlnEventOnly === true) {
    count++
  }

  if (filters.dateRange.start.toLocaleDateString() !== new Date(`01/01/${new Date().getFullYear()}`).toLocaleDateString() || filters.dateRange.end.toLocaleDateString() !== new Date(`12/31/${new Date().getFullYear()}`).toLocaleDateString()) {
    count++
  }


  return count;
}

export const getInitialState = (events) => {
  return {
    filteredItems: { year: `${new Date().getFullYear()}`, location: [], isPlnEventOnly: false, topics: [], eventHosts: [], eventType: '', dateRange: { start: new Date(`01/01/${new Date().getFullYear()}`), end: new Date(`12/31/${new Date().getFullYear()}`) } },
    filters: { year: `${new Date().getFullYear()}`, isPlnEventOnly: false, locations: [], topics: [], eventHosts: [], eventType: '', dateRange: { start: new Date(`01/01/${new Date().getFullYear()}`), end: new Date(`12/31/${new Date().getFullYear()}`) } },
    flags: { isMobileFilterActive: false, isScrolledUp: false, eventMenu: 'timeline' },
    events: [...events],
    filteredEvents: [...events]
  }
}

export const getDaysValue = (count, monthValue) => {
  const newDate = new Date(`${monthValue}/01/2023`)
  const items = [];
  const countForEmpty = newDate.getUTCDay()
  if (count === 0) {
    return []
  }
  for (let j = 1; j <= countForEmpty; j++) {
    items.push("")
  }
  for (let i = 1; i <= count; i++) {
    items.push(i)
  }

  return items
}

export const getFilteredEvents = (allEvents, filters) => {
  const filteredItems = [...allEvents].filter(item => {
    if (item.startYear !== filters.year) {
      return false
    }

    if (filters.locations.length > 0 && !filters.locations.includes(item.location)) {
      return false
    }


    if (filters.isPlnEventOnly && item?.tag?.toLowerCase().trim() !== 'pln event') {
      return false
    }

    if (filters.eventType !== '' && filters?.eventType?.toLowerCase().trim() !== item?.eventType?.toLowerCase().trim()) {
      return false
    }

    if (filters.dateRange.start.getTime() !== new Date(`01/01/${filters.year}`).getTime() && filters.dateRange.start.getTime() > item?.endDateTimeStamp) {
      return false
    }

    if (filters.dateRange.end.getTime() !== new Date(`12/31/${filters.year}`).getTime() && filters.dateRange.end.getTime() < item?.startDateTimeStamp) {
      return false
    }

    if (filters.topics.length > 0) {
      let result = false;
      const eventTopics = item?.topics ?? [];
      eventTopics.forEach(topic => {
        if (filters.topics.includes(topic)) {
          result = true;
        }
      })
      if (!result) {
        return false
      }
    }

    if (filters.eventHosts.length > 0) {
      let result = false;
      const eventHosts = item?.eventHosts ?? [];
      eventHosts.forEach(eh => {
        if (filters.eventHosts.includes(eh.name)) {
          result = true;
        }
      })
      if (!result) {
        return false
      }
    }

    return true;
  })

  return filteredItems;
}
export const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
}
export const getMonthWiseEvents = (filterdList) => {
  const monthWiseEvents = []
  months.forEach((m, i) => {
    const forSpecificMonth = [...filterdList].filter(e => e.startMonthIndex === i)
    const newMonthData = {
      name: m,
      index: i,
      events: [...forSpecificMonth]
    }
    if (forSpecificMonth.length > 0) {
      monthWiseEvents.push(newMonthData);
    }
  })

  return monthWiseEvents
}