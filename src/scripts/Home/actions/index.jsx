import fetchFromApi from '../../Shared/api';

const fetchBanners = (merchantId, lat, lon) => dispatch => {
    dispatch({
        type: 'REQUEST_BANNERS'
    });

    fetchFromApi(`/v2/search/merchants/${merchantId}/promotions`, {
        headers: {
            lat,
            lon,
        },
    }).then(response => response.json())
      .then(json => {
          dispatch({
              type: 'RECEIVE_BANNERS',
              offers: json.promotions
          });
      });
};

export default fetchBanners;
