function IconTab(props: any) {
  const items = props.items ?? [];
  const selectedItemId = props.selectedItemId;
  const sectionId = props.sectionId;
  const callback = props.callback;
  const arrowImg = props.arrowImg;
  const onCloseDropdown = props.onCloseDropdown;
  const isDropDownActive = props.isDropDownActive;
  const onToggleDropdown = props.onToggleDropdown;
  const activeItems = [...items].filter((item) => item.title === selectedItemId);

  const onTabClicked = (item: any) => {
    onCloseDropdown();
    callback(item);
  };

  return (
    <>
      <div className="it">
        <div className="it__title">
          <img src="/icons/switch.svg" className="it__title__img" alt="switch" />
          <p className="it__title__txt">VIEWS</p>
        </div>
        {items.map((item: any, itemIndex: number) => (
          <div
            onClick={() => onTabClicked(item.title)}
            key={`${sectionId}-tab-${itemIndex}`}
            className={`it__item ${selectedItemId === item.title ? "it__item--active" : ""}`}
          >
            <img
              className="it__item__img"
              src={`${selectedItemId === item.title ? item.activeImg : item.inActiveImg}`}
            />
            <span>{item.name}</span>
          </div>
        ))}
        {activeItems.map((a, aIndex) => (
          <div
            className={`it__mitem ${selectedItemId === a.title ? "it__mitem--active" : ""}`}
            key={`${sectionId}-mtab-${aIndex}`}
          >
            <img
              className="it__item__img"
              // src={`${
              //   selectedItemId === a.title ? a.activeImg : a.inActiveImg
              // }`}
              src={a.inActiveImg}
            />
            <span>{a.name}</span>
          </div>
        ))}
        <div onClick={onToggleDropdown} className="it__arrow">
          <img src={arrowImg} />
        </div>
        {isDropDownActive && (
          <div className="it__pane">
            {items.map((item: any, itemIndex: number) => (
              <div
                className={`it__pane__item ${selectedItemId === item.title ? "it__pane__item--active" : ""}`}
                key={`${sectionId}-pane-${itemIndex}`}
                onClick={() => onTabClicked(item.title)}
              >
                <img
                  className="it__pane__item__img"
                  src={`${selectedItemId === item.title ? item.activeImg : item.inActiveImg}`}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>
        {`
          .it {
            background: white;
            padding: 6px;
            border-radius: 67px;
            border: 1px solid #36cf79;
            box-shadow: 0px 2px 4px 2px rgba(15, 23, 42, 0.04);
            display: flex;
            gap: 4px;
            align-items: center;
            justify-content: center;
            height: 100%;
            position: relative;
            font-size: 12px;
          }

          .it__title {
            display: flex;
            gap: 3px;
            padding: 3px 8px;
            background-color: #f161001a;
            border-radius: 100px;
          }

          .it__title__txt {
            font-weight: 700;
            font-size: 13px;
            line-height: 18px;
            color: #00AA55;
          }

          .it__arrow {
            display: flex;
            padding: 4px;
            cursor: pointer;
          }
          .it__item {
            display: none;
            border-radius: 36.75px;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            cursor: pointer;
          }
          .it__item--active {
            background: #156ff7;
            color: #ffffff;
          }

          .it__mitem {
            display: flex;
            border-radius: 36.75px;
            align-items: center;
            gap: 2px;
            justify-content: center;
          }
          .it__mitem--active {
            // background: #000000;
          }

          .it__item__img {
            width: 16px;
            height: 16px;
          }
          .it__pane {
            position: absolute;
            top: 40px;
            right: 0;
            background: white;
            z-index: 2;
            gap: 2px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            display: flex;
            padding: 8px 4px;
            flex-direction: column;
            width: 100%;
          }

          .it__pane__item {
            display: flex;
            gap: 2px;
            padding: 8px 16px;
            border-radius: 4px;
            align-items: center;
          }
          .it__pane__item--active {
            background: #156ff7;
            color: white;
          }
          .it__pane__item__img {
            cursor: pointer;
            width: 16px;
            height: 16px;
          }

          @media (min-width: 1024px) {
            .it__item {
              display: flex;
              align-items: center;
              gap: 2px;
            }
            .it__mitem {
              display: none;
            }
            .it__arrow {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
}
export default IconTab;
