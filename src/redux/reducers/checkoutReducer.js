import {
    PREPARE_CHECKOUT,
    UPDATE_PAYMENT_MODE,
    UPDATE_CARD_NO,
    SAVE_STATUS,
    SAVE_FOR_BILLING,
    SAVE_INVOICE,
    CALCULATE_TENDER,
    UPDATE_CPHONE,
    UPDATE_CNAME,
    UPDATE_SALES_EXE,
    CLEAR_CUSTOMER,
    OTHER_PAYMENT_CASH,
    OTHER_PAYMENT_CARD,
    OTHER_PAYMENT_CARD_NO,
    OTHER_PAYMENT_OTHER,
    OTHER_PAYMENT_OTHER_TYPE,
    CLEAR_OTHER_PAYMENT,
    CLEAR_BILLING,
    DUMMY_BILL,
    UPDATE_PAID_AMT,
    UPDATE_CREDIT_AMT
} from '../action';

const initialState = {
    data: {},
    responseData: {},
    billingData: {},
    tender: '',
    suspendedCart: [],
    customer: {
        phone_number: '',
        customer_name: '',
        salesExec: ''
    },
    otherPayment: {
        cash: "",
        card: "",
        cardNo: "",
        other: "",
        otherType: "OTHER"
    },
    dummyBill: false
}
function checkout(state = initialState, action) {

    var payload = action.payload;
    let newState = { ...state }

    switch (action.type) {

        case PREPARE_CHECKOUT:
            return {
                ...state,
                data: payload,
                responseData: {},
                billingData: {},
                tender: "",
                otherPayment: {
                    cash: "",
                    card: "",
                    cardNo: "",
                    other: "",
                    otherType: "OTHER"
                },
                dummyBill: false
            }

        case UPDATE_PAYMENT_MODE:
            newState.data.payment_type = payload
            return newState

        case UPDATE_CARD_NO:
            newState.data.card_no = payload
            return newState

        case UPDATE_PAID_AMT:
            newState.data.paid_amt = payload
            return newState

        case UPDATE_CREDIT_AMT:
            newState.data.credit_amt = payload
            return newState

        case UPDATE_CPHONE:
            newState.customer.phone_number = payload
            return newState

        case UPDATE_CNAME:
            newState.customer.customer_name = payload
            return newState

        case CLEAR_CUSTOMER:
            newState.customer = { customer_name: '', phone_number: '', salesExec: '' }
            return newState

        case UPDATE_SALES_EXE:
            newState.customer.salesExec = payload
            return newState

        case OTHER_PAYMENT_CASH:
            newState.otherPayment.cash = payload
            return newState

        case OTHER_PAYMENT_CARD:
            newState.otherPayment.card = payload
            return newState

        case OTHER_PAYMENT_CARD_NO:
            newState.otherPayment.cardNo = payload
            return newState

        case OTHER_PAYMENT_OTHER:
            newState.otherPayment.other = payload
            return newState

        case OTHER_PAYMENT_OTHER_TYPE:
            newState.otherPayment.otherType = payload
            return newState

        case CLEAR_OTHER_PAYMENT:
            return {
                ...state,
                otherPayment: {
                    cash: "",
                    card: "",
                    cardNo: "",
                    other: "",
                    otherType: "OTHER"
                }
            }

        case SAVE_STATUS:
            return {
                ...state,
                responseData: payload
            }
        case SAVE_FOR_BILLING:
            return {
                ...state,
                billingData: payload
            }
        case DUMMY_BILL:
            return {
                ...state,
                dummyBill: payload
            }
        case CLEAR_BILLING:
            return {
                ...state,
                billingData: {}
            }
        case SAVE_INVOICE:
            newState.billingData.invoice = payload
            return newState

        case CALCULATE_TENDER:
            return {
                ...state,
                tender: payload
            }

        default:
            return state
    }


}

export default checkout;