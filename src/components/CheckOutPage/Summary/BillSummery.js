import React, { Component } from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import CartHelper from '../../../Helper/cartHelper';
//import StoreHelper from '../../../Helper/storeHelper';
import ReturnLabels from '../Return/ReturnLabels'


const Styles = theme => ({
  Billname: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  Billsummarycontent: {
    textAlign: "center",
    boxSizing: 'border-box',
    maxWidth: 340,
    margin: '0 auto'
  },
  totalbill: {
    borderTop: '2px solid #717171',
    borderBottom: '2px solid #717171',
    padding: 2,

  },
  billsummarytext: {
    color: '#717171',
    fontSize: 14,
    lineHeight: 1.25,
  },
  billsummarytotal: {
    color: '#717171',
    fontSize: 16,
    fontWeight: 'bold',
  }

});
class BillSummary extends Component {

  render() {
    const { classes, returnData } = this.props;
    const summary = CartHelper.getBillSummary();
    var discountAmount = summary.discountAmount
    var totalAmount = CartHelper.getTotalAmount();
    // const redeemedAmount = Number(customerData.redeemamount).toFixed(2)
    // const redeemtotal = Number(customerData.redeemtotal).toFixed(2)
    // if(customerData.isChecked){
    //   totalAmount = Number(redeemtotal).toFixed(2)
    // }

    if (CartHelper.isGiftVoucherApplicable()) {
      discountAmount = Number(0).toFixed(2)
    }
    return (
      <Grid container direction="row" className={classes.Billsummarycontent}>
        <Grid item xs={12}>
          <Box >
            <Typography component="p" gutterBottom className={classes.Billname}>
              Bill Summary
                    </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box className={'align-left'} pl={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              SubTotal
                </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className={'align-right'} pr={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              {CartHelper.getCurrencyFormatted(summary.beforeDiscount)}
            </Typography>
          </Box>
        </Grid>
        {!CartHelper.isApplyingDiscountAfterTax() && Number(discountAmount) > 0 ?
          <>
            <Grid item xs={6}>
              <Box className={'align-left'} pl={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  Discount (-)
                  </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className={'align-right'} pr={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  {CartHelper.getCurrencyFormatted(discountAmount)}
                </Typography>
              </Box>
            </Grid>
          </>
          : null
        }

        <Grid item xs={6}>
          <Box className={'align-left'} pl={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              Tax (+)
              </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className={'align-right'} pr={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              {CartHelper.getCurrencyFormatted(summary.taxamount)}
            </Typography>
          </Box>
        </Grid>

        {CartHelper.isApplyingDiscountAfterTax() && Number(discountAmount) > 0 ?
          <>
            <Grid item xs={6}>
              <Box className={'align-left'} pl={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  Discount (-)
                  </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className={'align-right'} pr={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  {CartHelper.getCurrencyFormatted(discountAmount)}
                </Typography>
              </Box>
            </Grid>
          </>
          : null
        }

        <Grid item xs={6}>
          <Box className={'align-left'} pl={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              Round
                </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className={'align-right'} pr={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              {CartHelper.getCurrencyFormatted(summary.round)}
            </Typography>
          </Box>
        </Grid>


        {/* {customerData.isChecked?
                <>
                  <Grid item xs={6}>
                    <Box className={'align-left'} pl={3}>
                      <Typography component="p" gutterBottom className={classes.billsummarytext}>
                      Redeem amount (-)
                    </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={'align-right'} pr={3}>
                      <Typography component="p" gutterBottom className={classes.billsummarytext}>
                      { CartHelper.getCurrencyFormatted(redeemedAmount) }
                      </Typography>
                    </Box>
                  </Grid>
                </>
              :null
              } */}

        <Grid container direction="row" spacing={1} className={classes.totalbill}>
          <Grid item xs={6}>
            <Box className={'align-left'} pl={3}>
              <Typography component="p" gutterBottom className={classes.billsummarytotal}>
                Total
                     </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box className={'align-right'} pr={3}>
              <Typography component="p" gutterBottom className={classes.billsummarytotal}>
                {CartHelper.getCurrencyFormatted(totalAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {!CartHelper.isEmpty(returnData) ?
          <ReturnLabels />
          : null
        }
      </Grid>
    )

  }

}

const mapStateToProps = state => ({
  cartProduct: state.cartProduct,
  productData: state.productData,
  returnData: state.returnData,
  customerData: state.customerData,
});
export default connect(mapStateToProps, null)(withStyles(Styles)(BillSummary));