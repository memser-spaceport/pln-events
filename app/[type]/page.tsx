import FilterBox from "@/components/core/filter-box";
import ListView from "@/components/page/list/list-view";
import Toolbar from "@/components/page/events/toolbar";
import styles from "./page.module.css";
import DetailView from "@/components/page/event-detail/event-detail-popup/detail-view";
import {
  getFilterValuesFromEvents,
  getFilteredEvents,
  groupByStartDate,
  sortEventsByStartDate,
  formatDateTime,
} from "@/utils/helper";
import LegendsModal from "@/components/page/event-detail/legends-modal";
import ProgramView from "@/components/page/events/program-view";
import { getAllEvents } from "@/service/events.service";
import { getLocations } from "@/service/events.service";

export const dynamic = 'force-dynamic';

async function getPageData(searchParams: any, type: string) {
  try {
    const locations = await getLocations();
    const location = searchParams?.location ?? "";
    const config = locations[location];
    
    const currentYear = new Date().getFullYear();
    const yearFilter = searchParams?.year ? parseInt(searchParams.year, 10) : currentYear;

    const eventsResponse = await getAllEvents(config, yearFilter, type);

    if (eventsResponse.isError) {
      return { isError: true, filteredEvents: [] };
    }
    
    const configLocations = Object.values(locations).map((item: any) => {
      return {
        name: item.title,
        title: item.title,  
        timezone: item.timezone,
      }
    });


    eventsResponse.data.configLocations = configLocations;
    
    const { rawFilterValues, selectedFilterValues, initialFilters } =
      getFilterValuesFromEvents(eventsResponse.data, searchParams);
      
    const filteredEvents = getFilteredEvents(eventsResponse.data, searchParams,type) ?? [];
    const sortedEvents = sortEventsByStartDate(filteredEvents);
    const groupedEvents = groupByStartDate(sortedEvents);
    const totalEventCount = sortedEvents.filter((event: any) => !event.isHidden).length;
    const listViewYear =
      sortedEvents.length > 0
        ? formatDateTime(sortedEvents[0].startDate, sortedEvents[0].timezone, "YYYY")
        : undefined;
    return {
      events: eventsResponse.data, 
      rawFilterValues,
      selectedFilterValues,
      filteredEvents,
      initialFilters,
      sortedEvents,
      groupedEvents,
      totalEventCount,
      listViewYear
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
    sortedEvents,
    groupedEvents,
    totalEventCount,
    listViewYear,
    isError
  } = await getPageData(searchParams,type);

  if (isError) {
    return (
      <div className={styles.error}>
        <h2>Sorry. Unexpected error happened. Please try again later</h2>
      </div>
    );
  }

  // Create ID-slug map for DetailView
  const eventIdSlugMap = filteredEvents.map((event: any) => ({
    id: event.id,
    slug: event.slug,
  }));

  return (
    <>
      <div className={styles.schedule}>
        <div className={styles.schedule__tbar}>
          <Toolbar
            selectedFilterValues={selectedFilterValues}
            initialFilters={initialFilters}
            searchParams={searchParams}
            type={type}
            sortedEvents={sortedEvents}
            groupedEvents={groupedEvents}
            totalEventCount={totalEventCount}
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
                  sortedEvents={sortedEvents}
                  groupedEvents={groupedEvents}
                  year={listViewYear}
                  viewType={type}
                />
              )}
              {type === "program" && <ProgramView events={filteredEvents} viewType={type} />}
            </div>
        </div>
      </div>
      <DetailView eventIdSlugMap={eventIdSlugMap} />
    </>
  );
}
