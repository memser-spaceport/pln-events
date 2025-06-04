"use client";

import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useHash } from "@/hooks/use-hash";
import useEscapeClicked from "@/hooks/use-escape-clicked";
import { useRouter } from "next/navigation";
import React from "react";
import EventType from "./event-type";
import Image from "next/image";
import EventAccessOption from "./event-access-option";
import PrimaryEventDetails from "./primary-event-details";
import Footer from "./footer";
const DetailView = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<any>({});
  const events = [...props.events];
  const hash = useHash();
  const router = useRouter();

  useEscapeClicked(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("session")) {
      searchParams.delete("session");
    }
    router.push(`${window.location.pathname}?${searchParams.toString()}`, {
      scroll: false,
    });
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
      document.removeEventListener(
        CUSTOM_EVENTS.SHOW_EVENT_DETAIL_MODAL,
        handler
      );
    };
  }, []);

  const onClose = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("session")) {
      searchParams.delete("session");
    }
    router.push(`${window.location.pathname}?${searchParams.toString()}`, {
      scroll: false,
    });
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Modal className="detail-view-modal">
          <div className="detail__view">
            <div>
              <div className="detail-content">
                <div className="detail-content__back-button">
                  <div
                    className="detail-content__back-button__wrapper"
                    onClick={onClose}
                  >
                    <div className="detail-content__back-button__wrapper__icon">
                      <Image
                        src="/icons/arrow-right.svg"
                        alt="back"
                        width={14}
                        height={14}
                      />
                    </div>
                    <span>Back</span>
                  </div>
                </div>
                {/* Header */}
                <div className="detail-content__header">
                  <div className="detail-content__header__left">
                    <div className="detail-content__header__left__title">
                      EVENT DETAILS
                    </div>
                  </div>
                  <div className="detail-content__header__right">
                    <EventType event={event} />
                    <EventAccessOption event={event} />
                  </div>
                </div>
                {/* Primary Event Details */}
                <PrimaryEventDetails event={event} />
                {/* Footer */}
                <Footer event={event} setEvent={setEvent} />
              </div>
            </div>
          </div>
        </Modal>
      )}
      <style jsx>{`
        .detail__view {
          position: relative;
          background-color: #fff;
          width: 778px;
          //height: 100%;
          border-left: 1px solid #cbd5e1;
          padding: 18px 12px;
          height: auto;
          overflow-y: auto;
          box-sizing: border-box;
          border-radius: 24px;
          margin: auto;
          margin-left: 12px;
          margin-right: 12px;
          max-height: 90vh;
        }

        @media (min-width: 1024px) {
          .detail__view {
            height: 100vh;
            max-height: 100vh;
            margin: 0;
            border-radius: 0;
            animation: slideIn 0.3s ease-out;
            padding: 18px 30px;
          }
        }

        :global(body.modal-open) {
          overflow: hidden;
          padding-right: 0 !important;
          margin: 0;
          height: 100vh;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .detail__view__close__btn {
          position: sticky;
          top: 18px;
          right: 30px;
          cursor: pointer;
          z-index: 1;
          float: right;
        }
        

        @media (min-width: 1024px) {
          .detail__view__mobile {
            display: none;
          }

        }

        .detail-content {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          gap: 20px;
        }
        .detail-content__back-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-content__back-button__wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .detail-content__back-button__wrapper__icon {
          width: 14px;
          height: 14px;
          transform: rotate(180deg);
        }

        .detail-content__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-content__header__right {
            display: none;
        }

        @media (min-width: 1024px) {
          .detail-content__header__right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        }
      `}</style>
    </>
  );
};

export default DetailView;
