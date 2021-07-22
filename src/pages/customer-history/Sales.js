import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Grid, Typography, TextField, Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import 'date-fns';
import { Search } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { fetchCustomerHistory } from '../../redux/action/customerAction';
import CartHelper from '../../Helper/cartHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { loading, alert } from '../../redux/action/InterAction';
import { fetchOrder } from '../../redux/action/cartAction';
import SalesOrderPopup from "./SalesOrderPopup"



export class Sales extends Component {

    constructor(props) {
        super(props)

        this.state = {
            report_type: "SALES",
            mobile: "",
            mobileError: true,
            sales: [],
            popup: false,
            order: {}
        }
    }

    componentDidMount() {
        this.props.pageTitle('Sales history');
    }

    handleMobile = (e) => {
        var mobNo = e.target.value
        this.setState({
            mobile: mobNo,
            mobileError: (mobNo.length === 10) ? false : true,
            sales: []
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { mobile, mobileError } = this.state
        if (mobile.length === 10 && !mobileError) {
            this.fetchSales();
        }
    }

    fetchSales = () => {
        const { mobile, report_type } = this.state
        var form = {}
        form.phone = mobile
        form.report_type = report_type
        this.props.loading(true)
        this.props.fetchCustomerHistory(form)
            .then(res => res.json())
            .then(res => {
                this.props.loading(false)
                if (res && res.success) {
                    this.setState({
                        sales: res.sales
                    })
                }
            })
            .catch(err => {
                this.props.loading(false)
            })
    }

    formatAmt = (e) => {
        return CartHelper.getCurrencyFormatted(e);
    }

    handleGetRowId = (e) => {
        return e.invoice_number;
    }

    renderAction = (e) => {
        return (
            <Button className="background-blue" variant="contained" size="small" onClick={() => this.fetchOrder(e.row)}>
                View Details
            </Button>
        )
    }

    fetchOrder = (order) => {
        if (order && order.invoice_number) {
            var form = {
                orderno: order.invoice_number
            }
            this.props.loading(true)
            this.props.fetchOrder(form)
                .then(res => res.json())
                .then(res => {
                    this.props.loading(false)
                    if (res.success) {
                        this.setState({
                            popup: true,
                            order: res
                        })
                    }
                })
                .catch(err => {
                    this.props.loading(false)
                })
        }
    }

    closePopup = () => {
        this.setState({
            popup: false,
            order: {}
        })
    }

    render() {
        const { mobile, mobileError, sales, popup, order } = this.state
        const columns =
            [
                { field: 'invoice_number', headerName: 'Invoice No', flex: 1 },
                { field: 'location_name', headerName: 'Location', flex: 1 },
                {
                    field: 'net_total', headerName: 'Payment Amount', flex: 1,
                    valueFormatter: ({ value }) => this.formatAmt(value),
                },
                { field: 'payment_type', headerName: 'Payment Type', flex: 1 },
                { field: 'sale_time', headerName: 'Date', flex: 1 },
                { field: 'action', headerName: 'Action', flex: 1, renderCell: (this.renderAction) }
            ];

        return (
            <>
                <Box className="width-100 clearfix">
                    <form onSubmit={this.onSubmit}>
                        <Grid container direction="row" alignItems="flex-start">
                            <Grid item xs={5}>
                                <Grid container direction="row" alignItems="flex-start" className="mb-5">
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
                        <Grid container>
                            <Grid item xs={12}>
                                <Box pt={2}>
                                    <DataGrid className="no-border-radius data-grid-border" rows={(sales && sales.length > 0) ? sales : []} getRowId={this.handleGetRowId} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
                <SalesOrderPopup popup={popup} order={order} closePopup={this.closePopup} />
            </>
        )
    }
}

Sales.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    fetchCustomerHistory: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    fetchOrder: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

});

const mapActionsToProps = {
    pageTitle,
    loading,
    alert,
    fetchCustomerHistory,
    fetchOrder
}
export default connect(mapStateToProps, mapActionsToProps)(withRouter(Sales))