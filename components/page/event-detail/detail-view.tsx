"use client";

import Modal from "@/components/ui/modal";
import DetailsDesktopView from "./detail-desktop-view";
import DetailsMobileView from "./detail-mobile-view";
import { useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useHash } from "@/hooks/use-hash";
import useEscapeClicked from "@/hooks/use-escape-clicked";
import { useRouter } from "next/navigation";
import React from "react";
import { getRefreshedAgenda } from "@/service/events.service";
// import { useEventDetailAnalytics } from "@/analytics/24-pg/event-detail-analytics";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import { toast } from "react-toastify";

const DetailView = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [event, setEvent] = useState(null);
  const [event, setEvent] = useState<Partial<{ id: string; sessions: any[], name: string }>>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const events = [...props.events];
  const hash = useHash();
  const router = useRouter();
  const { onScheduleRefreshClick } = useSchedulePageAnalytics();

  const handleRefreshClick = async () => {
    try {
      onScheduleRefreshClick(event?.id!, event?.name!, 'clicked');
    if (event?.id) {
      setIsRefreshing(true);
      const result = await getRefreshedAgenda(event.id);
      if (result?.agenda) {
        onScheduleRefreshClick(event?.id!, event?.name!, 'success');
        const updatedAgenda = result?.agenda?.map((session: any) => {
          return {
            ...session,
            startDate: session.start_date,
            endDate: session.end_date,
          };
        });
        setEvent((prevEvent) => ({
          ...prevEvent,
          sessions: updatedAgenda,
        }));
      }
      setIsRefreshing(false);
    }
  } catch (error) {
    setIsRefreshing(false);
    onScheduleRefreshClick(event?.id!, event?.name!, 'error');
    toast.error("Session refresh failed");
    return { error };
  }
  };

  useEscapeClicked(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("session")) {
      searchParams.delete("session");
    }
    router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
    setIsOpen(false);
  });

  useEffect(() => {
    if (hash) {
      const hashValue: string = hash;
      const slug = hashValue.split("#")[1];
      const foundEvent = [...events].findIndex((e) => e.slug === slug);
      if (foundEvent >= 0 && slug) {
        setEvent(events[foundEvent]);
        setIsOpen(true);
      }
    }
  }, [hash]);

  useEffect(() => {
    const handler = (e: any) => {
      const isOpen = e.detail.isOpen;
      const selectedEvent = e.detail.event;
      setEvent(selectedEvent);
      setIsOpen(isOpen);
    };

    document.addEventListener(CUSTOM_EVENTS.SHOW_EVENT_DETAIL_MODAL, handler);

    return () => {
      document.removeEventListener(CUSTOM_EVENTS.SHOW_EVENT_DETAIL_MODAL, handler);
    };
  }, []);

  // const onClose = () =>{
  //   // window.location.href = `${window.location.pathname}${window.location.search}`
  //   router.push(`${window.location.pathname}${window.location.search}`, { scroll: false})
  //   setIsOpen(false);

  // };

  const onClose = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("session")) {
      searchParams.delete("session");
    }
    router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Modal>
          <div className="detail__view">
            <button className="detail__view__close__btn" onClick={onClose}>
              <img src="/icons/close-white.svg" alt="close" />
            </button>
            <div className="detail__view__mobile">
              <DetailsMobileView
                event={event}
                onClose={onClose}
                handleRefreshClick={handleRefreshClick}
                isRefreshing={isRefreshing}
              />
            </div>
            <div className="detail__view__desktop">
              <DetailsDesktopView
                event={event}
                onClose={onClose}
                handleRefreshClick={handleRefreshClick}
                isRefreshing={isRefreshing}
              />
            </div>
          </div>
        </Modal>
      )}
      <style jsx>{`
        .detail__view {
          position: relative;
          background-color: #fff;
          width: 90%;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
        }

        .detail__view__close__btn {
          position: absolute;
          top: -11px;
          right: -13px;
          cursor: pointer;
        }

        .detail__view__desktop {
          display: none;
        }

        @media (min-width: 1024px) {
          .detail__view {
            width: 650px;
          }

          .detail__view__mobile {
            display: none;
          }

          .detail__view__desktop {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default DetailView;
