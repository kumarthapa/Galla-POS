import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
//import PropTypes from 'prop-types';
import { Grid, Typography, Box, Fab, Avatar } from '@material-ui/core'
import { Info } from '@material-ui/icons'
import CartHelper from '../../../Helper/cartHelper'

const Styles = theme => ({
    qtybox: {
        width: 100,
        height: 30,
        marginLeft: 10,
        textAlign: 'center',
        border: '1px solid #ddd',
        borderRadius: 4,
        fontSize: 15,
        color: '#313131',
        display: 'inline-block',
        backgroundColor: '#fff',
        lineHeight: '26px',
    },
    totalamount: {
        fontSize: 28,
        fontWeight: 'bold',
    }
});

class TotalSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }


    render() {

        const { classes, cartProduct, returnData } = this.props;
        const totalQty = Number(CartHelper.getTotalQty());
        const totalAmount = CartHelper.getTotalAmount();
        return (
            <Grid container direction="row" justify="space-between" >
                <Grid item >
                    <Typography variant="body1" component="span">
                        Total Qty/Kg
                    </Typography>
                    <Typography variant="h6" component="span" className={classes.qtybox} >
                        {Number(totalQty).toFixed(3)}
                    </Typography>
                </Grid>
                <Grid item >
                    <Grid container direction="row">
                        <Box mr={2}>
                            {!returnData.success ?
                                <Typography variant="h6" component="span" className={classes.totalamount}>
                                    {CartHelper.getCurrencyFormatted(totalAmount)}
                                </Typography>
                                :
                                <>
                                    {!returnData.barcode_return ?
                                        <>
                                            <Typography variant="body2" component="p">
                                                Paid Amount :{CartHelper.getCurrencyFormatted(returnData.sales_data.nettotal)}
                                            </Typography>
                                            <Typography variant="h6" component="p">
                                                {Number(totalAmount) > returnData.sales_data.nettotal ?
                                                    'Due Amount:' + CartHelper.getCurrencyFormatted(Number(totalAmount) - returnData.sales_data.nettotal)
                                                    :
                                                    'Refund Amount :' + CartHelper.getCurrencyFormatted(returnData.sales_data.nettotal - Number(totalAmount))
                                                }
                                            </Typography>
                                        </>
                                        :
                                        <Typography variant="h6" component="p">
                                            Refund Amount :{CartHelper.getCurrencyFormatted(totalAmount)}
                                        </Typography>
                                    }
                                </>
                            }
                        </Box>
                        <Box>
                            <Fab className={'fab-button-on-checkout'} id="summary-info-btn" title="Summary Info [Alt+I]" onClick={() => this.props.handleClickOpen()} disabled={CartHelper.isEmpty(cartProduct) ? true : false}>
                                <Avatar className={'checkout-icons'}>
                                    <Info className={'info-icon'} />
                                </Avatar>
                            </Fab>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    returnData: state.returnData,
});
export default connect(mapStateToProps, null)(withStyles(Styles)(TotalSummary));
