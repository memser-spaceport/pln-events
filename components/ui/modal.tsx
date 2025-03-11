import { ReactNode } from "react";

interface IModal {
  children: ReactNode;
}

const Modal = (props: IModal) => {
  const { children } = props;

  return (
    <>
      <div className="modal">{children}</div>
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
