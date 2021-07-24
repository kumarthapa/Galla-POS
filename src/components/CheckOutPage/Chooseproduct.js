import React, { Component } from 'react';
import { Card, CardMedia, Grid, Typography, Box, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from "@material-ui/core/styles";
import { AddToCart, updateQty, decreaseQty, removeCartItem, changeQty, updateCartPrice } from '../../redux/action/cartAction';
//import { clearReturningProducts } from '../../redux/action/returnAction';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
// import Price from '../CheckOutPage/CartItems/Price';
import EditablePrice from '../CheckOutPage/CartItems/EditablePrice';
//import ItemDiscount from '../CheckOutPage/discountCoupon/itemDiscount';
import CartHelper from '../../Helper/cartHelper';
import StoreHelper from '../../Helper/storeHelper';
import { clearAppliedDiscount } from '../../redux/action/discountAction'
import { clear_customer_data } from '../../redux/action/customerAction';
import { startRuleCalculation } from '../../redux/action/returnAction';


const Styles = theme => ({
    Chooseitem: {
        position: 'relative',
        border: '1px solid #e0e0e0',
        padding: 5,
        marginTop: -1,

    }, chooseimg: {
        width: '100%',
        backgroundSize: 'contain',
        height: '100%',
    }, qtybox: {
        float: 'left',
        width: 100,
        height: 25,
        fontSize: 14,
        textAlign: 'center',
        background: '#f3b7b7',
        border: '2px solid #888',
        position: 'relative',
    }, taxbox: {
        background: '#f3b7b7',
        border: '1px solid #888',
        padding: '0 7px',
    }, buttonminus: {
        float: 'left',
        height: 25,
        background: '#fff',
        width: 25,
        boxShadow: 'none',
        border: '2px solid #6f6b6b',
        marginRight: 5,
        fontWeight: 'bold',
        fontSize: 18,
        boxSizing: 'border-box',
    }, buttonplus: {
        float: 'left',
        height: 25,
        background: '#fff',
        width: 25,
        boxShadow: 'none',
        border: '2px solid #6f6b6b',
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 18,
        boxSizing: 'border-box',
    }, nametax: {
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 5,
        color: '#7b7b7b',
    }, productname: {
        color: '#5d5c5c',
    },
    removeItem: {
        padding: '0',
        width: 30,
        minWidth: 'auto',
        float: 'right',
        borderRadius: '50%',
        height: 30,
    }
});

class ChooseProduct extends Component {

    componentDidMount() {
        this.props.clear_customer_data()
    }

    updateQty = (product, event) => {

        if (event === 'plus') {
            this.props.updateQty(product);

        } else {
            this.props.decreaseQty(product);
        }
        this.props.clearAppliedDiscount()
        this.props.clear_customer_data()
    }
    removeItem = (index, product) => {
        this.props.removeCartItem(index, product);
        this.props.clearAppliedDiscount()
        this.props.clear_customer_data()
    }
    handleQty = (product, event) => {
        product.qty = event.target.value
        this.props.changeQty(product)
        this.props.clearAppliedDiscount()
        this.props.clear_customer_data()
    }

    updatePrice = (product) => {
        this.props.updateCartPrice(product);
    }

    componentDidUpdate() {
        const { returnData } = this.props;
        if (!CartHelper.isEmpty(returnData)) {
            var isChanged = CartHelper.isReturingCartChanged();
            //CartHelper.hasGlobalDiscountInReturn();
            if (isChanged && !CartHelper.isEmpty(returnData.rules) && !returnData.startRule) {
                this.props.startRuleCalculation(true);
            }
        }
        
    }

    render() {
        const { classes, returnData, editData } = this.props;

        return (
            <>
                <>
                    {!CartHelper.isEmpty(returnData) && returnData.success ?
                        <Typography variant='subtitle1' component='span' className={'exchanging-label'}>Exchanging Invoice #{returnData.invoice}</Typography>
                        : null}
                    {!CartHelper.isEmpty(editData) && editData.success ?
                        <Typography variant='subtitle1' component='span' className={'exchanging-label'}>Editing Invoice #{editData.invoice}</Typography>
                        : null}
                </>

                {this.props.cartProduct.map((product, index) => (
                    <Card className={classes.Chooseitem} key={index}>
                        <Grid container direction="row">
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                {product.item_image ?
                                    <CardMedia
                                        className={classes.chooseimg}
                                        image={product.item_image}
                                    />

                                    :
                                    <CardMedia
                                        className={classes.chooseimg}
                                        // image={`${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`}
                                        image={product.image}
                                    />

                                }

                            </Grid>
                            <Grid item lg={10} md={10} sm={10} xs={10} pl={1}>
                                <Grid container direction="row">
                                    <Grid item xs={11}>
                                        <Box pl={2}>
                                            <Typography variant="subtitle2" component="strong" className={classes.productname}>
                                                {product.name}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Button className={classes.removeItem} onClick={() => this.removeItem(index, product)}>
                                            <DeleteIcon />
                                        </Button>
                                    </Grid>

                                </Grid>
                                <Grid container direction="row">
                                    <Grid item lg={8} md={8} sm={8} xs={9} container alignItems="center">
                                        <Box pl={2}>
                                            <input type="button" value={'-'} className={classes.buttonminus} data-field="quantity" onClick={() => this.updateQty(product, 'minus')} />
                                            <input type="number" value={Number(product.qty)} name="quantity" className={classes.qtybox} onChange={(e) => this.handleQty(product, e)} step="any" />
                                            <input type="button" value={'+'} className={classes.buttonplus} data-field="quantity" onClick={() => this.updateQty(product, 'plus')} />
                                        </Box>
                                        {StoreHelper.isStockValidationCheckEnabled() && CartHelper.isNewSale() && CartHelper.getQTHFromStock(product) !== "0.00" ?
                                            <Box pl={2}>
                                                {CartHelper.getQTHFromStock(product) > 0 ?
                                                    <Typography variant="caption" component="span" color="secondary">
                                                        QTH:{CartHelper.getQTHFromStock(product)}
                                                    </Typography>
                                                    :
                                                    <Typography variant="caption" component="span">
                                                        QTH:{CartHelper.getQTHFromStock(product)}
                                                    </Typography>
                                                }
                                            </Box>
                                            : null}
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={4} xs={3}>
                                        <Box>
                                            <Typography variant="subtitle1" component="span" className={classes.nametax}>
                                                Tax
                                            </Typography>
                                            <Typography variant="subtitle1" component="span" className={classes.taxbox} >
                                                {Math.round(product.tax) + '%'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* <Price product={product} /> */}
                                <EditablePrice product={product} updatePrice={this.updatePrice} />
                                {/* <ItemDiscount product={product} /> */}
                            </Grid>
                        </Grid>

                    </Card>
                ))}
            </>
        )
    }
}


ChooseProduct.propTypes = {
    AddToCart: PropTypes.func.isRequired,
    updateQty: PropTypes.func.isRequired,
    changeQty: PropTypes.func.isRequired,
    decreaseQty: PropTypes.func.isRequired,
    removeCartItem: PropTypes.func.isRequired,
    clearAppliedDiscount: PropTypes.func.isRequired,
    clear_customer_data: PropTypes.func.isRequired,
    startRuleCalculation: PropTypes.func.isRequired,
    updateCartPrice: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    returnData: state.returnData,
    editData: state.editData,
    discount: state.discount,
});

const mapActionsToProps = {
    AddToCart,
    updateQty,
    changeQty,
    decreaseQty,
    removeCartItem,
    updateCartPrice,
    clearAppliedDiscount,
    clear_customer_data,
    startRuleCalculation
};
export default connect(mapStateToProps, mapActionsToProps)(withStyles(Styles)(ChooseProduct));