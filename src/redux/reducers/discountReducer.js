import { IS_COUPON_APPLIED,OPEN_DISCOUNT_BOX, APPLY_COUPON, APPLY_FLAT_OFF, APPLY_PERCENT_OFF,CLEAR_APPLIED_DISCOUNT,SAVE_COUPON_DATA,SPOT_APPLY_DISCOUNT} from '../action';

const initialState = {
    open:false,
    apply:false,
    coupon:'',
    flatoff:'',
    percentoff:'',
    couponData:{},
    spotApply:false
}
const clearState = {
    apply:false,
    coupon:'',
    flatoff:'',
    percentoff:'',
    couponData:{},
    spotApply:false
}

function Discount (state=initialState , action){

    var data = action.payload;

    switch(action.type){

        case OPEN_DISCOUNT_BOX:
            return {
                ...state,
                open:data
            }
        case IS_COUPON_APPLIED:
            return {
                ...state,
                apply:data
            }
        case APPLY_COUPON:
            return {
                ...state,
                coupon:data
            }
        case APPLY_FLAT_OFF:
            return {
                ...state,
                flatoff:data
            }
        case APPLY_PERCENT_OFF:
            return {
                ...state,
                percentoff:data
            }
        case SAVE_COUPON_DATA:
            return {
                ...state,
                couponData:data
            }
        case CLEAR_APPLIED_DISCOUNT:
            return {
                ...state,
                ...clearState
            }
        case SPOT_APPLY_DISCOUNT:
            return {
                ...state,
                spotApply:data
            }

        default:
            return state
    }
}
    
export default Discount;