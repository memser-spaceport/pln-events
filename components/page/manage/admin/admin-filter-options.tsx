import PlSingleSelect from "@/components/ui/pl-single-select";
import { ADMIN_VIEW_TAB_OPTIONS, EVENTS_STATUS } from "@/utils/constants";
import { useState } from "react";

interface IAdminFilterOptions {
  selectedTab: any;
  setSelectedTab: any;
  setEvents: any;
  rawEvents: any;
  searchText: any;
  setSearchText: any;
  events: any;
  selectedMainEvent: any;
  setSelectedMainEvent: any;
}

export const AdminFilterOptions = (props: IAdminFilterOptions) => {
  const tabOptions = ADMIN_VIEW_TAB_OPTIONS;
  const tabValues = tabOptions.map((tab: any) => tab.label);
  const mainEventNames = ["All Events"];
  const {
    selectedTab,
    setSelectedTab,
    rawEvents,
    setEvents,
    searchText,
    events,
    setSearchText,
    selectedMainEvent,
    setSelectedMainEvent,
  } = props;

  const eventNames = rawEvents[selectedTab.toLowerCase()].map((event: any) => {
    if (event.isMainEvent) {
      mainEventNames.push(event.title);
    }
  });

  const onTabOnclickHandler = (key: string, value: string, type: string) => {
    if (key === "eventType") {
      setEvents(rawEvents[value.toLowerCase()]);
      setSelectedTab(value);
      return;
    } else if (key === "eventName") {
      setSelectedMainEvent(value);
      if (value === "All Events") {
        setEvents(rawEvents[selectedTab.toLowerCase()]);
        return;
      } else {
        const allEvents = rawEvents[selectedTab.toLowerCase()];
        const filteredEvents = allEvents.filter((event: any) => {
          return event.mainEventName === value;
        });
        setEvents(filteredEvents);
      }
    }
  };

  const onSearch = (e: any) => {
    setSearchText(e.target.value);
    setEvents(
      rawEvents[selectedTab.toLowerCase()].filter((event: any) => {
        if (selectedMainEvent === "All Events") {
          return event.title
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        } else {
          return (
            event.title.toLowerCase().includes(e.target.value.toLowerCase()) &&
            event.mainEventName === selectedMainEvent
          );
        }
      })
    );
  };

  return (
    <>
      <div className="fltops">
        <div className="fltops__tabweb">
          {tabOptions.map((tab, index) => (
            <button
              onClick={() =>
                onTabOnclickHandler("eventType", tab?.label, "single-select")
              }
              key={`${tab} + ${index}`}
              className={`${
                selectedTab === tab.label ? "fltops__tabweb__tab--selected" : ""
              } fltops__tabweb__tab`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="fltops__statusdropdown__mob">
          <PlSingleSelect
            showSearch={false}
            isPanClose={true}
            callback={onTabOnclickHandler}
            items={tabValues}
            identifierId={"eventType"}
            type={"single-select"}
            selectedItem={selectedTab}
            dropdownImgUrl={"/icons/pln-arrow-down.svg"}
          />
        </div>

        <div className="fltops__srchhsctn">
          <div className="fltops__srchhsctn__search">
            <input
              placeholder="Search"
              className="fltops__srchhsctn__search__input"
              type="text"
              value={searchText}
              onChange={(e: any) => onSearch(e)}
            />
            <div className="fltops__srchhsctn__search__icon-web">
              <img alt="search" src="/icons/search-blue.svg" />
            </div>
            <div className="fltops__srchhsctn__search__icon-mob">
              <img alt="search" src="/icons/search-gray.svg" />
            </div>
          </div>
          <div className="fltops__srchhsctn__hstdropd">
            <PlSingleSelect
              showSearch={true}
              isPanClose={true}
              callback={onTabOnclickHandler}
              items={mainEventNames}
              identifierId={"eventName"}
              type={"single-select"}
              selectedItem={selectedMainEvent}
              dropdownImgUrl={"/icons/filter-blue.svg"}
            />
          </div>
        </div>
      </div>
      <style jsx>
        {`

  
          .fltops__tabweb {
            display: none;
          }

          .fltops__srchhsctn {
            display: flex;
            flex-direction: column-reverse;
            margin-top: 8px;
            gap: 8px;
          }

          .fltops__tabweb__tab {
            width: 100%;
            height: 40px;
            outline: none;
            border: none;
            cursor: pointer;
            background-color: inherit;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            color: #94A3B8;
            transition: all .5s ease;
          }
          
          .fltops__tabweb__tab:hover {
            color: #64748B;
          }
          .fltops__tabweb__tab--selected {
            color: #156FF7;
            font-size: 14px;
            font-weight:  700;
            line-height: 20px;
            box-shadow: inset 0 -3px 0 0 #156FF7;
          }

          .fltops__tabweb__tab--selected:hover {
            color: #156FF7;

          }

          .fltops__srchhsctn__search {
            background-color; white;
            display: flex;
            flex-direction: row-reverse;
            border: 1px solid #CBD5E1;
            padding: 0px 12px;
            height: 40px;
            gap: 8px;
            border: 1px solid #CBD5E1;
            background: white;
            border-radius: 8px;
          }

          .fltops__srchhsctn__search__input{
            outline: none;
            border: none;
            width: 100%;
          }
          
          .fltops__srchhsctn__search__icon-web {
            display: none;
          }

          .fltops__srchhsctn__search__icon-mob {
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
  

        input::placeholder {
            color: #475569;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
        }
        
        input::-moz-placeholder {
            color: #475569;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
        }
        
        input:-ms-input-placeholder {
            color: #475569;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
        }

        input::-ms-input-placeholder {
            color: #475569;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
        
        }
        
        input::placeholder {
            color: #475569;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
        }

        .fltops__statusdropdown__mob {
            height: 40px;
            margin-top: 8px;
            background-color: white;
        }

        .fltops__srchhsctn__hstdropd {
          height: 40px;
          background-color: white;
          border-radius: 8px;
        }

          @media (min-width: 1200px) {
            .fltops__tabweb {
              display: unset;
              display: flex;
              align-items: end;
              height: 48px;
              border-bottom: 1px solid #E2E8F0;
              justify-content: space-between;
              margin-top: 20px;
            }

            .fltops__statusdropdown__mob {
                display: none;
            }

            .fltops__srchhsctn__search {
                border-radius: 4px;
                box-shadow: 0px 1px 2px 0px #0F172A29;
                width: fit-content;
                gap: 0px;
                padding: 0px;
                flex-direction: row;
                border: none;
            }

            .fltops__srchhsctn__search__icon-web {
                width: 40px;
            }

            .fltops__srchhsctn__search__input {
                padding: 8px 12px;
                width: 192px;
                border-radius: 4px 0px 0px 4px;
            }

            .fltops__srchhsctn__search__input{
                border : none;
              }


              .fltops__srchhsctn__search__icon-web {
                height: 40px;
                width: 40px;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0px 4px 4px 0px;
            }
              
            
            .fltops__srchhsctn__search__icon-mob {
                display: none;
            }

              input::placeholder {
                color: #94A3B8;
                font-size: 14px;
                font-weight: 500;
                line-height: 24px;
            }
            
            input::-moz-placeholder {
                color: #94A3B8;
                font-size: 14px;
                font-weight: 500;
                line-height: 24px;
            }
            
            input:-ms-input-placeholder {
                color: #94A3B8;
                font-size: 14px;
                font-weight: 500;
                line-height: 24px;
            }

            input::-ms-input-placeholder {
                color: #94A3B8;
                font-size: 14px;
                font-weight: 500;
                line-height: 24px;
            
            }
            
            input::placeholder {
                color: #94A3B8;
                font-size: 14px;
                font-weight: 500;
                line-height: 24px;
            }

            .fltops__srchhsctn {
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 22px;
              justify-content: space-between;
              width: 100%;
              gap: unset;
            }

            .fltops__srchhsctn__hstdropd {
              width: 180px;
            }
  
          }
        `}
      </style>
    </>
  );
};
