import React, { PropTypes } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import config from '../../config';
import grofersLogo from '../../../images/header/grofers.png';
import StoreCategories from './StoreCategories';
import AdjacentImage from '../../Shared/SliderArrow/components/AdjacentImage';
import Loader from '../../Shared/Loader/components';
import { removeUrlProtocol } from '../../Shared/utils/urls';
import { description } from '../../PageMeta/constants';

const MerchantLandingPage = ({ merchant, offers, isLoadingBanners }) => {
    if (merchant === null) {
        return null;
    }

    const sliderSettings = {
        autoplay: offers && offers.length > 1,
        autoplaySpeed: 5000,
        infinite: offers && offers.length > 1,
        arrows: offers && offers.length > 1,
        prevArrow:
            <AdjacentImage
                direction="prev"
                text="Previous Image"
                positionClass="store-offers__arrow--prev"
            />,
        nextArrow:
            <AdjacentImage
                direction="next"
                text="Next Image"
                positionClass="store-offers__arrow--next"
            />
    };

    const jsonLD = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Organization',
        'url': config.hostname,
        'name': 'Grofers',
        'description': description,
        'logo': `${config.hostname}${grofersLogo}`,
        'sameAs': [
            'http://www.facebook.com/Grofers',
            'http://www.twitter.com/grofers',
            'http://www.instagram.com/grofers',
            'https://en.wikipedia.org/wiki/Grofers',
            'https://www.linkedin.com/company/grofers'
        ],
        'contactPoint': [
            {
                '@type': 'ContactPoint',
                'telephone': '+91 11 33552400',
                'contactType': 'customer service'
            }
        ],
    });

    return (
        <div className="page-home">
            <Helmet
                script={[
                    {
                        type: 'application/ld+json',
                        innerHTML: jsonLD,
                    }
                ]}
            />

            <div className="store-wrapper">
                <div className="store-background" />

                <div className="wrapper">
                    <div className="store-card">
                        <div className="store-details">
                            <h2 className="store-details__name" title={merchant.name}>
                                {merchant.name}
                            </h2>
                            <div className="store-details__fulfillment-guarantee">
                                <i className="icon-circular-check" />
                                Get 10% cashback. Use code SUPER10. Max cashback ₹200.
                            </div>

                            <div className="store-details__delivery-details">
                                <i className="icon-clock" />
                                {merchant.deliveryPromise}
                            </div>
                            <div className="store-details__delivery-details">
                                <i className="icon-scooter" />
                                <span>{merchant.deliveryCharge.title} </span>
                                ₹{merchant.deliveryCharge.freeDeliveryValue}
                            </div>
                        </div>

                        { isLoadingBanners ? (
                            <div className="store-offers relative">
                                <Loader
                                    loaderClasses="merchant-loader__loader"
                                    bestPos
                                />
                            </div>
                        ) : null }

                        { !isLoadingBanners && offers && offers.length ? (
                            <div className="store-offers relative">
                                <Slider {...sliderSettings}>
                                    {
                                        offers.map((offer, index) => (
                                            <div key={index} className="store-offers__offer">
                                                { offer.url.indexOf('http') > -1 ? (
                                                    <a href={offer.url} target="_blank" rel="noopener">
                                                        <img
                                                            className="display--inline-block"
                                                            alt={offer.text}
                                                            src={removeUrlProtocol(offer.image).replace('grofers.s3.amazonaws.com', 'cdn.grofers.com')}
                                                        />
                                                    </a>
                                                ) : (
                                                    <Link to={offer.url}>
                                                        <img
                                                            className="display--inline-block"
                                                            alt={offer.text}
                                                            src={removeUrlProtocol(offer.image).replace('grofers.s3.amazonaws.com', 'cdn.grofers.com')}
                                                        />
                                                    </Link>
                                                )}
                                            </div>
                                        ))
                                    }
                                </Slider>
                            </div>
                        ) : null }
                    </div>

                    <StoreCategories
                        categories={merchant.categories}
                    />
                </div>
            </div>
        </div>
    );
};

MerchantLandingPage.propTypes = {
    // todo: complete proptypes check when proper prop is implemented
    merchant: PropTypes.object.isRequired,
    offers: PropTypes.isArray,
    isLoadingBanners: PropTypes.bool.isRequired,
};

export default MerchantLandingPage;
