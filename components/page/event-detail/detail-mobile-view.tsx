import EventType from "./event-type";
import EventLocation from "./event-location";
import Tags from "./tags";
import { useState } from "react";
import DescriptionTemplate from "./description-template";
import ScheduleTemplate from "./schedule-template";
import EventHeader from "./event-header";
import EventHosts from "./event-hosts";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getRefreshStatus } from "@/utils/helper";

const DetailsMobileView = (props: any) => {
  const event = props?.event;
  const onClose = props?.onClose;
  const isRefreshing = props?.isRefreshing;
  const handleRefreshClick = props?.handleRefreshClick;
  const eventDateRange = event?.dateRange;

  const eventTitle = event?.name ?? "";
  const eventTags = event?.tags ?? [];
  const sessions = event?.sessions ?? [];
  const websiteLink = event?.websiteLink ?? "";
  const eventId = event?.id ?? "";
  const timing = event?.timing;
  const params = useParams();
  const view = params.type as string;
  const isRefreshRestricted = getRefreshStatus(eventId);

  const tabs = [
    { name: "description", label: "Description" },
    { name: "schedule", label: "Schedule" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const onTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const { onEventUrlClicked } = useSchedulePageAnalytics();

  const onNavigateToWebsite = (websiteLink: string) => {
    onEventUrlClicked(view, eventId, eventTitle, "website", websiteLink, {});
  };

  return (
    <>
      <div className="event">
        <div className="event__header__wrpr">
          {/* HEADER */}
          <div className="event__topbar">
            <EventHeader event={event} />
          </div>

          {/* TITLE */}
          <div className="event__title">
            <h1 className="event__title__text">{eventTitle}</h1>
          </div>
        </div>

        <div className="event__body">
          {/* DATE */}
          <div className="event__date">
            <div className="event__date__cn">
            <img alt="day" src="/icons/calendar-black.svg" height={13} width={13} />
            <span>{event?.dateRange}</span>
            </div>

            <div className="event__time">
            <img alt="time" src="/icons/clock.svg" className="event__time__icon" height={13} width={13} />
            <span className="event__time__text">
              {/* {calculateTime(event?.startDate, event?.endDate)} */}
              {`${event?.startTime} - ${event?.endTime} (${event?.utcOffset})`} 
            </span>
          </div>

          </div>

          {/* HOSTS */}
          <div className="event__hosts">
            <EventHosts event={event} showTitle />
          </div>

          {/* EVENT TYPE & LOCATION */}
          <div className="event__info">
            {/* EVENT TYPE  */}
            <EventType event={event} />
            {/* LOCATION  */}
            <EventLocation event={event} />
          </div>

          {/* TAGS */}
          {eventTags.length > 0 && (
            <div className="event__tags">
              <Tags tags={eventTags} noOftagsToShow={eventTags.length} />
            </div>
          )}

          {/* DESCRIPTION & SCHEDULE */}
          <div className="event__summary">
            <div className="event__summary__tabs">
              {tabs.map((tab: any) => {
                const shouldRenderTab = sessions.length !== 0 || tab.label !== "Schedule";
                return (
                  shouldRenderTab && (
                    <button
                      key={tab.name}
                      className={`event__summary__tabs__tab ${activeTab === tab.name ? "active-tab" : ""}`}
                      onClick={() => onTabClick(tab.name)}
                    >
                      {tab.label}
                    </button>
                  )
                );
              })}
            </div>
            <div className="event__summary__panel">
              {activeTab === "description" && (
                <div>
                  <DescriptionTemplate event={event} />
                </div>
              )}
              {activeTab === "schedule" && (
                <div>
                  <div className="event__summary__panel__refresh">
                    <span className="event__summary__panel__refresh__date">
                      {/* {`Last Updated on ${formatUpdatedDate(event.updatedAt)}`} */}
                    </span>
                  </div>
                  <ScheduleTemplate event={event} eventDateRange={eventDateRange} eventTimezone={event?.timezone} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="event__footer">
          {/* <button className="event__footer__clsBtn" onClick={onClose}>
            Close
          </button> */}
          {!isRefreshRestricted && (
            <button className="event__footer__refresh" onClick={handleRefreshClick} disabled={isRefreshing}>
              <Image src="/icons/refresh.svg" alt="edit" height={16} width={16} />
              <span className="event__footer__refresh__text">{`${isRefreshing ? "Refreshing" : "Schedule"}`}</span>
            </button>
          )}
          <a
            href={websiteLink || ""}
            target="_blank"
            className={`${websiteLink ? "" : "disabled"} event__footer__webBtn`}
            onClick={(event) => {
              if (!websiteLink) {
                event.preventDefault(); // Prevent navigation if websiteLink is empty
              } else {
                onNavigateToWebsite(websiteLink);
              }
            }}
          >
            Website
          </a>
        </div>
      </div>
      <style jsx>{`
        .event {
          padding: 24px 0px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 85dvh;
          max-height: 90dvh;
        }

        .event__header__wrpr {
          padding-right: 24px;
        }

        .event__topbar {
          padding-bottom: 12px;
        }

        .event__title {
          border-top: 1px solid #cbd5e1;
          padding-top: 12px;
        }

        .event__title__text {
          font-size: 16px;
          font-weight: 600;
          line-height: 22px;
          color: #0f172a;
          margin: 0px;
          white-space: normal;
          word-break: break-word;
        }

        .event__body {
          flex: 1;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event__date {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .event__date__cn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          line-height: 20px;
        }

        .event__time {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .event__time__icon{
          margin-top: 1px;
        }

        .event__time__text {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          line-height: 20px;
        }

        .event__info {
          display: flex;
          gap: 4px;
          align-items: center;
          flex-wrap: wrap;
        }

        .event__summary {
          padding-bottom: 20px;
          margin-right: 20px;
        }

        .event__summary__tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          height: 32px;
        }

        .event__summary__tabs__tab {
          flex: 1;
        }

        .active-tab {
          border-bottom: 2px solid #156ff7;
          color: #156ff7;
        }

        .event__summary__panel {
          padding: 0px 8px 4px 0px;
          height: 200px;
          overflow: auto;
          margin-block: 10px;
        }

        .event__summary__panel__refresh {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }

        .event__summary__panel__refresh__date {
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          font-style: italic;
          color: #0f172a;
        }

        .event__summary__panel__refresh__btn {
          display: flex;
          gap: 2px;
          border-radius: 100%;
          padding: 8px;
          background: #156ff7;
          margin-bottom: 2px;
        }

        .event__summary__panel__refresh__btn--spin {
          animation: rotate360 2s linear infinite;
        }

        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        .event__summary__panel__refresh__btn:disabled {
          cursor: default;
        }

        .event__summary__panel__refresh__btn__txt {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #156ff7;
        }

        .event__footer {
          position: absolute;
          bottom: 0px;
          display: flex;
          width: 100%;
          left: 0px;
          background-color: #fff;
          border-top: 1px solid #cbd5e1;
          border-radius: 0px 0px 8px 8px;
          gap: 8px;
          justify-content: end;
          padding: 12px 24px;
        }

        .event__footer__refresh {
          color: rgba(21, 111, 247, 1);
          padding: 8px 24px;
          background: #ffffff;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(21, 111, 247, 1);
          height: 40px;
          font-size: 16px;
          gap: 3px;
        }

        .event__footer__webBtn {
          background: rgba(21, 111, 247, 1);
          padding: 8px 24px;
          color: #ffffff;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          font-size: 16px;
        }

        .event__footer__btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .event__footer__btn:nth-child(1) {
          border-right: 1px solid #cbd5e1;
          border-radius: 0px 0px 0px 4px;
        }

        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (min-width: 400px) {

          .event__summary__panel {
            height: 300px;
          }
        }
      `}</style>
    </>
  );
};

export default DetailsMobileView;
