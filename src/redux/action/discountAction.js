import { IS_COUPON_APPLIED, OPEN_DISCOUNT_BOX, APPLY_COUPON, APPLY_FLAT_OFF, APPLY_PERCENT_OFF, CLEAR_APPLIED_DISCOUNT, SAVE_COUPON_DATA, SPOT_APPLY_DISCOUNT } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"

export const openDiscountBox = (data) => {
    return {
        type: OPEN_DISCOUNT_BOX,
        payload: data
    }
}

export const isDiscountCouponApplied = (data) => {
    return {
        type: IS_COUPON_APPLIED,
        payload: data
    }
}


export const applyCoupon = (data) => {
    return {
        type: APPLY_COUPON,
        payload: data
    }
}


export const fetchCoupon = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_APPLY_COUPON();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: SAVE_COUPON_DATA,
            payload: resData
        }))
}

export const applyFlatoff = (data) => {
    return {
        type: APPLY_FLAT_OFF,
        payload: data
    }
}

export const applyPercentoff = (data) => {
    return {
        type: APPLY_PERCENT_OFF,
        payload: data
    }
}

export const clearAppliedDiscount = (data) => {
    return {
        type: CLEAR_APPLIED_DISCOUNT,
        payload: data
    }
}


export const spotApplyDiscount = (data) => {
    return {
        type: SPOT_APPLY_DISCOUNT,
        payload: data
    }
}