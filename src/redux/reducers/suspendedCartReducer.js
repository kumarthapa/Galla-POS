import { SUSPEND_CART, REMOVE_FROM_SUSPENDED_CART, CLEAR_SUSPENDED_CART } from '../action';

function suspendCart(state = [], action) {
    var newProduct = action.payload;

    switch (action.type) {

        case SUSPEND_CART:
            return [
                ...state,
                ...[newProduct]
            ]

        case REMOVE_FROM_SUSPENDED_CART:
            let newArray = state.slice()
            newArray.splice(action.index, 1)
            return newArray

        case CLEAR_SUSPENDED_CART:
            return []

        default:
            return state
    }


}

export default suspendCart;