import StoreHelper from './storeHelper'

const helpers = {
    REACT_APP_API_URL: function () {
        return StoreHelper.getStoreApiUrl() + 'api/'
    },
    REACT_APP_LOGIN_API: function () {
        return this.REACT_APP_API_URL() + 'user/login'
    },
    REACT_APP_CONFIG: function () {
        return this.REACT_APP_API_URL() + 'config/load'
    },
    REACT_APP_ITEM_API: function () {
        return this.REACT_APP_API_URL() + 'items/load'
    },
    REACT_APP_CATEGORY_LIST_API: function () {
        return this.REACT_APP_API_URL() + 'items/category'
    },
    REACT_APP_SALE_SAVE: function () {
        return this.REACT_APP_API_URL() + 'sales/create'
    },
    REACT_APP_DUMMY_SALE_SAVE: function () {
        return this.REACT_APP_API_URL() + 'offlineSales/create'
    },
    REACT_APP_RETURN_SAVE: function () {
        return this.REACT_APP_API_URL() + 'sales/salesreturn'
    },
    REACT_APP_RETURN_ORDER: function () {
        return this.REACT_APP_API_URL() + 'sales/returnorder'
    },
    REACT_APP_PRODUCT_RETURN_LOAD: function () {
        return this.REACT_APP_API_URL() + 'sales/loadorder'
    },
    REACT_APP_DUMMY_ORDER_LOAD: function () {
        return this.REACT_APP_API_URL() + 'offlineSales/loadorder'
    },
    REACT_APP_EDITINVOICE: function () {
        return this.REACT_APP_API_URL() + 'sales/editinvoice'
    },
    REACT_APP_FETCH_OPEN_CLOSE_TILL: function () {
        return this.REACT_APP_API_URL() + 'salesregisterapi/fetchopeningtill'
    },
    REACT_APP_SAVE_OPEN_REGISTER: function () {
        return this.REACT_APP_API_URL() + 'salesregisterapi/saveopenregister'
    },
    REACT_APP_SAVE_CLOSE_REGISTER: function () {
        return this.REACT_APP_API_URL() + 'salesregisterapi/savecloseregister'
    },
    REACT_APP_FETCH_ORDERS: function () {
        return this.REACT_APP_API_URL() + 'sales/fetchorders'
    },
    REACT_APP_SEND_STOCK_REQUEST: function () {
        return this.REACT_APP_API_URL() + 'salesregisterapi/create'
    },
    REACT_APP_CANCEL_INVOICE: function () {
        return this.REACT_APP_API_URL() + 'sales/cancel'
    },
    REACT_APP_APPLY_COUPON: function () {
        return this.REACT_APP_API_URL() + 'sales/applycoupon'
    },
    REACT_APP_LOAD_CUSTOMER_RECORD: function () {
        return this.REACT_APP_API_URL() + 'sales/loadcustomer'
    },
    REACT_APP_LOAD_CUSTOMER: function () {
        return this.REACT_APP_API_URL() + 'customerapi/loadcustomer'
    },
    REACT_APP_LOAD_NOTIFY_CUSTOMER: function () {
        return this.REACT_APP_API_URL() + 'customerapi/notifycustomer'
    },
    REACT_APP_CREATE_CUSTOMER: function () {
        return this.REACT_APP_API_URL() + 'customerapi/create'
    },
    REACT_APP_CREATE_PRODUCT: function () {
        return this.REACT_APP_API_URL() + 'items/create'
    },
    REACT_APP_LOAD_CATEGORY: function () {
        return this.REACT_APP_API_URL() + 'items/category'
    },
    REACT_APP_CREATE_CREDIT_NOTE: function () {
        return this.REACT_APP_API_URL() + 'creditnoteapi/create'
    },
    REACT_APP_CREDIT_PAYMENTS: function () {
        return this.REACT_APP_API_URL() + 'customerapi/creditpayments'
    },
    REACT_APP_CUSTOMER_HISTORY: function () {
        return this.REACT_APP_API_URL() + 'customerapi/history'
    }
}

export default helpers;