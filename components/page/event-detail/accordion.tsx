import { useState } from "react";

const Accordion = (props: any) => {
  const agenda = props?.agenda;
  const agendaName = agenda?.title ?? "";
  const agendaContent = agenda?.content ?? "";

  const [isOpen, setIsOpen] = useState(true);

  const onToggleOpen = () => {
    setIsOpen((open) => !open);
  };

  return (
    <>
      <div className="accordion">
        <div className="accordion__header" onClick={onToggleOpen}>
          <img
            alt="day"
            src={
              isOpen
                ? "/icons/chevron-down.svg"
                : "/icons/chevron-up-circle.svg"
            }
            height={20}
            width={20}
          />
          <h6 className="accordion__header__text">{agendaName}</h6>
        </div>
        {isOpen && <div className="accordion__body">{agendaContent}</div>}
      </div>
      <style jsx>{`
        .accordion {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .accordion__header {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .accordion__header__text {
          font-size: 14px;
          font-weight: 700;
          line-height: 24px;
        }

        .accordion__body {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default Accordion;
