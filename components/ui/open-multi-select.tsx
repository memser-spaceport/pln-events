function OpenMultiSelect(props: any) {
  // Props
  const items = [...(props.items || [])].sort();
  const selectedItems = [...(props.selectedItems || [])];
  const filteredItems = [...(props.filteredItems || [])].sort((a, b) =>(a.name.toLowerCase() > b.name.toLowerCase()) ? 1: -1);
  const onInputChange = props.onInputChange;
  const onItemSelected = props.onItemSelected;
  const searchIcon = props.searchIcon;
  const itemId = props.itemId;
  const tickImg = props.tickImg;

  return (
    <>
      <div className="ms">
        <div className="ms__pane">
          <div className="ms__pane__head">
            <input onChange={(e) => onInputChange(e.target.value)} placeholder="Search" className="ms__pane__head__input" />
            <img className="ms__pane__head__searchicon" src={`${searchIcon}`} />
          </div>
            <div className="ms__pane__list">
              {filteredItems.map((item, index) => (
                <div key={`ms-item-${index}`} onClick={() => onItemSelected(props.identifierId, item.name)} className="ms__pane__list__item">
                  {/*  <div className="ms__pane__list__item__logo"></div> */}
                  <p
                    id={`${itemId}-ps-pane-${index}`}
                    title={item.name}
                    className={`ms__pane__list__item__text ${
                      selectedItems.includes(item.name) ? "ps__pane__item--active" : ""
                    }`}
                  >
                    {item.label}
                  </p>
                  {!selectedItems.includes(item.name) && <div className="ms__pane__list__item__check"></div>}
                  {selectedItems.includes(item.name) && (
                    <div className="ms__pane__list__item__check--active">
                      <img className="ms__pane__list__item__check__icon" src={tickImg} />
                    </div>
                  )}
                </div>
              ))}
                 {filteredItems.length === 0 && (
              <p className="ms__pane__list__empty">No options available</p>
            )}
            </div>

        </div>
      </div>
      <style jsx>
        {`
          .ms {
            position: relative;
            width: 100%;
          }


          .ms__pane {
            background: white;
            border-radius: 8px;
            width: calc(100%);
          }
          .ms__pane__head {
            width: 100%;
            position: relative;
          }
          .ms__pane__head__input {
            border: 1px solid #cbd5e1;
            padding: 0 12px 0 36px;
            height: 36px;
            width: 100%;
            outline: none;
            border-radius: 8px;
          }
          .ms__pane__head__searchicon {
            position: absolute;
            top: 10px;
            left: 12px;
          }
          .ms__pane__list {
            display:block;
            padding: 8px 0px;
          }
          .ms__pane__list__item {
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            width: 100%;
            padding: 6px 0;
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
            text-transform: capitalize;
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

          .ms__pane__list__empty {
            padding: 8px 16px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            color: lightgrey;
            font-size: 13px;
          }
          .ms__pane__list__item__check__icon {
            width: 12px;
            height: 12px;
          }
        `}
      </style>
    </>
  );
}

export default OpenMultiSelect;
