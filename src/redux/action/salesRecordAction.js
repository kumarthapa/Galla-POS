import { LOAD_SALES_RECORD } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"



export const loadSalesRecord = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_FETCH_ORDERS();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: LOAD_SALES_RECORD,
            payload: resData
        }))
}