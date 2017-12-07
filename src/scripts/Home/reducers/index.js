const initialState = {
    isLoadingBanners: false,
    offers: []
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
