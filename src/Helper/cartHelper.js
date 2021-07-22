import store from '../store';
import Helper from '../Helper/storeHelper'

const helpers = {

    getTotalQty: function () {
        var qty = 0;
        var cartProducts = store.getState().cartProduct;
        //console.log(cartProduct);
        cartProducts.forEach(product => {
            //console.log(product);
            qty += Number(product.qty);
        })
        return qty;
    },
    getTotalAmount: function () {
        var amount = 0;
        var cartProducts = store.getState().cartProduct;
        cartProducts.forEach(product => {
            var ruleAppliedPrice = this.getRulesAppliedData(product);
            //console.log(ruleAppliedPrice);
            if (this.isGiftVoucherApplicable()) {
                amount += product.qty * this.getFinalPrice(product);
            } else {
                amount += product.qty * ruleAppliedPrice.price;
            }
        })
        return Number(Math.round(amount)).toFixed(2);
    },
    getTotalAmountWithoutRule: function () {
        var amount = 0;
        var cartProducts = store.getState().cartProduct;
        cartProducts.forEach(product => {
            if (Helper.apply_dis_after_tax() || this.isRulesAppliedAsCoupon()) {
                amount += product.qty * this.getFinalPrice(product);
            } else {
                amount += product.qty * this.getPrice(product);
            }
        })
        //console.log(amount);
        return Number(Math.round(amount)).toFixed(2);
    },
    getPrice: function (product) {
        var price = Number(product.price);
        return price
    },
    getFinalPrice: function (product) {
        var finalprice = Number(product.finalprice);
        return finalprice
    },
    getBillSummary: function () {
        var cartProducts = store.getState().cartProduct;
        var summary = {};
        var beforeDiscount = 0;
        var subtotal = 0;
        var taxAmount = 0;
        var discountAmount = 0;
        var totalPayable = 0;
        var defaultDiscountAmount = 0;
        var freeProdTax = 0;

        cartProducts.forEach(product => {
            var ruleAppliedPrice = this.getRulesAppliedData(product);
            beforeDiscount += product.qty * this.getPrice(product);
            subtotal += product.qty * ruleAppliedPrice.subtotal;
            discountAmount += product.qty * ruleAppliedPrice.discountAmount;
            totalPayable += product.qty * ruleAppliedPrice.price;

            if (ruleAppliedPrice.defaultDiscountAmount) {
                defaultDiscountAmount += product.qty * ruleAppliedPrice.defaultDiscountAmount;
            }

            //console.log(ruleAppliedPrice);
            if (this.isGiftVoucherApplicable()) {
                taxAmount += product.qty * this.getTaxAmount(this.getPrice(product), product);
            } else {
                taxAmount += product.qty * ruleAppliedPrice.taxamount;
            }

            if (ruleAppliedPrice.freeProdTax) {
                freeProdTax = ruleAppliedPrice.freeProdTax
            }
        })
        if (freeProdTax) {
            taxAmount -= freeProdTax
            beforeDiscount += freeProdTax
        }

        //Returning bill Summary data
        summary.beforeDiscount = Number(beforeDiscount).toFixed(2);
        summary.subtotal = Number(subtotal).toFixed(2);
        summary.taxamount = Number(taxAmount).toFixed(2);
        summary.discountAmount = Number(discountAmount).toFixed(2);
        summary.round = Number(Math.round(totalPayable) - totalPayable).toFixed(2);
        summary.defaultDiscountAmount = Number(defaultDiscountAmount).toFixed(2);

        return summary;
    },
    getCheckoutData: function () {
        return store.getState().checkoutData;
    },
    getBillingData: function () {
        var checkoutData = store.getState().checkoutData;
        var billingData = checkoutData.billingData;
        return billingData
    },
    getResponseData: function () {
        var checkoutData = store.getState().checkoutData;
        var responseData = checkoutData.responseData;
        return responseData
    },
    calculateTax: function (discounted_price, product) {
        var taxPercent = product.tax;
        var taxAmount = (discounted_price / 100) * taxPercent;
        var final_price = discounted_price + taxAmount;
        return final_price;
    },
    getTaxAmount: function (discounted_price, product) {
        //console.log(discounted_price);
        var taxPercent = product.tax;
        var taxAmount = (discounted_price / 100) * taxPercent;
        return taxAmount;
    },
    getTaxDetailsToPrint: function () {
        var checkoutData = store.getState().checkoutData;
        var products = checkoutData.billingData.data;
        var TaxSlabArray = this.getTaxSlab(products);
        var TaxNames = this.getTaxNames(products);
        var filteredTaxSlabProducts = []
        if (!this.isEmpty(TaxSlabArray)) {
            TaxSlabArray.forEach(taxSlab => {
                var filterTaxSlabList = this.filterTaxSlabList(taxSlab, products);
                var taxTotalsBySlab = this.getTaxTotalsBySlab(filterTaxSlabList);
                var taxDetails = {}
                taxDetails.slab_total = Number(taxTotalsBySlab.slab_total).toFixed(2)
                taxDetails.tax_total = Number(taxTotalsBySlab.total).toFixed(2)
                taxDetails.tax_percent = Number(taxSlab).toFixed(2)
                taxDetails.tax_rates = taxTotalsBySlab.tax_rates
                //console.log(taxDetails);
                filteredTaxSlabProducts.push(taxDetails)
            })
        }
        //console.log(filteredTaxSlabProducts)
        var data = {}
        data.tax_data = filteredTaxSlabProducts.sort((a, b) => Number(a.tax_percent) - Number(b.tax_percent));
        data.tax_names = TaxNames;
        return data;
    },
    getTaxNames: function (products) {
        var TaxNamesArray = []
        products.forEach(product => {
            //console.log(product)
            if (TaxNamesArray.length === 0 && JSON.stringify(TaxNamesArray) !== JSON.stringify(product.tax_names)) {
                TaxNamesArray = product.tax_names
            }
        });
        return TaxNamesArray;
    },
    getTaxSlab: function (products) {
        var TaxSlabArray = []
        products.forEach(product => {
            //console.log(product)
            if (!TaxSlabArray.includes(product.tax)) {
                TaxSlabArray.push(product.tax)
            }
        });
        return TaxSlabArray;
    },
    filterTaxSlabList: function (keyValue, list) {
        let filteredList = [];
        for (let i = 0; i < list.length; i++) {
            //console.log(list[i]);
            if (list[i]["tax"] === keyValue) {
                filteredList.push(list[i]);
            }
        }
        return filteredList;
    },
    getTaxTotalsBySlab: function (productList) {
        var details = {}
        var taxRates = {}
        var taxTotals = 0
        var slabTotals = 0
        if (!this.isEmpty(productList)) {
            productList.forEach(product => {
                var rulesAppliedData = this.getRulesAppliedData(product)
                //var taxamount = rulesAppliedData.taxamount
                //console.log(rulesAppliedData)
                var freeProductIds = (rulesAppliedData.freeProductIds && rulesAppliedData.freeProductIds.length > 0) ? rulesAppliedData.freeProductIds : [];

                if (!freeProductIds.includes(Number(product.id))) {
                    if (this.isGiftVoucherApplicable()) {
                        slabTotals += this.getPrice(product) * Number(product.qty);
                        taxTotals += (product.qty * this.getTaxAmount(this.getPrice(product), product));
                    } else {
                        slabTotals += Number(rulesAppliedData.subtotal) * Number(product.qty);
                        taxTotals += (product.qty * rulesAppliedData.taxamount);
                    }
                    //taxTotals = taxTotals + taxamount
                    taxRates = product.tax_rates
                }
            })
        }
        details.total = taxTotals;
        details.slab_total = slabTotals;
        details.tax_rates = taxRates
        //console.log(details)
        return details
    },
    getCurrencyFormatted: function (amt) {
        return Helper.getCurrencySymbol() + '' + amt;
    },
    isEmpty: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    isNewSale: function () {
        var isNewSale = false;
        var state = store.getState();
        var returnData = state.returnData;
        var editData = state.editData;
        if (this.isEmpty(returnData) && this.isEmpty(editData)) {
            isNewSale = true;
        }
        return isNewSale;
    },
    isRulesApplied: function (product, rule) {
        var isRulesApplied = false;
        if (rule.items.length === 0 && rule.category_ids.length === 0) {
            isRulesApplied = true;
        }
        if (rule.items.length > 0) {
            rule.items.forEach(itemId => {
                if (Number(itemId) === Number(product.id)) {
                    return isRulesApplied = true;
                }
            })
        }
        if (rule.category_ids.length > 0) {
            rule.category_ids.forEach(catId => {
                if (Number(catId) === Number(product.category_id)) {
                    return isRulesApplied = true;
                }
            })
        }
        return isRulesApplied;
    },
    getCurrentAppliedRule: function (product) {
        var state = store.getState();
        var cartProducts = state.cartProduct;
        var rules = (product.rules && product.rules.length > 0) ? product.rules : state.productData.products.rules;

        if (Array.isArray(rules) && rules.length > 0) {
            var appliedRule = [];
            var sorted = [];
            rules.forEach(rule => {
                var isApplicable = this.isRuleApplicableOnCurrentCart(cartProducts, product, rule);
                if (isApplicable) {
                    appliedRule.push(rule);
                }
            })
            //console.log(appliedRule);
            if (appliedRule.length > 0) {
                sorted = appliedRule.sort((a, b) =>
                    (a.priority !== '0' ? a.priority : Infinity) - (b.priority !== '0' ? b.priority : Infinity)
                ).slice(0, 1);
            }
            if (sorted.length > 0) {
                sorted = sorted[0]
            }
            //console.log(sorted);
            rules = sorted;
        }

        var returnData = state.returnData
        if (!this.isEmpty(returnData)) {
            rules = returnData.rules
            if (this.getAppliedAsCouponDataByRule(rules)) {
                rules = {}
            }
        }

        var billingData = state.checkoutData.billingData
        if (!this.isEmpty(billingData)) {
            if (this.getAppliedAsCouponDataByRule(rules)) {
                rules = {}
            }
        }

        var editData = state.editData
        if (!this.isEmpty(editData)) {
            rules = editData.rules
        }

        return rules;
    },
    isRuleApplicableOnCurrentCart: function (cartProducts, product, rule) {
        var isRuleApplicable = false;
        var type_id = parseInt(rule.type_id);


        if (type_id === 1) {
            if (rule.percentoff && Number(rule.percentoff) > 0) {
                isRuleApplicable = true
            }
            if (rule.flatoff && Number(rule.flatoff) > 0) {
                isRuleApplicable = true
            }
        }
        if (type_id === 2) {
            if (Number(rule.qty_buy) && Number(rule.qty_get)) {
                let totalOfferQty = parseFloat(rule.qty_get) + parseFloat(rule.qty_buy);
                var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

                if (this.isRuleApplicableOnlyOnProduct(rule) && this.isRuleApplicableOnThisProduct(product, rule)) {
                    totalCartQty = Number(product.qty)
                }

                if (totalCartQty >= totalOfferQty) {
                    var noOfFreeCount = (totalCartQty - (totalCartQty % totalOfferQty)) / totalOfferQty;
                    //console.log(noOfFreeCount);
                    if (noOfFreeCount > 0) {
                        isRuleApplicable = true
                    }
                }
            }
        }
        if (type_id === 4) {
            if (this.isExistInQtyRange(cartProducts, rule)) {
                isRuleApplicable = true
            }
        }
        if (type_id === 5) {
            if (this.isExistInAmountRange(cartProducts, rule)) {
                isRuleApplicable = true
            }
        }
        return isRuleApplicable

    },
    isExistInAmountRange: function (cartProducts, rule) {
        var isExist = false
        var totalCartValue = this.getRuleAppliedCartTotal(cartProducts, rule);

        if (rule.amt_range) {
            var amt_ranges = rule.amt_range.split(';');
            amt_ranges.forEach((amt_range, index) => {
                var percent_off_range = rule.percent_off_range.split(';');
                var flat_off_range = rule.flat_off_range.split(';');
                var amountRange = amt_range.split('-');
                var startRange = amountRange[0];
                var endRange = amountRange[1];
                if (totalCartValue >= Number(startRange) && totalCartValue <= Number(endRange) && percent_off_range[index] && percent_off_range[index] !== 0) {
                    isExist = true
                }
                if (totalCartValue >= Number(startRange) && totalCartValue <= Number(endRange) && flat_off_range[index] && flat_off_range[index] !== 0) {
                    isExist = true
                }
            })
        } else if (rule.amt_spend && Number(totalCartValue) >= Number(rule.amt_spend)) {
            isExist = true
        }
        return isExist;
    },
    isExistInQtyRange: function (cartProducts, rule) {
        var isExist = false
        var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

        if (rule.qty_range) {
            var qty_ranges = rule.qty_range.split(';');
            qty_ranges.forEach((qty_range, index) => {
                let percent_off_range = rule.percent_off_range.split(';');
                var flat_off_range = rule.flat_off_range.split(';');
                var qtyRange = qty_range.split('-');
                var qtyStartRange = qtyRange[0];
                var qtyEndRange = qtyRange[1];
                if (totalCartQty >= Number(qtyStartRange) && totalCartQty <= Number(qtyEndRange) && percent_off_range[index] && Number(percent_off_range[index]) !== 0) {
                    isExist = true
                }
                if (totalCartQty >= Number(qtyStartRange) && totalCartQty <= Number(qtyEndRange) && flat_off_range[index] && Number(flat_off_range[index]) !== 0) {
                    isExist = true
                }
            })
        } else if (rule.qty_buy && Number(totalCartQty) >= Number(rule.qty_buy)) {
            isExist = true
        }
        return isExist;
    },
    isAppliedCouponDiscount: function (discount) {
        var state = store.getState()
        if (this.isEmpty(discount)) {
            discount = state.discount;
        }

        var isDiscountApplied = false;
        if (discount.apply && (discount.coupon || discount.flatoff || discount.percentoff)) {
            isDiscountApplied = true;
        }

        var customerData = state.customerData
        if (discount.apply && customerData.isChecked && Number(customerData.redeemamount) > 0) {
            isDiscountApplied = true;
        }

        return isDiscountApplied;
    },
    isOnlyCouponCodeApplied: function (discount) {
        var state = store.getState()
        if (this.isEmpty(discount)) {
            discount = state.discount;
        }

        var isOnlyCouponCodeApplied = false;
        if (!this.isEmpty(discount.couponData) && discount.couponData.success) {
            isOnlyCouponCodeApplied = true;
        }

        return isOnlyCouponCodeApplied;
    },
    isOnlyFlatDiscountApplied: function (discount) {
        if (this.isEmpty(discount)) {
            var state = store.getState()
            discount = state.discount;
        }
        var isOnlyFlatDiscountApplied = false;
        if (discount.apply && (discount.flatoff)) {
            isOnlyFlatDiscountApplied = true;
        }
        return isOnlyFlatDiscountApplied;
    },
    getManualDiscountedValue: function () {
        var discountValue = 0
        var state = store.getState()
        var discount = state.discount;

        var customerData = state.customerData;
        if (customerData.isChecked && Number(customerData.redeemamount)) {
            discountValue = Number(customerData.redeemamount);
        }
        if (discount.apply && discount.flatoff) {
            discountValue = Number(discount.flatoff);
        }
        if (discount.apply && discount.flatoff && customerData.isChecked && Number(customerData.redeemamount)) {
            discountValue = Number(discount.flatoff) + Number(customerData.redeemamount);
        }
        if (discount.apply && !this.isEmpty(discount.couponData) && discount.couponData.success) {
            discountValue = Number(discount.couponData.data.discount)
        }
        if (discount.apply && discount.percentoff) {
            var amount = 0;
            var tax = 0;
            var cartProducts = state.cartProduct;
            cartProducts.forEach(product => {
                amount += product.qty * product.price;
                tax += this.getTaxAmount(product.price, product)
            })
            if (this.isApplyingDiscountAfterTax()) {
                var amountWithTax = amount + tax
                discountValue = (amountWithTax / 100) * discount.percentoff
            } else {
                discountValue = (amount / 100) * discount.percentoff
            }
        }
        //console.log(discountValue);
        return discountValue
    },
    isApplyingDiscountAfterTax: function () {
        var apply_dis_after_tax = false
        var discount = store.getState().discount
        if (Helper.apply_dis_after_tax() === 1 || this.isAppliedCouponDiscount(discount)) {
            apply_dis_after_tax = true
        }
        if (this.hasGlobalDiscountInReturn()) {
            apply_dis_after_tax = true
        }

        return apply_dis_after_tax
    },
    isRulesAppliedAsCoupon: function () {
        var isRulesAppliedAsCoupon = false
        var state = store.getState()
        var rule = this.getCurrentAppliedRule("")
        if (!this.isEmpty(rule) && !this.isEmpty(state.productData)) {
            if (!this.isEmpty(rule) && Number(rule.apply_as_coupon) === 1) {
                isRulesAppliedAsCoupon = true
            }
        }
        var returnData = state.returnData
        if (!this.isEmpty(returnData)) {
            isRulesAppliedAsCoupon = false
        }

        return isRulesAppliedAsCoupon
    },
    getAppliedAsCouponDataByRule: function (rule) {
        var isRulesAppliedAsCoupon = false
        if (!this.isEmpty(rule) && Number(rule.apply_as_coupon) === 1) {
            isRulesAppliedAsCoupon = true
        }
        return isRulesAppliedAsCoupon
    },
    isSpotApplied: function () {
        var state = store.getState()
        var spotApply = state.discount.spotApply;
        return spotApply
    },
    isGiftVoucherApplicable: function () {
        var isGiftVoucherApplicable = false

        var state = store.getState()
        var discount = state.discount;

        if (this.isRulesAppliedAsCoupon() && !this.isSpotApplied()) {
            isGiftVoucherApplicable = true
        }
        if (this.isAppliedCouponDiscount(discount)) {
            isGiftVoucherApplicable = false
        }

        return isGiftVoucherApplicable
    },
    getRulesAppliedData: function (product) {
        var data = {};
        //var discountLabel               = '';
        var default_discounted_data = {
            discounted_price: this.getPrice(product),
            discountAmount: 0,
            percentage_off_discount: 0,
            discount_label: ''
        };
        var discounted_data = default_discounted_data;
        var state = store.getState()
        var cartProducts = state.cartProduct;
        var returnData = state.returnData;
        //var editData = state.editData;
        var discount = state.discount;
        var rule = this.getCurrentAppliedRule(product)

        if (!this.isAppliedCouponDiscount(discount)) {
            if (!this.isEmpty(rule) && this.isRulesApplied(product, rule)) {
                /*
                type_id:
                    1 => is for Simple Discount
                    2 => is for buy X Get Y Discount
                    4 => is for buy X Get Discount
                    5 => is for Spent X Get Discount
                */
                switch (parseInt(rule.type_id)) {
                    case 1:
                        discounted_data = this.getSimpleDiscount(product, rule);
                        break;

                    case 2:
                        discounted_data = this.buyXGetY(product, rule, cartProducts);
                        break;

                    case 4:
                        discounted_data = this.buyXGetDiscount(product, rule, cartProducts);
                        break;

                    case 5:
                        discounted_data = this.spentXGetDiscount(product, rule, cartProducts);
                        break;

                    default:
                        discounted_data = default_discounted_data
                }
            }

        } else if (this.isAppliedCouponDiscount(discount)) {
            discounted_data = this.getCouponAppliedData(product, discount, cartProducts)
            //sending default rules discount amount
            data.defaultDiscountAmount = discounted_data.defaultDiscountAmount
        }

        //console.log(discounted_data);

        //Check if Global discount applied
        if (!this.isEmpty(returnData) && !returnData.startRule) {
            discounted_data = this.getReturnEditData(returnData, cartProducts, product)
        }

        //tax calculation
        var taxamount = this.getTaxAmount(discounted_data.discounted_price, product);
        if (discounted_data.freeProdTax) {
            data.freeProdTax = discounted_data.freeProdTax
            data.freeProductIds = discounted_data.freeProductIds
        }

        data.taxamount = taxamount
        data.price = Number(discounted_data.discounted_price + taxamount).toFixed(2);

        if (this.isApplyingDiscountAfterTax()) {
            var price_incl_tax = Number(discounted_data.discounted_price + taxamount);
            var price_after_discount = Number(price_incl_tax) - Number(discounted_data.discountAmount);
            //console.log(price_after_discount);
            data.price = Number(price_after_discount).toFixed(2);
            if (price_after_discount < 0) {
                data.price = Number(0).toFixed(2);
            }
        }

        data.subtotal = discounted_data.discounted_price
        data.discountAmount = discounted_data.discountAmount
        data.percentage_off_discount = discounted_data.percentage_off_discount
        data.discount_label = discounted_data.discount_label
        data.rule_id = (discounted_data.rule_id) ? discounted_data.rule_id : ""

        //console.log(data)

        return data;
    },
    getOnlyDefaultRulesAppliedData: function (product) {
        var data = {};
        var default_discounted_data = {
            discounted_price: this.getPrice(product),
            discountAmount: 0,
            percentage_off_discount: 0,
            discount_label: Number(0).toFixed(2) + '%'
        };
        var discounted_data = default_discounted_data;
        var state = store.getState()
        var cartProducts = state.cartProduct;
        var rule = this.getCurrentAppliedRule(product);


        if (!this.isEmpty(rule) && this.isRulesApplied(product, rule)) {
            /*
            type_id:
                1 => is for Simple Discount
                2 => is for buy X Get Y Discount
                4 => is for buy X Get Discount
                5 => is for Spent X Get Discount
            */
            switch (parseInt(rule.type_id)) {
                case 1:
                    discounted_data = this.getSimpleDiscount(product, rule);
                    break;

                case 2:
                    discounted_data = this.buyXGetY(product, rule, cartProducts);
                    break;

                case 4:
                    discounted_data = this.buyXGetDiscount(product, rule, cartProducts);
                    break;

                case 5:
                    discounted_data = this.spentXGetDiscount(product, rule, cartProducts);
                    break;

                default:
                    discounted_data = default_discounted_data
            }
        }

        //tax calculation
        var taxamount = this.getTaxAmount(discounted_data.discounted_price, product);
        data.taxamount = taxamount
        data.price = Number(discounted_data.discounted_price + taxamount).toFixed(2);
        data.subtotal = discounted_data.discounted_price
        data.discountAmount = discounted_data.discountAmount
        data.percentage_off_discount = discounted_data.percentage_off_discount
        data.discount_label = discounted_data.discount_label

        return data;
    },
    getCouponAppliedData: function (product, discount, cartProducts) {

        var default_discounted_data = {
            discounted_price: this.getPrice(product),
            discountAmount: 0,
            percentage_off_discount: 0,
            discount_label: Number(0).toFixed(2) + '%'
        };
        var discounted_data = default_discounted_data;
        var discountLabel = Number(0).toFixed(2) + '%';

        //defining redeem amount
        var state = store.getState()
        var customerData = state.customerData
        var redeemAmount = Number(customerData.redeemamount)

        //var CartQty = this.getTotalQty();
        if (discount.percentoff) {
            var percentoff = Number(discount.percentoff);
            if (percentoff > 0) {
                discountLabel = Number(percentoff).toFixed(2) + '%'
            }
            discounted_data = this.getPercentOf(product, percentoff);
            discounted_data.discount_label = discountLabel;
        }
        var percentOnPerProduct = 0
        if (discount.flatoff || redeemAmount) {
            var flatOff = Number(discount.flatoff);
            if (flatOff === 0 && customerData.isChecked && redeemAmount) {
                flatOff = redeemAmount
            }
            if (flatOff > 0 && customerData.isChecked && redeemAmount) {
                flatOff = Number(discount.flatoff) + redeemAmount
            }
            percentOnPerProduct = this.getPercentageOfCartTotal(cartProducts, flatOff);
            //var discountPerProduct = discount.flatoff / CartQty
            discounted_data = this.getPercentOf(product, percentOnPerProduct);
        }
        if (!this.isEmpty(discount.couponData) && discount.couponData.success) {
            if (discount.couponData.data.type === 'fixed') {
                var couponDiscountAmount = Number(discount.couponData.data.discount);
                percentOnPerProduct = this.getPercentageOfCartTotal(cartProducts, couponDiscountAmount);
                //var coupondiscountPerProduct = couponDiscountAmount / CartQty
                discounted_data = this.getPercentOf(product, percentOnPerProduct);
            }
        }

        var onlyRulesAppliedData = this.getOnlyDefaultRulesAppliedData(product)
        discounted_data.defaultDiscountAmount = onlyRulesAppliedData.discountAmount

        return discounted_data;
    },
    getPercentageOfCartTotal: function (cartProducts, flatoff) {
        var totalCartValue = 0;
        cartProducts.forEach(product => {
            var price = this.getPrice(product) * Number(product.qty);
            if (this.isApplyingDiscountAfterTax()) {
                price = this.getFinalPrice(product) * Number(product.qty);
            }
            totalCartValue += price
        })
        var percentage = flatoff / totalCartValue * 100

        return percentage;
    },
    hasGlobalDiscountInReturn: function () {
        var isApplied = false
        var state = store.getState()
        if (!this.isEmpty(state.returnData)) {
            var returingProduct = state.returnData.data;
            returingProduct.forEach(product => {
                if (Number(product.applyDisWithoutTax) === 1) {
                    isApplied = true
                    return isApplied
                }
            })
        }
        return isApplied
    },
    hasGlobalDiscountOnBilling: function (billingData) {
        var isApplied = false
        if (billingData !== undefined && billingData.length > 0) {
            billingData.forEach(product => {
                if (Number(product.applyDisWithoutTax) === 1) {
                    isApplied = true
                    return isApplied
                }
            })
        }
        return isApplied
    },
    isReturingCartChanged: function () {
        var ischanged = false
        var state = store.getState()
        var cartProducts = state.cartProduct;
        if (!this.isEmpty(state.returnData)) {
            var returingProduct = state.returnData.data;
            if (JSON.stringify(cartProducts) !== JSON.stringify(returingProduct)) {
                ischanged = true
            }
        }
        return ischanged;
    },
    getReturnEditData: function (returnEditData, cartProducts, product) {
        var discounted_data = {};
        var hasDiscount = Number(returnEditData.sales_data.discount)
        var applied_discountOnProduct = Number(product.discount);

        if (hasDiscount > 0) {
            if (this.hasGlobalDiscountInReturn()) {
                var percentOnPerProduct = this.getPercentageOfCartTotal(cartProducts, hasDiscount);
                discounted_data = this.getPercentOf(product, percentOnPerProduct);

            } else {
                discounted_data = this.getPercentOf(product, applied_discountOnProduct);
                discounted_data.discount_label = (discounted_data.discountAmount > 0) ? discounted_data.discount_label : "";
            }
        } else if (hasDiscount === 0) {
            discounted_data = this.getPercentOf(product, applied_discountOnProduct);
            discounted_data.discount_label = (discounted_data.discountAmount > 0) ? discounted_data.discount_label : "";
        }
        //console.log(discounted_data);
        return discounted_data;
    },
    getSimpleDiscount: function (product, rule) {
        var data = {};

        //Discount Calculation
        var product_price = this.getPrice(product);

        var discounted_price = product_price;
        var discountAmount = 0;
        var percentage_off_discount = 0;
        var discount_label = '';

        //returing values
        data.discounted_price = discounted_price;
        data.discountAmount = discountAmount;
        data.percentage_off_discount = percentage_off_discount
        data.discount_label = discount_label

        if (rule.percentoff && rule.percentoff > 0) {
            data = this.getPercentOf(product, Number(rule.percentoff));
            data.rule_id = rule.rule_id
        }
        if (rule.flatoff && rule.flatoff > 0) {
            data = this.getFlatOf(product, Number(rule.flatoff));
            data.rule_id = rule.rule_id
        }
        return data;
    },
    buyXGetY: function (product, rule, cartProducts) {
        var data = {};
        var product_price = this.getPrice(product);

        var discounted_price = product_price;
        var discountAmount = 0;
        var percentage_off_discount = 0;
        var discount_label = '';

        //default returing values
        data.discounted_price = discounted_price;
        data.discountAmount = discountAmount;
        data.percentage_off_discount = percentage_off_discount
        data.discount_label = discount_label

        //Getting Total Cart Value and Qty
        var totalCartValue = this.getRuleAppliedCartTotal(cartProducts, rule);
        var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

        if (this.isRuleApplicableOnlyOnProduct(rule) && this.isRuleApplicableOnThisProduct(product, rule)) {
            var productqty = Number(product.qty)
            var finalprice = this.isApplyingDiscountAfterTax() ? Number(product.finalprice) : Number(product.price)
            totalCartQty = productqty;
            totalCartValue = Number(productqty) * Number(finalprice);
            cartProducts = [product];
        }

        if (Number(rule.qty_buy) && Number(rule.qty_get)) {
            let totalOfferQty = parseFloat(rule.qty_get) + parseFloat(rule.qty_buy);

            if (totalCartQty >= totalOfferQty) {
                var noOfFreeCount = (totalCartQty - (totalCartQty % totalOfferQty)) / totalOfferQty;

                let lowestprices = this.getItemsToShort(cartProducts, rule).sort((a, b) => a.price - b.price).slice(0, noOfFreeCount);
                let freeProductIds = [];
                var dis_array = [];
                let disAppliedCount = noOfFreeCount;

                //filtering product qty based discount on product
                lowestprices.forEach(lowest_price => {
                    var pro = {};
                    var percent_off = 0;
                    var actualAmt = lowest_price.price * lowest_price.qty;

                    if (disAppliedCount === 0) return;
                    if (lowest_price.qty >= disAppliedCount) {
                        percent_off = lowest_price.price / actualAmt * 100 * disAppliedCount
                        pro.dis_percentoff = percent_off
                        pro.qty = disAppliedCount
                        pro.id = lowest_price.id
                        freeProductIds.push(lowest_price.id);
                        dis_array.push(pro);
                        disAppliedCount = 0
                    } else {
                        percent_off = lowest_price.price / actualAmt * 100
                        pro.qty = lowest_price.qty
                        pro.dis_percentoff = percent_off
                        pro.id = lowest_price.id
                        freeProductIds.push(lowest_price.id);
                        dis_array.push(pro);
                        if (lowest_price.qty > 1) {
                            disAppliedCount = disAppliedCount - lowest_price.qty;
                        } else {
                            disAppliedCount--;
                        }
                    }
                })
                //here BOGO discount calculating on all product
                var freeProTotal = this.getFreeProductTotal(cartProducts, dis_array)
                var percentage_off_total = (freeProTotal / totalCartValue) * 100;
                data = this.getPercentOf(product, Number(percentage_off_total));
                data.rule_id = rule.rule_id

                var freeProdTax = this.getFreeProductTaxAmt(freeProductIds)
                if (freeProdTax) {
                    data.freeProductIds = freeProductIds
                    data.freeProdTax = freeProdTax
                }

                /***** here BOGO discount calculating on applied product *******/
                // if (freeProductIds.length > 0 && freeProductIds.includes(Number(product.id))) {
                //     var current_dis_data = {};
                //     dis_array.forEach(data => {
                //         if (Number(product.id) === data.id) {
                //             current_dis_data = data;
                //         }
                //     })
                //     var percentoff = ((product_price * current_dis_data.qty) / (product_price * product.qty)) * 100;
                //     data = this.getPercentOf(product, Number(percentoff));
                // }
            }
        }
        return data;
    },
    buyXGetDiscount: function (product, rule, cartProducts) {
        var data = {};

        var product_price = this.getPrice(product);

        var discounted_price = product_price;
        var discountAmount = 0;
        var percentage_off_discount = 0;
        var discount_label = '';

        //default returing values
        data.discounted_price = discounted_price;
        data.discountAmount = discountAmount;
        data.percentage_off_discount = percentage_off_discount
        data.discount_label = discount_label


        //Getting Total Cart Value
        //var totalCartValue          = this.getRuleAppliedCartTotal(cartProducts,rule);
        var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

        if (rule.qty_range) {
            var qty_ranges = rule.qty_range.split(';');
            //console.log(totalCartQty);

            qty_ranges.forEach((qty_range, index) => {
                let percent_off_range = rule.percent_off_range.split(';');
                var flat_off_range = rule.flat_off_range.split(';');
                var qtyRange = qty_range.split('-');
                var qtyStartRange = qtyRange[0];
                var qtyEndRange = qtyRange[1];

                if (totalCartQty >= Number(qtyStartRange) && totalCartQty <= Number(qtyEndRange) && percent_off_range[index] && Number(percent_off_range[index]) !== 0) {

                    data = this.getPercentOf(product, Number(percent_off_range[index]));
                    data.rule_id = rule.rule_id
                }

                if (totalCartQty >= Number(qtyStartRange) && totalCartQty <= Number(qtyEndRange) && flat_off_range[index] && Number(flat_off_range[index]) !== 0) {
                    var discountPerProduct = Number(flat_off_range[index])
                    var percentOnPerProduct = this.getPercentageOfCartTotal(cartProducts, discountPerProduct);
                    data = this.getPercentOf(product, percentOnPerProduct);
                    data.rule_id = rule.rule_id
                }
            })
        } else if (rule.qty_buy && Number(totalCartQty) >= Number(rule.qty_buy)) {

            //console.log(totalCartQty);

            if (rule.percentoff) {

                data = this.getPercentOf(product, Number(rule.percentoff));
                data.rule_id = rule.rule_id
            } else if (rule.flatoff) {
                var discountPerProduct = Number(rule.flatoff)
                var percentOnPerProduct = this.getPercentageOfCartTotal(cartProducts, discountPerProduct);
                data = this.getPercentOf(product, percentOnPerProduct);
                data.rule_id = rule.rule_id
            }

        }

        return data;
    },
    spentXGetDiscount: function (product, rule, cartProducts) {
        var data = {};
        var product_price = this.getPrice(product);

        var discounted_price = product_price;
        var discountAmount = 0;
        var percentage_off_discount = 0;
        var discount_label = '';

        //default returing values
        data.discounted_price = discounted_price;
        data.discountAmount = discountAmount;
        data.percentage_off_discount = percentage_off_discount
        data.discount_label = discount_label

        //Getting Total Cart Value
        var totalCartValue = this.getRuleAppliedCartTotal(cartProducts, rule);
        //var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

        if (rule.amt_range) {

            var amt_ranges = rule.amt_range.split(';');

            amt_ranges.forEach((amt_range, index) => {
                var percent_off_range = rule.percent_off_range.split(';');
                var flat_off_range = rule.flat_off_range.split(';');
                var amountRange = amt_range.split('-');
                var startRange = amountRange[0];
                var endRange = amountRange[1];

                if (totalCartValue >= Number(startRange) && totalCartValue <= Number(endRange) && percent_off_range[index] && percent_off_range[index] !== 0) {


                    data = this.getPercentOf(product, Number(percent_off_range[index]));
                    data.rule_id = rule.rule_id
                }
                if (totalCartValue >= Number(startRange) && totalCartValue <= Number(endRange) && flat_off_range[index] && flat_off_range[index] !== 0) {

                    var discountPerProduct = Number(flat_off_range[index])
                    var percentOnPerProduct = this.getPercentageOfCartTotal(cartProducts, discountPerProduct);
                    data = this.getPercentOf(product, Number(percentOnPerProduct));
                    data.rule_id = rule.rule_id
                }
            })
        } else if (rule.amt_spend && Number(totalCartValue) >= Number(rule.amt_spend)) {
            if (rule.percentoff) {
                data = this.getPercentOf(product, Number(rule.percentoff));
                data.rule_id = rule.rule_id
            } else if (rule.flatoff) {
                var discountPerProduct = Number(rule.flatoff)
                var percentOnPerProduct = this.getPercentageOfCartTotal(cartProducts, discountPerProduct);
                data = this.getPercentOf(product, percentOnPerProduct);
                data.rule_id = rule.rule_id
            }
        }

        return data;
    },
    getFormData: function () {
        //getting store data 
        var state = store.getState();
        var cartProducts = state.cartProduct;
        var returnData = state.returnData;
        var editData = state.editData;
        var checkoutData = state.checkoutData.data;
        var customerData = state.customerData;

        var formData = {};
        //adding Cart Items in form
        formData.cart = [];
        formData.applyDisWithoutTax = 0

        //arranging cart items data for checkout
        cartProducts.forEach((product, index) => {
            var discountedData = this.getRulesAppliedData(product);
            const cartProduct = { ...product };
            delete cartProduct.rules;
            formData.cart[index] = cartProduct
            formData.cart[index].quantity = product.qty
            formData.cart[index].rule_applied = (discountedData.rule_id) ? discountedData.rule_id : ""
            formData.cart[index].disType = ''
            formData.cart[index].discount = Number(discountedData.percentage_off_discount).toFixed(4)
            if (this.isGiftVoucherApplicable()) {
                formData.cart[index].discount = 0
            }
            formData.cart[index].applyDisWithoutTax = 0 // this parameter is for apply discount after tax
            //check for discount after tax if redeeming gift value or aftertax enabled 
            if (this.isApplyingDiscountAfterTax() || customerData.isChecked) {
                formData.cart[index].applyDisWithoutTax = 1
                formData.applyDisWithoutTax = 1
            }
        })

        //Arranging payments data 
        formData.payments = {};
        //console.log(checkoutData);
        if (!this.isEmpty(checkoutData)) {
            formData.payments.subtotal = checkoutData.subtotal

            if (this.isGiftVoucherApplicable()) {
                formData.payments.discount = 0
            } else {
                formData.payments.discount = checkoutData.discount
            }

            formData.payments.totaltax = checkoutData.totaltax
            formData.payments.payment_amount = checkoutData.payment_amount;
            formData.payments.payment_type = checkoutData.payment_type
            if (checkoutData.payment_type === 'CARD') {
                formData.payments.transactionid = checkoutData.card_no
            }

            if (checkoutData.credit_amt) {
                formData.payments.credit_amt = checkoutData.credit_amt
                formData.payments.paid_amt = checkoutData.paid_amt
            }
        }

        //Other Payments
        formData.other_payments = {};
        if (checkoutData.payment_type === 'OTHER') {
            var otherPayment = state.checkoutData.otherPayment
            if (otherPayment.cash) { formData.other_payments.CASH = otherPayment.cash }
            if (otherPayment.card) { formData.other_payments.CARD = otherPayment.card }
            if (otherPayment.other) {
                var otherPaymentType = otherPayment.otherType
                formData.other_payments[otherPaymentType] = otherPayment.other
                //card Number
                formData.payments.transactionid = otherPayment.cardNo
            }
        }

        if (!this.isEmpty(returnData)) {
            formData.returnOrder = 1
            formData.sale_id = ""
            if (returnData.sale_id) {
                formData.sale_id = returnData.sale_id
            }
            if (returnData.barcode_return) {
                formData.barcode_return = returnData.barcode_return
            }
            if (Number(checkoutData.payment_amount) < 0) {
                formData.payments.payment_amount = 0
            }
        }
        if (!this.isEmpty(editData)) {
            formData.sale_id = editData.sale_id
        }



        formData.user = Helper.getUserId();
        formData.status = 0
        formData.apply_as_coupon_disc = 0
        if (this.isGiftVoucherApplicable()) {
            formData.apply_as_coupon_disc = checkoutData.discount
        }
        if (this.isOnlyCouponCodeApplied()) {
            var summary = this.getBillSummary();
            formData.apply_as_coupon_disc = summary.defaultDiscountAmount

            var discount = state.discount;
            formData.coupon_code = discount.coupon
        }

        formData.is_redeemd = false;
        formData.couponBal = 0;
        formData.couponRedeemedAmt = 0;
        //check if redeeming gift value
        var custRecord = (customerData.custrecord.data) ? customerData.custrecord.data : ""
        if (customerData.isChecked) {
            var redeemamount = customerData.redeemamount;
            formData.is_redeemd = customerData.isChecked;

            //Gift voucher applying here;
            var giftval = this.getCouponBalance(customerData)
            if (giftval && redeemamount) {
                var couponBal = giftval;
                if (giftval >= redeemamount) {
                    couponBal = giftval - redeemamount;
                }
                formData.couponBal = couponBal;
                formData.couponRedeemedAmt = redeemamount;
            }

            //Redeem Amount converting to point;
            if (custRecord && custRecord.reward_points && custRecord.reward_point_equal) {
                var usedRewardPoint = Number(redeemamount) / Number(custRecord.reward_point_equal);
                formData.points_used = usedRewardPoint
                formData.points_left = Number(custRecord.reward_points) - usedRewardPoint;
            }
        }
        //Reward package id gettting from customer record
        if (custRecord) {
            if (custRecord.package_id) {
                formData.reward_pkg_id = custRecord.package_id
            }
        }
        //Reward package id gettting from New Package Mapping Box data
        if (customerData.rewardPkgId) {
            formData.reward_pkg_id = customerData.rewardPkgId;
        }
        if (customerData.memberNo) {
            formData.membership_no = customerData.memberNo;
        }

        formData.salescounter = Helper.getSalesCounter();
        formData.customer = ""
        formData.cphone = ""

        var customer = state.checkoutData.customer
        if (!this.isEmpty(customer)) {
            formData.create_customer = true
            formData.cname = customer.customer_name
            formData.cphone = customer.phone_number
            formData.sales_person = ""
            if (customer.salesExec) {
                formData.sales_person = customer.salesExec
            }
        }
        formData.location = Helper.getLocationId();

        //console.log(formData);

        return formData;
    },
    getFreeProductTaxAmt: function (pids) {
        var taxAmount = 0
        if (pids && pids.length > 0 && this.isApplyingDiscountAfterTax()) {
            pids.forEach(pid => {
                var product = this.getProductFormCart(pid.toString());
                if (product) {
                    var price = this.getPrice(product)
                    taxAmount += this.getTaxAmount(price, product);
                }
            });
        }
        return taxAmount;
    },
    getProductFormCart: function (pid) {
        var product = null;
        if (pid) {
            var cartProduct = store.getState().cartProduct
            cartProduct.forEach(item => {
                if (item.id === pid) {
                    product = { ...item };
                }
            })
        }
        return product;
    },
    getCouponBalance: function (customerData) {
        //console.log(customerData);
        var total = 0;
        if (customerData && customerData.custrecord && customerData.custrecord.data) {
            var item = customerData.custrecord.data
            total = Number(item.giftvalue);
        }
        return Number(total)
    },
    getTotalShopping: function (customerData) {
        //console.log(customerData);
        var total = "";
        if (customerData && customerData.custrecord && customerData.custrecord.data) {
            var item = customerData.custrecord.data
            total = item.total;
        }
        return total
    },
    recheckLowestPriceForBogo: function (cartProducts) {
        var lowestPrice = 0;
        var allProductPrice = [];
        cartProducts.forEach((product) => {
            allProductPrice.push(this.getPrice(product));
        })
        lowestPrice = Math.min(...allProductPrice);
        //console.log(lowestPrice);
        return lowestPrice;
    },
    getItemsToShort: function (cartProducts, rule) {
        var allProduct = [];
        var rulesAppliedCartProduct = [];
        cartProducts.forEach((product) => {
            if (this.isRulesApplied(product, rule)) {
                rulesAppliedCartProduct.push(product);
            }
        })
        rulesAppliedCartProduct.forEach((product) => {
            var item = {};
            item.price = Number(product.finalprice);
            item.id = Number(product.id);
            item.qty = Number(product.qty);
            allProduct.push(item);
        })
        //console.log(allProduct);
        return allProduct;
    },
    getFreeProductTotal: function (cartProducts, freeProductIds) {
        var total = 0
        cartProducts.forEach(cartProduct => {
            freeProductIds.forEach((pro) => {
                if (Number(cartProduct.id) === pro.id) {
                    var product_price = 0
                    if (this.isApplyingDiscountAfterTax()) {
                        product_price = this.getFinalPrice(cartProduct);
                    } else {
                        product_price = this.getPrice(cartProduct);
                    }
                    total += product_price * pro.qty
                }
            })
        })
        return total
    },
    getRuleAppliedCartTotal: function (cartProducts, rule) {
        var totalCartValue = 0;
        cartProducts.forEach(product => {
            if (this.isRulesApplied(product, rule)) {
                var productqty = Number(product.qty)
                var finalprice = this.isApplyingDiscountAfterTax() ? Number(product.finalprice) : Number(product.price)
                totalCartValue += Number(productqty) * Number(finalprice);
            }
        })
        if (this.isAppliedCouponDiscount()) {
            totalCartValue = totalCartValue - this.getManualDiscountedValue()
        }


        return Number(totalCartValue);
    },
    getRuleAppliedCartQty: function (cartProducts, rule) {
        var totalCartQty = 0;
        cartProducts.forEach(product => {
            if (this.isRulesApplied(product, rule)) {
                var qty = Number(product.qty)
                totalCartQty += qty;
            }
        })
        return Number(totalCartQty);
    },
    getPercentOf: function (product, percentoff) {
        var data = {}
        var product_price = this.getPrice(product);
        var product_finalprice = this.getFinalPrice(product);

        var percentage_off_discount = percentoff;
        var discountAmount = (product_price / 100) * percentage_off_discount;
        var discounted_price = product_price - discountAmount;

        if (this.isApplyingDiscountAfterTax()) {
            discountAmount = (product_finalprice / 100) * percentage_off_discount;
            discounted_price = product_price;
        }
        var discount_label = Number(percentage_off_discount).toFixed(2) + '%';

        data.discounted_price = discounted_price;
        data.discountAmount = discountAmount;
        data.percentage_off_discount = percentage_off_discount
        data.discount_label = discount_label

        return data
    },
    getFlatOf: function (product, flatoff) {
        //console.log(totalCartValue);
        var data = {}
        var product_price = this.getPrice(product);
        var product_finalprice = this.getFinalPrice(product);

        var percentage_off_discount = (flatoff / product_price) * 100;
        var discountAmount = (product_price / 100) * percentage_off_discount;
        var discounted_price = product_price - discountAmount;

        if (this.isApplyingDiscountAfterTax()) {
            percentage_off_discount = (flatoff / product_finalprice) * 100;
            discountAmount = (product_finalprice / 100) * percentage_off_discount;
            discounted_price = product_price;
        }


        var discount_label = Number(percentage_off_discount).toFixed(2) + '%';

        data.discounted_price = discounted_price;
        data.discountAmount = discountAmount;
        data.percentage_off_discount = percentage_off_discount
        data.discount_label = discount_label

        return data
    },
    getProductFromId: function (id) {
        var allProduct = store.getState().productData.products.data;
        var findProduct = '';

        allProduct.forEach(product => {
            if (product.id === id) {
                findProduct = { ...product };
                return true;
            }
        })
        return findProduct;
    },

    getCalculationOfDenoms: function (denom) {
        var TotalCalc = 0
        if (denom && !this.isEmpty(denom)) {
            denom.forEach(data => {
                TotalCalc += data.denom * data.count
            })
        }
        return TotalCalc;
    },
    getOfflineInvoiceNo: function () {
        var invPrefix = Helper.getInvPrefix();
        var today = new Date();
        var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
        var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
        var dateTime = date + '' + time;
        return invPrefix + "" + dateTime
    },
    getOfflineOrderDate: function () {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        return dateTime
    },
    getOfflineResponseDate: function () {
        var today = new Date();
        var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        return dateTime
    },
    getOfflineBillingData: function (formData) {
        var rules = this.getCurrentAppliedRule("");
        var billingData = {}
        billingData.success = true
        billingData.data = formData.cart
        billingData.rules = rules
        billingData.sales_data = {
            applyDisWithoutTax: formData.applyDisWithoutTax.toString(),
            dis_type: null,
            discount: formData.payments.discount,
            nettotal: formData.payments.payment_amount,
            subtotal: formData.payments.subtotal,
            tax: formData.payments.totaltax,
        }
        billingData.customer = {
            amount: formData.payments.payment_amount,
            order_date: this.getOfflineOrderDate(),
            person_id: '',
            phone_number: formData.cphone
        }
        return billingData;
    },
    getOfflineResponseData: function (formData) {
        var responseData = {}
        responseData.date = this.getOfflineResponseDate()
        responseData.invoice_num = formData.off_ref_no
        responseData.sale_id = formData.off_ref_no
        responseData.success = true
        return responseData
    },
    getProductUpdatedPrice: function (product, price) {
        var selectedProduct = { ...product }
        const selectedPrice = {
            cost_price: price.costprice,
            price: price.pricebftx,
            mrp: price.mrp,
            finalprice: price.mrp,
            actualMrp: price.actualMrp
        }
        selectedProduct = {
            ...selectedProduct,
            ...selectedPrice
        }
        return selectedProduct
    },
    getPriceFromPrices: function (product) {
        var finalprice = product.finalprice
        if (product.prices && product.prices.length > 0) {
            var price = product.prices[0];
            finalprice = price.mrp
        }
        return this.getCurrencyFormatted(finalprice);
    },
    getQTHFromStock: function (product) {
        var qth = (product.pre_qty) ? product.pre_qty : 0;
        var quantity = 0;
        if (product.stock) {
            product.stock.forEach((stock) => {
                quantity += Number(stock.quantity);
            })
            if (quantity) {
                qth = quantity
            }
        }
        return Number(qth).toFixed(2);
    },
    getDetailPriceFromNewPrice: function (tax, newPrice) {
        var data = {};
        var TaxPercent = Number(tax)
        var NewPriceNum = Number(newPrice)
        var taxAmount = NewPriceNum - (NewPriceNum * (100 / (100 + TaxPercent)));
        var taxAmountFixed = Number(taxAmount).toFixed(3);
        var taxAmountNum = Number(taxAmountFixed);
        // data.taxAmount = taxAmountNum;
        data.price = NewPriceNum - taxAmountNum
        data.finalprice = NewPriceNum
        data.mrp = NewPriceNum
        return data
    },
    getCartItems: function () {
        return store.getState().cartProduct
    },
    getCreditData: function () {
        return store.getState().credit
    },
    getItemDisAmt: function (item) {
        let mrp = item.actualMrp;
        let price = (this.isApplyingDiscountAfterTax()) ? item.finalprice : item.price;
        let discount = item.discount;
        let discountAmt = Number(discount) * Number(price) / 100
        let discOnAllQty = discountAmt * Number(item.qty)
        let diff = Number(mrp) - Number(price)
        let totalDisc = discOnAllQty + diff
        return this.getCurrencyFormatted(totalDisc.toFixed(2));
    },
    getItemPrice: function (item) {
        let price = (this.isApplyingDiscountAfterTax()) ? item.finalprice : item.price;
        let discount = item.discount;
        let discountAmt = Number(discount) * Number(price) / 100
        let finalPrice = price - discountAmt
        let totalFPrice = finalPrice * Number(item.qty)
        return this.getCurrencyFormatted(totalFPrice.toFixed(2));
    },
    getProductWithRules: function (cproduct) {
        const product = { ...cproduct };
        var state = store.getState();
        const rules = (state.productData.products.rules && state.productData.products.rules.length > 0) ? state.productData.products.rules : []
        product.rules = []
        rules.forEach((rule) => {
            if (this.isRulesApplied(product, rule)) {
                product.rules.push(rule);
            }
        })
        return product;
    },
    isRuleApplicableOnlyOnProduct: function (rule) {
        var applied_on_product = false;
        if (rule.apply_rule_on === "product") {
            applied_on_product = true;
        }
        return applied_on_product;
    },
    isRuleApplicableOnThisProduct: function (product, rule) {
        var applied_on_this_product = false;
        if (rule.apply_rule_on === "product") {
            if (rule.items.length === 0 && rule.category_ids.length === 0) {
                return applied_on_this_product = true;
            }
            if (rule.items.length > 0) {
                rule.items.forEach(itemId => {
                    if (Number(itemId) === Number(product.id)) {
                        return applied_on_this_product = true;
                    }
                })
            }
            if (rule.category_ids.length > 0) {
                rule.category_ids.forEach(catId => {
                    if (Number(catId) === Number(product.category_id)) {
                        return applied_on_this_product = true;
                    }
                })
            }
        }
        return applied_on_this_product;
    }
}

export default helpers;