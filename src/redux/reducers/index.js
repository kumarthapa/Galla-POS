import loggedReducer from './isLogged';
import themeReducer from './themeReducer';
import InterActionReducer from './InterActionReducer';
//import postReducer from './postReducer';
import storeCounterReducer from './storeCounterReducer';
import logInNowReducer from './logInNow';
import productsReducer from './products';
import cartReducer from './cartReducer';
import checkoutReducer from './checkoutReducer';
import suspendedCartReducer from './suspendedCartReducer';
import returnReducer from './returnReducer';
import discountReducer from './discountReducer';
import editReducer from './editReducer';
import openCloseRegisterReducer from './openCloseRegisterReducer'
import salesRecordReducer from './salesRecordReducer'
import cancelReducer from './cancelReducer'
import offlineReducer from './offlineReducer'
import customerReducer from './customerReducer'
import productConfig from './productConfig'
import creditReducer from './creditReducer'
import { combineReducers } from 'redux';


const allReducers = combineReducers({
    isLogged: loggedReducer,
    theme: themeReducer,
    interAction: InterActionReducer,
    //posts: postReducer,
    storeCounter: storeCounterReducer,
    storeData: logInNowReducer,
    productData: productsReducer,
    cartProduct: cartReducer,
    checkoutData: checkoutReducer,
    suspendedCart: suspendedCartReducer,
    returnData: returnReducer,
    discount: discountReducer,
    editData: editReducer,
    openCloseTill: openCloseRegisterReducer,
    salesRecord: salesRecordReducer,
    cancelData: cancelReducer,
    offlineData: offlineReducer,
    customerData: customerReducer,
    credit: creditReducer,
    productConfig: productConfig
})

const rootReducer = (state, action) => {
    // when a RESET_ALL_DATA action is dispatched it will reset redux state
    if (action.type === 'RESET_ALL_DATA') {
        state = undefined;
    }

    return allReducers(state, action);
};

export default rootReducer;
//export default allReducers;