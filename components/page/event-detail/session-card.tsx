import React from "react";
import CollapsibleContent from "./collapsible-content";
import { formatDateTime } from "@/utils/helper";

const SessionCard = (props: any) => {
  const session = props?.detail;
  const className = props?.className;
  const eventTimezone = props?.eventTimezone;
  const sessionName = session?.name ?? "";
  const sessionDescription = session?.description ? session?.description : "";

  const formatTimeRange = (startDateTime: string, endDateTime: string) => {
    const formattedStartTime = formatDateTime(startDateTime, eventTimezone, "h:mm A");
    const formattedEndTime = formatDateTime(endDateTime, eventTimezone, "h:mm A");

    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  const timing = formatTimeRange(session?.startDate, session?.endDate);

  return (
    <>
      <div className={`session ${className}`}>
          <span className="session__time">{timing} • {sessionName}</span>
        {sessionDescription && (
          <div className="session__desc">
            <CollapsibleContent content={sessionDescription} />
          </div>
        )}
      </div>
      <style jsx>{`
        .session {
          display: flex;
          flex-direction: column;
        }

        .session__time {
          font-size: 13px;
          font-weight: 500;
          line-height: 20px;
          color: #4F4F4F;
        }
        .session__title {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #000000;
        }

        .session__desc {
font-weight: 400;
font-size: 13px;
line-height: 20px;
letter-spacing: 0px;
text-transform: capitalize;
color: #4F4F4F;
        }
      `}</style>
    </>
  );
};

export default SessionCard;
