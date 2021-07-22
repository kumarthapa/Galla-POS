import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import CheckoutButton from '../CheckOutPage/CheckoutPage';
import { withStyles } from "@material-ui/core/styles";
import Chooseproduct from '../CheckOutPage/Chooseproduct';
import SearchByBarcode from '../Search/searchByBarcode';
import CartHelper from '../../Helper/cartHelper';
import { connect } from "react-redux";

const Styles = theme => ({
  root: {
    flexGrow: 1,
  },
  fixCheckout: {
    position: 'fixed',
    bottom: 0,
    width: '33.33333%',
    right: 0
  },
  selectedproduct: {
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: 1,
  }
});


class SelectedProduct extends Component {

  render() {

    var stylescroll = {
      overflowY: 'scroll',
      height: 'calc(100vh - 264px)',
      margin: 0,
      padding: 0,
      width: 'auto',
      justifyContent: 'space-around'
    }
    if (CartHelper.isRulesAppliedAsCoupon()) {
      stylescroll.height = "calc(100vh - 313px)"
    }


    const { classes } = this.props;
    return (
      <>
        <Box mt={1} mb={2} className="position-relative" >
          <SearchByBarcode />
        </Box>
        <Box style={stylescroll}>
          <Box className={classes.selectedproduct}>
            <Chooseproduct />
          </Box>
          <Box className={classes.fixCheckout}>
            <CheckoutButton />
          </Box>
        </Box>
      </>
    )
  }

}
const mapStateToProps = state => ({
  cartProduct: state.cartProduct,
  customerData: state.customerData,
  checkoutData: state.checkoutData,
  discount: state.discount
});

export default connect(mapStateToProps, null)(withStyles(Styles)(SelectedProduct));