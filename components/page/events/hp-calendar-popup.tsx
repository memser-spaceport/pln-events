import { useState, useEffect } from "react"
import PlEventCard from "../../ui/pl-event-card";
import { useHash } from "@/hooks/use-hash";
import { useRouter } from "next/navigation";
import useEventsAnalytics from "@/analytics/events.analytics";
import { IEvent } from "@/types/events.type";

function HpCalendarPopup(props: any) {

    const rawEvents = props?.rawEvents ?? [];
    const monthName = props?.monthName;
    const [selectedEvent, setSelectedEvent] = useState({});
    const [isEventCardActive, setEventCardStatus] = useState(false);
    const hash = useHash();
    const router = useRouter();
    const { onCardLinkClicked } = useEventsAnalytics()

    const onCloseCard = () => {
        setEventCardStatus(false);
        setSelectedEvent({});
        router.replace(`${window.location.pathname}${window.location.search}`, { scroll: false})
    }

    const onLinkItemClicked = (item: string, url: string) => {
        onCardLinkClicked(item, url, 'calender')
    }

    useEffect(() => {
        function handleEventPopup(e: any) {
            setEventCardStatus(true);
            setSelectedEvent(e.detail)
        }
        document.addEventListener('showCalenderPopup', handleEventPopup);
        return function() {
            document.removeEventListener('showCalenderPopup', handleEventPopup)
        }
    },[])

    useEffect(() => {
        if(hash) {
          const hashValue: string = hash;
          const slug = hashValue.split('#')[1]

           const foundEvent = rawEvents.findIndex((e: IEvent)=> e.slug === slug);
          if(foundEvent >= 0 && slug) {
            setSelectedEvent(rawEvents[foundEvent])
            setEventCardStatus(true);
          } 
        }
      }, [hash])

    return <>
        {isEventCardActive && <div className="eventCard">
            <div className="eventCard__item">
                <PlEventCard onLinkItemClicked={onLinkItemClicked} {...selectedEvent} />
                <p onClick={onCloseCard} className="eventCard__item__close">
                    <img src="/icons/pln-close-white.svg" className="eventCard__item__close__img" />
                </p>

            </div>
        </div>}

        <style jsx>
            {
                `
                    .eventCard {display: flex; position: fixed; top:0; left:0; right:0; width: 100vw; align-items: center; justify-content: center; height: 100vh; background: rgb(0,0,0,0.8); z-index: 15;}
                    .eventCard__item {width: 90vw; position: relative;}
                    .eventCard__item__close {position: absolute; top:-13px; border-radius: 50%; display: flex; align-items: center; justify-content: center; right: -10px; width: 26px; height: 26px; background: #475569; border: 1px solid rgba(255, 255, 255, 0.5); cursor: pointer;}
                    .eventCard__item__close__img {width:16px; height: 16px; }
                    @media(min-width: 1200px) {

                        .eventCard__item {width: 360px; position: relative;}
                    }
                    `
            }
        </style>
    </>
}

export default HpCalendarPopup