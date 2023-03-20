import { client } from "../.tina/__generated__/client";
import AppHeader from '../components/core/app-header'
import { getFilteredEvents, getFormattedEvents, getInitialState, getMonthWiseEvents, HpContext, months, reducerFunction } from "../components/page/home/hp-helper";
import HpTimeline from "../components/page/home/hp-timeline";
import { useReducer } from 'react'
import HpFilters from "../components/page/home/hp-filters";
import HpFilterHead from "../components/page/home/hp-filter-head";
import HpCalendar from "../components/page/home/hp-calendar";

export default function IndexPage(props) {
  // const { data } = useTina({ query: props.query, variables: props.variables, data: props.data, });
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

  const onApplyMobileFilter = () => {
    dispatch({ type: 'toggleMobileFilter' });
  }

  const onMobileClear = () => {
    dispatch({ type: 'clearAllFilters' })
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
          <HpFilterHead />

          {/*** SCROLL UP TO VIEW PAST ***/}
          {(state.flags.isScrolledUp && state.flags.eventMenu === 'timeline') && <div className="hmt__scollup">
            <img className="hmt__scollup__img" src="/icons/scroll-up-icon.svg" />
            <p className="hmt__scollup__text">Scroll up to view past events</p>
          </div>}

          {/**** TIMELINE VIEW ****/}
          {(state?.flags?.eventMenu === 'timeline') && <HpTimeline filterdListCount={filterdListCount} filters={state.filters} monthWiseEvents={monthWiseEvents} />}


          {/**** CALENDAR VIEW ****/}
          {state?.flags?.eventMenu === 'calendar' && <HpCalendar eventItems={finalEvents} filters={state.filters} monthWiseEvents={monthWiseEvents} filterdListCount={filterdListCount} />}
        </div>
      </div>

      {state.flags.isMobileFilterActive && <div className="mfilter">
        <div id="mfiltercn" className="mfilter__top">
          <HpFilters filteredCount={filterdListCount} events={[...events]} />
        </div>
        <div className="mfilter__bottom">
          <div className="mfilter__bottom__tools">
            <div onClick={onMobileClear} className="mfilter__bottom__tools__clear">Clear all</div>
            <div onClick={onApplyMobileFilter} className="mfilter__bottom__tools__apply">{`View ${filterdListCount} event(s)`}</div>
          </div>
        </div>
      </div>}

    </HpContext.Provider>
    <style jsx>
      {
        `
      .hp {width: 100%; height: 100%; display: flex;}
      .mfilter__bottom__tools {width: 100%; height: 70px; display: flex; align-items: center; justify-content: center; background: white;z:index: 13; padding: 12px 16px; box-shadow: 0px -2px 4px #E2E8F0;}
      .mfilter__bottom__tools__clear {border: 1px solid #CBD5E1; margin-right: 16px; padding: 12px 24px; font-size: 14px; font-weight: 600; border-radius: 100px;}
      .mfilter__bottom__tools__apply {background: #156FF7; color: white;  padding: 12px 24px; font-size: 14px; font-weight: 600; border-radius: 100px;}

      .hp__sidebar {display: none;}
      .hp__maincontent {width: 100%; padding-top:0px; overflow-y: ${state?.flags?.eventMenu === 'calendar' ? 'hidden' : 'scroll'}; background: #f2f7fb; height: 100%;}
      .hp__maincontent__tools {background: white; z-index:5; position: sticky; top: 58px; width: 100%; height: 48px; margin-top: 60px; box-shadow: 0px 1px 4px rgba(226, 232, 240, 0.25); padding: 0 24px; display: flex; align-items: center; justify-content: space-between;}
      .hp__maincontent__tools__filter {display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1; border-radius: 4px; padding: 5px 12px; cursor: pointer; z-index: 3;}
      .hp__maincontent__tools__filter__icon {width:16px; height: 16px; margin-right: 8px;}
      .hp__maincontent__tools__filter__text {font-size: 13px; font-weight: 400;}
      .hp__maincontent__tools__clear {color: #156FF7; font-size: 13px; cursor: pointer;}
      .hmt__scollup {width: 100%; display: flex; position: sticky; z-index: 5; top:105px; justify-content: center; align-items: center; padding: 13px 0; background: linear-gradient(180deg, #F1F5F9 0%, rgba(241, 245, 249, 0.92) 39.05%); color: #0F172A; font-size: 13px;}
      .hmt__scollup__img {width: 8px; margin-right: 8px; height: 8px;}
      .hmt__scollup__text {font-size: 12px;}
      
      
      .mfilter{display: block; width: 100%;  height: calc(100svh); boz-sizing: content-box; padding-bottom: 0px; position: fixed; top:0; left:0; right:0; background: white; z-index: 10;}
      .mfilter__top {height: calc(100svh - 70px); overflow-y: scroll;}
      .mfilter__bottom {height: 70px; background: red;}
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

export const getStaticProps = async () => {

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
