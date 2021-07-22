import React, { Component } from 'react';
import { Box, Grid, TextField, Typography, MenuItem } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { updateOtherPaymentCash, updateOtherPaymentCard, updateOtherPaymentCardNo, updateOtherPaymentOther, updateOtherPaymentOtherType } from '../../../../redux/action/cartAction';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import StoreHelper from '../../../../Helper/storeHelper'

const Styles = theme => ({
    button: {
        margin: theme.spacing(1),
        background: '#c0d5ef',
        textAlign: 'center',
        color: '#1f1d1d',
        fontWeight: 'bold',
        width: 'calc(100% - 10px)',
        height: 45,
    },
    active: {
        background: '#ffff8e',
        margin: theme.spacing(1),
        textAlign: 'center',
        color: '#000',
        fontWeight: 'bold',
        width: 'calc(100% - 10px)',
        height: 45,
    },
    iconButton: {
        margin: theme.spacing(1),
        background: '#c0d5ef',
    },
    iconActive: {
        margin: theme.spacing(1),
        background: '#ffff8e',
    },
    input: {
        display: 'none',
    },
    gb_button: {
        color: '#f6f6f6',
        width: 180,
        background: '#9bbb59',
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
    },
    payingcash: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
    Returnamountcash: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7f7d7d',
    },
    payreturnamountcash: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6b6a6a',
    }
});


class OtherPayment extends Component {

    componentDidMount() {
        // const { checkoutData } = this.props
        // var net_amount = checkoutData.data.payment_amount
        //this.props.updateOtherPaymentOther(Number(net_amount));
    }

    updateOtherPaymentCash = (event) => {
        var diff = this.getDiffAmt("cash", event.target.value);

        if (diff >= 0) {
            this.props.updateOtherPaymentCash(event.target.value);
        }
    }

    updateOtherPaymentCard = (event) => {
        var diff = this.getDiffAmt("card", event.target.value);

        if (diff >= 0) {
            this.props.updateOtherPaymentCard(event.target.value);
        }
    }

    updateOtherPaymentOther = (event) => {
        var diff = this.getDiffAmt("other", event.target.value);

        if (diff >= 0) {
            this.props.updateOtherPaymentOther(event.target.value);
        }
    }

    getDiffAmt = (field, eventValue) => {
        const { checkoutData } = this.props
        var net_amount = Number(checkoutData.data.payment_amount)

        var cash = checkoutData.otherPayment.cash
        var card = checkoutData.otherPayment.card
        var other = checkoutData.otherPayment.other
        var OtherPaymentTotal = 0

        if (field === 'cash') {
            OtherPaymentTotal = Number(eventValue) + Number(card) + Number(other)
        }
        if (field === 'card') {
            OtherPaymentTotal = Number(cash) + Number(eventValue) + Number(other)
        }
        if (field === 'other') {
            OtherPaymentTotal = Number(cash) + Number(card) + Number(eventValue)
        }
        var diff = net_amount - OtherPaymentTotal;
        return diff
    }


    render() {
        const { checkoutData, updateOtherPaymentCardNo, updateOtherPaymentOtherType } = this.props;
        const otherPaymentOptions = StoreHelper.getOtherPaymentOptions()

        return (
            <>
                <Grid container item xs={12} alignItems="center" className="align-left">
                    <Grid item xs={3}>
                        <Box p={1}>
                            <Typography variant="subtitle2" component="span">CASH</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box pr={1} pl={1}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.cash}
                                onChange={(event) => this.updateOtherPaymentCash(event)}
                                placeholder="AMOUNT"
                                autoFocus
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                                className="width-100"
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={3}>
                        <Box p={1}>
                            <Typography variant="subtitle2" component="span">CARD</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box pr={1} pl={1}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.card}
                                onChange={(event) => this.updateOtherPaymentCard(event)}
                                placeholder="AMOUNT"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box pr={1} pl={0}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.cardNo}
                                onChange={(event) => updateOtherPaymentCardNo(event.target.value)}
                                placeholder="CARD NO"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={3}>
                        <Box p={1}>
                            <Typography variant="subtitle2" component="span">OTHER</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box pr={1} pl={1}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.other}
                                onChange={(event) => this.updateOtherPaymentOther(event)}
                                placeholder="AMOUNT"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        {/* <Avatar alt="Paytm" src={`${process.env.PUBLIC_URL}/assets/images/phone_pe_logo.png`} className={'phonepe padding-0'} /> */}
                        <Box pr={1} pl={0}>
                            <TextField
                                select
                                variant="outlined"
                                value={checkoutData.otherPayment.otherType}
                                onChange={(event) => updateOtherPaymentOtherType(event.target.value)}
                                placeholder="TYPE"
                                className="width-100"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            >
                                <MenuItem value={"OTHER"}>{"SELECT"}</MenuItem>
                                {otherPaymentOptions.map((options, index) => (
                                    <MenuItem value={options.toUpperCase()} key={index}>                    {options.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Grid>
                </Grid>
            </>
        )
    }

}

OtherPayment.propTypes = {
    updateOtherPaymentCash: PropTypes.func.isRequired,
    updateOtherPaymentCard: PropTypes.func.isRequired,
    updateOtherPaymentCardNo: PropTypes.func.isRequired,
    updateOtherPaymentOther: PropTypes.func.isRequired,
    updateOtherPaymentOtherType: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    checkoutData: state.checkoutData,
    returnData: state.returnData,
    editData: state.editData
});
export default connect(mapStateToProps,
    {
        updateOtherPaymentCash,
        updateOtherPaymentCard,
        updateOtherPaymentCardNo,
        updateOtherPaymentOther,
        updateOtherPaymentOtherType,
    })(withStyles(Styles)(OtherPayment));