import React from "react";
import { stringToUniqueInteger } from "@/utils/helper";
import HashIcon from "@/components/ui/hash-icon";
import { COLOR_PAIRS, DEFAULT_TAGS } from "@/utils/constants";

const Tags = (props: any) => {
  const noOftagsToShow = props?.noOftagsToShow;
  const tags = props?.tags;

  const getTagColor = (tag: string) => {
    const colors = DEFAULT_TAGS[tag] || COLOR_PAIRS[stringToUniqueInteger(tag)];
    return {
      icon: colors[0],  
      tagBgColor: colors[1]
    };
  };

  return (
    <>
      <div className="tagsContainer">
        {tags?.slice(0, noOftagsToShow).map((tag: any, index: number) => {
          const tagColor = getTagColor(tag);
          return (
            <div key={`event-tag-${index}`} className="tagsContainer__tag" style={{ background: tagColor.tagBgColor}}>
              <HashIcon color={tagColor.icon} size={15} />
              <span className="tagsContainer__tag__name">{tag}</span>
            </div>
          );
        })}
        {tags.length > noOftagsToShow && (
          <div className="tagsContainer__tag__more">
            +{tags?.length - noOftagsToShow}
          </div>
        )}
      </div>
      <style jsx>{`
        .tagsContainer {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
        }

        .tagsContainer__tag {
          display: flex;
          align-items: center;
          border-radius: 4px;
        }

        .tagsContainer__tag__name {
          font-size: 12px;
          font-weight: 600;
          line-height: 20px;
          color: #000000;
          padding: 0 8px 0 4px;
        }

        .tagsContainer__tag__more {
          border: 0.5px solid #94a3b8;
          font-size: 10px;
          border-radius: 100%;
          height: 20px;
          width: 20px;
          line-height: 20px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default Tags;
