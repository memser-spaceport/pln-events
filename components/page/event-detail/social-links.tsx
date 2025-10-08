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
  const whatsapp = contactInfos?.whatsapp;
  const instagram = contactInfos?.instagram;
  const email = contactInfos?.email;
  const mastodon = contactInfos?.mastodon;
  const blueSky = contactInfos?.bluesky;
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
      {email && (
          <a
            className="social__link"
            href={`mailto:${getFirstUrl(email)}`}
            target="_blank"
            onClick={() => onClickSocialLink("Email", email[0])}
            title="Email"
          >
            <img src={"/icons/email.svg"} width={35} height={35} alt="email" loading="lazy" />
          </a>
        )}
        {linkedIn && (
          <a
            className="social__link"
            href={getFirstUrl(linkedIn)}
            target="_blank"
            onClick={() => onClickSocialLink("LinkedIn", linkedIn[0])}
            title="LinkedIn"
          >
            <img src={"/icons/linkedin.svg"} width={35} height={35} alt="linkedIn" loading="lazy" />
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
            <img src={"/icons/x.svg"} width={35} height={35} alt="twitter" loading="lazy" />
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
            <img src={"/icons/discord.svg"} width={35} height={35} alt="discord" loading="lazy" />
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
            <img src={"/icons/telegram.svg"} width={35} height={35} alt="telegram" loading="lazy" />
          </a>
        )}
        {whatsapp && (
          <a
            className="social__link"
            href={getFirstUrl(whatsapp)}
            target="_blank"
            onClick={() => onClickSocialLink("Whatsapp", whatsapp[0])}
            title="Whatsapp"
          >
            <img src={"/icons/whatsapp.svg"} width={35} height={35} alt="whatsapp" loading="lazy" />
          </a>
        )}
        {instagram && (
          <a
            className="social__link"
            href={getFirstUrl(instagram)}
            target="_blank"
            onClick={() => onClickSocialLink("Instagram", instagram[0])}
            title="Instagram"
          >
            <img src={"/icons/instagram.svg"} width={35} height={35} alt="instagram" loading="lazy" />
          </a>
        )}
        {mastodon && (
          <a
            className="social__link"
            href={getFirstUrl(mastodon)}
            target="_blank"
            onClick={() => onClickSocialLink("Mastodon", mastodon[0])}
            title="Mastodon"
          >
            <img src={"/icons/mastadon.svg"} width={35} height={35} alt="mastodon" loading="lazy" />
          </a>
        )}
        {blueSky && (
          <a
            className="social__link"
            href={getFirstUrl(blueSky)}
            target="_blank"
            onClick={() => onClickSocialLink("BlueSky", blueSky[0])}
            title="BlueSky"
          > 
            <img src={"/icons/bluesky.svg"} width={35} height={35} alt="bluesky" loading="lazy" />
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
            height: 35px;
            box-shadow: 0px 0px 4px 0px #0000002b;
            border-radius: 50%;
          }
        `}
      </style>
    </>
  );
};

export default SocialLinks;
