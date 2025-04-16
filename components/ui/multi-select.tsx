import HostLogo from "@/components/ui/host-logo";

function MultiSelect(props: any) {
  // Props
  const items = [...props.items].sort();
  const tickImg = props.tickImg;
  const closeImg = props.closeImg;
  const name = props.name ?? "";
  const callback = props.callback;
  const dropdownImgUrl = props.dropdownImgUrl ?? "";
  const iconUrl = props.iconUrl ?? "";
  const selectedItems = [...props.selectedItems];
  const selectedItemsNames = [...items]
    .filter((v) => selectedItems.includes(v.name))
    .map((v) => v.label);
  const filteredItems = [...props.filteredItems]?.sort((a, b) =>
    a?.label?.toLowerCase() > b?.label?.toLowerCase() ? 1 : -1
  );
  const onInputChange = props.onInputChange;
  const onItemSelected = props.onItemSelected;
  const isPaneActive = props.isPaneActive;
  const searchIcon = props.searchIcon;
  const itemId = props.itemId;
  const onMultiBoxClicked = props.onMultiBoxClicked;
  const onClearSelection = props.onClearSelection;

  return (
    <>
      <div className="ms">
        <div
          title={
            selectedItemsNames.length > 0 ? selectedItemsNames.join(" | ") : ``
          }
          onClick={onMultiBoxClicked}
          className="ms__info"
        >
          <img src={iconUrl} className="ms__info__icon" />
          {selectedItemsNames.length === 0 && (
            <div className="ms__info__text">{`Select ${name}`}</div>
          )}
          {selectedItemsNames.length === 1 && (
            <div className="ms__info__text">{selectedItemsNames[0]}</div>
          )}
          {selectedItemsNames.length > 1 && (
            <div className="ms__info__text">Multiple</div>
          )}

          {selectedItemsNames.length > 0 && (
            <div className="ms__info__count">
              <p className="ms__info__count__text">
                {selectedItemsNames.length}
              </p>
            </div>
          )}
          {selectedItemsNames.length > 0 && (
            <div
              onClick={(e) => onClearSelection(e, props?.identifierId)}
              className="ms__info__close"
            >
              <img src={`${closeImg}`} className="ms__info__close__img" />
            </div>
          )}
          <img className="ms__info__arrow" src={dropdownImgUrl} />
        </div>

        {isPaneActive && (
          <div className="ms__pane">
            {items.length === 0 && (
              <p className="ms__pane__empty">No options available</p>
            )}
            {items.length > 0 && (
              <div className="ms__pane__head">
                <input
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Search"
                  className="ms__pane__head__input"
                />
                <img
                  className="ms__pane__head__searchicon"
                  src={`${searchIcon}`}
                />
              </div>
            )}

            {filteredItems.length > 0 && props.identifierId === "locations" && (
              <div className="ms__pane__select-all">
                <div
                  onClick={() => {
                    // Check if all items are already selected
                    const allSelected = filteredItems.every((item) =>
                      selectedItems.includes(item.name)
                    );

                    // Get all item names in a single array
                    const itemNames = filteredItems.map((item) => item.name);

                    // Call onItemSelected with a special payload that indicates "select all"
                    onItemSelected(props?.identifierId, {
                      isSelectAll: true,
                      items: itemNames,
                      select: !allSelected,
                    });
                  }}
                  className="ms__pane__select-all__item"
                >
                  <p className="ms__pane__select-all__item__text">Select All</p>
                  <div
                    className={`${
                      filteredItems.every((item) =>
                        selectedItems.includes(item.name)
                      )
                        ? "ms__pane__list__item__check--active"
                        : "ms__pane__list__item__check"
                    }`}
                  >
                    <img
                      className="ms__pane__list__item__check__icon"
                      src={tickImg}
                    />
                  </div>
                </div>
                <div className="ms__pane__list__divider"></div>
              </div>
            )}

            {filteredItems.length === 0 && (
              <p className="ms__pane__empty">No options available</p>
            )}

            {items.length > 0 && (
              <div className="ms__pane__list">
                {filteredItems.map((item, index) => (
                  <div
                    key={`ms-item-${index}`}
                    onClick={() =>
                      onItemSelected(props?.identifierId, item.name)
                    }
                    className="ms__pane__list__item"
                  >
                    {/*  <div className="ms__pane__list__item__logo"></div> */}
                    {item.img ? (
                      <img
                        className="ms__pane__list__item__img"
                        src={item.img}
                      />
                    ) : props?.name === "Hosts" ? (
                      <div className="ms__pane__list__item__img">
                        <HostLogo
                          firstLetter={item.label
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                          height="20px"
                          width="20px"
                        />
                      </div>
                    ) : null}
                    <p
                      id={`${itemId}-ps-pane-${index}`}
                      title={item.label}
                      className={`ms__pane__list__item__text ${
                        selectedItems.includes(item.value)
                          ? "ps__pane__item--active"
                          : ""
                      }`}
                    >
                      {item.label}
                    </p>
                    <div
                      id={`${itemId}-ps-pane-check-${index}`}
                      className={`${
                        selectedItems.includes(item.name)
                          ? "ms__pane__list__item__check--active"
                          : "ms__pane__list__item__check"
                      }`}
                    >
                      <img
                        id={`${itemId}-ps-pane-check-img-${index}`}
                        className="ms__pane__list__item__check__icon"
                        src={tickImg}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx>
        {`
          .ms {
            position: relative;
            width: 100%;
            height: 36px;
          }
          .ms__pane__empty {
            padding: 8px 16px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            color: lightgrey;
            font-size: 13px;
          }
          .ms__info {
            position: relative;
            height: 38px;
            align-items: center;
            width: 100%;
            font-size: 14px;
            line-height: 14px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 8px 12px;
            display: flex;
            cursor: pointer;
          }
          .ms__info__icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            display: inline-block;
          }
          .ms__info__text {
            color: #475569;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-transform: capitalize;
            flex: 1;
            font-weight: 500;
            font-size: 14px;
          }
          .ms__info__close {
            background: #64748b;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 20px;
            border-radius: 0 100px 100px 0;
          }
          .ms__info__close__img {
            width: 16px;
            height: 16px;
          }
          .ms__info__count {
            background: #64748b;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 20px;
            border-radius: 100px 0 0 100px;
            margin-right: 1px;
          }
          .ms__info__count__text {
            color: white;
            font-weight: 500;
            font-size: 11px;
          }

          .ms__pane {
            position: absolute;
            background: white;
            z-index: 1;
            margin-bottom: 48px;
            top: 38px;
            left: 0;
            max-height: 250px;
            box-shadow: 0px 2px 6px rgba(15, 23, 42, 0.16);
            border-radius: 8px;
            position: absolute;
            border: 1px solid #e2e8f0;
            width: calc(100%);
          }
          .ms__pane__head {
            width: 100%;
            border-bottom: 1px solid #cbd5e1;
            padding: 16px;
            position: relative;
          }
          .ms__pane__head__input {
            border: 1px solid #cbd5e1;
            padding: 0 12px 0 32px;
            height: 36px;
            width: 100%;
            outline: none;
            border-radius: 8px;
          }
          .ms__pane__head__searchicon {
            position: absolute;
            top: 27px;
            left: 26px;
          }
          .ms__pane__list {
            overflow-y: auto;
            max-height: 120px;
            padding: 8px 16px;
          }
          .ms__pane__list__item {
            display: flex;
            align-items: center;
            cursor: pointer;
            width: 100%;
            padding: 6px 0;
          }
          .ms__pane__list__item__img {
            width: 20px;
            height: 20px;
            margin-right: 6px;
          }
          .ms__pane__list__item__text {
            color: #0f172a;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            font-weight: 400;
            flex: 1;
            text-align: left;
          }

          .ms__pane__list__item__logo {
            width: 20px;
            height: 20px;
            border: 1px solid grey;
            background: grey;
            border-radius: 50%;
            margin-right: 8px;
          }
          .ms__pane__list__item__check {
            width: 20px;
            height: 20px;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            margin-left: 8px;
          }
          .ms__pane__list__item__check--active {
            background: #156ff7;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-left: 8px;
          }
          .ms__pane__list__item__check__icon {
            width: 12px;
            height: 12px;
          }

          .ms__pane__select-all {
            padding: 8px 20px 0 20px;
          }

          .ms__pane__select-all__item {
            display: flex;
            align-items: center;
            cursor: pointer;
            width: 100%;
            padding: 6px 0;
          }

          .ms__pane__select-all__item__text {
            color: #0f172a;
            font-size: 14px;
            font-weight: 500;
            flex: 1;
            text-align: left;
          }
          .ms__pane__list__divider {
            width: 100%;
            height: 1px;
            margin-top: 5px;
            border-top: 1px solid #cbd5e1;
          }
        `}
      </style>
    </>
  );
}

export default MultiSelect;
