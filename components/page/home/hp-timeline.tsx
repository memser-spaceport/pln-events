import { useContext, useEffect, useState } from "react";
import PlEventCard from "../../ui/pl-event-card";
import { trackGoal } from "fathom-client";
import { HpContext } from "./hp-helper";
import HpMonthBox from "./hp-month-box";

function HpTimeline(props) {
    const monthWiseEvents = props.monthWiseEvents ?? [];
    const filterdListCount = props.filterdListCount ?? 0
    const totalEventsCount = monthWiseEvents.reduce((count, m) => { return count + m.events.length }, 0)
    const { state } = useContext(HpContext)
    const { events, filters } = state


    const onLinkItemClicked = (item) => {
        if (item === 'event') {
            trackGoal('DULOJY8I', 0)
        } else if (item === 'location') {
            trackGoal('UKSYEJLH', 0)
        }
    }

    const onScrollToCurrentMonth = () => {
        const currentYear = new Date().getFullYear();
      
        if(`${currentYear}` !== filters.year) {
            const scrollContainer = document.getElementById("main-content");
            scrollContainer.scrollTop = 0;
            return;
        }

        const currenMonthId = new Date().getMonth();
        const currentDay = new Date().getDate()
        const currentMonthIndex = [...monthWiseEvents].findIndex(m => m.index === currenMonthId)
        const filteredMonthData = [...monthWiseEvents].filter(m => m.index > currenMonthId);
        let selectedEvent;


        // if current Month has events in future
        if (currentMonthIndex > -1 && monthWiseEvents[currentMonthIndex].events.length > 0) {
            const filteredEvents = monthWiseEvents[currentMonthIndex].events.filter(ev => ev.startDay >= currentDay);
            if (filteredEvents.length > 0) {
                selectedEvent = filteredEvents[0];
            }
        }

        // if any future Month has events
        if (!selectedEvent && filteredMonthData.length > 0) {
            const selectedMonthData = filteredMonthData[0];
            selectedEvent = selectedMonthData.events[0];
        }

        // If event found scroll to event else scroll to end of list
        if (selectedEvent) {
            const scrollItem = document.getElementById(`m-${selectedEvent.startMonthIndex}-${selectedEvent.startDay}`);
            if (scrollItem) {
                scrollItem.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        } else {
            const scrollContainer = document.getElementById("main-content");
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    const onMonthClicked = () => {
        trackGoal('GY01KNTS', 0)
    }

    useEffect(() => {
        onScrollToCurrentMonth();
    }, [filterdListCount])




    return <>
        <div id="timeline-cn" className="hmt">
            <div className="hmt__cn">
                {(totalEventsCount === 0) && <div className="hmt__cn__empty">
                    No matching events available.
                </div>}

                {monthWiseEvents.map(me => <div id={`m-${me.index}`} className="hmt__cn__sec">
                    {/*** MONTH DROPDOWN ***/}
                    <div onClick={onMonthClicked} className="hmt__cn__sec__month"><HpMonthBox {...me} allData={[...monthWiseEvents]} currentIndex={me.index} /></div>

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
                <div className="dummy"></div>
            </div>
        </div>
        <style jsx>
            {
                `
            .hmt {width: 100%; height: 100%; position: relative; display: flex; flex-direction: column; align-items: center;}
   
            
            .hmt__cn {position: relative;}
            .hmt__cn__empty {background: white; border: 1px solid lightgrey; text-align: center; margin-top: 180px; width: 270px; padding: 24px;}
            .hmt__cn__sec {width: 100%; display: flex; position: relative;  flex-direction: column; align-items: center;}
            .hmt__cn__sec__month { position: sticky; z-index: 1; top: 150px; margin: 32px 0;}
           
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
            .dummy {width: 100%; height: 60px;}
            @media(min-width: 1200px) {
                .left {float: left;}
                .right {float: right; margin-top: -12%;} 
               
                .hmt__cn__sec__month {top: 42px;}
                .hmt__cn__sec__month__test {position: sticky; top: 72px;}
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