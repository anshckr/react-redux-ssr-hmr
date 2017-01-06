import { combineReducers } from 'redux';

import modal from './Shared/ModalRoot/reducers';
import serviceability from './Shared/NonServiceable/reducers';
import home from './Home/reducers';
import onboarding from './Onboarding/reducers';
import { auth, login, user } from './Login/reducers';
import { locationUi, locationData, addresses } from './Location/reducers';
import pdp from './pdp/reducers';
import { subHeaderReducer as subHeader } from './Shared/SubHeader/reducers/subHeaderReducer';
import { layoutUiReducers } from './Layout/reducers';
import { merchantData, merchantUi } from './Merchant/reducers';
import checkout from './Checkout/reducers';
import { plpUiReducers } from './Plp/reducers';
import {
    data as cartData,
    ui as cartUi
} from './Cart/reducers';
import searchReducer from './Search/reducers/searchReducer';
import backdrop from './Shared/Backdrop/reducers';
import modalInTransit from './Shared/ModalTransition/reducers';
import userAccountUiReducer from './UserAccount/reducers';

const dataReducers = combineReducers({
    auth,
    user,
    location: locationData,
    merchant: merchantData,
    cart: cartData,
    addresses
});

const uiReducers = combineReducers({
    home,
    login,
    ...layoutUiReducers,
    subHeader,
    ...plpUiReducers,
    pdp,
    onboarding,
    checkout,
    cart: cartUi,
    location: locationUi,
    search: searchReducer,
    backdrop,
    serviceability,
    merchant: merchantUi,
    modalInTransit,
    ...userAccountUiReducer
});


export default combineReducers({
    data: dataReducers,
    ui: uiReducers,
    modal
});
