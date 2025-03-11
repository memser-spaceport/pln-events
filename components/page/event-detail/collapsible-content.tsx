"use client";

import { useState } from "react";

const CollapsibleContent = (props: any) => {
  const description = props?.content;
  const [desc, setDesc] = useState(description?.substring(0, 250));

  const onShowMoreClickHandler = () => {
    setDesc(description);
  };

  const onShowLessClickHandler = () => {
    setDesc(desc?.substring(0, 250));
  };

  return (
    <>
      {desc && (
        <div className="desc">
          <p className="desc__content">
            {desc}
            {description?.length > desc?.length && (
              <>
                <span>...</span>
                <button
                  className="desc__content__toggle"
                  onClick={onShowMoreClickHandler}
                >
                  Read more
                </button>
              </>
            )}
            {description?.length > 250 && description === desc && (
              <button
                className="desc__content__toggle"
                onClick={onShowLessClickHandler}
              >
                Read less
              </button>
            )}
          </p>
        </div>
      )}
      <style jsx>{`
        .desc {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .desc__content {
          color: #64748b;
          font-size: 13px;
          font-weight: 400;
          line-height: 20px;
          white-space: normal;
          word-break: break-word;
        }

        .desc__content__toggle {
          color: #156ff7;
          padding: 0;
          border: none;
          background-color: #fff;
          display: block;
          font-size: 13px;
          font-weight: 500;
          line-height: 20px;
        }
      `}</style>
    </>
  );
};

export default CollapsibleContent;
