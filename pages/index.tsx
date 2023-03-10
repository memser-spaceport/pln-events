import { trackGoal } from "fathom-client";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";
import { client } from "../.tina/__generated__/client";
import AppHeader from '../components/core/app-header'
import { getFilteredEvents, getFormattedEvents, getInitialState, getMonthWiseEvents, HpContext, months, reducerFunction } from "../components/page/home/hp-helper";
import HpTimeline from "../components/page/home/hp-timeline";
import { useReducer, useEffect } from 'react'
import HpFilters from "../components/page/home/hp-filters";
import HpFilterHead from "../components/page/home/hp-filter-head";
import HpCalendar from "../components/page/home/hp-calendar";

export default function IndexPage(props) {
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data, });
  const eventsData = props.data.eventConnection.edges;
  const events = getFormattedEvents([...eventsData])
  const [state, dispatch] = useReducer(reducerFunction, getInitialState([...events]))
  const orderedEventsList = [...events].sort((a, b) => a.startDateTimeStamp - b.startDateTimeStamp)
  const filterdList = getFilteredEvents([...orderedEventsList], { ...state.filters })
  const monthWiseEvents = getMonthWiseEvents([...filterdList])
  const filterdListCount = filterdList.length;
  const finalEvents = [...filterdList].map(f => {
    const endDateValue = new Date(f.endDateValue);
    endDateValue.setSeconds(endDateValue.getSeconds() + 10);
    return {
        title: f.eventName,
        start: f.startDateValue,
        end: endDateValue,
        ...f
    }
})

  const onContentScroll = () => {
    const container = document.getElementById('main-content');
    if (container.scrollTop > 5) {
      dispatch({ type: 'setScrollupStatus', value: true })
    } else {
      dispatch({ type: 'setScrollupStatus', value: false })
    }
  }

 


  return <>
    <AppHeader />
    <HpContext.Provider value={{ state: { ...state }, dispatch }}>
      <div className="hp">
        {/*** EVENTS FILTERING ***/}
        <div className="hp__sidebar">
          <HpFilters filteredCount={filterdListCount} events={[...events]} />
        </div>

        {/*** EVENTS TIMELINE ***/}
        <div id="main-content" onScroll={onContentScroll} className="hp__maincontent">
           <HpFilterHead/>

          {/*** SCROLL UP TO VIEW PAST ***/}
          {(state.flags.isScrolledUp && state.flags.eventMenu === 'timeline') && <div className="hmt__scollup">
            <img className="hmt__scollup__img" src="/icons/scroll-up-icon.svg" />
            <p className="hmt__scollup__text">Scroll up to view past events</p>
          </div>}
          
          {/**** TIMELINE VIEW ****/}
          {(state?.flags?.eventMenu === 'timeline') &&  <HpTimeline filterdListCount={filterdListCount} filters={state.filters} monthWiseEvents={monthWiseEvents} />}


          {/**** CALENDAR VIEW ****/}
         {state?.flags?.eventMenu === 'calendar' &&  <HpCalendar eventItems={finalEvents} filters={state.filters} monthWiseEvents={monthWiseEvents} filterdListCount={filterdListCount}/>}
        </div>
      </div>

      {state.flags.isMobileFilterActive && <div className="mfilter">
        <HpFilters filteredCount={filterdListCount} events={[...events]} />
      </div>}

    </HpContext.Provider>
    <style jsx>
      {
        `
      .hp {width: 100%; height: 100%; display: flex;}
      .hp__sidebar {display: none;}
      .hp__maincontent {width: 100%; padding-top:0px; overflow-y: ${state?.flags?.eventMenu === 'calendar'? 'hidden': 'scroll'}; background: #f2f7fb; height: 100%;}
      .hp__maincontent__tools {background: white; z-index:5; position: sticky; top: 58px; width: 100%; height: 48px; margin-top: 60px; box-shadow: 0px 1px 4px rgba(226, 232, 240, 0.25); padding: 0 24px; display: flex; align-items: center; justify-content: space-between;}
      .hp__maincontent__tools__filter {display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1; border-radius: 4px; padding: 5px 12px; cursor: pointer; z-index: 3;}
      .hp__maincontent__tools__filter__icon {width:16px; height: 16px; margin-right: 8px;}
      .hp__maincontent__tools__filter__text {font-size: 13px; font-weight: 400;}
      .hp__maincontent__tools__clear {color: #156FF7; font-size: 13px; cursor: pointer;}
      .hmt__scollup {width: 100%; display: flex; position: sticky; z-index: 5; top:105px; justify-content: center; align-items: center; padding: 13px 0; background: linear-gradient(180deg, #F1F5F9 0%, rgba(241, 245, 249, 0.92) 39.05%); color: #0F172A; font-size: 13px;}
      .hmt__scollup__img {width: 8px; margin-right: 8px; height: 8px;}
      .hmt__scollup__text {font-size: 12px;}
      
      .mfilter{display: block; width: 100%; overflow-y: scroll; height: 100%; boz-sizing: content-box; padding-bottom: 70px; position: fixed; top:0; left:0; right:0; background: white; z-index: 10;}
      @media(min-width: 1200px) {
        .mfilter {display: none;}
        .hmt__scollup {top: 0;}
        .hp__sidebar {width: 300px; border: 1px solid #CBD5E1; display: block; padding-top: 60px; box-sizing: content-box;}
        .hp__maincontent {width: calc(100% - 300px); padding-top: 60px; background: #f2f7fb; height: 100%;}
        .hp__maincontent__tools {display: none;}
      }
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
