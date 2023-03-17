import { useContext } from "react"
import { getNoFiltersApplied,HpContext } from './hp-helper'
import { trackGoal } from "fathom-client";

function HpFilterHead(props) {
    const {state, dispatch} = useContext(HpContext)
    const {filters, flags} = state
    const {eventMenu} = flags;
    const filterCount = getNoFiltersApplied(filters);
    const menus = [
        {name: 'timeline', img: '/icons/pln-timeline.svg', title: "Timeline View", imgActive: '/icons/pln-timeline-active.svg'},
        {name: 'calendar', img: '/icons/pln-calendar.svg', title: "Calendar View", imgActive: '/icons/pln-calendar-active.svg'},
       /*  {name: 'map', img: '/icons/pln-map-view.svg', title: "Map View", imgActive: '/icons/pln-map-view-active.svg'} */
    ]
    const toggleMobileFilter = () => {
        dispatch({ type: 'toggleMobileFilter' })
      }
    
      const onClearFilters = () => {
        dispatch({ type: 'clearAllFilters' })
      }

      const onMenuSelection = (value) => {
        if(value === 'timeline') {
            trackGoal('E98R34BE', 0)
        } else {
            trackGoal('BBAJPYJQ', 0)
        }
        dispatch({type: 'setEventMenu', value: value})
    }

    return <>
        <div className="hp__maincontent__tools">
            <div onClick={toggleMobileFilter} className="hp__maincontent__tools__filter">
                <img className="hp__maincontent__tools__filter__icon" src="/icons/pln-filter-icon.svg" />
                <p className="hp__maincontent__tools__filter__text">Filters</p>
                {(filterCount > 0) && <p className="hp__maincontent__tools__filter__count">{filterCount}</p>}
            </div>
            <div className="hpf__menu">
                <div className="hpf__menu__icons">
                    {menus.map(m => <img onClick={e => onMenuSelection(m.name)} title={m.title} className="hpf__menu__icons__item" src={eventMenu === m.name ? m.imgActive: m.img}/>)}
                </div>
            </div>
        </div>
        <style jsx>
            {
                `
                .hp__maincontent {width: 100%; display: block; padding-top:0px; overflow-y: scroll; background: #f2f7fb; height: 100%;}
                .hp__maincontent__tools {background: white; z-index:5; position: sticky; top: 58px; width: 100%; height: 48px; margin-top: 60px; box-shadow: 0px 1px 4px rgba(226, 232, 240, 0.25); padding: 0 24px; display: flex; align-items: center; justify-content: space-between;}
                .hp__maincontent__tools__filter {display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1; border-radius: 4px; padding: 5px 12px; cursor: pointer; z-index: 3;}
                .hp__maincontent__tools__filter__icon {width:16px; height: 16px; margin-right: 8px;}
                .hp__maincontent__tools__filter__text {font-size: 13px; font-weight: 400;}
                .hp__maincontent__tools__clear {color: #156FF7; font-size: 13px; cursor: pointer;}
                .hp__maincontent__tools__filter__count {background: #156FF7; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; margin-left: 8px;}

                .hpf__menu {display: flex; padding: 16px 0px; height: 48px; justify-content: space-between;}
                .hpf__menu__view {font-size: 14px; color: #64748B;}
                .hpf__menu__icons {display: flex; gap: 0 16px;  }
                .hpf__menu__icons__item {cursor: pointer; width: 16px; height: 16px;}

                @media(min-width: 1200px) {
                    .hp__maincontent__tools {display: none;}
                    
                }
                
                `
            }
        </style>
    </>
}

export default HpFilterHead;