import { useState } from "react";
import { useTina } from "tinacms/dist/react";
import { client } from "../.tina/__generated__/client";
import AppHeader from '../components/core/app-header'
import HpSideBar from "../components/page/home/hp-sidebar";
import HpTimeline from "../components/page/home/hp-timeline";
export default function IndexPage(props: AsyncReturnType<typeof getStaticProps>["props"]) {
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data, });
  const eventsData = props.data.eventConnection.edges;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const events = [...eventsData].map(event => {

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

    if (event?.node?.eventTopic) {
      event.node['topicitems'] = event.node.eventTopic
    }

    // Logos/images
    const locationLogo = '/icons/pln-location-icon.svg'
    const calenderLogo = '/icons/calender-icon.svg'
    let tagLogo = ''

    if(event?.node?.tag?.toLowerCase().trim() === 'pln event') {
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
      topicitems: event?.node?.topicitems ?? [],
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

  const orderedEventsList = [...events].sort((a,b) => a.startDateTimeStamp - b.startDateTimeStamp)

  const [filters, setFilters] = useState({ year: `${new Date().getFullYear()}`, location: 'All', isPlnEventOnly: false, eventname: 'All', topic: 'All', eventType: '',  })

  const filterdList = [...orderedEventsList].filter(item => {

    if (item.startYear !== filters.year) {
      console.log(item)
      return false
    }

    if (filters.location !== 'All' && filters.location !== item.location) {
      return false
    }

    if (filters.isPlnEventOnly && item?.tag?.toLowerCase().trim() !== 'pln event') {
      return false
    }

    if (filters.eventType !== '' && filters?.eventType?.toLowerCase().trim() !== item?.eventType?.toLowerCase().trim()) {
      return false
    }

    if (filters.topic !== 'All' && !item?.topics?.includes(filters.topic)) {
      return false
    }

    return true;
  })

  const monthWiseEvents = [];
  
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


  const onFilterChange = (name, value, index) => {
    let newFilter = { ...filters }
    newFilter[name] = value
    setFilters({ ...newFilter })
    console.log(name, value)
    // setFilters(v => v[name] = value)
  }

  const onClearFilters = () => {
    setFilters({ year: `${new Date().getFullYear()}`, location: 'All', isPlnEventOnly: false, eventname: 'All', topic: 'All', eventType: '' })
    
  }


  return <>
    <AppHeader />
    <div className="hp">

      {/*** EVENTS FILTERING ***/}
      <div className="hp__sidebar">
        <HpSideBar onFilterChange={onFilterChange} onClearFilters={onClearFilters} events={[...events]} />
      </div>

      {/*** EVENTS TIMELINE ***/}
      <div className="hp__maincontent">
        <HpTimeline filters={filters} monthWiseEvents={monthWiseEvents}/>
      </div>
    </div>
    <style jsx>
      {
        `
      .hp {width: 100%; height: 100%; display: flex;}
      .hp__sidebar {width: 300px; border: 1px solid #CBD5E1; padding-top: 60px;}
      .hp__maincontent {width: calc(100% - 300px); padding-top: 60px; background: #f2f7fb; height: 100%;}
    
      `
      }
    </style>
  </>
}

export const getStaticProps = async ({ params }) => {

  const eventsListData = await client.queries.eventConnection({ last: -1 });
  return {
    props: {
      data: eventsListData.data,
      query: eventsListData.query,
      variables: eventsListData.variables
    },
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
