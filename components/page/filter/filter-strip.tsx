
import { useContext } from "react";

function FilterStrip(props: any) {
    const filterCount = props?.filterCount;
    const onStripClicked = props?.onStripClicked;
    const onClearAllFilter = props?.onClear;
  return (
    <>
      <div className="fs">
        <div className="fs__cn">
          <img onClick={onStripClicked} className="fs__cn__img" src="/icons/double_arrow_left.svg" />
          <p onClick={onStripClicked} className="fs__cn__text">
            Filters
          </p>
          {filterCount > 0 && (
            <div onClick={onClearAllFilter} className="fs__cn__count">
              <div className="fs__cn__count__text">{filterCount}</div>
              <img src="/icons/close_white.svg" className="fs__cn__count__close" />
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .fs {
            width: 37px;
            height: 100%;
            border: 1px solid #e2e8f0;
          }
          .fs__cn {
            position: sticky;
            top: 120px;
            display: flex;
            margin: 5px 0;
            cursor: pointer;
            flex-direction: column;
            align-items: center;
          }
          .fs__cn__img {
            width: 20px;
          }
          .fs__cn__text {
            transform: rotate(90deg);
            margin: 16px 0;
            color: #156ff7;
            font-size: 16px;
            font-weight: 600;
          }
          .fs__cn__count {
            background: #156ff7;
            padding: 6px 2px;
            border-radius: 142px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 20px;
            margin-top: 2px;
          }
          .fs__cn__count__text {
            font-size: 12px;
            color: white;
          }
          .fs__cn__count__close {
            opacity: 0.5;
            width: 12px;
            height: 12px;
          }
        `}
      </style>
    </>
  );
}

export default FilterStrip;
