import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Grid, Typography, TextField, MenuItem } from '@material-ui/core';
//import { ArrowForwardIos } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadSalesRecord } from '../../redux/action/salesRecordAction';
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { DataGrid } from '@material-ui/data-grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class index extends Component {
    constructor(props) {
        super(props)

        var today = new Date()
        var fromDate = new Date()
        var lastSelectableDate = new Date().setDate(today.getDate() - 7);

        this.state = {
            from: fromDate,
            to: today,
            today: today,
            lastSelectableDate: lastSelectableDate,
            transaction_type: 'all',
            payment_types: []
        }
    }

    componentDidMount() {
        this.props.pageTitle('Sales Record');
        this.loadSalesRecord(this.state.transaction_type);
    }

    handleTransactionType = event => {
        this.setState({
            transaction_type: event.target.value
        })
        setTimeout(() => {
            this.loadSalesRecord();
        })
    }

    loadSalesRecord = () => {
        const { from, to, transaction_type } = this.state
        if (from && from.getDate() && to && to.getDate()) {
            var from_date = from.getDate() + '/' + (from.getMonth() + 1) + '/' + from.getFullYear();
            var to_date = to.getDate() + '/' + (to.getMonth() + 1) + '/' + to.getFullYear();
            var formData = {}
            formData.location = StoreHelper.getLocationId();
            formData.from_date = from_date;
            formData.to_date = to_date;
            formData.salestype = transaction_type;
            this.props.loadSalesRecord(formData);
        }
    }

    getPaymentType = () => {
        const { salesRecord } = this.props
        var payment_type = []
        if (salesRecord.success && !CartHelper.isEmpty(salesRecord.data)) {
            salesRecord.data.forEach(sales => {
                if (!payment_type.includes(sales.payment_type)) {
                    payment_type.push(sales.payment_type)
                }
            })
        }
        return payment_type
    }

    componentDidUpdate = () => {
        if (this.state.payment_types.length === 0) {
            var payment_types = this.getPaymentType()
            if (payment_types.length > 0) {
                this.setState({
                    payment_types: payment_types
                })
            }
        }
    }

    handleGetRowId = (e) => {
        return (e.invoice_no) ? e.invoice_no : Math.random();
    }

    formatAmt = (e) => {
        return StoreHelper.getCurrencyFormatted(e);
    }

    handleFrom = (e) => {
        this.setState({
            from: e
        });
        setTimeout(() => {
            this.loadSalesRecord();
        })
    }

    handleTo = (e) => {
        this.setState({
            to: e
        });
        setTimeout(() => {
            this.loadSalesRecord();
        })
    }

    render() {
        const { salesRecord } = this.props
        const { transaction_type, payment_types, from, to, lastSelectableDate, today } = this.state
        //var payment_types = this.getPaymentType()

        const columns =
            [
                { field: 'invoice_no', headerName: 'Invoice No', flex: 1 },
                { field: 'invoice_date', headerName: 'Date', flex: 1 },
                { field: 'transaction_status', headerName: 'Status', flex: 1 },
                { field: 'payment_type', headerName: 'Payment Type', flex: 1 },
                {
                    field: 'payment_amount', headerName: 'Payment Amount', flex: 1,
                    valueFormatter: ({ value }) => this.formatAmt(value),
                }
            ];

        return (
            <Box p={1} className="height-100-overflow">
                {!CartHelper.isEmpty(salesRecord) && salesRecord.success ?
                    <>
                        <Box p={2}>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <Grid container direction="row" item spacing={2} xs={12} md={10} lg={7}>
                                        <Grid item xs>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <Grid container justify="flex-start">
                                                    <KeyboardDatePicker
                                                        required
                                                        id="from-date-picker-dialog"
                                                        label="From"
                                                        format="dd/MM/yyyy"
                                                        value={from}
                                                        minDate={lastSelectableDate}
                                                        maxDate={today}
                                                        size="small"
                                                        inputVariant="outlined"
                                                        InputProps={{ readOnly: true }}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date'
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
                                                        minDate={from}
                                                        maxDate={today}
                                                        size="small"
                                                        inputVariant="outlined"
                                                        InputProps={{ readOnly: true }}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                        onChange={this.handleTo}
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField
                                                select
                                                variant="outlined"
                                                value={transaction_type}
                                                label="Transaction type"
                                                onChange={this.handleTransactionType}
                                                className="width-100"
                                                inputProps={{
                                                    className: "padding-9 width-100"
                                                }}
                                            >
                                                <MenuItem value="all">All</MenuItem>
                                                {payment_types.map((paymentType, index) => (
                                                    <MenuItem value={paymentType} key={index}>{paymentType}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box p={2} pt={0}>
                            <Paper square={true}>
                                <Box p={2}>
                                    <Grid container direction="row" justify="space-between">
                                        <Grid item>
                                            <Typography variant="subtitle2" component="strong">Total:{!CartHelper.isEmpty(salesRecord.data) ? salesRecord.totalpayment : 0.00}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2" component="strong">{!CartHelper.isEmpty(salesRecord.data) ? salesRecord.paymentdetail : null}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box>
                                    <DataGrid className="no-border-radius data-grid-border" rows={(salesRecord.data) ? salesRecord.data : []} getRowId={this.handleGetRowId} rowHeight={36} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
                                </Box>

                                {/* <Box>
                                <Grid container direction="row" justify="center" spacing={1} className="align-center-important">
                                    <Grid item xs className="border-white">
                                        <Typography variant="body2" component="strong">Invoice No.</Typography>
                                    </Grid>
                                    <Grid item xs className="border-white">
                                        <Typography variant="body2" component="strong">Date</Typography>
                                    </Grid>
                                    <Grid item xs className="border-white">
                                        <Typography variant="body2" component="strong">Status</Typography>
                                    </Grid>
                                    <Grid item xs className="border-white">
                                        <Typography variant="body2" component="strong">Type</Typography>
                                    </Grid>
                                    <Grid item xs className="border-white">
                                        <Typography variant="body2" component="strong">Amount</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            {!CartHelper.isEmpty(salesRecord.data) ?
                                <List>
                                    {salesRecord.data.map((order, i) => (
                                        <React.Fragment key={i}>
                                            {i !== 0 ? <Divider /> : null}
                                            <ListItem button className="user-select-auto" >
                                                <Grid container direction="row" justify="center" spacing={1} className="align-center-important">
                                                    <Grid item xs className="border-black">
                                                        <Typography variant="caption" component="span">{order.invoice_no}</Typography>
                                                    </Grid>
                                                    <Grid item xs className="border-black">
                                                        <Typography variant="caption" component="span">{order.invoice_date}</Typography>
                                                    </Grid>
                                                    <Grid item xs className="border-black">
                                                        <Typography variant="caption" component="span">{order.transaction_status}</Typography>
                                                    </Grid>
                                                    <Grid item xs className="border-black">
                                                        <Typography variant="caption" component="span">{order.payment_type}</Typography>
                                                    </Grid>
                                                    <Grid item xs className="border-black">
                                                        <Typography variant="caption" component="span">{CartHelper.getCurrencyFormatted(order.payment_amount)}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </React.Fragment>
                                    ))}
                                </List>
                                : null
                            } */}
                            </Paper>
                        </Box>

                    </>
                    : null
                }
            </Box>
        )
    }
}

index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    loadSalesRecord: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    salesRecord: state.salesRecord,
});
export default connect(mapStateToProps, { pageTitle, loadSalesRecord })(withRouter(index))