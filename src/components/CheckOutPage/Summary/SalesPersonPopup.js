import React, { Component } from 'react'
import { Dialog, DialogActions, DialogContent, Grid, Avatar, Box, Typography, Button, TextField, FormControl, MenuItem, Switch } from '@material-ui/core';
import { HighlightOff } from '@material-ui/icons';

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { updateCPhone, updateCName, updateSalesExe, toogleDummyBill } from '../../../redux/action/cartAction';
import storeHelper from '../../../Helper/storeHelper';

export class SalesPersonPopup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      continue: false,
      isMobileRequired: false
    }
  }
  componentDidMount() {

    const { checkoutData } = this.props
    var phone_number = checkoutData.customer.phone_number

    if (storeHelper.isCustRequired()) {
      if (!isNaN(phone_number) && phone_number.length === 10) {
        this.setState({
          isMobileRequired: false
        })
      } else {
        this.setState({
          isMobileRequired: true
        })
      }
    }
  }

  changePhone = event => {
    this.props.updateCPhone(event.target.value);

    if (storeHelper.isCustRequired()) {
      if (!isNaN(event.target.value) && event.target.value.length === 10) {
        this.setState({
          isMobileRequired: false
        })
      } else {
        this.setState({
          isMobileRequired: true
        })
      }
    }
  }

  changeName = event => {
    this.props.updateCName(event.target.value);
  }

  handleContinue = () => {
    if (!this.state.isMobileRequired) {
      this.props.continue()
    }
  }

  handleSalesPerson = event => {
    this.props.updateSalesExe(event.target.value)
  }

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.isMobileRequired) {
      this.props.continue()
    }
    if (!storeHelper.isCustRequired()) {
      this.props.continue()
    }
  }

  onDummyChange = event => {
    const { checkoutData } = this.props
    this.props.toogleDummyBill(!checkoutData.dummyBill)
  }

  render() {
    const { checkoutData, storeData } = this.props
    const { isMobileRequired } = this.state

    return (
      <Dialog onClose={this.props.close} open={this.props.open} scroll={'body'} className={'dialog'}>
        <form onSubmit={this.handleSubmit} autoComplete="off">
          <Grid>
            <DialogActions>

              <Avatar onClick={this.props.close} className={'popup-close-button'}>
                <HighlightOff />
              </Avatar>
            </DialogActions>
          </Grid>

          <DialogContent>
            <Grid container direction="row" justify="space-between" >
              <Grid item>
                <Typography variant="h6" component="span">{'Customer Mobile No'}</Typography>
              </Grid>
              {storeHelper.isDummyBillAllowed() ?
                <Grid item>
                  <Switch
                    checked={checkoutData.dummyBill}
                    onChange={this.onDummyChange}
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  Offline
                </Grid>
                : null}
            </Grid>
            <Grid container justify="center" alignItems="stretch">
              <Grid item xs>
                <Box pr={1} pt={2}>
                  <TextField
                    error={isMobileRequired}
                    id="outlined-mobile"
                    label="Mobile"
                    value={checkoutData.customer.phone_number}
                    onChange={this.changePhone}
                    variant="outlined"
                    autoFocus
                    type="number"
                  />
                  {isMobileRequired ?
                    <Typography variant="caption" >Enter valid mobile number</Typography>
                    : null}
                </Box>
              </Grid>
              <Grid item xs>
                <Box pl={1} pt={2}>
                  <TextField
                    id="outlined-name"
                    label="Name"
                    value={checkoutData.customer.customer_name}
                    onChange={this.changeName}
                    variant="outlined" />
                </Box>
                <input type="submit" name="submit" value="continue" className="hidden" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container direction="row" justify="space-between" spacing={2}>
              <Grid item xs={7}>
                <Box p={2} pr={0}>
                  {storeData.data.salesexes ?
                    <FormControl variant="outlined" className={'select-sales-person width-100'}>
                      <TextField
                        select
                        label="Sales person"
                        value={checkoutData.customer.salesExec}
                        variant="outlined"
                        onChange={this.handleSalesPerson}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {storeData.data.salesexes.map(exec => (
                          <MenuItem value={exec.person_id} key={exec.person_id}>{exec.first_name + " " + exec.last_name}</MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                    : null}
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box p={2} pl={0}>
                  <Button variant="contained" onClick={this.handleContinue} className={'continue-button width-100'} >
                    Continue
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

SalesPersonPopup.propTypes = {
  updateCPhone: PropTypes.func.isRequired,
  updateCName: PropTypes.func.isRequired,
  updateSalesExe: PropTypes.func.isRequired,
  toogleDummyBill: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  checkoutData: state.checkoutData,
  storeData: state.storeData,
});
export default connect(mapStateToProps, { updateCPhone, updateCName, updateSalesExe, toogleDummyBill })((SalesPersonPopup))
