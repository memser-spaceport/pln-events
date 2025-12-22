import FilterBox from "@/components/core/filter-box";
import ListView from "@/components/page/list/list-view";
import Toolbar from "@/components/page/events/toolbar";
import styles from "./page.module.css";
import DetailView from "@/components/page/event-detail/event-detail-popup/detail-view";
import { getFilterValuesFromEvents, getFilteredEvents, sortEventsByStartDate } from "@/utils/helper";
import LegendsModal from "@/components/page/event-detail/legends-modal";
import ProgramView from "@/components/page/events/program-view";
import { getAllEvents, getCalendarData, getLocations } from "@/service/events.service";



async function getPageData(searchParams: any, type: string) {
  try {
    const locations = await getLocations();
    const locationParam = searchParams?.location ?? "";
    // Match location by lowercase key (getLocations uses lowercase keys)
    const locationKey = locationParam.toLowerCase();
    
    let config = locations[locationKey];
    
    if (!config && locationParam.trim().startsWith("[")) {
         try {
             // Try to parse JSON param
             const parsedAssociations = JSON.parse(locationParam);
             if (Array.isArray(parsedAssociations)) {
                 config = {
                     title: "Custom Selection", // Placeholder, API uses locationAssociations
                     locationAssociations: parsedAssociations,
                     timezone: "" 
                 };
             }
         } catch(e) {
             // Fallback
         }
    }
    
    if (!config) {
        config = locationParam ? { title: locationParam, locationAssociations: [] } : undefined;
    }
    
    const currentYear = new Date().getFullYear();
    const yearFilter = searchParams?.year ? parseInt(searchParams.year, 10) : currentYear;

    const eventsResponse = await getAllEvents(config, yearFilter);
    const calendarResponse = await getCalendarData(config);


    if (eventsResponse.isError) {
      return { isError: true, filteredEvents: [] };
    }
    
    const configLocations = Object.values(locations).map((item: any) => {
      return {
        name: item.title,
        title: item.title,  
        timezone: item.timezone,
        locationAssociations: item.locationAssociations
      }
    });


    eventsResponse.data.configLocations = configLocations;
    
    const { rawFilterValues, selectedFilterValues, initialFilters } =
      getFilterValuesFromEvents(eventsResponse.data, searchParams);
    const filteredEvents = getFilteredEvents(eventsResponse.data, searchParams, type) ?? [];
    const sortedAndFilteredEvents = sortEventsByStartDate(filteredEvents);
    
    return {
      events: eventsResponse.data, 
      rawFilterValues,
      selectedFilterValues,
      filteredEvents: sortedAndFilteredEvents,
      initialFilters,
      calendarData: calendarResponse.data ?? {}
    };
  } catch (e) {
    console.error("error response", e);
    return { isError: true, filteredEvents: [] };
  }
}

export default async function Page({ searchParams, params }: any) {
  const type = params["type"];

  const {
    events,
    rawFilterValues,
    selectedFilterValues,
    filteredEvents,
    initialFilters,
    isError,
    calendarData
  } = await getPageData(searchParams,type);

  if (isError) {
    return (
      <div className={styles.error}>
        <h2>Sorry. Unexpected error happened. Please try again later</h2>
      </div>
    );
  }

  return (
    <>
      <div className={styles.schedule}>
        <div className={styles.schedule__tbar}>
          <Toolbar
            selectedFilterValues={selectedFilterValues}
            initialFilters={initialFilters}
            searchParams={searchParams}
            type={type}
            events={filteredEvents}
            calendarData={calendarData}
          />
        </div>
        <LegendsModal />

        <div className={styles.schedule__content}>
          <div className={styles.schedule__content__left}>
            <FilterBox
              searchParams={searchParams}
              selectedFilterValues={selectedFilterValues}
              rawFilters={rawFilterValues}
              initialFilters={initialFilters}
              viewType={type}
              filteredEvents={filteredEvents}
            />
          </div>
            <div className={styles.schedule__content__right}>
              {type === "list" && (
                <ListView
                  events={filteredEvents}
                  allEvents={events}
                  viewType={type}
                />
              )}
              {type === "program" && <ProgramView events={filteredEvents} viewType={type} />}
            </div>
        </div>
      </div>
      <DetailView events={filteredEvents} />
    </>
  );
}
