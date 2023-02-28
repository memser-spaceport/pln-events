import { trackGoal } from "fathom-client";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";
import { client } from "../.tina/__generated__/client";
import AppHeader from '../components/core/app-header'
import { getFilteredEvents, getFormattedEvents, getInitialState, getMonthWiseEvents, HpContext, months, reducerFunction } from "../components/page/home/hp-helper";
import HpSideBar from "../components/page/home/hp-sidebar";
import HpTimeline from "../components/page/home/hp-timeline";
import { useReducer } from 'react'
import HpFilters from "../components/page/home/hp-filters";

export default function IndexPage(props) {
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data, });
  const eventsData = props.data.eventConnection.edges;
  const events = getFormattedEvents([...eventsData])
  const [state, dispatch] = useReducer(reducerFunction, getInitialState([...events]))
  console.log(state)
  const orderedEventsList = [...events].sort((a, b) => a.startDateTimeStamp - b.startDateTimeStamp)
  const filterdList = getFilteredEvents([...orderedEventsList], { ...state.filters })
  const monthWiseEvents = getMonthWiseEvents([...filterdList])

  const toggleMobileFilter = () => {
    dispatch({type: 'toggleMobileFilter'})
  }


  return <>
    <AppHeader />
    <HpContext.Provider value={{ state: {...state}, dispatch }}>
      <div className="hp">
        {/*** EVENTS FILTERING ***/}
        <div className="hp__sidebar">
          <HpFilters events={[...events]} />
        </div>

        {/*** EVENTS TIMELINE ***/}
        <div className="hp__maincontent">
          <div className="hp__maincontent__tools">
            <div onClick={toggleMobileFilter} className="hp__maincontent__tools__filter">
              <img className="hp__maincontent__tools__filter__icon" src="/icons/pln-filter-icon.svg"/>
              <p className="hp__maincontent__tools__filter__text">Filters</p>
            </div>
          </div>
          <HpTimeline filters={state.filters} monthWiseEvents={monthWiseEvents} />
        </div>
      </div>

      {state.flags.isMobileFilterActive &&  <div className="mfilter">
        <HpFilters events={[...events]}/>
      </div>}
      
    </HpContext.Provider>
    <style jsx>
      {
        `
      .hp {width: 100%; height: 100%; display: flex;}
      .hp__sidebar {display: none;}
      .hp__maincontent {width: 100%; padding-top:0px; background: #f2f7fb; height: 100%;}
      .hp__maincontent__tools {background: white; width: 100%; height: 48px; margin-top: 60px; box-shadow: 0px 1px 4px rgba(226, 232, 240, 0.25); padding: 0 24px; display: flex; align-items: center; justify-content: space-between;}
      .hp__maincontent__tools__filter {display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1; border-radius: 4px; padding: 5px 12px; cursor: pointer;}
      .hp__maincontent__tools__filter__icon {width:16px; height: 16px; margin-right: 8px;}
      .hp__maincontent__tools__filter__text {font-size: 13px; font-weight: 400;}
      
      .mfilter{display: block; width: 100%; height: 100%; position: fixed; top:0; left:0; right:0; background: white; z-index: 10;}
      @media(min-width: 1200px) {
        .mfilter {display: none;}
        .hp__sidebar {width: 300px; border: 1px solid #CBD5E1; display: block; padding-top: 60px;}
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
