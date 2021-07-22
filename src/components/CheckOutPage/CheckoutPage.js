import React, { Component } from 'react';
import { Card, Box, Grid, Avatar, Button, Fab, Tooltip } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { HighlightOff, Reply, Loyalty, PanTool, Description } from "@material-ui/icons";
import { connect } from "react-redux";
import SummaryPopup from './Summary/SummaryPopup';
// import Billsummery from './Summary/BillSummery';
// import PaymentBill from './Summary//PaymentBill';
import Success from '../CheckOutPage/Success/Success';
import SuspendCartBlock from '../../pages/sales-record/suspendedCart'
import ReturnPopup from '../CheckOutPage/Return/ReturnPopup';
import EditPopup from '../CheckOutPage/Edit/EditPopup';
import cartHelper from '../../Helper/cartHelper';
import { prepareCheckout, clearCart, suspendCart, clearCustomer, clearBilling } from '../../redux/action/cartAction';
import { clearReturningProducts } from '../../redux/action/returnAction';
import { clearEditProducts } from '../../redux/action/editAction';
import { pageTitle, returnIsActive, editIsActive } from '../../redux/action/themeAction';
import PropTypes from 'prop-types';
import DiscountCoupon from '../CheckOutPage/discountCoupon/discountCoupon';
import { clearAppliedDiscount, openDiscountBox } from '../../redux/action/discountAction';
import SalesPersonPopup from './Summary/SalesPersonPopup';
import TotalSummary from './Summary/TotalSummary'
import ApplyAsCoupon from './discountCoupon/applyAsCoupon'
import { clear_customer_data } from '../../redux/action/customerAction';

const Styles = theme => ({

  boxcardfix: {
    minHeight: 135,
    width: '100%',
    padding: 10,
    background: '#fff',
    margin: 0,
    borderRadius: 0,
    border: '1px solid #5a5858',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  secondivfix: {
  },
  checkoutbutton: {
    background: '#ff2e2e',
    border: '1px solid #ffffff',
    borderRadius: 5.5,
    opacity: 1,
    width: '100%',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  }, paymentoptiontext: {
    textAlign: "center",
    fontSize: 18,
    padding: 8,
    fontWeight: "bold",

  }, dialogcontent: {
    textAlign: "center",
    margin: '20px 0',
  },
  dialogbox: {
    background: "#f0f8ff",
  },
  dialog: {
    background: "#f0f8ff"
  },
  closeAvatar: {
    color: '#f50d0d',
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: "bolder",
    cursor: 'pointer',
    position: 'absolute',
    top: 5,
  }

});



class Checkoutpage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      successPopup: false,
      popup_type: '',
      opensuspended: false,
      openDiscountCoupon: false,
      openSalesPersonPopup: false
    }
  }

  handleClickOpen = (data) => {
    var checkoutData = {};
    var summary = cartHelper.getBillSummary();

    checkoutData.total_qty = cartHelper.getTotalQty();
    checkoutData.subtotal = summary.beforeDiscount;
    checkoutData.discount = summary.discountAmount;
    checkoutData.totaltax = summary.taxamount;

    if (!cartHelper.isEmpty(this.props.returnData)) {
      var currentTotal = Number(cartHelper.getTotalAmount());
      var paidTotal = Number(this.props.returnData.sales_data.nettotal);

      checkoutData.payment_amount = currentTotal - paidTotal;

    } else {
      checkoutData.payment_amount = cartHelper.getTotalAmount();
    }
    checkoutData.payment_type = 'CASH';
    checkoutData.card_no = '';

    //Customer Credit Amount
    checkoutData.paid_amt = Number(checkoutData.payment_amount);
    checkoutData.credit_amt = 0;

    this.props.prepareCheckout(checkoutData);


    if (cartHelper.isNewSale() && data !== 'info') {
      this.setState({ openSalesPersonPopup: true, popup_type: data });
    } else {
      this.setState({ open: true, popup_type: data });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  openSucessPopup = () => {
    this.setState({
      open: false,
      successPopup: true
    });
    // this.props.clearReturningProducts();
    // this.props.clearEditProducts();
    this.props.pageTitle('New Sale');
  }
  handleSuccess = () => {
    this.setState({
      successPopup: false
    })
    this.props.clearCart();
    this.props.clearCustomer();
    this.props.clear_customer_data();
    this.props.clearAppliedDiscount();
    this.props.clearReturningProducts();
    this.props.clearEditProducts();
    this.props.clearBilling();
  }
  clearCart = () => {
    this.props.clearCart();
    this.props.clearAppliedDiscount();
    this.props.clearReturningProducts();
    this.props.clearEditProducts();
  }
  suspendCart = () => {
    if (!cartHelper.isEmpty(this.props.cartProduct)) {
      this.props.suspendCart(this.props.cartProduct);
      this.props.clearCart();
    }
  }
  openSuspendCart = () => {
    this.setState({
      opensuspended: !this.state.opensuspended
    })
  }
  closeSuspendCart = () => {
    this.setState({
      opensuspended: false
    })
  }
  toggleReturnPopup = () => {
    this.props.returnIsActive(!this.props.theme.returnIsActive);
    this.props.clearEditProducts();
  }

  toggleEditPopup = () => {
    this.props.editIsActive(!this.props.theme.editIsActive);
    this.props.clearReturningProducts();
  }

  newSaleStart = () => {
    this.props.clearReturningProducts();
    this.props.clearEditProducts();
    this.props.clearCart();
    this.props.pageTitle('New Sale');
  }

  openDiscountCoupon = () => {
    this.props.openDiscountBox(!this.props.discount.open);
  }

  closeSalesPersonPopup = () => {
    this.setState({
      openSalesPersonPopup: false
    })
  }

  continueOnSalesPerson = () => {
    this.setState({
      openSalesPersonPopup: false,
      open: true
    })
  }

  render() {
    const { classes, cartProduct, returnData, editData, theme, discount, productData } = this.props;
    const { popup_type, opensuspended } = this.state;
    const isCartEmpty = cartHelper.isEmpty(cartProduct);
    return (
      <>
        <Box >
          <Card className={classes.boxcardfix}>

            <TotalSummary handleClickOpen={() => this.handleClickOpen('info')} />

            {productData && cartHelper.isRulesAppliedAsCoupon() ?
              <ApplyAsCoupon />
              : null}

            <Grid container direction="row" className={classes.secondivfix} justify="space-between">
              <Grid item lg={7} xs={8} container direction="row" className={classes.secondivfix} justify="flex-start">
                <Grid item xs={3}>
                  <Tooltip title="Clear Cart [Alt+C]" aria-label="Clear Cart">
                    <span>
                      <Fab className={'fab-button-on-checkout'} id="cart-clear-btn" onClick={() => this.clearCart()} disabled={isCartEmpty}>
                        <Avatar className={'checkout-icons'}>
                          <HighlightOff className={'close-icon'} />
                        </Avatar>
                      </Fab>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item xs={3}>
                  <Tooltip title="Double click to suspend cart [Ctrl+Shift+S]" aria-label="Suspend Cart">
                    <Fab className={'fab-button-on-checkout'} id="cart-suspend-btn" onDoubleClick={() => this.suspendCart()} onClick={this.openSuspendCart}>
                      <Avatar className={'checkout-icons'}>
                        <PanTool className={'hand-icon'} />
                      </Avatar>
                    </Fab>
                  </Tooltip>
                </Grid>
                <Grid item xs={3}>
                  {!cartHelper.isEmpty(returnData) && returnData.success !== undefined ?
                    <Tooltip title="New Sale [Alt+N]" aria-label="New Sale">
                      <Fab className={'fab-button-on-checkout'} id="new-sale-btn" onClick={this.newSaleStart}>
                        <Avatar className={'checkout-icons'}>
                          <Description className={'reply-icon'} />
                        </Avatar>
                      </Fab>
                    </Tooltip>
                    : null
                  }
                  {!cartHelper.isEmpty(editData) && editData.success !== undefined ?
                    <Tooltip title="New Sale [Alt+N]" aria-label="New Sale">
                      <Fab className={'fab-button-on-checkout'} id="new-sale-btn" onClick={this.newSaleStart}>
                        <Avatar className={'checkout-icons'}>
                          <Description className={'reply-icon'} />
                        </Avatar>
                      </Fab>
                    </Tooltip>
                    : null
                  }
                  {cartHelper.isEmpty(returnData) && cartHelper.isEmpty(editData) ?
                    <Tooltip title="Return item [Alt+R]" aria-label="Return item">
                      <Fab className={'fab-button-on-checkout'} id="return-start-btn" onClick={this.toggleReturnPopup}>
                        <Avatar className={'checkout-icons'}>
                          <Reply className={'reply-icon'} />
                        </Avatar>
                      </Fab>
                    </Tooltip>
                    : null
                  }
                </Grid>
                <Grid item xs={3}>
                  <Tooltip title="Discount Coupon [Alt+D]" aria-label="Discount Coupon">
                    <span>
                      <Fab className={'fab-button-on-checkout'} id="discount-btn" onClick={this.openDiscountCoupon} disabled={isCartEmpty}>
                        <Avatar className={'checkout-icons'}>
                          <Loyalty className={'loyalty-tag-icon'} />
                        </Avatar>
                      </Fab>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid item sm={4} md={4} xs={4}>
                <Button title="Checkout [Ctrl + Enter]" variant="contained" onClick={() => this.handleClickOpen('checkout')} className={classes.checkoutbutton} id="checkout-btn" disabled={isCartEmpty}>
                  CheckOut
                </Button>
              </Grid>
            </Grid>

          </Card>
        </Box>



        <Box className={classes.dialogbox}>
          {/*Sales Person popup */}
          {this.state.openSalesPersonPopup ? <SalesPersonPopup close={this.closeSalesPersonPopup} open={this.state.openSalesPersonPopup} continue={this.continueOnSalesPerson} /> : null}

          {/*summary popup */}
          {this.state.open ? <SummaryPopup handleClose={this.handleClose} open={this.state.open} popup_type={popup_type} openSucessPopup={this.openSucessPopup} />
            : null
          }
          {/*success popup */}
          {this.state.successPopup ? <Success success={this.state.successPopup} close={this.handleSuccess} /> : null}

          {/*SuspendCartBlock popup */}
          {opensuspended ? <SuspendCartBlock close={this.closeSuspendCart} open={this.openSuspendCart} /> : null}

          {/*return popup */}
          {theme.returnIsActive ? <ReturnPopup toggle={this.toggleReturnPopup} return={theme.returnIsActive} /> : null}

          {/*Edit popup */}
          {theme.editIsActive ? <EditPopup toggle={this.toggleEditPopup} openEdit={theme.editIsActive} /> : null}

          {discount.open ? <DiscountCoupon toggle={this.openDiscountCoupon} /> : null}
        </Box>
      </>
    )

  }
}

Checkoutpage.propTypes = {
  prepareCheckout: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  clearReturningProducts: PropTypes.func.isRequired,
  pageTitle: PropTypes.func.isRequired,
  returnIsActive: PropTypes.func.isRequired,
  editIsActive: PropTypes.func.isRequired,
  clearEditProducts: PropTypes.func.isRequired,
  clearAppliedDiscount: PropTypes.func.isRequired,
  openDiscountBox: PropTypes.func.isRequired,
  clearCustomer: PropTypes.func.isRequired,
  clear_customer_data: PropTypes.func.isRequired,
  clearBilling: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  cartProduct: state.cartProduct,
  productData: state.productData,
  returnData: state.returnData,
  editData: state.editData,
  theme: state.theme,
  discount: state.discount,
  customerData: state.customerData,
});

const mapActionsToProps = {
  prepareCheckout,
  clearCart,
  suspendCart,
  clearReturningProducts,
  pageTitle,
  returnIsActive,
  editIsActive,
  clearEditProducts,
  clearAppliedDiscount,
  openDiscountBox,
  clearCustomer,
  clear_customer_data,
  clearBilling
}
export default connect(mapStateToProps, mapActionsToProps)(withStyles(Styles)(Checkoutpage));