import { IEvent, IEventResponse, ISelectedItem } from "@/types/events.type";
import { IEventHost } from "@/types/shared.type";
import { CURRENT_YEAR, EVENT_TYPES, EVENT_YEARS, MONTHS, URL_QUERY_VALUE_SEPARATOR } from "@/utils/constants";
import { stringToSlug } from "@/utils/helper";

export const getBannerData = async () => {
    if (process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_URL && process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_TOKEN) {
        const bannerResponse = await fetch(process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_TOKEN
            }
        })

        if (!bannerResponse.ok) {
            return { isError: true, message: "Something went wrong" }
        }

        return bannerResponse.json();
    }
}

export const getEvents = async () => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/eventjson`,
        {
            method: "GET",
            // next: { tags: ["pln-events-tina-service"] },
        }
    )
    if (!response.ok) {
        return { isError: true, message: "Something went wrong!" }
    }
    return response.json();
}

export const getFilterValues = (events: IEvent[], selectedItems: ISelectedItem) => {
    const uniqueValues = getUniqueValuesFromEvents(events);
    return [
        { name: "Year", type: 'single-select', items: uniqueValues.years, selectedItem: selectedItems.year, placeholder: 'Filter by year', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'year', iconUrl: '/icons/pl-calender-icon.svg' },
        { name: "Locations", type: 'multi-select', items: uniqueValues.locations, selectedItems: selectedItems.locations, placeholder: 'Filter by location', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'locations', iconUrl: '/icons/pl-location-icon.svg' },
        { name: "Date Range", type: 'date-range', dateRange: { startDate: selectedItems.startDate, endDate: selectedItems.endDate }, identifierId: 'dateRange', iconUrl: '/icons/pl-calender-icon.svg' },
        { name: "Event Hosts", type: 'multi-select', items: uniqueValues.eventHosts, selectedItems: selectedItems.eventHosts, placeholder: 'Filter by Host Name', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'eventHosts', iconUrl: '/icons/pln-hosts-icon.svg' },
        { name: "Event Type", type: 'tags', items: EVENT_TYPES, selectedItem: selectedItems.eventType, identifierId: 'eventType' },
        { name: "Topics", type: 'multi-select', items: uniqueValues.topics, selectedItems: selectedItems.topics, placeholder: 'Filter by topics', dropdownImgUrl: '/icons/pln-arrow-down.svg', identifierId: 'topics', iconUrl: '/icons/pl-topics-icon.svg' },
    ]

}

export const getUniqueValuesFromEvents = (allEvents: IEvent[]) => {
    const filterValues: any = {
        years: EVENT_YEARS,
        locations: [],
        eventHosts: [],
        topics: [],
    }


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
            })
        }

        // Topics
        if (event?.topics?.length > 0) {
            event.topics.map((topic: string) => {
                if (!filterValues.topics.includes(topic)) {
                    filterValues.topics.push(topic);
                }
            })
        }
    })
    return filterValues;
}

export const getInitialSelectedItems = () => {
    return {
        viewType: "timeline",
        year: CURRENT_YEAR,
        locations: [],
        startDate: `01/01/${CURRENT_YEAR}`,
        endDate: `12/31/${CURRENT_YEAR}`,
        eventHosts: [],
        eventType: '',
        topics: [],
        isPlnEventOnly: false,
    }
}

export const getSelectedItems = (searchParams: any) => {
    const year = searchParams.year ?? CURRENT_YEAR;
    return {
        viewType: searchParams?.viewType ?? "timeline",
        year,
        locations: getValuesFromQuery(searchParams.locations),
        startDate: searchParams.start ?? `01/01/${year}`,
        endDate: searchParams.end ?? `12/31/${year}`,
        eventHosts: getValuesFromQuery(searchParams.eventHosts),
        eventType: searchParams.eventType ?? '',
        topics: getValuesFromQuery(searchParams.topics),
        isPlnEventOnly: searchParams.isPlnEventOnly === "true" ? true : false,
    }
}

export const getValuesFromQuery = (query: string) => {
    try {
        if (query) {
            return decodeURIComponent(query).split(URL_QUERY_VALUE_SEPARATOR);
        }
        return [];
    } catch (error) {
        return [];
    }
}

export const getFormattedEvents = (events: IEventResponse[]) => {
    const allEvents = events ?? [];
    const formattedEvents = allEvents?.map((event: any) => {
        // Start Date
        const startDateValue = new Date(event?.startDate);
        const startDateTimeStamp = startDateValue.getTime()
        const startMonthIndex = startDateValue.getMonth();
        const startDay = startDateValue.getDate();
        const startDayString = startDateValue.toLocaleDateString('us-en', { weekday: 'short' });
        const startYear = startDateValue.getFullYear()

        // End Date
        const endDateValue = new Date(event.endDate);
        const endDateTimeStamp = endDateValue.getTime();
        const endMonthIndex = endDateValue.getMonth();
        const endDay = endDateValue.getDate();

        // Event date format
        const showEndDate = startDay === endDay ? false : true;
        const fullDateFormat = startMonthIndex === endMonthIndex ? `${MONTHS[startMonthIndex]} ${startDateValue.getDate()}${showEndDate ? ' - ' : ''}${showEndDate ? endDateValue.getDate() : ''}, ${endDateValue.getFullYear()} ` : `${MONTHS[startMonthIndex]} ${startDateValue.getDate()} - ${MONTHS[endMonthIndex]} ${endDateValue.getDate()}, ${endDateValue.getFullYear()}`

        // Host names
        const tempEventNames: string[] = []
        const eventHosts: IEventHost[] = []
        event?.eventHosts?.forEach((hs: string) => {
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
        const preferredContacts = event?.preferredContacts?.map((pc: string) => {
            const splitted = pc.split('|');
            const supportedLinks = ['twitter', 'discord', 'telegram', 'whatsapp', 'facebook', 'instagram', 'linkedin', 'email']
            return {
                name: splitted[0],
                logo: supportedLinks.includes(splitted[0].toLowerCase().trim()) ? `/icons/pln-contacts-${splitted[0]}.svg` : `/icons/pln-contacts-default.svg`,
                link: splitted[1]
            }
        }) ?? []

        //trimming topics
        const allTopics = event.eventTopic ?? []
        const trimmedTopics = allTopics.slice(0, 4);

        // Logos/images
        const locationLogo = '/icons/pln-location-icon.svg'
        const calenderLogo = '/icons/calender-icon.svg'
        let tagLogo = ''

        if (event?.tag?.toLowerCase().trim() === 'pln event' || event?.tag?.toLowerCase().trim() === 'pl event') {
            event.tag = "PL Event"
            tagLogo = '/icons/pln-event-icon.svg'
        } else if (event?.tag?.toLowerCase().trim() === 'industry event') {
            tagLogo = '/icons/pln-industry-icon.svg'
        }
        const eventSlug = `${stringToSlug(event.eventName)}-${new Date(event.startDate).getTime()}-${new Date(event.endDate).getTime()}`;
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
            externalLinkIcon: '/icons/pl-external-icon.svg'
        }
    })

    return formattedEvents;
}




export const getFilteredEvents = (allEvents: IEvent[], selectedItems: ISelectedItem) => {
    const filteredItems = [...allEvents].filter(item => {
        if (item?.startYear !== selectedItems?.year) {
            return false
        }

        if (selectedItems?.locations?.length > 0 && !selectedItems.locations.includes(item.location)) {
            return false
        }


        if (selectedItems?.isPlnEventOnly && item?.tag?.toLowerCase().trim() !== 'pln event' && item?.tag?.toLowerCase().trim() !== 'pl event') {
            return false
        }

        if (selectedItems?.eventType !== '' && selectedItems?.eventType?.toLowerCase().trim() !== item?.eventType?.toLowerCase().trim()) {
            return false
        }

        if (selectedItems?.startDate) {
            if (new Date(selectedItems.startDate).getTime() !== new Date(`01/01/${selectedItems.year}`).getTime() && new Date(selectedItems.startDate).getTime() > item?.endDateTimeStamp) {
                return false
            }
        }

        if (selectedItems?.endDate) {

            if (new Date(selectedItems.endDate).getTime() !== new Date(`12/31/${selectedItems.year}`).getTime() && new Date(selectedItems.endDate).getTime() < item?.startDateTimeStamp) {
                return false
            }
        }

        if (selectedItems?.topics?.length > 0) {
            let result = false;
            const eventTopics = item?.topics ?? [];
            eventTopics.forEach((topic: string) => {
                if (selectedItems.topics.includes(topic)) {
                    result = true;
                }
            })
            if (!result) {
                return false
            }
        }

        if (selectedItems?.eventHosts?.length > 0) {
            let result = false;
            const eventHosts = item?.eventHosts ?? [];
            eventHosts.forEach((eh: IEventHost) => {
                if (selectedItems.eventHosts.includes(eh.name)) {
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