import PlSingleSelect from "@/components/ui/pl-single-select";
import { useState } from "react";

const UserFilterOptions = (props: any) => {
  const rawEvents = props?.rawEvents;
  const setFilteredEvents = props?.setFilteredEvents;

  const mainEventNames = ["All Events"];

  const eventNames = rawEvents.map((event: any) => {
    if (event.isMainEvent) {
      mainEventNames.push(event.title);
    }
  });
  const [searchText, setSearchText] = useState("");
  const [selectedMainEvent, setSelectedMainEvent] = useState("All Events");

  const onSearch = (e: any) => {
    setSearchText(e.target.value);
    const filteredEvents = rawEvents.filter((event: any) => {
        console.log("selected", selectedMainEvent)
        if (selectedMainEvent === "All Events") {
            console.log("onsearch")
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

      setFilteredEvents(filteredEvents);
  };

  const onEventNameClickHandler = (
    key: string,
    value: string,
    type: string
  ) => {
    if (key === "eventName") {
      setSelectedMainEvent(value);
      if (value === "All Events") {
        setFilteredEvents(rawEvents);
        return;
      } else {
        const filteredEvents = rawEvents.filter((event: any) => {
          return event.mainEventName === value;
        });
        setFilteredEvents(filteredEvents);
      }
    }
  };
  return (
    <>
      <div className="ufo">
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
              callback={onEventNameClickHandler}
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
          .ufo {
            padding: 0px 16px 16px 16px;
            background: white;
            display: flex;
            justify-content: space-between;
            flex-direction: column-reverse;
          }


          .fltops__srchhsctn {
            display: flex;
            flex-direction: column-reverse;
            margin-top: 8px;
            gap: 8px;
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

        .fltops__srchhsctn__hstdropd {
          height: 40px;
          background-color: white;
          border-radius: 8px;
        }

          @media (min-width: 1200px) {
            .ufo {
              background: unset;
              padding: unset;
              margin-top: 18px;
              flex-direction: row;
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

export default UserFilterOptions;
