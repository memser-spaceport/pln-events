
const Modal = (props: any) => {
    const children = props?.children;
    const position = props?.position ?? "center";
    const onClose = props?.onClose;
    const title = props?.title ?? "";
  
    return (
      <>
        <div className="modal__overlay">
          <div className={`modal__wrapper mc ${position}`}>
            <div className="modal">
              <button onClick={onClose} className="mc__close">
                <img src="/icons/pln-close.svg" alt="close icon" />
              </button>
              <div className="modal__body">{children}</div>
            </div>
          </div>
        </div>
        <style jsx>{`

          .modal__overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 10;
            background: rgba(0, 0, 0, 0.6);

          }
  
          .modal__wrapper {
            width: 100%;
            outline: 0;
            display: flex;
            justify-content: center;
            overflow: auto;
            padding: 10px 0px;
          }
  
          .bottom {
            bottom: 0;
          }
  
          .center {
            align-items: center;
            height: 100%;
          }
  
          .modal {
            z-index: 9;
            background: #fff;
            position: relative;
            margin: auto;
            border-radius: 8px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
  
          .mc__close {
            cursor: pointer;
            border: 0;
            background-color: inherit;
            position: absolute;
            z-index: 10;
            top: 16px;
            right: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

        `}</style>
        <style jsx global>
          {`
            html {
              overflow: hidden;
            }
          `}
        </style>
      </>
    );
  };
  
  export default Modal;