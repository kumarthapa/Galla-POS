import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button, Switch } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadReturningProducts, clearReturningProducts, saveReturingInvoiceNo, enableReturnProcess, saveReturingData, startRuleCalculation, switchCompleteReturn } from '../../../redux/action/returnAction';
import { restoreCartProduct, clearCart } from '../../../redux/action/cartAction';
import CartHelper from '../../../Helper/cartHelper';
import StoreHelper from '../../../Helper/storeHelper';
import { loading, alert } from '../../../redux/action/InterAction';
import { pageTitle } from '../../../redux/action/themeAction';

class ReturnPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            invoice: '',
            checked: false,
            complete: false
        }
        this.textInput = React.createRef();
    }
    componentDidMount() {
        this.props.clearReturningProducts();
    }

    handleInvoice = event => {
        this.setState({
            invoice: event.target.value
        })
    }

    submitInvoice = event => {
        event.preventDefault();
        var form = {
            orderno: this.state.invoice
        }
        this.props.loading(true);
        this.props.loadReturningProducts(form)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    res.startRule = false
                    this.props.saveReturingData(res);
                    if (this.state.complete) {
                        this.props.history.push(`${process.env.PUBLIC_URL}/complete-return`);
                    }
                    this.props.loading(false);
                } else {
                    this.props.loading(false);
                    this.props.alert(true, res.message);
                    this.props.clearReturningProducts();
                    this.props.toggle();
                }
            }, err => {
                this.props.loading(false);
                this.props.clearReturningProducts();
                this.props.toggle();
            })

    }

    switchbarcode = () => {
        this.setState({ checked: !this.state.checked, invoice: "_UNKNOWN" });
        var form = {
            customer: {},
            data: [],
            invoice: '',
            rules: {},
            sale_id: '',
            sales_data: { applyDisWithoutTax: "0", dis_type: null, discount: "0", nettotal: "0", subtotal: "0 ", tax: "0" },
            success: true,
            barcode_return: true
        }

        this.props.enableReturnProcess(form);
    }

    handleComplete = () => {
        this.setState({
            complete: !this.state.complete
        })
    }

    componentDidUpdate() {
        this.textInput.current.focus();
        var returnData = this.props.returnData;

        if (!CartHelper.isEmpty(returnData)) {
            if (returnData.success) {
                this.props.clearCart();
                this.props.pageTitle('Return Sale');
                this.props.saveReturingInvoiceNo(this.state.invoice);
                returnData.data.forEach(product => {
                    this.props.restoreCartProduct(product);
                })
                this.props.startRuleCalculation(false);
                this.props.switchCompleteReturn(this.state.complete);
                this.props.loading(false);
                this.props.toggle();
            } else {
                this.props.loading(false);
                this.props.alert(true, returnData.message);
                this.props.clearReturningProducts();
                this.props.toggle();
            }
        }
    }

    render() {
        const { invoice, complete } = this.state;

        return (
            <React.Fragment>
                <Dialog open={this.props.return} scroll={'body'} className={'dialog'} onClose={this.props.toggle}>
                    <DialogActions>
                        <Avatar onClick={this.props.toggle} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent className={'display-in-center'}>
                        <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h5" className="bold-i">Return Invoice</Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h6">Enter or Scan invoice number </Typography>
                            </Grid>

                            <Grid item xs={12} className={'align-center'}>
                                <Box >
                                    <Switch value={complete} onChange={this.handleComplete} />
                                    <span>Complete Return</span>
                                </Box>
                            </Grid>

                            <Grid item xs={12} className={'align-center'}>
                                <Box>
                                    <form onSubmit={this.submitInvoice} className="display-flex justify-center">
                                        <input type="text" name={'orderid'} className={'input orderid'} placeholder={'Invoice number'} value={invoice} onChange={this.handleInvoice} ref={this.textInput} />
                                        <Button variant="contained" color="secondary" type="submit">Load</Button>
                                    </form>
                                </Box>
                            </Grid>

                            {StoreHelper.isBarcodeReturn() === 1 ?
                                <Box pb={3}>
                                    <Switch value={this.state.checked} onChange={this.switchbarcode} />
                                    <span>Return by barcode scan</span>
                                </Box>
                                : null}

                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}


ReturnPopup.propTypes = {
    loadReturningProducts: PropTypes.func.isRequired,
    clearReturningProducts: PropTypes.func.isRequired,
    restoreCartProduct: PropTypes.func.isRequired,
    enableReturnProcess: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    pageTitle: PropTypes.func.isRequired,
    saveReturingInvoiceNo: PropTypes.func.isRequired,
    saveReturingData: PropTypes.func.isRequired,
    startRuleCalculation: PropTypes.func.isRequired,
    switchCompleteReturn: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    returnData: state.returnData
});
export default connect(mapStateToProps, {
    loadReturningProducts,
    clearReturningProducts,
    restoreCartProduct,
    clearCart,
    enableReturnProcess,
    loading,
    alert,
    pageTitle,
    saveReturingInvoiceNo,
    saveReturingData,
    startRuleCalculation,
    switchCompleteReturn
})(withRouter(ReturnPopup))
