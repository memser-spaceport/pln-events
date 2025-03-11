import React from "react";
import SocialLinks from "./social-links";

const DescriptionTemplate = (props: any) => {
  const event = props.event;
  const constactInfos = event?.contactInfos;
  const description = event?.description ?? "";

  const hasSocialLinks = constactInfos && Object?.keys(constactInfos)?.length > 0;

  return (
    <>
      <div className="desc">
        {/* SOCIAL LINK */}
        {hasSocialLinks && (
          <div className="desc__social__wrpr">
            <div className="desc__social">
              <span className="desc__social__text">Social handles :</span>
              {constactInfos && hasSocialLinks && <SocialLinks event={event} />}
            </div>
          </div>
        )}
        <div className="desc__content">
          <p className="desc__content__text" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>

      <style jsx>{`
        .desc {
          height: 100%;
        }

        .desc__content {
          padding-top: ${hasSocialLinks ? "12px" : ""};
        }

        .desc__content__text {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
          padding: 0px 0px 10px 0;
          white-space: normal;
          word-break: break-word;
        }

        .desc__social__wrpr {
          padding-block: 12px;
          border-bottom: 1px solid #cbd5e1;
          border-top: 1px solid #cbd5e1;
        }

        .desc__social {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 46px;
        }

        .desc__social__text {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        :global(.desc__content__text a) {
          color: #156ff7;
          cursor: pointer;
        }

        :global(.desc__content__text ul),
        :global(.desc__content__text ol) {
          margin-left: 16px;
          padding-left: 16px;
          list-style-position: inside;
        }

        :global(.desc__content__text ul) {
          list-style-type: disc;
        }

        :global(.desc__content__text ol) {
          list-style-type: decimal;
        }

        /* Bold (strong, b) and Italic (em, i) styles */
        :global(.desc__content__text strong),
        :global(.desc__content__text b) {
          font-weight: 700;
          color: #0f172a;
        }

        :global(.desc__content__text em),
        :global(.desc__content__text i) {
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </>
  );
};

export default DescriptionTemplate;
