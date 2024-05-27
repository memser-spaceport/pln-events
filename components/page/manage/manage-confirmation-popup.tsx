import Modal from "@/components/core/modal";
import { MANAGE_EVENT_OPTIONS } from "@/utils/constants";

const ManageOptionPopup = (props: any) => {
  const selectedOption = props.selectedOption;
  const onClose = props?.onClose;
  const onApprove = props?.onApprove;
  const onReject = props?.onReject;

  return (
    <>
      <div className="modalcon">
        {selectedOption === MANAGE_EVENT_OPTIONS.approve.name && (
          <Modal onClose={onClose}>
            <div className="apmodal">
              <h3 className="apmodal__title">Approve Event?</h3>
              <p className="apmodal__content">
                Are you sure you want to approve this event?
              </p>
              <div className="apmodal__options">
                <button className="apmodal__options__cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="apmodal__options__approve"
                  onClick={onApprove}
                >
                  Approve
                </button>
              </div>
            </div>
          </Modal>
        )}

        {selectedOption === MANAGE_EVENT_OPTIONS.reject.name && (
          <Modal onClose={onClose}>
            <div className="rjmodal">
              <h3 className="rjmodal__title">Reject Event?</h3>
              <div className="rjmodal__content">
                <img
                  alt="note"
                  src="/icons/note-red.svg"
                  height={16}
                  width={16}
                />
                <p>You will not be able to revert this action</p>
              </div>
              <div className="rjmodal__options">
                <button className="rjmodal__options__cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="rjmodal__options__approve"
                  onClick={onReject}
                >
                Reject
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>

      <style jsx>
        {`
          .modalcon {
            width: 320px;
          }
          .apmodal,
          .rjmodal {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 250px;
          }

          .apmodal__title,
          .rjmodal__title {
            font-size: 24px;
            line-height: 32px;
            font-weight: 700;
            padding: 10px 0px;
          }

          .rjmodal__content {
            display: flex;
            padding: 10px 12px;
            gap: 10px;
            align-items: center;
            background: #dd2c5a1a;
            border-radius: 4px;
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
          }

          .apmodal__content {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
          }

          .apmodal__options,
          .rjmodal__options {
            display: flex;
            flex-direction: column-reverse;
            gap: 10px;
            cursor: pointer;
            width: 100%;
            padding: 10px 0px 10px 0px;
          }

          .apmodal__options__cancel,
          .rjmodal__options__cancel {
            height: 40px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            background: inherit;
            box-shadow: 0px 1px 1px 0px #0f172a14;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            color: #0f172a;
            padding: 10px 24px;
            cursor: pointer;
          }

          .apmodal__options__approve,
          .rjmodal__options__approve {
            height: 40px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            background: #156ff7;
            box-shadow: 0px 1px 1px 0px #0f172a14;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            color: white;
            padding: 10px 24px;
            cursor: pointer;
          }

          @media (min-width: 1200px) {
            .apmodal,
            .rjmodal {
              width: 656px;
            }

            .apmodal__options,
            .rjmodal__options {
              justify-content: end;
              padding: 6px 0 6px 0;
              flex-direction: row;
            }
          }
        `}
      </style>
    </>
  );
};

export default ManageOptionPopup;
