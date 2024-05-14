import { IEventHost } from "./shared.type";


export interface IEventResponse {
        eventName: string;
        website: string;
        location: string;
        startDate: string;
        endDate: string;
        dateTBD: boolean;
        dri: string;
        tag: string;
        description: string;
        juanSpeaking: string;
        eventOrg: string;
        eventLogo: string;
        eventType: string;
        venueName: string;
        venueMapsLink: string;
        venueAddress: string;
        isFeaturedEvent: boolean;
        topics: string[];
        eventHosts: string[] | null;
        preferredContacts: string[] | null;
        startDateTimeStamp: number;
        startMonthIndex: number;
        startDay: number;
        startDayString: string;
        startYear: string;
        endDateTimeStamp: number;
        endMonthIndex: number;
        endDay: number;
        fullDateFormat: string;
        tagLogo: string;
        calenderLogo: string;
        startDateValue: Date;
        endDateValue: Date;
        locationLogo: string;
        slug: string;
        externalLinkIcon: string;
}

export interface IFilterValue {
        name: string;
        type: string;
        items?: string[];
        dateRange?: { startDate: string; endDate: string };
        selectedItem?: string;
        selectedItems?: string[];
        placeholder?: string;
        dropdownImgUrl?: string;
        identifierId: string;
        iconUrl?: string;
}

export interface ISelectedItem {
        viewType: string;
        year: string;
        locations: string[];
        startDate: string;
        endDate: string;
        eventHosts: string[];
        eventType: string;
        topics: string[];
        isPlnEventOnly: boolean;
}


export interface IMonthwiseEvent {
        name: string;
        index: number;
        events: IEvent[];
}

export interface IEvent {
        eventName: string;
        website: string;
        location: string;
        startDate: string;
        endDate: string;
        dateTBD: boolean;
        dri: string | null;
        tag: string;
        description: string;
        juanSpeaking: string;
        eventOrg: string;
        eventLogo: string;
        eventType: string;
        venueName: string;
        venueMapsLink: string;
        venueAddress: string;
        isFeaturedEvent: boolean;
        topics: string[];
        eventHosts: IEventHost[];
        preferredContacts: {
                name: string;
                logo: string;
                link: string;
        }[];
        startDateTimeStamp: number;
        startMonthIndex: number;
        startDay: number;
        startDayString: string;
        startYear: string;
        endDateTimeStamp: number;
        endMonthIndex: number;
        endDay: number;
        fullDateFormat: string;
        tagLogo: string;
        calenderLogo: string;
        startDateValue: Date;
        endDateValue: Date;
        locationLogo: string;
        slug: string;
        externalLinkIcon: string;
}