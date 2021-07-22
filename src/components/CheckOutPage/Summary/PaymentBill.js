import React, { Component } from 'react';
import { Button, Grid, Card } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import PaymentLabel from './Payments/PaymentLabel';
import Cashpayment from './Payments/Cashpayment';
import Walletpayment from './Payments/Walletpayment';
import Cardpayment from './Payments/Cardpayment';
import Otherpayment from './Payments/Otherpayment';
import Calculater from '../../Calculater/CalculaterIndex';
import { connect } from "react-redux";
import { updatePaymentMode, generateBill, generateDummyBill, updateGeneratedBill, updateEditedBill, loadBillingData, saveInvoiceInBilling, clearOtherPayment, loadDummyBillingData } from '../../../redux/action/cartAction';
import PropTypes from 'prop-types';
import CartHelper from '../../../Helper/cartHelper'
import StoreHelper from '../../../Helper/storeHelper'
import { saveOfflineOrder, saveOfflineBillingData, saveOfflineResponseData } from '../../../redux/action/offlineAction'
import CustomerCredit from './Payments/CustCredit';

const Styles = theme => ({

    button: {
        margin: theme.spacing(1),
        background: '#fff',
        textAlign: 'center',
        color: '#1f1d1d',
        fontWeight: 'bold',
        width: 'calc(100% - 10px)',
        height: 45,
    },
    active: {
        background: '#777',
        margin: theme.spacing(1),
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        width: 'calc(100% - 10px)',
        height: 45,
    },
    gb_button: {
        color: '#fff',
        width: 180,
        background: '#777',
        fontWeight: 'bold',
        fontSize: 18,
        height: 40,
        textTransform: 'none !important',
        boxSizing: 'border-box',
        // marginTop: 60
    },
    customecard: {
        minHeight: 250,
        maxWidth: 333,
        width: "100%",
        border: '1px solid #9e9e9e',
        left: 35,
        display: 'flex',
        margin: '0 auto'
    }
});

class PaymentBill extends Component {

    constructor(props) {
        super(props)

        this.state = {
            cashopen: false,
            cardopen: false,
            Otheropen: false,
            upiopen: false,
            walletopen: false,
            displayCalcBlock: false,
            displayCalc: false,
            disableGenerateBtn: false,
            creditBox: false
        }
    }

    resetAll = () => {
        this.setState({
            cashopen: false,
            cardopen: false,
            Otheropen: false,
            upiopen: false,
            walletopen: false,
            displayCalcBlock: false,
            displayCalc: false,
            disableGenerateBtn: false,
            creditBox: false
        })
    }

    opencash = () => {
        this.props.updatePaymentMode('CASH');
        this.props.clearOtherPayment();
        this.resetAll();
        this.setState({
            displayCalcBlock: true,
            displayCalc: true,
            cashopen: true
        })
    }
    opencard = () => {
        this.props.updatePaymentMode('CARD');
        this.props.clearOtherPayment();
        this.resetAll();
        this.setState({
            displayCalcBlock: true,
            cardopen: true
        })
    }

    openupi = () => {
        this.props.updatePaymentMode('UPI');
        this.props.clearOtherPayment();
        this.resetAll();
        this.setState({
            displayCalcBlock: true,
            upiopen: true
        })
    }

    openwallet = () => {
        this.props.updatePaymentMode('WALLET');
        this.props.clearOtherPayment();
        this.resetAll();
        this.setState({
            displayCalcBlock: true,
            walletopen: true
        })
    }

    openother = () => {
        this.props.updatePaymentMode('OTHER');
        this.props.clearOtherPayment();
        this.resetAll();
        this.setState({
            displayCalcBlock: true,
            Otheropen: true
        })
    }

    openCreditBox = () => {
        this.props.updatePaymentMode('CREDIT');
        this.props.clearOtherPayment();
        this.resetAll();
        this.setState({
            displayCalcBlock: true,
            creditBox: true
        })
    }

    generateBill = () => {
        this.setState({
            disableGenerateBtn: true
        })
        var formData = CartHelper.getFormData();
        if (StoreHelper.isOnline()) {
            if (CartHelper.isEmpty(this.props.returnData) && CartHelper.isEmpty(this.props.editData)) {
                const { checkoutData } = this.props
                if (checkoutData.dummyBill) {
                    this.props.generateDummyBill(formData);
                } else {
                    this.props.generateBill(formData);
                }
            } else if (!CartHelper.isEmpty(this.props.returnData)) {
                this.props.updateGeneratedBill(formData);
            } else if (!CartHelper.isEmpty(this.props.editData)) {
                this.props.updateEditedBill(formData);
            }
        } else {
            formData.off_ref_no = CartHelper.getOfflineInvoiceNo()
            this.props.saveOfflineOrder(formData);
            var offlineBillingData = CartHelper.getOfflineBillingData(formData)
            var offlineResponse = CartHelper.getOfflineResponseData(formData)
            this.props.saveOfflineBillingData(offlineBillingData)
            this.props.saveOfflineResponseData(offlineResponse)
        }
        //this.props.openSucessPopup();
    }

    isDisableGenerateBtn = () => {
        var isDisble = false
        const { checkoutData } = this.props
        const { Otheropen, disableGenerateBtn } = this.state
        if (disableGenerateBtn) {
            isDisble = true
            return isDisble;
        }
        var net_amount = Number(checkoutData.data.payment_amount)
        var cash = checkoutData.otherPayment.cash
        var card = checkoutData.otherPayment.card
        var other = checkoutData.otherPayment.other

        var OtherPaymentTotal = Number(cash) + Number(card) + Number(other)

        if (Otheropen && net_amount !== OtherPaymentTotal) {
            isDisble = true
        }
        return isDisble;
    }


    componentDidUpdate() {
        //this.props.openSucessPopup();
        const { checkoutData } = this.props
        var isSuccess = checkoutData.responseData.success;
        if (isSuccess !== undefined && isSuccess) {
            var invoice_num = checkoutData.responseData.invoice_num;
            var form = {
                orderno: invoice_num
            }
            if (StoreHelper.isOnline()) {
                if (checkoutData.dummyBill) {
                    this.props.loadDummyBillingData(form)
                } else {
                    this.props.loadBillingData(form);
                }
            }
            this.props.saveInvoiceInBilling(invoice_num);
            this.props.openSucessPopup();
        }
    }

    render() {
        const { classes } = this.props;
        const { displayCalcBlock, displayCalc, cashopen, cardopen, upiopen, walletopen, Otheropen, creditBox } = this.state;


        return (
            <React.Fragment>
                <Grid container direction="row">
                    {StoreHelper.isCashAllowed() === 1 ?
                        <Grid item xs>
                            <Button variant="contained" className={cashopen ? classes.active : classes.button} onClick={this.opencash.bind(this)}>
                                CASH
                            </Button>
                        </Grid>
                        : null}
                    {StoreHelper.isCardAllowed() === 1 ?
                        <Grid item xs>
                            <Button variant="contained" className={cardopen ? classes.active : classes.button} onClick={this.opencard}>
                                CARD
                            </Button>
                        </Grid>
                        : null}
                    {StoreHelper.isUPIAllowed() === 1 ?
                        <Grid item xs>
                            <Button variant="contained" className={upiopen ? classes.active : classes.button} onClick={this.openupi}>
                                UPI
                            </Button>
                        </Grid>
                        : null}
                    {StoreHelper.isWalletAllowed() === 1 ?
                        <Grid item xs>
                            <Button variant="contained" className={walletopen ? classes.active : classes.button} onClick={this.openwallet}>
                                WALLET
                            </Button>
                        </Grid>
                        : null}
                    {StoreHelper.isOTHERAllowed() === 1 ?
                        <Grid item xs>
                            <Button variant="contained" className={Otheropen ? classes.active : classes.button} onClick={this.openother}>
                                OTHER
                            </Button>
                        </Grid>
                        : null}
                    {StoreHelper.isCreditAllowed() === 1 ?
                        <Grid item xs>
                            <Button variant="contained" className={creditBox ? classes.active : classes.button} onClick={this.openCreditBox}>
                                CREDIT
                            </Button>
                        </Grid>
                        : null}
                </Grid>
                {displayCalcBlock ?
                    <Grid container direction="row" className={'mt-20'} justify="center" alignItems="center" spacing={2}>
                        <Grid item xs>
                            <Card className={classes.customecard}>
                                <Grid container direction="row" alignItems="center" justify="center">
                                    <Grid item xs={12}>
                                        <PaymentLabel />
                                    </Grid>
                                    {cashopen || upiopen ?
                                        <Grid item xs={12}>
                                            <Cashpayment />
                                        </Grid>
                                        : null}
                                    {cardopen ?
                                        <Cardpayment />
                                        : null}
                                    {walletopen ?
                                        <Grid item xs={12}>
                                            <Walletpayment />
                                        </Grid>
                                        : null
                                    }
                                    {Otheropen ?
                                        <Otherpayment />
                                        : null
                                    }
                                    {creditBox ?
                                        <Grid item xs={12}>
                                            <CustomerCredit />
                                        </Grid>
                                        : null
                                    }
                                    <Grid item xs={12}>
                                        <Button variant="contained" className={classes.gb_button} onClick={this.generateBill} disabled={this.isDisableGenerateBtn()}>
                                            Generate Bill
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        {displayCalc ?
                            <Grid item xs>
                                <Calculater />
                            </Grid>
                            : null
                        }
                    </Grid>
                    :
                    null
                }
            </React.Fragment>

        )
    }

}
PaymentBill.propTypes = {
    updatePaymentMode: PropTypes.func.isRequired,
    generateBill: PropTypes.func.isRequired,
    updateGeneratedBill: PropTypes.func.isRequired,
    updateEditedBill: PropTypes.func.isRequired,
    loadBillingData: PropTypes.func.isRequired,
    saveInvoiceInBilling: PropTypes.func.isRequired,
    saveOfflineOrder: PropTypes.func.isRequired,
    saveOfflineBillingData: PropTypes.func.isRequired,
    saveOfflineResponseData: PropTypes.func.isRequired,
    clearOtherPayment: PropTypes.func.isRequired,
    generateDummyBill: PropTypes.func.isRequired,
    loadDummyBillingData: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    checkoutData: state.checkoutData,
    returnData: state.returnData,
    editData: state.editData
});
export default connect(mapStateToProps,
    {
        updatePaymentMode,
        generateBill,
        updateGeneratedBill,
        updateEditedBill,
        loadBillingData,
        saveInvoiceInBilling,
        saveOfflineOrder,
        saveOfflineBillingData,
        saveOfflineResponseData,
        clearOtherPayment,
        generateDummyBill,
        loadDummyBillingData
    })(withStyles(Styles)(PaymentBill));