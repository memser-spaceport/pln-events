import { useRef } from "react";
function PlTags(props: any) {
  const items = props?.items ?? [];
  const itemId = props?.identifierId;
  const inputRef = useRef<HTMLInputElement>();
  const selectedItem = props?.selectedItem ?? "";
  const callback = props?.callback;
  const onItemSelected = (item: string) => {
    callback(itemId, item, "single-select");
  };

  return (
    <>
      <div className="plt">
        {items.map((item: string) => (
          <p
            key={`${item}`}
            onClick={(e) => onItemSelected(item)}
            className={`plt__item ${
              selectedItem === item ? "plt__item--active" : ""
            }`}
          >
            {item}
          </p>
        ))}
      </div>
      <style jsx>
        {`
          .plt {
            width: 100%;
            display: inline-flex;
            gap: 0 6px;
          }
          .plt__item {
            font-size: 12px;
            color: #0f172a;
            cursor: pointer;
            margin-bottom: 4px;
            padding: 6px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 20px;
          }
          .plt__item--active {
            background: #dbeafe;
            color: #1d4ed8;
            border: 1px solid #1d4ed8;
          }
          .plt__hidden {
            visibility: hidden;
            height: 1px;
            width: 1px;
          }
        `}
      </style>
    </>
  );
}

export default PlTags;
