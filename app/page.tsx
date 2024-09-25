import Events from "@/components/page/events/events";
import FilterWrapper from "@/components/page/events/filter-wrapper";
var fs = require('fs');
import {
  getBannerData,
  getEvents,
  getFilterValues,
  getFilteredEvents,
  getFormattedEvents,
  getInitialSelectedItems,
  getSelectedItems,
} from "@/service/events.service";
import { IEvent, IFilterValue, ISelectedItem } from "@/types/events.type";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PL network events",
  // description: "Meet virtually and IRL at LabDay and LabWeek , and much more",
  // openGraph: {
  //   title: "PL network events",
  //   description: "Meet virtually and IRL at LabDay and LabWeek , and much more",
  //   images: [
  //     {
  //       url: "",
  //       width: 1200,
  //       height: 600,
  //     },
  //   ],
  // },
};

export default async function Home(params: any) {
  const searchParams = params.searchParams;
  const {
    isError,
    events,
    filterValues,
    selectedItems,
    bannerData,
    rawEvents,
  } = await getPageData(params);

  const viewType = searchParams?.viewType;
  // const showBanner = (bannerData && bannerData?.message?.length > 0) && (searchParams?.showBanner !== "false")
  const showBanner = false;

  if (isError) {
    return <div></div>
  }

  return (
    <main className={styles.hp}>
      <div className={styles.hp__content}>
        <aside className={styles.hp__filter}>
          <FilterWrapper
            showBanner = {showBanner}
            filterValues={filterValues}
            selectedItems={selectedItems}
            events={events}
          />
        </aside>
        <div className={styles.hp__events}>
          <Events
           showBanner={showBanner}
            rawEvents={rawEvents}
            viewType={viewType}
            events={events}
            selectedItems={selectedItems}
          />
        </div>
      </div>
    </main>
  );
}

const getPageData = async (params: any) => {
  const searchParams = params?.searchParams;
  let events: IEvent[] = [];
  let rawEvents: IEvent[] = [];
  let bannerData = null;
  let isError = false;
  let selectedItems: ISelectedItem = getInitialSelectedItems();
  let filterValues: IFilterValue[] = [];
  try {
    selectedItems = getSelectedItems(searchParams);
    const [eventsResponse, bannerResponse] = await Promise.all([
      getEvents(),
      getBannerData(),
    ]);

    if (eventsResponse?.isError || bannerResponse?.isError) {
      return {
        isError: true,
        events,
        rawEvents,
        filterValues,
        bannerData,
        selectedItems
      };
    }

    bannerData = bannerResponse?.data ?? null;
    events = getFormattedEvents(eventsResponse?.data) ?? [];
    rawEvents = events;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',rawEvents.length);
    // fs.writeFileSync('./jsoncontent/'+'check'+'.json', JSON.stringify({'name':'nivz'}, null, 2) , 'utf-8');
    rawEvents.map((event) => {
      // const stream = fs.createWriteStream('./jsoncontent/'+event.eventName+'.json');
      let filename = event.eventName.replaceAll(/[^a-zA-Z0-9 ]/g, "").split(' ').join('-').toLowerCase();
      console.log(filename);
      while (fs.existsSync("jsoncontent/"+filename+".json")) {
        filename = filename + '-1';
        console.log("Found file");
      }
      try{
        fs.writeFileSync('jsoncontent/'+filename+'.json', JSON.stringify(event, null, 2) , 'utf-8');  
      }catch(e){
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',filename);
        
        console.log(e);
      }
      // fs.writeFileSync('jsoncontent/'+filename+'.json', JSON.stringify(event, null, 2) , 'utf-8');
      // stream.write(event);
    });

    filterValues = getFilterValues(events, selectedItems);
    events = getFilteredEvents(events, selectedItems).sort(
      (firstEvent, secondEvent) =>
        firstEvent.startDateTimeStamp - secondEvent.startDateTimeStamp
    );
    return {
      isError,
      events,
      rawEvents,
      filterValues,
      bannerData,
      selectedItems,
    };
  } catch (error) {
    console.error(error);
    return {
      isError: true,
      events,
      rawEvents,
      filterValues,
      selectedItems,
      bannerData,
    };
  }
};
