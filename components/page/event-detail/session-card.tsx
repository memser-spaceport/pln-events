import React from "react";
import CollapsibleContent from "./collapsible-content";
import { formatDateTime } from "@/utils/helper";

const SessionCard = (props: any) => {
  const session = props?.detail;
  const className = props?.className;
  const eventTimezone = props?.eventTimezone;
  const sessionName = session?.name ?? "";
  const sessionDescription = session?.description ?? "";

  const formatTimeRange = (startDateTime: string, endDateTime: string) => {
    const formattedStartTime = formatDateTime(startDateTime, eventTimezone, "h:mm A");
    const formattedEndTime = formatDateTime(endDateTime, eventTimezone, "h:mm A");

    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  const timing = formatTimeRange(session?.startDate, session?.endDate);

  return (
    <>
      <div className={`session ${className}`}>
        <span className="session__time">{timing}</span>
        <p className="session__title">{sessionName}</p>
        <div className="session__desc">
          <CollapsibleContent content={sessionDescription} />
        </div>
      </div>
      <style jsx>{`
        .session {
          padding: 8px;
        }

        .background {
          background: #f8fafc;
        }

        .border-bottom {
          border-bottom: 1px solid #cbd5e1;
        }

        .bottom-radius {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .session__time {
          font-size: 10px;
          font-weight: 700;
          line-height: 20px;
          color: #0f172a;
        }
        .session__title {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #000000;
        }

        .session__desc {
          padding-top: 8px;
        }
      `}</style>
    </>
  );
};

export default SessionCard;
