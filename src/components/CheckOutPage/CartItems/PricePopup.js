import React, { Component } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { openPricePopup, saveSelectedPrice, clearMultiPriceData } from '../../../redux/action/productConfigAction';
import { AddToCart, updateQty } from '../../../redux/action/cartAction';
import CartHelper from '../../../Helper/cartHelper';
import AddToCartHelper from '../../../Helper/actionHelper/addToCartHelper';

class PricePopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedRowPrice: ""
        }
    }
    componentDidMount() {

    }


    handleChange = (e) => {
        this.setState({
            selectedRowPrice: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        //this.props.close();
    }

    closePricePopup = () => {
        this.props.openPricePopup(false);
    }

    selectedPrice = (price) => {
        this.props.saveSelectedPrice(price);
        const { productConfig } = this.props;
        var updatedProduct = CartHelper.getProductUpdatedPrice(productConfig.product, price);
        this.addThisProductToCart(updatedProduct);
    }

    addThisProductToCart = (updatedProduct) => {
        AddToCartHelper.validateQty(updatedProduct);
        this.closePricePopup();
        this.props.clearMultiPriceData();
    }


    render() {
        const { productConfig } = this.props
        return (
            <React.Fragment>
                <Dialog open={productConfig.pricePopup} scroll={'body'} className={'dialog'} onClose={this.closePricePopup}>
                    <DialogActions>
                        <Avatar onClick={this.closePricePopup} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent>
                        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={0}>
                            <form noValidate autoComplete="off" onSubmit={this.onSubmit}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Select Price</FormLabel>
                                    <RadioGroup aria-label="Prices" name="prices" onChange={(e) => this.handleChange(e)}>
                                        {productConfig.product.prices.map((price, index) => (
                                            <FormControlLabel key={index} value={price.mrp} control={<Radio color="secondary" onClick={() => this.selectedPrice(price)} />} label={CartHelper.getCurrencyFormatted(price.mrp)} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <button type="submit" className="hidden"></button>
                            </form>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}


PricePopup.propTypes = {
    openPricePopup: PropTypes.func.isRequired,
    saveSelectedPrice: PropTypes.func.isRequired,
    clearMultiPriceData: PropTypes.func.isRequired,
    AddToCart: PropTypes.func.isRequired,
    updateQty: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    productConfig: state.productConfig,
    cartProduct: state.cartProduct
});

const mapActionsToProps = {
    openPricePopup,
    saveSelectedPrice,
    clearMultiPriceData,
    AddToCart,
    updateQty
};


export default connect(mapStateToProps, mapActionsToProps)(PricePopup);