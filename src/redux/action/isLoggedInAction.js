import { IS_LOGGED_IN, LOG_IN_NOW, CLEAR_STORE_DATA } from './index';
//import { REACT_APP_LOGIN_API, } from '../../Helper/urlHelper'
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"


export const loadtStoreData = (formData) => dispatch => {
    let url = process.env.REACT_APP_VALIDATE_STORE;
    return post(url, formData)
}


export const LogInNow = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_LOGIN_API();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: LOG_IN_NOW,
            payload: resData
        }))
}


export const isLoogedIn = (data) => {
    return {
        type: IS_LOGGED_IN,
        payload: data
    }
}


export const clearStoreData = () => {
    return {
        type: CLEAR_STORE_DATA
    }
}

export const resetAllData = () => {
    return {
        type: 'RESET_ALL_DATA'
    }
}

