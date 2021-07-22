import React, { Component } from 'react'
//import ReactDOM from 'react-dom'
import { Box, Grid, Typography, Paper, Card, CardContent, TextField, Switch, Button } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { isDiscountCouponApplied, applyCoupon, applyPercentoff, applyFlatoff, clearAppliedDiscount, fetchCoupon } from '../../../redux/action/discountAction';
import CartHelper from '../../../Helper/cartHelper';
import { loading, alert } from '../../../redux/action/InterAction'
import StoreHelper from '../../../Helper/storeHelper';


class discountCoupon extends Component {
    constructor(props) {
        super(props)

        this.state = {
            discountSwitch: false,
            disableCoupon: false,
            disableDiscount: false
        }
    }
    componentDidMount() {
        const { apply, flatoff } = this.props.discount;
        if (apply && flatoff !== '') {
            this.setState({
                discountSwitch: true
            })
        }
    }

    handleDiscountSwitch = () => {
        const { apply } = this.props.discount;

        this.setState({
            discountSwitch: !this.state.discountSwitch
        })
        if (!apply) {
            this.props.clearAppliedDiscount();
        }
    }
    handleCoupon = event => {
        this.props.isDiscountCouponApplied(false);
        this.props.applyCoupon(event.target.value);
        if (event.target.value) {
            this.setState({
                disableDiscount: true
            })
        } else {
            this.setState({
                disableDiscount: false
            })
            this.props.clearAppliedDiscount();
        }
    }
    handleFlatoff = event => {
        this.props.isDiscountCouponApplied(false);

        if (Number(event.target.value) > 0 && Number(event.target.value) <= CartHelper.getTotalAmountWithoutRule()) {
            this.props.applyFlatoff(event.target.value);
        }
        if (event.target.value) {
            this.setState({
                disableCoupon: true
            })
        } else {
            this.setState({
                disableCoupon: false
            })
            this.props.clearAppliedDiscount();
        }
    }
    handlePercentof = event => {
        this.props.isDiscountCouponApplied(false);
        if (Number(event.target.value) > 0 && Number(event.target.value) <= 100) {
            this.props.applyPercentoff(event.target.value);
        }
        if (event.target.value) {
            this.setState({
                disableCoupon: true
            })
        } else {
            this.setState({
                disableCoupon: false
            })
            this.props.clearAppliedDiscount();
        }
    }

    handleDiscountForm = event => {
        event.preventDefault();
        const { discountSwitch } = this.state;
        const { coupon, flatoff, percentoff } = this.props.discount;

        if (coupon !== '' || flatoff !== '' || percentoff !== '') {
            if (coupon !== '') {
                this.props.applyPercentoff('');
                this.props.applyFlatoff('');
                var formData = {}
                formData.coupon = coupon
                this.props.fetchCoupon(formData);
                this.props.loading(true)
            }
            if (!discountSwitch && percentoff !== '') {
                this.props.applyFlatoff('');
            }

            if (discountSwitch && flatoff !== '') {
                this.props.applyPercentoff('');
            }

            this.props.isDiscountCouponApplied(true);
        }

    }
    clearAppliedDiscount = () => {
        this.props.clearAppliedDiscount();
        this.setState({
            disableCoupon: false,
            disableDiscount: false
        });
        this.props.toggle();
    }

    componentDidUpdate() {
        const { couponData } = this.props.discount;
        if (!CartHelper.isEmpty(couponData)) {
            if (couponData.success) {
                this.props.loading(false)
                if (couponData.data.type === 'fixed') {
                    this.props.alert(true, "Applied " + couponData.data.type + " discount " + CartHelper.getCurrencyFormatted(couponData.data.discount));
                }
                this.props.toggle();
            } else {
                this.props.loading(false)
                this.props.alert(true, couponData.msg)
                this.props.toggle();
            }
        }
    }


    render() {
        const { discountSwitch } = this.state
        const { apply, coupon, flatoff, percentoff } = this.props.discount
        return (
            <Box className={'discountCoupon-Box'} id={'discountCoupon-Box'} >
                <Paper>
                    <Box p={1}>
                        <form onSubmit={this.handleDiscountForm} className={'discountCoupon-form'}>
                            <Grid container direction="row" spacing={1} justify="center">
                                <Grid item xs container alignItems='center' justify="space-between">
                                    <Card className={'width-100'}>
                                        <CardContent>
                                            <Box>
                                                <Typography variant={'h6'} component="span" className={'color-lite'}>{'Coupon'}</Typography>
                                            </Box>
                                            <TextField
                                                id="discount-coupon"
                                                className={''}
                                                label="Coupon"
                                                value={coupon}
                                                onChange={this.handleCoupon}
                                                disabled={flatoff !== '' || percentoff !== '' ? true : false}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {StoreHelper.isGlobalDiscountEnabled() === 1 ?
                                    <Grid item lg={7} xs={12} container alignItems='center' justify="space-between">
                                        <Card className={'width-100'}>
                                            <CardContent>
                                                <Box>
                                                    <Grid container direction="row" justify="space-between">
                                                        <Box pr={1}>
                                                            <Typography variant={'h6'} component="span" className={'color-lite'}>{'Discount'}</Typography>
                                                        </Box>
                                                        <Typography variant={'body2'} component="span" className={'color-lite switch-button'}>
                                                            {'%'}
                                                            <Switch
                                                                checked={discountSwitch}
                                                                onChange={this.handleDiscountSwitch}
                                                                color="default"
                                                                size="small"
                                                                disabled={coupon !== '' ? true : false}
                                                            />
                                                            {'FLAT'}
                                                        </Typography>

                                                    </Grid>
                                                </Box>

                                                {discountSwitch ?
                                                    <TextField
                                                        id="flatoff"
                                                        type="number"
                                                        className={''}
                                                        label="Flat off"
                                                        value={flatoff}
                                                        onChange={this.handleFlatoff}
                                                        disabled={coupon !== '' ? true : false}
                                                        helperText={"Max discount will be " + CartHelper.getCurrencyFormatted(CartHelper.getTotalAmountWithoutRule())}
                                                    />
                                                    :
                                                    <TextField
                                                        id="percentoff"
                                                        type="number"
                                                        className={''}
                                                        label="% off"
                                                        value={percentoff}
                                                        onChange={this.handlePercentof}
                                                        disabled={coupon !== '' ? true : false}
                                                    />
                                                }
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    : null}
                                <Grid item xs={12} container justify="flex-end">
                                    {apply ?
                                        <Button type="button" variant="outlined" onClick={this.clearAppliedDiscount}>Clear</Button>
                                        :
                                        <Button type="submit" variant="outlined">Apply</Button>
                                    }
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            </Box>
        )
    }
}
discountCoupon.propTypes = {
    isDiscountCouponApplied: PropTypes.func.isRequired,
    applyCoupon: PropTypes.func.isRequired,
    applyPercentoff: PropTypes.func.isRequired,
    clearAppliedDiscount: PropTypes.func.isRequired,
    applyFlatoff: PropTypes.func.isRequired,
    fetchCoupon: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    suspendedCart: state.suspendedCart,
    cartProduct: state.cartProduct,
    discount: state.discount,
});

export default connect(mapStateToProps, { isDiscountCouponApplied, applyCoupon, applyPercentoff, applyFlatoff, clearAppliedDiscount, fetchCoupon, loading, alert })(discountCoupon)
