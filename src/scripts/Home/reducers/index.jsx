import winterNRO from '../../../images/store/banners/winterNRO.jpg';
import genericGrofers20 from '../../../images/store/banners/Grofers20-website.jpg';
import fresh100 from '../../../images/store/banners/FRESH100.jpg';
import genericSuper10 from '../../../images/store/banners/generic-super10.jpg';
import householdNeeds from '../../../images/store/banners/household-needs-2.jpg';
import staples from '../../../images/store/banners/staples.jpg';
import patanjali from '../../../images/store/banners/patanjali.jpg';
import cashless from '../../../images/store/banners/cashless.jpg';
import stockup15 from '../../../images/store/banners/stockup15.jpg';
import mobikwik50 from '../../../images/store/banners/mobikwik50.png';

const initialState = {
    isLoadingBanners: false,
    offers: [
        {
            text: 'Get upto 50% Cashback using MobiKwik',
            image: mobikwik50,
            url: '/cn/grocery-staples/cid/16?utm_source=hp_banner&utm_medium=website&utm_campaign=mobikwik_onsite&position=9&banner_location=hp_banner&banner_name=mobikwik_onsite'
        },
        {
            text: 'Get 15% Cashback using promo code STOCKUP15',
            image: stockup15,
            url: '/cn/grocery-staples/cid/16?utm_source=hp_banner&utm_medium=website&utm_campaign=stockup15_onsite&position=1&banner_location=hp_banner&banner_name=stockup15_onsite'
        },
        {
            text: 'Get 20% Cashback on First 3 Orders',
            image: genericGrofers20,
            url: '/cn/grocery-staples/cid/16'
        },
        {
            text: 'Get 100% Cashback on first order with Farm Fresh Friuts And Vegetables',
            image: fresh100,
            url: '/cn/fruits-vegetables/cid/9'
        },
        {
            text: 'Get 10% Cashback On Every Order',
            image: genericSuper10,
            url: '/cn/household-needs/cid/18'
        },
        {
            text: 'Upto 20% off on Household Products',
            image: householdNeeds,
            url: '/cn/household-needs/cid/18'
        },
        {
            text: 'Upto 50% off on Staples',
            image: staples,
            url: '/cn/grocery-staples/cid/16'
        },
        {
            text: 'Wildest Range of Patanjali Products',
            image: patanjali,
            url: '/cln/patanjali/clid/57c4910ee23510fd5c81782e'
        },
        {
            text: 'Introducing Grofers Cash Credit Lane For A No Cash Solution',
            image: cashless,
            url: 'https://docs.google.com/a/grofers.com/forms/d/e/1FAIpQLSdKCMzX9Wpgw8sjpBDTGRtWl8H6SLZnD70BZPUlGCcz8u1hug/viewform'
        }
    ]
};

const ui = (state = initialState, action) => {
    switch (action.type) {
        case 'REQUEST_BANNERS':
            return {
                ...state,
                isLoadingBanners: true,
            };
        case 'RECEIVE_BANNERS':
            return {
                ...state,
                isLoadingBanners: false,
                offers: action.offers
            };
        default:
            return state;
    }
};

export default ui;
