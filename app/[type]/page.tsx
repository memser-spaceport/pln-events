import FilterBox from "@/components/core/filter-box";
import ListView from "@/components/page/list/list-view";
import Toolbar from "@/components/page/events/toolbar";
import styles from "./page.module.css";
import DetailView from "@/components/page/event-detail/event-detail-popup/detail-view";
import { getFilterValuesFromEvents, getFilteredEvents } from "@/utils/helper";
import LegendsModal from "@/components/page/event-detail/legends-modal";
import ProgramView from "@/components/page/events/program-view";
import { getAllEvents } from "@/service/events.service";
import { getLocations } from "@/service/events.service";

async function getPageData(searchParams: any, type: string) {
  try {
    const locations = await getLocations();
    const location = searchParams?.location ?? "";
    const config = locations[location];
    const eventsResponse = await getAllEvents(config);

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
    return {
      events: eventsResponse.data,
      rawFilterValues,
      selectedFilterValues,
      filteredEvents,
      initialFilters
    };
  } catch (e) {
    console.error("error response", e);
    return { isError: true, filteredEvents: [] };
  }
}

export default async function Page({ searchParams, params }: any) {
  const type = params["type"];

  const {
    rawFilterValues,
    selectedFilterValues,
    filteredEvents,
    initialFilters,
    isError
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
