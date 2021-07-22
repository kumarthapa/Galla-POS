import React, { Component } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, FormControl, TextField, Typography } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
// import CartHelper from '../../../Helper/cartHelper';
import AddToCartHelper from '../../../Helper/actionHelper/addToCartHelper';
import { openQtyPopup, clearQtyData } from '../../../redux/action/productConfigAction';
import { AddToCartWithQty } from '../../../redux/action/cartAction';

class QtyPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            qty: ""
        }
    }
    componentDidMount() {

    }


    handleChange = (e) => {
        this.setState({
            qty: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        //this.props.close();
        const { productConfig } = this.props
        var product = { ...productConfig.qtyProduct }

        if (this.state.qty) {
            product.pre_qty = product.qty;
            product.qty = Number(this.state.qty);
            this.addToCartProductWithQty(product);
        }
    }

    closeQtyPopup = () => {
        this.props.openQtyPopup(false);
    }

    addToCartProductWithQty = (product) => {
        AddToCartHelper.addToCartProductWithQty(product);
        this.closeQtyPopup();
        this.props.clearQtyData();
    }


    render() {
        const { productConfig } = this.props
        return (
            <React.Fragment>
                <Dialog open={productConfig.qtyPopup} scroll={'body'} className={'dialog'} onClose={this.closeQtyPopup}>
                    <DialogActions>
                        <Avatar onClick={this.closeQtyPopup} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Grid item xs={12} container direction="row" justify="center" alignItems="center">
                                <Typography variant="h6" component="span">{'Please enter quantity.'}</Typography>
                            </Grid>
                            <Grid item xs={12} container direction="row" justify="center" alignItems="center">
                                <form autoComplete="off" onSubmit={this.onSubmit}>
                                    <FormControl component="fieldset">
                                        <TextField
                                            id="qty-input"
                                            label="Enter Quantity"
                                            variant="outlined"
                                            value={this.state.qty}
                                            onChange={this.handleChange}
                                            autoFocus
                                        />
                                    </FormControl>
                                    <button type="submit" className="hidden"></button>
                                </form>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}


QtyPopup.propTypes = {
    openQtyPopup: PropTypes.func.isRequired,
    clearQtyData: PropTypes.func.isRequired,
    AddToCartWithQty: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    productConfig: state.productConfig,
    cartProduct: state.cartProduct
});

const mapActionsToProps = {
    openQtyPopup,
    clearQtyData,
    AddToCartWithQty
};


export default connect(mapStateToProps, mapActionsToProps)(QtyPopup);