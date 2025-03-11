function TagItem(props: any) {
    const text = props.text;
    const img = props.img;
    const value= props?.value;
    const activeImg = props.activeImg;
    const inActiveImg = props.inActiveImg;
    const isActive = props.isActive;
    const callback = props.callback;
    const onItemClicked = () => {
      callback(props?.identifierId, value);
    };
    return (
      <>
        <div
          onClick={onItemClicked}
          className={`ti ${isActive ? "ti--active" : ""}`}
        >
          {activeImg && isActive && <img className="ti__img" src={activeImg} />}
          {inActiveImg && !isActive && (
            <img className="ti__img" src={inActiveImg} />
          )}
          {text && <p className="ti__text">{text}</p>}
        </div>
        <style jsx>
          {`
            .ti {
              display: flex;
              padding: 6px 12px;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              border-radius: 24px;
              border: 1px solid #cbd5e1;
              display: flex;
              background: white;
              color: #0f172a;
            }
            .ti--active {
              background: #156ff7;
              color: #fff;
            }
            .ti__img {
              height: 14px;
              display: inline-block;
              margin-right: 4px;
            }
  
            .ti__text {
              font-size: 12px;
              font-weight: 600;
              line-height: 14px;
              text-transform: lowercase;
            }
  
            .ti__text:first-letter {
              text-transform: uppercase;
            }
          `}
        </style>
      </>
    );
  }
  
  export default TagItem;
  