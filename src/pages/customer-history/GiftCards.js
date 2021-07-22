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



export class GiftCards extends Component {

    constructor(props) {
        super(props)

        this.state = {
            report_type: "GIFTCARDS",
            mobile: "",
            mobileError: true,
            giftCards: {}
        }
    }

    componentDidMount() {
        this.props.pageTitle('Giftcards history');
    }

    handleMobile = (e) => {
        var mobNo = e.target.value
        this.setState({
            mobile: mobNo,
            mobileError: (mobNo.length === 10) ? false : true,
            giftCards: {}
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { mobile, mobileError } = this.state
        if (mobile.length === 10 && !mobileError) {
            this.fetGiftCards();
        }
    }

    fetGiftCards = () => {
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
                        giftCards: res
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
        return e.giftcard_id;
    }

    render() {
        const { mobile, mobileError, giftCards } = this.state
        const totalBalance = (!CartHelper.isEmpty(giftCards) && giftCards.totalBalance) ? giftCards.totalBalance : 0

        const columns =
            [
                { field: 'record_time', headerName: 'Date', flex: 1 },
                { field: 'giftcard_number', headerName: 'Gift Card No', flex: 1 },
                {
                    field: 'value', headerName: 'Value', flex: 1,
                    valueFormatter: ({ value }) => this.formatAmt(value),
                },
                { field: 'discount_type', headerName: 'Discount Type', flex: 1 },
                { field: 'validity', headerName: 'Validity', flex: 1 }

            ];

        return (
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
                                {totalBalance ?
                                    <Grid container>
                                        <Grid item>
                                            <Typography variant="subtitle2" component="strong">
                                                Total Balance:{CartHelper.getCurrencyFormatted(totalBalance)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    : null
                                }

                                <DataGrid className="no-border-radius data-grid-border" rows={(giftCards.giftcards && giftCards.giftcards.length > 0) ? giftCards.giftcards : []} getRowId={this.handleGetRowId} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        )
    }
}

GiftCards.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    fetchCustomerHistory: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

});

const mapActionsToProps = {
    pageTitle,
    loading,
    alert,
    fetchCustomerHistory
}
export default connect(mapStateToProps, mapActionsToProps)(withRouter(GiftCards))