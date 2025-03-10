function IconTab(props: any) {
    const items = props.items ?? [];
    const selectedItemId = props.selectedItemId;
    const sectionId = props.sectionId;
    const callback = props.callback;
    const arrowImg = props.arrowImg;
    const onCloseDropdown = props.onCloseDropdown;
    const isDropDownActive = props.isDropDownActive;
    const onToggleDropdown = props.onToggleDropdown;
    const activeItems = [...items].filter(
      (item) => item.title === selectedItemId
    );
  
    const onTabClicked = (item: any) => {
      onCloseDropdown();
      callback(item);
    };
  
    return (
      <>
        <div className="it">
          <div className="it__title">
            <img src="/icons/switch.svg" className="it__title__img" alt="switch"/>
            <p className="it__title__txt">VIEWS</p>
          </div>
          {items.map((item: any, itemIndex: number) => (
            <div
              onClick={() => onTabClicked(item.title)}
              title={item.name}
              key={`${sectionId}-tab-${itemIndex}`}
              className={`it__item ${
                selectedItemId === item.title ? "it__item--active" : ""
              }`}
            >
              <img
                className="it__item__img"
                src={`${
                  selectedItemId === item.title
                    ? item.activeImg
                    : item.inActiveImg
                }`}
              />
            </div>
          ))}
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
              gap: 5px;
              align-items: center;
              justify-content: center;
              height: 100%;
              position: relative;
            }
            .it__title{
              display: flex;
              gap: 3px;
              padding-left: 5px;
            }
  
            .it__title__txt{
              display: none;
              font-weight: 700;
              font-size: 13px;
              line-height: 18px;
              color: #00AA55;
            }
            .it__arrow {
              display: flex;
              cursor: pointer;
              margin-left: -5px;
            }
            .it__item {
              display: flex;
              width: 28px;
              height: 28px;
              border: 1px solid #156FF7;
              border-radius: 36.75px;
              align-items: center;
              justify-content: center;
            }
            .it__item--active {
              background: #156ff7;
            }
  
            .it__mitem {
              display: flex;
              width: 28px;
              height: 28px;
              border-radius: 36.75px;
              align-items: center;
              justify-content: center;
            }
            .it__mitem--active {
              background: #156ff7;
            }
  
            .it__item__img {
              cursor: pointer;
              width: 16px;
              height: 16px;
            }
            .it__pane {
              position: absolute;
              top: 35px;
              right: 26px;
              background: white;
              z-index: 2;
              border-radius: 8px;
              border: 1px solid #cbd5e1;
              display: flex;
              padding: 4px 4px;
              flex-direction: column;
            }
  
            .it__pane__item {
              display: flex;
              width: 28px;
              height: 24px;
              border-radius: 4px;
              align-items: center;
              justify-content: center;
            }
            .it__pane__item--active {
              background: #156ff7;
            }
            .it__pane__item__img {
              cursor: pointer;
              width: 16px;
              height: 16px;
            }
  
            @media (min-width: 1024px) {
              .it__title__txt{
                display: block;
              }
  
              .it__item {
                display: flex;
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
  