import {
    ADD_TO_CART,
    ADD_TO_CART_WITH_QTY,
    UPDATE_QTY,
    UPDATE_PRODUCT_WITH_QTY,
    CHANGE_QTY,
    DECREASE_QTY,
    REMOVE_CART_ITEM,
    CLEAR_CART,
    RESTORE_SUSPENDED_CART_PRODUCT,
    UPDATE_CART_PRICE
} from '../action';

// const initialState = {
//     cartItems:[]
// }

function Cart(state = [], action) {

    var newProduct = action.payload;



    switch (action.type) {
        case ADD_TO_CART:
            var item = newProduct;
            item.pre_qty = item.qty;
            item.qty = 1;
            return [
                item,
                ...state
            ]

        case ADD_TO_CART_WITH_QTY:
            return [
                newProduct,
                ...state
            ]
        case UPDATE_QTY:
            return state.map(product => {
                if (product.barcode === newProduct.barcode && product.price === newProduct.price) {
                    return {
                        ...product,
                        qty: Number(product.qty) + 1
                    }
                }
                return product;
            })
        case UPDATE_PRODUCT_WITH_QTY:
            return state.map(product => {
                if (product.barcode === newProduct.barcode && product.price === newProduct.price) {
                    return {
                        ...product,
                        qty: Number(product.qty) + Number(newProduct.qty)
                    }
                }
                return product;
            })
        case UPDATE_CART_PRICE:
            return state.map(product => {
                if (product.barcode === newProduct.barcode) {
                    return {
                        ...product,
                        ...newProduct
                    }
                }
                return product;
            })
        case CHANGE_QTY:
            return state.map(product => {
                if (product.barcode === newProduct.barcode && product.price === newProduct.price) {
                    return {
                        ...newProduct
                    }
                }
                return product;
            })

        case DECREASE_QTY:
            return state.map((product, index) => {
                if (product.barcode === newProduct.barcode && product.price === newProduct.price) {

                    if (product.qty > 1) {
                        return {
                            ...product,
                            qty: Number(product.qty) - 1
                        }
                    }

                }
                return product;
            })
        case REMOVE_CART_ITEM:
            let newArray = state.slice()
            newArray.splice(action.index, 1)
            return newArray

        case CLEAR_CART:
            return []

        case RESTORE_SUSPENDED_CART_PRODUCT:
            return [
                ...state,
                newProduct
            ]
        default:
            return state
    }


}


export default Cart;