import React, { Component } from 'react'
import { Dialog, DialogActions, DialogContent, Grid, Avatar, Box, Typography } from '@material-ui/core';
import { HighlightOff } from '@material-ui/icons';
import Billsummery from './BillSummery';
import PaymentBill from './PaymentBill';
import CartHelper from '../../../Helper/cartHelper';
import Custrec from './customerrecord';
import RewardContainer from '../CreditPoints/RewardContainer';
import StoreHelper from '../../../Helper/storeHelper';

export class SummaryPopup extends Component {


  render() {
    const isRulesAppliedAsCoupon = CartHelper.isRulesAppliedAsCoupon();
    return (
      <Dialog onClose={this.props.handleClose} open={this.props.open} scroll={'body'} className={'dialog'}>
        <Grid>
          <DialogActions>
            <Avatar onClick={this.props.handleClose} className={'popup-close-button'}>
              <HighlightOff />
            </Avatar>
          </DialogActions>
        </Grid>
        <DialogContent>
          <Grid className={''}>
            <Billsummery />
          </Grid>
          {this.props.popup_type === 'checkout' ?
            <React.Fragment>
              {StoreHelper.isCustomerRewardEnable() ?
                <RewardContainer />
                : null
              }
              {isRulesAppliedAsCoupon ?
                <Grid >
                  <Custrec />
                </Grid>
                : null}
              <Grid>
                <Box pt={2}>
                  <Typography className={'payment-option-title'} gutterBottom>
                    Payment Options
                  </Typography>
                </Box>
              </Grid>
              <Grid className={'payment-content'}>
                <PaymentBill openSucessPopup={this.props.openSucessPopup} />
              </Grid>
            </React.Fragment>
            : <Box p={2}></Box>
          }
        </DialogContent>
      </Dialog>
    )
  }
}

export default SummaryPopup
