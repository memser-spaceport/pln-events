import { MONTHS } from "@/utils/constants";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useRef, useState } from "react";
import HpCalendarPopup from "./hp-calendar-popup";
import dayGridPlugin from "@fullcalendar/daygrid";
import HpCalendarDateCell from "./hp-calendar-datecell";
import HpCalendarEvent from "./hp-calendar-event";
import { useRouter } from "next/navigation";
import useEventsAnalytics from "@/analytics/events.analytics";
import { IMonthwiseEvent } from "@/types/events.type";

function HpCalendar(props: any) {
  const monthWiseEvents = props.monthWiseEvents ?? [];
  const showBanner = props?.showBanner;

  const rawEvents = props?.rawEvents;
  const filterdListCount = props.filterdListCount ?? 0;
  const filters = props?.filters;
  const eventItems = props.eventItems ?? [];
  const monthNames = [...MONTHS];
  const calenderRef = useRef<any>();
  const [monthIndex, setMonthIndex] = useState(0);
  const [calendarheight, setCalendarHeight] = useState(0);
  const currentYear = filters.year;
  const monthName = monthNames[monthIndex];
  const router = useRouter();
  const { onCalendarCardClicked, onCalendarMonthNav } = useEventsAnalytics();

  const onMonthNavigate = (type: string) => {
    const calendarElement = calenderRef?.current;
    const ca = calendarElement.getApi();
    if (type === "prev") {
      if (monthIndex - 1 > -1) {
        ca.prev();
        setMonthIndex((v) => v - 1);
        onCalendarMonthNav("previous");
      }
    } else {
      if (monthIndex + 1 < monthNames.length) {
        ca.next();
        setMonthIndex((v) => v + 1);
        onCalendarMonthNav("next");
      }
    }
  };

  const onEventClicked = (v: any) => {
    if (v) {
      router.replace(
        `${window.location.pathname}${window.location.search}#${v?.event?.extendedProps.slug}`,
        { scroll: false }
      );
      onCalendarCardClicked(v?.event?.extendedProps ?? {});
      document.dispatchEvent(
        new CustomEvent("showCalenderPopup", {
          detail: v?.event?.extendedProps,
        })
      );
    }
  };

  useEffect(() => {
    try {
    const currenMonthId = filters?.monthIndex ? filters?.monthIndex :  new Date().getMonth();
    const filteredMonthData = monthWiseEvents.filter(
      (m: IMonthwiseEvent) => m.index >= currenMonthId
    );
    if (filteredMonthData.length > 0) {
      const selectedMonthData = filteredMonthData[0];
      setMonthIndex(selectedMonthData.index);
      const calendarElement = calenderRef?.current;
      const ca = calendarElement.getApi();
      ca.gotoDate(
        `${filters.year}-${
          selectedMonthData.index + 1 <= 9
            ? `0${selectedMonthData.index + 1}`
            : selectedMonthData.index + 1
        }-01`
      );
    } else if (monthWiseEvents.length > 0) {
      const selectedMonthData = monthWiseEvents[0];
      setMonthIndex(selectedMonthData.index);
      const calendarElement = calenderRef?.current;
      const ca = calendarElement.getApi();
      ca.gotoDate(
        `${filters.year}-${
          selectedMonthData.index + 1 <= 9
            ? `0${selectedMonthData.index + 1}`
            : selectedMonthData.index + 1
        }-01`
      );
    } else {
      setMonthIndex(currenMonthId);
      const calendarElement = calenderRef?.current;
      const ca = calendarElement.getApi();
      ca.gotoDate(
        `${filters.year}-${
          currenMonthId + 1 <= 9 ? `0${currenMonthId + 1}` : currenMonthId + 1
        }-01`
      );
    }
  } catch(error) {
    console.error(error);
  }
  }, [filterdListCount, currentYear]);

  useEffect(() => {
    function changeCalendarHeight() {
      const calendarContainer: HTMLElement | null= document.getElementById("calendar-cn");
      if (calendarContainer) {
        setCalendarHeight(calendarContainer.clientHeight);
      }
    }
    changeCalendarHeight();
    window.addEventListener("resize", changeCalendarHeight);

    return function () {
      window.removeEventListener("resize", changeCalendarHeight);
    };
  }, [props.showBanner]);

  return (
    <>
      <div className="hpc">
        <div className="hpc__head">
          <div className="hpc__head__menu"></div>
          <div className="hpc__head__months">
            {monthIndex === 0 && (
              <img
                className="hpc__head__months__leftimg disabled"
                src="/icons/pln-icon-left-disabled.svg"
              />
            )}
            {monthIndex !== 0 && (
              <img
                onClick={() => onMonthNavigate("prev")}
                className="hpc__head__months__leftimg"
                src="/icons/pln-icon-left-blue.svg"
              />
            )}
            <p className="hpc__head__months__text">{monthNames[monthIndex]}</p>
            {monthIndex !== 11 && (
              <img
                onClick={() => onMonthNavigate("next")}
                className="hpc__head__months__rightimg"
                src="/icons/pln-icon-right-blue.svg"
              />
            )}
            {monthIndex === 11 && (
              <img
                className="hpc__head__months__rightimg disabled"
                src="/icons/pln-icon-right-disabled.svg"
              />
            )}
          </div>
          <div className="hpc__head__info">
            <div className="hpc__head__info__item">
              <img
                className="hpc__head__info__item__img"
                src="/icons/pln-calendar-social.svg"
              />
              <p className="hpc__head__info__item__text social">Social</p>
            </div>
            <div className="hpc__head__info__item">
              <img
                className="hpc__head__info__item__img"
                src="/icons/pln-calendar-virtual.svg"
              />
              <p className="hpc__head__info__item__text virtual">Virtual</p>
            </div>
            <div className="hpc__head__info__item">
              <img
                className="hpc__head__info__item__img"
                src="/icons/pln-calendar-conference.svg"
              />
              <p className="hpc__head__info__item__text conference">
                Conference
              </p>
            </div>
          </div>
        </div>
        <div className="hpc__day"></div>
        <div id="calendar-cn" className="hpc__calendar">
          <FullCalendar
          timeZone="America/Los_Angeles"
            eventClick={(v: any) => onEventClicked(v)}
            height={calendarheight}
            nextDayThreshold="00:00"
            ref={calenderRef}
            dayCellContent={(info: any) => HpCalendarDateCell(info)}
            visibleRange={{ start: "2023-01-01", end: "2023-12-01" }}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              center: "",
              end: "",
              left: "",
              right: "",
              start: "",
            }}
            events={eventItems}
            dayHeaders={false}
            showNonCurrentDates={true}
            eventContent={HpCalendarEvent}
          />
        </div>
      </div>
      <HpCalendarPopup
        monthName={monthName}
        events={monthWiseEvents}
        rawEvents={rawEvents}
      />
      <style jsx>
        {`
          .hpc {
            width: 100%;
            overflow-y: hidden;
            position: relative;
            ${showBanner
              ? "padding-top:42px !important;"
              : "padding-top:0px !important;"}
          }
          .hpc__head {
            display: flex;
            height: 70px;
            position: relative;
            padding-top: 8px;
            border-bottom: 1px solid #cbd5e1;
            width: 100%;
            background: #f2f7fb;
            align-items: flex-start;
            justify-content: center;
          }
          .hpc__head__months {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 8px;
            width: 319px;
            border: 1px solid #cbd5e1;
            background: white;
            border-radius: 6px;
          }
          .hpc__head__months__text {
            flex: 1;
            font-weight: 500;
            display: flex;
            font-size: 14px;
            justify-content: center;
          }
          .hpc__head__months__leftimg {
            cursor: pointer;
            width: 24px;
            height: 24px;
          }
          .hpc__head__months__rightimg {
            cursor: pointer;
            width: 24px;
            height: 24px;
          }
          .hpc__head__info {
            display: flex;
            gap: 0 16px;
            margin-right: 24px;
            position: absolute;
            top: 47px;
            left: auto;
            right: auto;
          }
          .hpc__head__info__item {
            display: flex;
            gap: 0 8px;
            align-items: center;
          }
          .hpc__head__info__item__img {
            width: 16px;
            height: 16px;
          }
          .hpc__head__info__item__text {
            font-size: 12px;
          }

          .hpc__calendar {
            height: calc(100svh - ${showBanner ? "195px" : "156px"});
            margin-top: -25px;
          }

          .social {
            color: #817cd2;
          }
          .virtual {
            color: #67aed7;
          }
          .conference {
            color: #63a93e;
          }
          .disabled {
            cursor: default;
          }
          @media (min-width: 1200px) {
            .hpc__calendar {
              height: calc(100svh - ${showBanner ? "133px" : "86px"});
            }
            .hpc__head {
              padding: 8px 0;
              align-items: center;
              height: fit-content;
            }
            .hpc__head__info {
              top: 18px;
              right: 0;
            }
            .eventCard__item {
              width: 360px;
              position: relative;
            }
          }
          @media (max-width: 638px) {
            .hpc {
              padding-top: ${showBanner ? "163px" : "0px"} !important;
            }
            .hpc__calendar {
              height: calc(100svh - ${showBanner ? "332px" : "156px"});
              margin-top: -25px;
            }
          }
        `}
      </style>
    </>
  );
}

export default HpCalendar;
