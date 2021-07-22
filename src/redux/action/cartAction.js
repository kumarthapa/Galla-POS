import {
    ADD_TO_CART,
    ADD_TO_CART_WITH_QTY,
    UPDATE_QTY,
    UPDATE_PRODUCT_WITH_QTY,
    CHANGE_QTY,
    DECREASE_QTY,
    REMOVE_CART_ITEM,
    CLEAR_CART,
    PREPARE_CHECKOUT,
    UPDATE_PAYMENT_MODE,
    UPDATE_CARD_NO,
    SAVE_STATUS,
    CALCULATE_TENDER,
    SUSPEND_CART,
    RESTORE_SUSPENDED_CART_PRODUCT,
    REMOVE_FROM_SUSPENDED_CART,
    CLEAR_SUSPENDED_CART,
    SAVE_FOR_BILLING,
    SAVE_INVOICE,
    UPDATE_CNAME,
    UPDATE_CPHONE,
    UPDATE_SALES_EXE,
    CLEAR_CUSTOMER,
    OTHER_PAYMENT_CASH,
    OTHER_PAYMENT_CARD,
    OTHER_PAYMENT_CARD_NO,
    OTHER_PAYMENT_OTHER,
    OTHER_PAYMENT_OTHER_TYPE,
    CLEAR_OTHER_PAYMENT,
    CLEAR_BILLING,
    UPDATE_CART_PRICE,
    DUMMY_BILL,
    UPDATE_PAID_AMT,
    UPDATE_CREDIT_AMT

} from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"

export const AddToCart = (products) => {
    return {
        type: ADD_TO_CART,
        payload: products
    }
}

export const AddToCartWithQty = (products) => {
    return {
        type: ADD_TO_CART_WITH_QTY,
        payload: products
    }
}

export const updateQty = (products) => {
    return {
        type: UPDATE_QTY,
        payload: products
    }
}

export const updateProductWithQty = (products) => {
    return {
        type: UPDATE_PRODUCT_WITH_QTY,
        payload: products
    }
}

export const updateCartPrice = (product) => {
    return {
        type: UPDATE_CART_PRICE,
        payload: product
    }
}

export const changeQty = (data) => {
    return {
        type: CHANGE_QTY,
        payload: data
    }
}

export const decreaseQty = (product) => {
    return {
        type: DECREASE_QTY,
        payload: product
    }
}

export const removeCartItem = (index, product) => {
    return {
        type: REMOVE_CART_ITEM,
        payload: product,
        index: index
    }
}

export const clearCart = () => {
    return {
        type: CLEAR_CART
    }
}

export const clearBilling = () => {
    return {
        type: CLEAR_BILLING
    }
}

export const prepareCheckout = (data) => {
    return {
        type: PREPARE_CHECKOUT,
        payload: data
    }
}

export const updatePaymentMode = (data) => {
    return {
        type: UPDATE_PAYMENT_MODE,
        payload: data
    }
}


export const updateCardNo = (data) => {
    return {
        type: UPDATE_CARD_NO,
        payload: data
    }
}


export const updateCName = (data) => {
    return {
        type: UPDATE_CNAME,
        payload: data
    }
}

export const updateCPhone = (data) => {
    return {
        type: UPDATE_CPHONE,
        payload: data
    }
}

export const clearCustomer = () => {
    return {
        type: CLEAR_CUSTOMER
    }
}

export const updateSalesExe = (data) => {
    return {
        type: UPDATE_SALES_EXE,
        payload: data
    }
}

export const updateOtherPaymentCash = (data) => {
    return {
        type: OTHER_PAYMENT_CASH,
        payload: data
    }
}

export const updateOtherPaymentCard = (data) => {
    return {
        type: OTHER_PAYMENT_CARD,
        payload: data
    }
}

export const updateOtherPaymentCardNo = (data) => {
    return {
        type: OTHER_PAYMENT_CARD_NO,
        payload: data
    }
}


export const updateOtherPaymentOther = (data) => {
    return {
        type: OTHER_PAYMENT_OTHER,
        payload: data
    }
}

export const updateOtherPaymentOtherType = (data) => {
    return {
        type: OTHER_PAYMENT_OTHER_TYPE,
        payload: data
    }
}

export const clearOtherPayment = (data) => {
    return {
        type: CLEAR_OTHER_PAYMENT,
        payload: data
    }
}


export const generateBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALE_SAVE();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: SAVE_STATUS,
            payload: resData
        }))
}

export const generateDummyBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_DUMMY_SALE_SAVE();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: SAVE_STATUS,
            payload: resData
        }))
}

export const updateGeneratedBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_RETURN_SAVE();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: SAVE_STATUS,
            payload: resData
        }))
}

export const updateEditedBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_EDITINVOICE();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: SAVE_STATUS,
            payload: resData
        }))
}


export const calculateTenderAmount = (data) => {
    return {
        type: CALCULATE_TENDER,
        payload: data
    }
}

export const suspendCart = (data) => {
    return {
        type: SUSPEND_CART,
        payload: data
    }
}

export const restoreCartProduct = (data) => {
    return {
        type: RESTORE_SUSPENDED_CART_PRODUCT,
        payload: data
    }
}

export const removeFromSuspended = (index) => {
    return {
        type: REMOVE_FROM_SUSPENDED_CART,
        index: index
    }
}

export const clearSuspendedCart = (index) => {
    return {
        type: CLEAR_SUSPENDED_CART
    }
}

export const loadBillingData = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: SAVE_FOR_BILLING,
            payload: resData
        }))
}

export const fetchOrder = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    return post(url, formData);
}

export const loadDummyBillingData = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_DUMMY_ORDER_LOAD();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: SAVE_FOR_BILLING,
            payload: resData
        }))
}

export const saveInvoiceInBilling = (data) => {
    return {
        type: SAVE_INVOICE,
        payload: data
    }
}

export const toogleDummyBill = (data) => {
    return {
        type: DUMMY_BILL,
        payload: data
    }
}


export const updatePaidAmt = (data) => {
    return {
        type: UPDATE_PAID_AMT,
        payload: data
    }
}

export const updateCreditAmt = (data) => {
    return {
        type: UPDATE_CREDIT_AMT,
        payload: data
    }
}
