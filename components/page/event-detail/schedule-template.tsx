import { AGENDA_COMING_SOON } from "@/utils/constants";
import { formatDateTime } from "@/utils/helper"; // Import common method
import React, { useState } from "react";

const ScheduleTemplate = (props: any) => {
  const event = props?.event;
  const eventDateRange = props?.eventDateRange;
  const eventTimezone = props?.eventTimezone;
  const sessions = event?.sessions ?? [];

  const groupEventsByDates = (sessions: any) => {
    const groupedEvents = {} as any;

    sessions.forEach((session: any) => {
      const startDate = formatDateTime(session?.startDate, eventTimezone, "Do MMM");

      if (!groupedEvents[startDate]) {
        groupedEvents[startDate] = [];
      }

      groupedEvents[startDate].push(session);
    });

    // Sort sessions within each date array
    Object.keys(groupedEvents).forEach((date) => {
      groupedEvents[date].sort((a: any, b: any) => {
        const startTimeA = formatDateTime(a?.startDate, eventTimezone, "YYYY-MM-DDTHH:mm:ssZ");
        const startTimeB = formatDateTime(b?.startDate, eventTimezone, "YYYY-MM-DDTHH:mm:ssZ");

        return startTimeA.localeCompare(startTimeB);
      });
    });

    return groupedEvents;
  };

  const dateInterval = groupEventsByDates(sessions);

  const formatTimeRange = (startDateTime: string, endDateTime: string) => {
    const formattedStartTime = formatDateTime(startDateTime, eventTimezone, "h:mm A");
    const formattedEndTime = formatDateTime(endDateTime, eventTimezone, "h:mm A");

    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  const [openDescriptions, setOpenDescriptions] = useState<boolean[]>(new Array(sessions?.length).fill(false));

  const toggleDescription = (index: number) => {
    setOpenDescriptions((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <>
      <div className="schedule">
        <div className="schedule__date">
          <img src="/icons/filter-blue.svg" alt="filter icon" />
          <span className="schedule__date__text">{eventDateRange}</span>
        </div>
        <div className="schedule__list">
          {Object.keys(dateInterval)?.length > 0 ? (
            <>
              {Object.entries(dateInterval)?.map(([key, value]: [string, any]) =>
                value.map((session: any, index: number) => (
                  <div
                    key={`${index}`}
                    onClick={() => session?.description && toggleDescription(index)}
                    className="schedule__list__meeting"
                  >
                    <h6 className="schedule__list__meeting__title">{session?.name}</h6>
                    {openDescriptions[index] && session?.description && (
                      <p className="schedule__list__meeting__desc">{session?.description}</p>
                    )}
                    <div className="schedule__list__meeting__info">
                      <div className="schedule__list__meeting__info__time">
                        <img src="/icons/clock.svg" width={16} height={16} alt="time logo" />
                        <span className="schedule__list__meeting__info__time__txt">
                          {formatTimeRange(session?.startDate, session?.endDate)}
                        </span>
                      </div>
                      <div className="schedule__list__meeting__info__date">{key}</div>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="schedule__empty">{AGENDA_COMING_SOON}</div>
          )}
        </div>
      </div>
      <style jsx>{`
        .schedule {
          display: flex;
          padding-bottom: 20px;
          flex-direction: column;
          gap: 8px;
        }

        .schedule__date {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background-color: #e8f1fe;
          border-radius: 8px;
          gap: 4px;
        }

        .schedule__date__text {
          color: #156ff7;
          font-size: 12px;
          font-weight: 500;
        }

        .schedule__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .schedule__empty {
          text-align: center;
        }

        .schedule__list__meeting {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .schedule__list__meeting__title {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          line-height: 20px;
          white-space: normal;
        }

        .schedule__list__meeting__info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .schedule__list__meeting__info__time {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .schedule__list__meeting__info__time__txt {
          font-size: 12px;
        }

        .schedule__list__meeting__info__date {
          font-weight: 500;
          font-size: 12px;
          color: #999999;
        }

        .schedule__list__meeting__desc {
          font-size: 12px;
          color: #64748b;
          white-space: normal;
          word-break: break-word;
        }
      `}</style>
    </>
  );
};

export default ScheduleTemplate;
