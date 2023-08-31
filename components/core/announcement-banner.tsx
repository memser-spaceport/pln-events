import PreviousArrow from '../../public/icons/previous_arrow.svg';
import NextArrow from '../../public/icons/next_arrow.svg';
import CloseIcon from '../../public/icons/closeIcon.svg';
import Logo from '../../public/icons/logo.svg';
import Share from '../../public/icons/share.svg';
import { Carousel } from 'react-responsive-carousel';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AnnouncementBanner({ bannerJSON, setBannerState, showBanner }) {

    const [selectedItem, setSelectedItem] = useState(0);

    const updateCurrentSlide = (index) => {
        setSelectedItem(index);
    };

    const createMarkup = (pTag) => {
        return { __html: pTag };
    }

    const next = () => {
        setSelectedItem(selectedItem + 1);
    };

    const prev = () => {
        setSelectedItem(selectedItem - 1);
    };

    const [isMobile, setIsMobileFlag] = useState(false);

    useEffect(() => {
        setIsMobileFlag(window.innerWidth <= 640);
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", () => {
                setIsMobileFlag(window.innerWidth <= 640);
            });
        }
    },[])

    return <>
        {
            showBanner && bannerJSON && bannerJSON?.message && bannerJSON.message.length > 0 && (
                <div className="banner">
                    {
                        !isMobile && (
                            <div className="banner_navigator">
                                {
                                    bannerJSON.message.length !== 1 && (
                                        <>
                                            <div className="banner_arrow" onClick={prev}>
                                                <PreviousArrow />
                                            </div>
                                            <div className="banner_slideinfo">
                                                {selectedItem + 1} of {bannerJSON.message.length}
                                            </div>
                                            <div className="banner_arrow" onClick={next}>
                                                <NextArrow />
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        isMobile && (
                            <div>
                                <div className='inline-block px-2 py-2'>
                                    <Logo />
                                </div>
                            </div>
                        )
                    }
                    <div className="w-c">
                        <Carousel selectedItem={selectedItem} autoPlay={true} showArrows={false} infiniteLoop={true} showIndicators={isMobile && bannerJSON?.message?.length > 1}
                            showStatus={false} showThumbs={false} swipeable={false} interval={4000}
                            onChange={updateCurrentSlide}
                        >
                            {
                                bannerJSON.message.map((info, index) => {
                                    return (
                                        <div className='banner_c_container' key={index}>
                                            <div className={`banner_c ${isMobile ? 'flex-col' : 'flex-row'}`}>
                                                {
                                                    !isMobile && (
                                                        <div>
                                                            <div className='banner_logo_c'>
                                                                <Logo />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className="banner_c_text" dangerouslySetInnerHTML={createMarkup(info?.infoHtml)}></div>
                                                <div className={`${isMobile ? 'py-4' : ''}`}>
                                                    {
                                                        info?.websiteLink && (
                                                            <div className='inline-block'>
                                                                <Link href={info.websiteLink}>
                                                                    <a
                                                                        className="banner_view_website"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        View website
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        info?.learnMoreLink && (
                                                            <div className='inline-block'>
                                                                <div className=' inline-block'>
                                                                    <Link href={info.learnMoreLink}>
                                                                        <a
                                                                            className="banner_c_learn_more"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            Learn More
                                                                        </a>
                                                                    </Link>
                                                                </div>
                                                                <div className='inline-block px-1 cursor-pointer'>
                                                                    <Share />
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Carousel>
                    </div>
                    <div className="banner_close" onClick={() => { setBannerState(false) }}>
                        <CloseIcon
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            )
        }
        <style jsx>
            {
                `
            .banner{
                background: linear-gradient(90deg, #44D5BB 0%, #3EB7EB 14.03%, #427DFF 41.15%, #427DFF 52.59%, #427DFF 64.58%, #3EB7EB 85.42%, #44D5BB 100%);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                display: flex;
                justify-content: space-between;
                // position: fixed;
                top: 0px;
                //z-index: 100;
                //left: 0px;
                //right: 0px;
                height:${isMobile?'160px':'43px'};
             }

            .banner_navigator{
              display:flex;
              min-width: 124px;
              min-height: 40px;
              align-items: center;
              padding-left: 20px;
             }

            .banner_arrow{
                font-size: 14px;
                padding-left: 8px;
                padding-right: 8px;
                cursor: pointer;
            }
            .banner_slideinfo{
                font-size:14px;
                color:white;

            }
            .banner_close{
                padding:10px;
                cursor: pointer;
            }
            .banner_c_container{
                position: relative;
            }
            .banner_c{
                position:relative;
                color:white;
                font-size:14px;
                margin:auto;
                height:100%;
                padding:8px;
                display:flex;
                justify-content:center;
            }
            .banner_logo_c{
                display:inline-block;
                padding-right:8px;
                padding-left:8px;
            }
            .py-4{
                padding-top:16px;
                padding-bottom:16px;
            }
            .inline-block{
                display:inline-block;
            }
            .banner_view_website{
                padding-right:4px;
                padding-left:4px;
                border:1px solid white;
                border-radius:4px;
                cursor:pointer;
                display:block;
                padding-top:2px;
                padding-bottom:1px;
                font-size:13px;
                color: white;
                text-decoration: none;
                padding: 4px;
            }

            .banner_view_website:hover{
                background-color:white;
                color:#156FF7;
            }
            .banner_c_text{
                margin-top: auto;
                margin-bottom: auto;
                margin-right: 14px;
            }
            .banner_c_learn_more{
                font-size: 13px;
                font-weight: 500;
                padding-left: 8px;
                color: white;
                padding-right: 4px;
            }

            .flex-col{
                flex-direction:column;
            }

            .flex-row{
                flex-direction:row;
            }
            .w-c{
                width: 66.666667%;
            }
            .px-2{
                padding-left: 0.5rem; /* 8px */
                padding-right: 0.5rem; /* 8px */
            }
            .py-2{
                padding-top: 0.5rem; /* 8px */
                padding-bottom: 0.5rem; /* 8px */
            }
            .banner_info{
                -webkit-box-orient: vertical;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal
            }

            @media (max-width: 638px) {
                .w-c{
                    padding-top:${bannerJSON?.message?.length === 1 ? '35px !important':''};
                }
            
            }
            `
            }
        </style>
    </>
}
