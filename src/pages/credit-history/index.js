import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Grid, List, ListItem, Divider, Typography, TextField, Button } from '@material-ui/core';
import 'date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Search } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadCreditPayments } from '../../redux/action/creditAction';
import CartHelper from '../../Helper/cartHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { loading, alert } from '../../redux/action/InterAction';

class index extends Component {

    constructor(props) {
        super(props)

        var today = new Date()
        var fromDate = new Date().setMonth(today.getMonth() - 1)

        this.state = {
            mobile: "",
            from: fromDate,
            to: today,
            creditRecord: {},
            mobileError: true
        }
    }

    componentDidMount() {
        this.props.pageTitle('Credit history');
        this.loadCreditPayments(1)
    }

    loadCreditPayments = (pageseq) => {
        const { mobile, from, to } = this.state
        var fromDate = new Date(from)
        var toDate = new Date(to)
        var form = {}
        form.phone = mobile
        form.from_date = this.formatDate(fromDate)
        form.to_date = this.formatDate(toDate)
        form.pageseq = pageseq
        if (mobile && mobile.length === 10) {
            this.props.loading(true)
            this.props.loadCreditPayments(form)
                .then(res => res.json())
                .then(res => {
                    this.props.loading(false)
                    if (res && res.success) {
                        this.setState({
                            creditRecord: res
                        })
                    }
                })
                .catch(err => {
                    this.props.loading(false)
                })
        }
    }

    formatDate = (params) => {
        if (params) {
            var dd = params.getDate();
            var mm = params.getMonth() + 1;
            var yyyy = params.getFullYear();
            return dd + '/' + mm + '/' + yyyy;
        }
        return ""
    }

    handleFrom = (e) => {
        this.setState({
            from: e
        })
    }

    handleTo = (e) => {
        this.setState({
            to: e
        })
    }

    handleMobile = (e) => {
        var mobNo = e.target.value
        this.setState({
            mobile: mobNo,
            mobileError: (mobNo.length === 10) ? false : true,
            creditRecord: {}
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { mobile, mobileError } = this.state
        if (mobile.length === 10 && !mobileError) {
            this.loadCreditPayments(1);
        }
    }

    getTransText = (trans) => {
        var text = ""
        let creditAmt = Number(trans.credit_amt)
        let debitAmt = Number(trans.debit_amt)
        if (creditAmt) {
            text = "Credit:" + CartHelper.getCurrencyFormatted(trans.credit_amt);
        } else {
            text = (debitAmt) ? "Paid:" + CartHelper.getCurrencyFormatted(trans.debit_amt) : ""
        }
        return text
    }


    render() {
        const { from, to, mobile, creditRecord, mobileError } = this.state
        return (
            <Box p={1} className="height-100-overflow">
                <form className=" height-100" onSubmit={this.onSubmit}>
                    <Box p={2} pl={0} pb={1}>
                        <Grid container direction="row">
                            <Grid item xs sm={10} md={8} lg={6}>
                                <Grid container direction="row" alignItems="flex-start" spacing={2}>
                                    <Grid item xs>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="flex-start">
                                                <KeyboardDatePicker
                                                    required
                                                    id="from-date-picker-dialog"
                                                    label="From"
                                                    format="dd/MM/yyyy"
                                                    value={from}
                                                    size="small"
                                                    inputVariant="outlined"
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={this.handleFrom}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item xs>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    required
                                                    id="to-date-picker-dialog"
                                                    label="To"
                                                    format="dd/MM/yyyy"
                                                    value={to}
                                                    size="small"
                                                    inputVariant="outlined"
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={this.handleTo}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item xs={5}>
                                        <Grid container direction="row" alignItems="flex-start">
                                            <Grid item xs>
                                                <TextField
                                                    required
                                                    label="Mobile"
                                                    variant="outlined"
                                                    value={mobile}
                                                    className="width-100"
                                                    size="small"
                                                    type="number"
                                                    onChange={this.handleMobile}
                                                    error={mobileError}
                                                />
                                                {mobileError ?
                                                    <Typography variant="caption">Enter valid mobile number</Typography>
                                                    :
                                                    <Typography variant="caption">&nbsp;</Typography>}
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    type="submit"
                                                    className="search-button"
                                                    variant="contained"
                                                    color="secondary"
                                                    size="large"
                                                >
                                                    <Search />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {!CartHelper.isEmpty(creditRecord) && creditRecord.success ?
                        <Paper className="width-100 clearfix" square={true}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box p={1}>
                                        <Grid container>
                                            <Grid item>
                                                <Typography variant="subtitle2" component="strong">
                                                    Records found:{!CartHelper.isEmpty(creditRecord) && creditRecord.recordscount ? creditRecord.recordscount : 0}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" component="strong"></Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Grid container direction="row" justify="center" spacing={1} className="align-center-important">
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Date</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Transaction Amount</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Balance</Typography>
                                            </Grid>
                                            <Grid item xs className="border-white">
                                                <Typography variant="body2" component="strong">Comment</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {creditRecord.data && creditRecord.data.length > 0 ?
                                        <List>
                                            {creditRecord.data.map((transaction, i) => (
                                                <React.Fragment key={i}>
                                                    {i !== 0 ? <Divider /> : null}
                                                    <ListItem className="user-select-auto" >
                                                        <Grid container direction="row" justify="center" spacing={1} className="align-center-important">
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{transaction.cdate}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{this.getTransText(transaction)}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{CartHelper.getCurrencyFormatted(transaction.closing_bal)}</Typography>
                                                            </Grid>
                                                            <Grid item xs className="border-black">
                                                                <Typography variant="caption" component="span">{transaction.comment}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                        : null
                                    }
                                </Grid>
                            </Grid>
                        </Paper>
                        : <Paper square={true}>
                            <Box pt={3} pb={3} className="height-100">
                                <Grid container direction="row" justify="center">
                                    <Typography variant="h6" component="span">Records not found</Typography>
                                </Grid>
                            </Box>
                        </Paper>
                    }
                </form>
            </Box>
        )
    }
}

index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    loadCreditPayments: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

});
export default connect(mapStateToProps, { pageTitle, loading, alert, loadCreditPayments })(withRouter(index))