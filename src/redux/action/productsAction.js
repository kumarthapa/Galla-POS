import { FETCH_PRODUCTS, ALERT, SAVE_CATEGORIES, SAVE_CATEGORY_PRODUCTS, SAVE_BESTSELLING_PRODUCTS, SAVE_RECOMMENDED_PRODUCTS, TOOGLE_CREATE_PRODUCT, CLEAR_PRODUCTS_DATA } from './index';
import { get, post } from "./http"
import UrlHelper from '../../Helper/urlHelper'


export const fetchProducts = () => dispatch => {
    let url = UrlHelper.REACT_APP_ITEM_API();
    return get(url);
}

export const saveProducts = (data) => {
    return {
        type: FETCH_PRODUCTS,
        payload: data
    }
}

export const sendStockRequest = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SEND_STOCK_REQUEST();
    post(url, formData)
        .then(res => res.json())
        .then(data => dispatch({
            type: ALERT,
            alert: data.success,
            message: data.msg
        }))
}

export const saveCategories = (data) => {
    var allCat = [];
    var allCatId = [];
    data.forEach(prod => {
        if (prod.category_id && prod.cat_name) {
            var cat = {}
            cat.id = prod.category_id
            cat.name = prod.cat_name
            if (!allCatId.includes(prod.category_id)) {
                allCat.push(cat);
                allCatId.push(prod.category_id);
            }
        }
    })
    allCat.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
    return {
        type: SAVE_CATEGORIES,
        payload: allCat
    }
}

export const saveCategoryProducts = (data) => {
    var products = data.slice(0, 40);
    return {
        type: SAVE_CATEGORY_PRODUCTS,
        payload: products
    }
}

export const saveBestsellingProducts = (data) => {
    var products = data.slice(0, 20);
    if (data.length > 60) {
        products = data.slice(40, 60);
    }
    return {
        type: SAVE_BESTSELLING_PRODUCTS,
        payload: products
    }
}

export const saveRecommendedProducts = (data) => {
    var products = data.slice(0, 20);
    if (data.length > 80) {
        products = data.slice(60, 80);
    }
    return {
        type: SAVE_RECOMMENDED_PRODUCTS,
        payload: products
    }
}

export const toogleCreateProduct = (data) => {
    return {
        type: TOOGLE_CREATE_PRODUCT,
        payload: data
    }
}

export const createProduct = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_CREATE_PRODUCT();
    return post(url, formData)
}

export const fetchCategory = () => dispatch => {
    let url = UrlHelper.REACT_APP_LOAD_CATEGORY();
    return post(url, "")
}

export const clearProducts = () => {
    return {
        type: CLEAR_PRODUCTS_DATA
    }
}