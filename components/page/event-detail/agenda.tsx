import React, { useEffect, useRef, useState } from "react";
import SessionCard from "./session-card";
import Accordion from "./accordion";
import { useSearchParams } from "next/navigation";
import { formatDateTime } from "@/utils/helper";

const Agenda = (props: any) => {
  const eventDetail = props?.event;
  const eventTimezone = props?.eventTimezone;
  const sessionsList = eventDetail?.sessions ?? [];
  const searchParams = useSearchParams();
  const [blinkSession, setBlinkSession] = useState<string | null>(null);
  const sessionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const EmptySession = () => {
    return (
      <>
        <div className="emptySession">TBD</div>
        <style jsx>{`
          .emptySession {
            padding: 8px;
          }
        `}</style>
      </>
    );
  };

  const groupEventsByDates = (sessions: any) => {
    const groupedEvents = {} as any;

    sessions.forEach((session: any) => {
      const startDate = formatDateTime(session?.startDate, eventTimezone, "Do MMM ddd");

      if (!groupedEvents[startDate]) {
        groupedEvents[startDate] = [];
      }

      groupedEvents[startDate].push(session);
    });

    // Sort sessions within each date array
    Object.keys(groupedEvents).forEach((date) => {
      groupedEvents[date].sort((a: any, b: any) => {
        const startTimeA = new Date(a?.startDate).getTime();
        const startTimeB = new Date(b?.startDate).getTime();

        return startTimeA - startTimeB;
      });
    });

    return groupedEvents;
  };

  const dateInterval = groupEventsByDates(sessionsList);

  const agendaList = Object.entries(dateInterval)?.map(
    ([key, value]: [string, any]) => {
      return {
        title: key,
        content:
          value?.length > 0 ? (
            value?.map((session: any, index: number) => (
              <div
                id={session?.id}
                style={{
                  display : "flex",
                  flexDirection : "column",
                  gap : "10px",
                }}
                key={`${session.name}_${index}`}
                ref={(el) => {
                  sessionRefs.current[session.id] = el;
                }}
              >
                <SessionCard
                  // className={`${index % 2 === 1 ? "background" : ""} ${
                  //   index !== value.length - 1 ? "border-bottom" : ""
                  // } ${index === value.length - 1 ? "bottom-radius" : ""} ${
                  //   blinkSession === session.id ? "blink-border" : ""
                  // }`}
                  detail={session}
                  eventTimezone={eventTimezone}
                />
              </div>
            ))
          ) : (
            <EmptySession />
          ),
      };
    }
  );

  useEffect(() => {
    const session = searchParams.get("session");

    if (session && sessionRefs.current[session as string]) {
      // Scroll to the session if the query param is present
      sessionRefs.current[session as string]?.scrollIntoView({
        block: "start",
      });
      setBlinkSession(session);
      setTimeout(() => setBlinkSession(null), 2000);
    }
  }, [searchParams]);

  return (
    <>
      <div className="agenda">
        <div className="agenda__list">
          {agendaList?.map((item: any, index: number) => {
            return (
              <div key={`agenda-${index}`}>
                <div className="agenda__list__item">
                  <div className="agenda__list__item__title">
                    <span className="agenda__list__item__title__text">
                      Day {index + 1} - {item?.title}
                    </span>
                  </div>
                  <div className="agenda__list__item__content">
                    {item?.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .agenda__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .agenda__list__item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .agenda__list__item__title__text {
          font-weight: 700;
          font-size: 12px;
          text-transform: capitalize;
        }

        .agenda__list__item__content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: white;
          border-radius: 4px;
          padding: 7px 10px;
        }
      `}</style>
    </>
  );
};

export default Agenda;
