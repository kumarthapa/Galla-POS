import store from '../../store';
import CartHelper from '../cartHelper'
import { AddToCart, updateQty, clearCart, AddToCartWithQty, updateProductWithQty } from '../../redux/action/cartAction';
import { openPricePopup, saveMultiPriceProduct, openQtyPopup, saveQtyProduct } from '../../redux/action/productConfigAction';

const helpers = {
    validatePrice: function (product) {
        if (product.prices && product.prices.length === 1) {
            var price = product.prices[0];
            var updatedProduct = CartHelper.getProductUpdatedPrice(product, price);
            this.validateQty(updatedProduct);
        } else if (product.prices && product.prices.length > 1) {
            store.dispatch(saveMultiPriceProduct(product));
            store.dispatch(openPricePopup(true));
        } else {
            this.validateQty(product);
        }
    },
    validateQty: function (product) {
        var isLooseProduct = this.isLooseProduct(product);
        if (isLooseProduct) {
            store.dispatch(saveQtyProduct(product));
            store.dispatch(openQtyPopup(true));
        } else {
            this.addThisProductToCart(product)
        }
    },
    addThisProductToCart: function (cartprod) {
        const product = CartHelper.getProductWithRules(cartprod);
        var cartProducts = store.getState().cartProduct;
        if (cartProducts.length !== 0) {
            let isExist = 0;
            cartProducts.forEach(prod => {
                if (prod.barcode === product.barcode && prod.price === product.price) {
                    store.dispatch(updateQty(product));
                    isExist = 1;
                }
            })
            if (!isExist) {
                store.dispatch(AddToCart(product));
            }
        } else {
            store.dispatch(AddToCart(product));
        }
    },
    addToCartProductWithQty: function (cartprod) {
        const product = CartHelper.getProductWithRules(cartprod);
        var cartProducts = store.getState().cartProduct;
        if (cartProducts.length !== 0) {
            let isExist = 0;
            cartProducts.forEach(prod => {
                if (prod.barcode === product.barcode && prod.price === product.price) {
                    store.dispatch(updateProductWithQty(product));
                    isExist = 1;
                }
            })
            if (!isExist) {
                store.dispatch(AddToCartWithQty(product));
            }
        } else {
            store.dispatch(AddToCartWithQty(product));
        }
    },
    clearCart: function () {
        store.dispatch(clearCart())
    },
    isLooseProduct: function (product) {
        var isLooseProduct = false
        if (product && product.attributes && product.attributes.length > 0) {
            product.attributes.forEach((attr) => {
                if (attr && attr.attribute_code && attr.attribute_value) {
                    if (attr.attribute_code === "product_type" && attr.attribute_value.toLowerCase() === "loose") {
                        isLooseProduct = true
                    }
                }
            })
        }
        return isLooseProduct;
    }
}
export default helpers;