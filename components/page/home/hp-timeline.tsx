import { useContext, useEffect, useState } from "react";
import PlEventCard from "../../ui/pl-event-card";
import { trackGoal } from "fathom-client";
import { HpContext } from "./hp-helper";

function HpTimeline(props) {
    const monthWiseEvents = props.monthWiseEvents ?? [];
    const filterdListCount = props.filterdListCount ?? 0
    const totalEventsCount = monthWiseEvents.reduce((count, m) => { return count + m.events.length }, 0)
    const { state } = useContext(HpContext)
    const { events } = state


    const onLinkItemClicked = (item) => {
        if (item === 'event') {
            trackGoal('DULOJY8I', 0)
        } else if (item === 'location') {
            trackGoal('UKSYEJLH', 0)
        }
    }

    const onScrollToCurrentMonth = () => {
        const currentTimeStamp = new Date().getTime()
        const currenMonthId = new Date().getMonth();
        const currentDay = new Date().getDate()
        const filteredMonthData = monthWiseEvents.filter(m => m.index >= currenMonthId);
        if(filteredMonthData.length > 0)  {
           const selectedMonthData =  filteredMonthData[0];
           const filteredEvents = selectedMonthData.events.filter(ev => ev.startDay >= currentDay);
           if(filteredEvents.length > 0) {
                const selectedEvent = filteredEvents[0];
                const scrollItem = document.getElementById(`m-${selectedEvent.startMonthIndex}-${selectedEvent.startDay}`);
                if (scrollItem) {
                    scrollItem.scrollIntoView({ behavior: "smooth", block: "center" })
                }

           }
        }


       /*  const futureTimeStamps = events.map(ev => ev.startDateTimeStamp).filter(v => v >= currentTimeStamp).sort((a, b) => a - b)
        
        
        if (futureTimeStamps.length > 0) {
            const foundDate = new Date(futureTimeStamps[0]);
            const scrollItem = document.getElementById(`m-${foundDate.getMonth()}-${foundDate.getDate()}`);
            if (scrollItem) {
                scrollItem.scrollIntoView({ behavior: "smooth", block: "nearest" })
            }
        } */
    }

    useEffect(() => {
        console.log(filterdListCount, 'changed')
        onScrollToCurrentMonth();
    }, [filterdListCount])




    return <>
        <div id="timeline-cn" className="hmt">
            <div className="hmt__cn">
                {totalEventsCount === 0 && <div className="hmt__cn__empty">
                    No matching events available.
                </div>}

                {monthWiseEvents.map(me => <div id={`m-${me.index}`} className="hmt__cn__sec">
                    {/*** MONTH DROPDOWN ***/}
                    <p className="hmt__cn__sec__month">{me.name}</p>

                    {/*** TIMELINE UI ***/}
                    <div className="hmt__cn__sec__timeline"></div>

                    {/*** EVENT CARD ***/}
                    {me.events.map((event, eventIndex) => <div id={`m-${me.index}-${event.startDay}-cn`} className={`hmt__cn__sec__event`}>
                        <div id={`m-${me.index}-${event.startDay}`} className={`hmt__cn__sec__event__item ${(eventIndex + 1) % 2 !== 0 ? 'left' : 'right'}`}>
                            <PlEventCard onLinkItemClicked={onLinkItemClicked} {...event} />
                            <div className={`hmt__cn__sec__event__timeline ${(eventIndex + 1) % 2 !== 0 ? 'hmt__cn__sec__event__timeline--left' : 'hmt__cn__sec__event__timeline--right'}`}></div>
                            <div className={`hmt__cn__sec__event__databox ${(eventIndex + 1) % 2 !== 0 ? 'hmt__cn__sec__event__databox--left' : 'hmt__cn__sec__event__databox--right'}`}>
                                <p className="hmt__cn__sec__event__databox__date"> {event.startDay}</p>
                                <p className="hmt__cn__sec__event__databox__day">{event.startDayString}</p>
                            </div>
                        </div>
                    </div>
                    )}
                </div>)}
            </div>
        </div>
        <style jsx>
            {
                `
            .hmt {width: 100%; height: 100%; position: relative; display: flex; flex-direction: column; align-items: center;}
   
            
            .hmt__cn {position: relative;}
            .hmt__cn__empty {background: white; border: 1px solid lightgrey; text-align: center; margin-top: 80px; width: 200px; padding: 24px;}
            .hmt__cn__sec {width: 100%; display: flex; position: relative;  flex-direction: column; align-items: center;}
            .hmt__cn__sec__month {background: white;  position: sticky;  top: 150px; padding: 6px 16px; color: #0F172A; border-radius: 100px; font-size: 13px; font-weight: 400; border: 0.5px solid #CBD5E1;z-index: 3; width: fit-content; margin: 32px 0;}
            .hmt__cn__sec__event { width: 100%; position: relative; margin: 16px 0; display: flex; justify-content: center;}
            .hmt__cn__sec__event__item {position: relative; width: calc(100vw - 32px);}
          
            .hmt__cn__sec__timeline {position: absolute; height: 100%; left: 50%; top: 0; width: 1px; background: #CBD5E1;}

           
            .hmt__cn__sec__event__timeline {display: none;}
            .hmt__cn__sec__event__timeline--left {}
            .hmt__cn__sec__event__timeline--right {}
            
            .hmt__cn__sec__event__databox {display: none; }
            .hmt__cn__sec__event__databox--left { top: 0; right: -67px;}
            .hmt__cn__sec__event__databox--right { top: 0; left: -67px;}
            .hmt__cn__sec__event__databox__date {font-size: 16px; font-weight: 600; margin-bottom: 0px;}
            .hmt__cn__sec__event__databox__day {font-size: 12px; font-weight: 400; text-transform: uppercase;}
 

            .left {}
            .right {} 

            @media(min-width: 1200px) {
                .left {float: left;}
                .right {float: right; margin-top: -12%;} 
                .hmt__cn__sec__month {top: 42px;}
                .hmt__cn__sec {width: 800px; display: flex; position: relative;  flex-direction: column; align-items: center;}
                .hmt__cn__sec__event { width: 800px; position: relative; margin:0; display: block;}
                .hmt__cn__sec__event__item {position: relative; width: 354px; }
                .hmt__cn__sec__event__timeline {position: absolute; display: block; width: 23px; height: 1px; border-bottom: 1px solid #cbd5e1;}
                .hmt__cn__sec__event__timeline--left { top: 22px; right: -23px;}
                .hmt__cn__sec__event__timeline--right { top: 22px; left: -23px;}
                
                .hmt__cn__empty {width: 400px; margin-top: 40px;}
                .hmt__cn__sec__event__databox {position: absolute; border-radius: 2px; width: 44px; color: white; font-size: 14px;  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 44px; background: #8C55D3; }
                .hmt__cn__sec__event__databox--left { top: 0; right: -67px;}
                .hmt__cn__sec__event__databox--right { top: 0; left: -67px;}
                .hmt__cn__sec__event__databox__date {font-size: 16px; font-weight: 600; margin-bottom: 0px;}
                .hmt__cn__sec__event__databox__day {font-size: 12px; font-weight: 400; text-transform: uppercase;}
            }

            `
            }
        </style>
    </>
}

export default HpTimeline