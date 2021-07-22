import React, { Component } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadCreditProducts, saveCreditData, clearCreditProducts, updateCreditInv } from '../../redux/action/creditAction';
import { restoreCartProduct, clearCart } from '../../redux/action/cartAction';
import { loading, alert } from '../../redux/action/InterAction';

class CreditPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            checked: false
        }
        this.textInput = React.createRef();
    }
    componentDidMount() {
        this.props.clearCreditProducts()
        this.props.updateCreditInv("");
    }

    handleInvoice = event => {
        this.props.updateCreditInv(event.target.value);
    }

    submitInvoice = event => {
        event.preventDefault();
        const { credit } = this.props
        var form = {
            orderno: credit.invoice
        }
        this.props.loading(true);
        this.props.loadCreditProducts(form)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    this.props.saveCreditData(res);
                    this.props.clearCart();
                    res.data.forEach(product => {
                        this.props.restoreCartProduct(product);
                    })
                    this.props.loading(false);
                    this.props.toggle();
                } else {
                    this.props.loading(false);
                    this.props.alert(true, res.message);
                    this.props.toggle();
                }
            }, err => {
                this.props.loading(false);
                this.props.toggle();
            })

    }

    componentDidUpdate() {
        this.textInput.current.focus();
    }

    render() {
        const { credit } = this.props
        return (
            <React.Fragment>
                <Dialog open={credit.popup} scroll={'body'} className={'dialog'} onClose={this.props.toggle}>
                    <DialogActions>
                        <Avatar onClick={this.props.toggle} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent className={'display-in-center'}>
                        <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                            <Grid item xs={12} className={'align-center color-green'}>
                                <Typography variant="h4" component="h4">Credit Note</Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center color-green'}>
                                <Typography variant="h5" component="h5">Enter or Scan invoice number </Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Box>
                                    <form onSubmit={this.submitInvoice} className="display-flex justify-center">
                                        <input type="text" name={'orderid'} className={'input orderid'} placeholder={'Invoice number'} value={credit.invoice} onChange={this.handleInvoice} ref={this.textInput} />
                                        <Button variant="contained" color="secondary" type="submit">Load</Button>
                                    </form>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}


CreditPopup.propTypes = {
    loadCreditProducts: PropTypes.func.isRequired,
    saveCreditData: PropTypes.func.isRequired,
    clearCreditProducts: PropTypes.func.isRequired,
    restoreCartProduct: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    updateCreditInv: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    credit: state.credit
});

const mapActionsToProps = {
    loadCreditProducts,
    saveCreditData,
    clearCreditProducts,
    restoreCartProduct,
    clearCart,
    loading,
    alert,
    updateCreditInv
};
export default connect(mapStateToProps, mapActionsToProps)(CreditPopup)
