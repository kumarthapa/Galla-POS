import { SAVE_OFFLINE_ORDER, SAVE_FOR_BILLING, SAVE_STATUS, REMOVE_OFFLINE_ORDER } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"


export const saveOfflineOrder = (data) => {
    return {
        type: SAVE_OFFLINE_ORDER,
        payload: data
    }
}

export const saveOfflineBillingData = (data) => {
    return {
        type: SAVE_FOR_BILLING,
        payload: data
    }
}


export const saveOfflineResponseData = (data) => {
    return {
        type: SAVE_STATUS,
        payload: data
    }
}


export const syncOfflineOrder = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALE_SAVE();
    return post(url, formData)
}

export const removeOfflineOrder = (index) => {
    return {
        type: REMOVE_OFFLINE_ORDER,
        index: index
    }
}