import {
    OPEN_PRICE_POPUP,
    SAVE_MULTI_PRICE_PRODUCT,
    SAVE_SELECTED_PRICE,
    CLEAR_MULTI_PRICE_DATA,
    OPEN_QTY_POPUP,
    SAVE_QTY_PRODUCT,
    CLEAR_MANUAL_QTY_DATA
} from './index';

export const openPricePopup = (data) => {
    return {
        type: OPEN_PRICE_POPUP,
        payload: data
    }
}

export const saveMultiPriceProduct = (data) => {
    return {
        type: SAVE_MULTI_PRICE_PRODUCT,
        payload: data
    }
}

export const saveSelectedPrice = (data) => {
    return {
        type: SAVE_SELECTED_PRICE,
        payload: data
    }
}

export const clearMultiPriceData = () => {
    return {
        type: CLEAR_MULTI_PRICE_DATA
    }
}

export const openQtyPopup = (data) => {
    return {
        type: OPEN_QTY_POPUP,
        payload: data
    }
}

export const saveQtyProduct = (data) => {
    return {
        type: SAVE_QTY_PRODUCT,
        payload: data
    }
}

export const clearQtyData = () => {
    return {
        type: CLEAR_MANUAL_QTY_DATA
    }
}