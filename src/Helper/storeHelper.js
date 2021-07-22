import store from '../store';
import Cookies from 'universal-cookie';

const helpers = {
    isBrowser: function () {
        return typeof window !== 'undefined' ? true : false
    },
    getStoreApiUrl: function () {
        var url = ''
        const cookies = new Cookies();
        if (cookies.get('url')) {
            url = cookies.get('url')
        }
        return url;
    },
    getStoreName: function () {
        var store_name = ''
        const cookies = new Cookies();
        if (cookies.get('store_name')) {
            store_name = cookies.get('store_name')
        }
        return store_name;
    },
    setAllDataInSession: function (prefix, data) {
        for (var label in data) {
            var prefix_label = prefix + '_' + label;
            var value = data[label];
            if (this.isBrowser()) {
                sessionStorage.setItem(prefix_label, value);
            }
        }
    },
    setThisDataInSession: function (label, value) {
        if (this.isBrowser()) {
            sessionStorage.setItem(label, value);
        }
    },
    isLoggedIn: function () {
        let islogin = false;
        if (this.isBrowser()) {
            if (sessionStorage.getItem('islogin') === 'yes') {
                islogin = true;
            }
        }
        return islogin;
    },
    logOut: function () {
        if (this.isBrowser()) {
            sessionStorage.clear();
            window.location.reload();
        }
    },
    clearStorageData: function () {
        if (this.isBrowser()) {
            sessionStorage.clear();
        }
    },
    getApiKey: function () {
        var apikey = ''
        if (this.isBrowser()) {
            if (sessionStorage.getItem('user_apikey')) {
                apikey = sessionStorage.getItem('user_apikey');
            }
        }
        return apikey
    },
    getRetailId: function () {
        var user_rid = ''
        if (this.isBrowser()) {
            if (sessionStorage.getItem('user_rid')) {
                user_rid = sessionStorage.getItem('user_rid');
            }
        }
        return user_rid
    },
    canEditInvoice: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('user_canEditInvoice'));
        }
    },
    canCancelInvoice: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('user_canCancelInvoice'));
        }
    },
    canCreateCreditNote: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('user_showCreditNote'));
        }
    },
    canCreateProduct: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_can_create_product'));
        }
    },
    getSalesCounter: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('sales_counter');
        }
    },
    getConfigPhone: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_phone');
        }
    },
    apply_dis_after_tax: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_apply_dis_without_tax'));
        }
    },
    getUserId: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_id');
        }
    },
    getUserName: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_name');
        }
    },
    getUserAddress: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_address');
        }
    },
    getConfigAddress: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_address');
        }
    },
    getUserCity: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_city');
        }
    },
    getUserRegion: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_region');
        }
    },
    getUserPincode: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_pincode');
        }
    },
    getGSTNo: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_gst_no');
        }
    },
    getLocationId: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_location_id');
        }
    },
    getLocationName: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_location_name');
        }
    },
    getCompany: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_company');
        }
    },
    getCompanyLogo: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_company_logo');
        }
    },
    getReturnPolicy: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_return_policy');
        }
    },
    getCurrencySymbol: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_currency_symbol');
        }
    },
    getCurrencyFormatted: function (amt) {
        if (this.isBrowser()) {
            return this.getCurrencySymbol() + '' + amt;
        }
    },
    getOtherPaymentOptions: function () {
        var paymentOptions = []
        var storeData = store.getState().storeData;
        if (this.isBrowser()) {
            if (sessionStorage.getItem('configs_other_payment_options')) {
                paymentOptions = sessionStorage.getItem('configs_other_payment_options').split(',');
            } else {
                paymentOptions = storeData.data.configs.other_payment_options.split(',');
            }
        }
        return paymentOptions
    },
    isOnline: function () {
        return navigator.onLine;
    },
    isBarcodeReturn: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_barcode_return'));
        }
    },
    isStockValidationCheckEnabled: function () {
        var isEnabled = false
        if (this.isBrowser()) {
            if (Number(sessionStorage.getItem('configs_stock_validation_check')) === 1) {
                isEnabled = true
            }
        }
        return isEnabled;
    },
    isGlobalDiscountEnabled: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('user_showGblDisc'));
        }
    },
    isCashAllowed: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_is_cash_allowed'));
        }
    },
    isCardAllowed: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_is_card_allowed'));
        }
    },
    isUPIAllowed: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_is_upi_allowed'));
        }
    },
    isOTHERAllowed: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_is_other_allowed'));
        }
    },
    isWalletAllowed: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_is_wallet_allowed'));
        }
    },
    isCreditAllowed: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_is_credit_allowed'));
        }
    },
    getWalletOptions: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('configs_wallet_options');
        }
    },
    isPriceEditable: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_price_editable'));
        }
    },
    isDummyBillAllowed: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_bill_offline'));
        }
    },
    getInvTemp: function () {
        if (this.isBrowser()) {
            return (sessionStorage.getItem('configs_invtemplate')) ? sessionStorage.getItem('configs_invtemplate') : "default";
        }
    },
    getLangs: function () {
        var langs = {}
        var storeData = store.getState().storeData;
        if (storeData && storeData.data && storeData.data.langs) {
            langs = storeData.data.langs
        }
        return langs
    },
    isCustomerRewardEnable: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_customer_reward_enable'));
        }
    },
    getInvPrefix: function () {
        if (this.isBrowser()) {
            return sessionStorage.getItem('user_invprefix');
        }
    },
    isCustRequired: function () {
        if (this.isBrowser()) {
            return Number(sessionStorage.getItem('configs_customer_required'));
        }
    }
}

export default helpers;