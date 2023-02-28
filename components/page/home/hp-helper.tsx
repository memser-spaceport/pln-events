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
    const fullDateFormat = startMonthIndex === endMonthIndex ? `${months[startMonthIndex]} ${startDateValue.getDate()} ${showEndDate ? '-' : ''} ${showEndDate ? endDateValue.getDate() : ''}, ${endDateValue.getFullYear()} ` : `${months[startMonthIndex]} ${startDateValue.getDate()} - ${months[endMonthIndex]} ${endDateValue.getDate()}, ${endDateValue.getFullYear()}`

    // Host names
    const eventHosts = event?.node?.eventHosts?.map(hs => {
      const splitted = hs.split('|');
      if(splitted.length === 1) {
        splitted.push('')
      }
      return {
        name: splitted[0],
        logo: splitted[1],
      }
    })

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
      topics: event.node?.eventTopic,
      eventHosts,
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
  }
}

export const getInitialState = (events) => {
  return {
    filteredItems: { year: `${new Date().getFullYear()}`, location: [], isPlnEventOnly: false, topic: [], eventType: '' },
    filters: { year: `${new Date().getFullYear()}`, isPlnEventOnly: false, locations: [], topics: [], hosts: [], eventType: '' },
    flags: { isMobileFilterActive: false },
    events: [...events],
    filteredEvents: [...events]
  }
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

    return true;
  })

  return filteredItems;
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