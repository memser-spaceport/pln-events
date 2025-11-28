"use client";

import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useHash } from "@/hooks/use-hash";
import useEscapeClicked from "@/hooks/use-escape-clicked";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import EventType from "./event-type";
import Image from "next/image";
import EventAccessOption from "./event-access-option";
import PrimaryEventDetails from "./primary-event-details";
import Footer from "./footer";
import useClickedOutside from "@/hooks/use-clicked-outside";

interface DetailViewProps {
  eventIdSlugMap: Array<{ id: string; slug: string }>;
}

const DetailView = (props: DetailViewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const eventIdSlugMap = props.eventIdSlugMap || [];
  const hash = useHash();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch event data by ID
  const fetchEventById = async (eventId: string) => {
    try {
      setIsLoading(true);
      setIsOpen(true);
      const response = await fetch(`/api/events/${eventId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        setEvent(result.data[0]);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

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
      const foundEventMap = eventIdSlugMap.find((e) => e.slug === slug);
      if (foundEventMap && slug) {
        fetchEventById(foundEventMap.id);
      }
    }
  }, [hash, eventIdSlugMap]);

  // Handle event clicks from list/program views
  useEffect(() => {
    const handler = (e: any) => {
      const eventId = e.detail.eventId;
      
      if (eventId) {
        fetchEventById(eventId);
      }
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

  useClickedOutside({
    callback: onClose,
    ref: modalRef,
  })

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <Modal modalRef={modalRef} className="detail-view-modal">
          <div className="detail__view">
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
              <div className="detail-content-cn">
                {isLoading ? (
                  <div className="detail-content__loading">
                    <div className="spinner"></div>
                    <p>Loading event details...</p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              {/* Footer */}
              {!isLoading && <Footer event={event} setEvent={setEvent} />}
            </div>
          </div>
        </Modal>
      )}
      <style jsx>{`
        .detail__view {
          position: relative;
          background-color: #fff;
          width: 778px;
          border-left: 1px solid #cbd5e1;
          padding: 18px 12px;
          padding-bottom: 0;
          padding-top: 0;
          height: auto;
          overflow-y: auto;
          box-sizing: border-box;
          border-radius: 24px;
          margin: auto;
          margin-left: 12px;
          margin-right: 12px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .detail__view {
            height: 100vh;
            max-height: 100vh;
            margin: 0;
            border-radius: 0;
            animation: slideIn 0.3s ease-out;
            padding: 18px 30px;
            padding-bottom: 0;
            padding-top: 0;
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

        .detail-content-cn{
          display: flex;
          flex-direction: column;
          gap:10px;
          flex: 1;
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
          flex: 1;
          min-height: 0;
          gap: 20px;
          justify-content: space-between;
        }
        .detail-content__back-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 2;
          padding-top: 12px;
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

        .detail-content__loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 20px;
          min-height: 300px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #156ff7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .detail-content__loading p {
          color: #64748b;
          font-size: 16px;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default DetailView;
