import { ACCESS_TYPES, TYPE_CONSTANTS } from "@/utils/constants";   
import React from "react";
import EventHosts from "../event-detail/event-hosts";
import Tags from "../event-detail/tags";
import { getBackgroundColor, getHoverColor } from "@/utils/helper";

const EventCard = (props: any) => {
  const event = props?.event;
  const eventTitle = event?.name;
  const eventAccessOption = event?.accessOption ?? "";
  const isMultiDay = event?.multiday ?? false;
  const eventFormat = event?.format ?? "";
  const eventTags = event.tags ?? [];

  const hoverColor = getHoverColor(event?.tags);
  const backgroundColor = getBackgroundColor(event?.tags);

  return (
    <>
      <div className={`eventCard ${event?.isFeatured ? "featured-card" : ""} `}>
        {/* HEADER */}
        <div className="eventCard__header">
          <h1 title={eventTitle} className="eventCard__header__title">
            {eventTitle}
          </h1>
          <div className="eventCard__header__labels">
            {eventFormat && eventFormat === TYPE_CONSTANTS.VIRTUAL && (
              <img
                src={"/icons/virtual-sqaure.svg"}
                width={24}
                height={24}
                title="Virtual"
                alt="virtual"
              />
            )}
            {eventFormat && eventFormat === TYPE_CONSTANTS.HYBRID && (
              <img
                src="/icons/hybrid-square.svg"
                width={24}
                height={24}
                title="Hybrid"
                alt="in person"
              />
            )}
            {eventAccessOption === ACCESS_TYPES.PAID && (
              <img
                src={"/icons/paid-square.svg"}
                width={24}
                height={24}
                alt="paid"
                title="Paid"
                loading="lazy"
              />
            )}
            {eventAccessOption === ACCESS_TYPES.INVITE && (
              <img
                src={"/icons/invite-only-sqaure.svg"}
                width={24}
                height={24}
                title="Invite Only"
                alt="invite logo"
                loading="lazy"
              />
            )}
            {isMultiDay && (
              <div
                className="eventCard__header__labels__multiday"
                title="Multiday"
              >
                <img
                  src={"/icons/multiday.svg"}
                  width={14}
                  height={14}
                  alt="multiday"
                  loading="lazy"
                />
                <span className="eventCard__header__label__text">MULTIDAY</span>
              </div>
            )}
          </div>
        </div>

        <div className="eventCard__header">
          <EventHosts event={event} />
        </div>

        <div className="eventCard__tags__mobile">
          <Tags tags={eventTags} noOftagsToShow={2} />
        </div>

        <div className="eventCard__tags__desktop">
          <Tags tags={eventTags} noOftagsToShow={5} />
        </div>

        <div className="eventCard__footer">
          <div className="eventCard__footer__dateTime">
            <div className="eventCard__footer__dateTime__date">
              <img
                alt="day"
                src="/icons/calendar-black.svg"
                height={16}
                width={16}
                loading="lazy"
              />
              <span className="eventCard__footer__dateTime__date__text">
                {event?.dateRange}
              </span>
            </div>
            <div className="eventCard__footer__dateTime__date__time">
              {!event?.startTime && (
                <>
                  <img
                    src="/icons/clock.svg"
                    height={16}
                    width={16}
                    alt="clock"
                    loading="lazy"
                  />
                  <span className="eventCard__footer__dateTime__date__time__text">
                    {/* {calculateTime(event?.startDate, event?.endDate)} */}
                    {event?.startTime} - {event?.endTime}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="eventCard__footer__moreInfo">
            <button className="eventCard__footer__moreInfo__btn">
              <span>MORE INFO</span>
              <img
                width={14}
                height={14}
                src="/icons/chevron-right.svg"
                alt="chevron right"
                loading="lazy"
              />
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .eventCard {
          padding: 10px 16px;
          border: 2px solid #94a3b8;
          background-color: ${backgroundColor};
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 173px;
          justify-content: space-evenly;
        }

        .eventCard:hover {
          border: ${!event?.isFeatured ? `2px solid ${hoverColor}` : ""};
        }

        .featured-card {
          border: 2px solid;
          border-image: linear-gradient(to right, #427dff, #44d5bb) 1;
          background: linear-gradient(#47ff7b4d, #ffffff70);
        }

        .eventCard__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .eventCard__header__title {
          font-size: 16px;
          font-weight: 600;
          line-height: 22px;
          color: #0f172a;
          margin: 0px;
          white-space: normal;
          word-break: break-word;
          width: 60%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .eventCard__header__labels {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .eventCard__header__labels__multiday {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border: 1px solid #0992f5;
          border-radius: 4px;
          background-color: #e9f4f9;
          height: 24px;
        }

        .eventCard__header__label__text {
          color: #0992f5;
          font-weight: 700;
          font-size: 11px;
        }

        .eventCard__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .eventCard__footer__dateTime {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .eventCard__footer__dateTime__date {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .eventCard__footer__dateTime__date__text {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          line-height: 22px;
        }

        .eventCard__footer__dateTime__date__time {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .eventCard__footer__dateTime__date__time__text {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          line-height: 22px;
        }

        .eventCard__footer__moreInfo__btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          line-height: 14px;
          font-size: 12px;
          color: #156ff7;
        }

        .eventCard__tags__mobile {
          display: block;
        }

        .eventCard__tags__desktop {
          display: none;
        }

        @media (min-width: 1024px) {
          .eventCard__tags__desktop {
            display: block;
          }

          .eventCard__tags__mobile {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default EventCard;
