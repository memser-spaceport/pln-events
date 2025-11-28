'use client'
import useEscapeClicked from "@/hooks/use-escape-clicked";
import Modal from "@/components/ui/modal";
import { CUSTOM_EVENTS, CALENDAR_LEGENDS } from "@/utils/constants";
import React, { useEffect, useState } from "react";

const LegendsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEscapeClicked(onClose)

  useEffect(() => {
    const handler = (e: any) => {
      const isOpen = e.detail.isOpen;
      setIsOpen(isOpen);
    };

    document.addEventListener(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, handler);

    return () => {
      document.removeEventListener(CUSTOM_EVENTS.SHOW_LEGEND_MODAL, handler);
    };
  }, []);

  function onClose() {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <Modal>
          <div className="lm__wrpr">
            <button className="lm__close__btn" onClick={onClose}>
              <img src="/icons/close-white.svg" alt="close" />
            </button>
            <div className="lm">
              <div className="lm__head">
                <img className={`lm__head__img `} src="/icons/info-blue.svg" />
                <p className="lm__head__text">Legend</p>
              </div>
              <div className="lm__body">
                {CALENDAR_LEGENDS.map((legend, legendIndex) => (
                  <div
                    className="lm__body__item"
                    key={`header-legend-${legendIndex}`}
                  >
                    <img
                      width={20}
                      height={20}
                      className={`lm__body__item__img`}
                      src={legend.img}
                    />
                    <p className="lm__body__item__text">{legend.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
      <style jsx>{`
        .lm__wrpr {
          position: relative;
          background-color: #fff;
          width: calc(100svw - 48px);
          border-radius: 8px;
          border: 1px solid #cbd5e1;
        }

        .lm__close__btn {
          position: absolute;
          top: -11px;
          right: -13px;
          cursor: pointer;
        }

        .lm {
          max-height: 70svh;
          background: white;
          border-radius: 8px;
          padding: 24px;
        }

        .lm__head {
          display: flex;
          border-bottom: 1px solid #cbd5e1;
          width: 100%;
          justify-content: center;
          padding-bottom: 12px;
        }

        .lm__head__img {
          margin-right: 4px;
        }

        .lm__head__text {
          font-size: 18px;
          font-weight: 600;
        }

        .lm__body {
          overflow: auto;
          max-height: calc(70svh - 82px);
        }


        .lm__body__item {
          display: flex;
          align-items: center;
          padding: 12px 0;
        }

        .lm__body__item__img {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        .lm__body__item__text {
          font-size: 13px;
          text-transform: uppercase;
          font-weight: 500;
        }

        @media (min-width: 1024px) {
          .lm__wrpr {
            width: 400px !important;
          }
        }
      `}</style>
    </>
  );
};

export default LegendsModal;
