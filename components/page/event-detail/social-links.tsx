// import { useEventDetailAnalytics } from "@/analytics/24-pg/event-detail-analytics";
import { useParams } from "next/navigation";
import React from "react";

const getFirstUrl = (list: any) => {
  return list?.length ? list[0] : "";
};

const SocialLinks = (props: any) => {
  const event = props?.event;
  const contactInfos = event?.contactInfos;
  const linkedIn = contactInfos?.linkedIn;
  const twitter = contactInfos?.twitter;
  const discord = contactInfos?.discord;
  const telegram = contactInfos?.telegram;
  const eventName = event?.name ?? "";
  const eventId = event?.id ?? "";
  const params = useParams();
  const view = params.type as string;

  // const { onEventUrlClicked } = useEventDetailAnalytics();

  const onClickSocialLink = (socialPlatform: string, socialLink: string) => {
    // onEventUrlClicked(view, eventId, eventName, "social", socialLink, from, {
    //   socialPlatform,
    // });
  };

  return (
    <>
      <div className="social__links">
        {linkedIn && (
          <a
            className="social__link"
            href={getFirstUrl(linkedIn)}
            target="_blank"
            onClick={() => onClickSocialLink("LinkedIn", linkedIn[0])}
            title="LinkedIn"
          >
            <img
              src={"/icons/linkedin.svg"}
              width={26}
              height={26}
              alt="linkedIn"
              loading="lazy"
            />
          </a>
        )}
        {twitter && (
          <a
            className="social__link"
            href={getFirstUrl(twitter)}
            target="_blank"
            onClick={() => onClickSocialLink("X", twitter[0])}
            title="X"
          >
            <img
              src={"/icons/x.svg"}
              width={26}
              height={26}
              alt="twitter"
              loading="lazy"
            />
          </a>
        )}
        {discord && (
          <a
            className="social__link"
            href={getFirstUrl(discord)}
            target="_blank"
            onClick={() => onClickSocialLink("Discord", discord[0])}
            title="Discord"
          >
            <img
              src={"/icons/discord.svg"}
              width={26}
              height={26}
              alt="discord"
              loading="lazy"
            />
          </a>
        )}
        {telegram && (
          <a
            className="social__link"
            href={getFirstUrl(telegram)}
            target="_blank"
            onClick={() => onClickSocialLink("Telegram", telegram[0])}
            title="Telegram"
          >
            <img
              src={"/icons/telegram.svg"}
              width={26}
              height={26}
              alt="telegram"
              loading="lazy"
            />
          </a>
        )}
      </div>

      <style jsx>
        {`
          .social__links {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .social__link {
            height: 26px;
            box-shadow: 0px 0px 4px 0px #0000002b;
            border-radius: 50%;
          }
        `}
      </style>
    </>
  );
};

export default SocialLinks;
