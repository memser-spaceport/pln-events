import { ReactNode, RefObject } from "react";

interface IModal {
  children: ReactNode;
  className?: string;
  modalRef?: RefObject<HTMLDivElement>;
}

const Modal = (props: IModal) => {
  const { children, className, modalRef } = props;

  return (
    <>
      <div className={`modal ${className || ''}`} ref={modalRef}>{children}</div>
      <style jsx>
        {`
          .modal {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 35;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.6);
          }
          .detail-view-modal {
            justify-content: center;
          }

          @media (min-width: 1024px) {
            .detail-view-modal {
              justify-content: flex-end;
            }
          }
        `}
      </style>
     {/*  <style jsx global>
        {`
          body {
            height: 100vh;
            overflow: hidden;
          }
        `}
      </style> */}
    </>
  );
};

export default Modal;
