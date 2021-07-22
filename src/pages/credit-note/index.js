import React, { Component } from 'react'
import { Box, Paper, Grid, Button, Typography } from '@material-ui/core';
//import { ArrowForwardIos } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import CartHelper from '../../Helper/cartHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { loading, alert } from '../../redux/action/InterAction';
import { clearCart } from '../../redux/action/cartAction';
import { toggleCreditPopup, toggleCreditSuccessPopup, createCreditNote, saveCreditRes, clearCreditData } from '../../redux/action/creditAction';
import { sendStockRequest } from '../../redux/action/productsAction'
import Chooseproduct from '../../components/CheckOutPage/Chooseproduct';
import SearchByBarcode from '../../components/Search/searchByBarcode';
import CreditPopup from './creditPopup';
import CreditSuccessPopup from './creditSuccessPopup';

class index extends Component {
    componentDidMount() {
        this.props.pageTitle('Credit note');
        this.props.clearCart();
        this.props.clearCreditData();
        this.props.toggleCreditPopup(true);
    }

    handleSendRequest = () => {
        const { credit } = this.props
        var formData = {}
        formData.cart = this.props.cartProduct;
        formData.sale_id = credit.credData.sale_id
        formData.refinvno = credit.invoice
        formData.customer_id = credit.credData.customer.person_id
        this.props.loading(true);
        this.props.createCreditNote(formData)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    this.props.saveCreditRes(res);
                    this.props.loading(false);
                    this.props.toggleCreditSuccessPopup(true);
                } else {
                    this.props.loading(false);
                    this.props.alert(true, res.msg);
                }
            }, err => {
                this.props.loading(false);
            })
    }

    togglePopup = () => {
        const { credit } = this.props
        this.props.toggleCreditPopup(!credit.popup);
    }

    toggleSuccessPopup = () => {
        const { credit } = this.props
        this.props.toggleCreditSuccessPopup(!credit.success);
    }

    componentWillUnmount() {
        this.props.clearCreditData();
    }

    render() {
        const { clearCart, cartProduct, credit } = this.props
        //var summary = CartHelper.getBillSummary();
        var total = CartHelper.getTotalAmount();
        return (
            <>
                <Box className="container">
                    <Grid container direction="row" className="height-100">
                        <Grid item xs={12} md={6}>
                            <Box p={3} className="position-relative align-center">
                                <SearchByBarcode />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="height-100">
                            <Paper className="height-100" square={true}>
                                <Box p={3} className="height-100 overflow-auto request-product-max-height">
                                    <Chooseproduct />
                                </Box>
                                {!CartHelper.isEmpty(cartProduct) ?
                                    <Grid container direction="row" justify="flex-end" className="fixed-in-bottom width-100 z-index-99">
                                        <Grid item xs={6}>
                                            <Box p={1} pl={3} className="width-100 align-right background-white display-flex justify-space-between">
                                                <Typography variant="h6" component="p">Total: {CartHelper.getCurrencyFormatted(total)}</Typography>
                                            </Box>

                                            <Box boxShadow={1} p={2} pr={3} className="width-100 align-right background-white display-flex justify-space-between">
                                                <Button size="large" color="secondary" onClick={() => clearCart()}>
                                                    Clear All
                                                </Button>
                                                {/* <ReactToPrint
                                                    trigger={
                                                        () =>
                                                            <Button size="large" variant="contained" color="secondary" className="color-white">
                                                                Generate Credit Note
                                                            </Button>
                                                    }
                                                    content={() => this.componentRef}
                                                />
                                                <div style={{ display: "none" }}>
                                                    <PrintCreditNote ref={el => (this.componentRef = el)} />
                                                </div> */}

                                                <Button size="large" variant="contained" color="secondary" className="color-white" onClick={this.handleSendRequest}>
                                                    Generate Credit Note
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    :
                                    <Grid container direction="row" justify="flex-end" className="fixed-in-bottom width-100 z-index-99">
                                        <Grid item xs={6}>
                                            <Box className="width-100 align-right background-white" boxShadow={1} p={2} pr={3}>
                                                <Button size="large" variant="contained" color="secondary" className="color-white" onClick={this.togglePopup}>
                                                    Load Invoice
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
                {credit.popup ? <CreditPopup toggle={this.togglePopup} /> : null}
                {credit.success ? <CreditSuccessPopup toggle={this.toggleSuccessPopup} /> : null}
            </>
        )
    }
}

index.propTypes = {
    toggleCreditPopup: PropTypes.func.isRequired,
    toggleCreditSuccessPopup: PropTypes.func.isRequired,
    pageTitle: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    sendStockRequest: PropTypes.func.isRequired,
    createCreditNote: PropTypes.func.isRequired,
    saveCreditRes: PropTypes.func.isRequired,
    clearCreditData: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    salesRecord: state.salesRecord,
    cartProduct: state.cartProduct,
    interAction: state.interAction,
    credit: state.credit,
});

const mapActionsToProps = {
    pageTitle,
    clearCart,
    sendStockRequest,
    toggleCreditPopup,
    toggleCreditSuccessPopup,
    createCreditNote,
    saveCreditRes,
    clearCreditData,
    loading,
    alert
};

export default connect(mapStateToProps, mapActionsToProps)(index)