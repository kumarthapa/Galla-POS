import React, { Component } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Divider, Box } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import CartHelper from '../../Helper/cartHelper'

export class SalesOrderPopup extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    getRowTotal = (item) => {
        var qty = (item.qty) ? Number(item.qty) : 0;
        var price = (item.finalprice) ? Number(item.finalprice) : 0;
        var total = qty * price;
        return CartHelper.getCurrencyFormatted(total.toFixed(2));
    }

    applyDisAfterTax = (order) => {
        var isApplying = false
        if (order.sales_data.applyDisWithoutTax && Number(order.sales_data.applyDisWithoutTax)) {
            isApplying = true
        }
        return isApplying;
    }

    render() {
        const { popup, order, closePopup } = this.props
        return (
            <React.Fragment>
                <Dialog open={popup} scroll={'body'} className={'dialog'} onClose={closePopup}>
                    <DialogActions>
                        <Avatar onClick={closePopup} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent>
                        <Box pt={2} pb={1}>
                            <Grid container spacing={2} >
                                <Grid item xs >
                                    <Typography variant="body2" component="span">Name</Typography>
                                </Grid>
                                <Grid item xs={2} className="align-right">
                                    <Typography variant="body2" component="span">Price</Typography>
                                </Grid>
                                <Grid item xs={2} className="align-right">
                                    <Typography variant="body2" component="span">Qty</Typography>
                                </Grid>
                                <Grid item xs={2} className="align-right">
                                    <Typography variant="body2" component="span">Row Total</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        <Box>
                            {order && order.data && order.data.length > 0 ?
                                <>
                                    {order.data.map((item, index) => (
                                        <Box key={index}>
                                            <Box pt={1} pb={1}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs>
                                                        <Typography variant="body2" component="span">{item.name}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} className="align-right">
                                                        <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(item.finalprice)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} className="align-right">
                                                        <Typography variant="body2" component="span">{item.qty}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} className="align-right">
                                                        <Typography variant="body2" component="span">{this.getRowTotal(item)}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <Divider />
                                        </Box>
                                    ))}
                                </>
                                :
                                null
                            }
                        </Box>
                        {order && order.sales_data && !CartHelper.isEmpty(order.sales_data) ?

                            <Box pt={1}>
                                <Grid container spacing={2}>
                                    <Grid item xs className="align-right">
                                        <Typography variant="body2" component="span">Subtotal</Typography>
                                    </Grid>
                                    <Grid item xs={3} className="align-right">
                                        <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.subtotal)}</Typography>
                                    </Grid>
                                </Grid>
                                {!this.applyDisAfterTax(order) && Number(order.sales_data.discount) > 0 ?
                                    <Grid container spacing={2}>
                                        <Grid item xs className="align-right">
                                            <Typography variant="body2" component="span">Discount</Typography>
                                        </Grid>
                                        <Grid item xs={3} className="align-right">
                                            <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.discount)}</Typography>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                {Number(order.sales_data.tax) > 0 ?
                                    <Grid container spacing={2} >
                                        <Grid item xs className="align-right">
                                            <Typography variant="body2" component="span">Tax</Typography>
                                        </Grid>
                                        <Grid item xs={3} className="align-right">
                                            <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.tax)}</Typography>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                {this.applyDisAfterTax(order) && Number(order.sales_data.discount) > 0 ?
                                    <Grid container spacing={2}>
                                        <Grid item xs className="align-right">
                                            <Typography variant="body2" component="span">Discount</Typography>
                                        </Grid>
                                        <Grid item xs={3} className="align-right">
                                            <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.discount)}</Typography>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                <Grid container spacing={2} >
                                    <Grid item xs className="align-right">
                                        <Typography variant="subtitle1" component="span" className="bold-i">Total</Typography>
                                    </Grid>
                                    <Grid item xs={3} className="align-right">
                                        <Typography variant="subtitle1" component="span" className="bold-i">{CartHelper.getCurrencyFormatted(order.sales_data.nettotal)}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            : null
                        }
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}

export default SalesOrderPopup
