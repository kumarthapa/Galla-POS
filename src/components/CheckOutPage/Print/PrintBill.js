import React, { Component } from 'react';
import { Typography, Box, Grid } from '@material-ui/core';
import CartHelper from '../../../Helper/cartHelper'
import StoreHelper from '../../../Helper/storeHelper'
import PaymentDetails from './paymentDetails'
import TaxDetails from './taxDetails'
import ReturnDetails from './ReturnDetails'
import DefaultInvoice from './inv-template/defaultInv'
import GroceryInvoice from './inv-template/groceryInv'
import OtherInvoice from './inv-template/otherInv'
import Barcode from "react-barcode"

export class PrintBill extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        var billingData = CartHelper.getBillingData();
        var responseData = CartHelper.getResponseData();
        var langs = StoreHelper.getLangs()
        return (
            <Box className="custom-font printable-area" p={1}>
                {!CartHelper.isEmpty(billingData) && billingData.success ?
                    <>
                        <Box p={0} className="align-center-important">
                            <Typography className="custom-font print-heading" variant="h6" component="b">{StoreHelper.getCompany() !== 'null' ? StoreHelper.getCompany() : ""}</Typography>
                        </Box>
                        <Box p={0} className="align-center-important">
                            <Typography className="custom-font" variant="body2" component="b">{StoreHelper.getConfigAddress() !== "null" ? StoreHelper.getConfigAddress() : ""}</Typography>
                        </Box>
                        <Box p={0} className="align-center-important">
                            <Typography className="custom-font" variant="body2" component="b">{StoreHelper.getUserCity() !== 'null' ? StoreHelper.getUserCity() : ""}{StoreHelper.getUserPincode() !== "null" ? StoreHelper.getUserPincode() : ""}</Typography>
                        </Box>
                        <Box p={0} className="align-center-important">
                            <Typography className="custom-font" variant="body2" component="b">{"Phone: "}{StoreHelper.getConfigPhone() !== "null" ? StoreHelper.getConfigPhone() : ""}</Typography>
                        </Box>
                        <Box p={0} className="align-center-important">
                            <Typography className="custom-font" variant="body2" component="b">{langs.GST ? langs.GST : 'GST'}{':'}{StoreHelper.getGSTNo() !== 'null' ? StoreHelper.getGSTNo() : ""}</Typography>
                        </Box>
                        <Box p={2} className="align-center-important">
                            <Typography className="custom-font print-heading" variant="h6" component="b">{"Tax Invoice"}</Typography>
                        </Box>
                        <Box p={0} className="align-left background-white">
                            <table className="inv-table" colSpan={12}>
                                <tbody>
                                    <tr className="inv-table-row">
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{"Order #: "}</Typography>
                                        </td>
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{responseData.invoice_num}</Typography>
                                        </td>
                                    </tr>
                                    <tr className="inv-table-row">
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{"Date: "}</Typography>
                                        </td>
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{responseData.date}</Typography>
                                        </td>
                                    </tr>
                                    {billingData.customer.phone_number ?
                                        <tr className="inv-table-row">
                                            <td className="inv-table-data-left" colSpan={6}>
                                                <Typography className="custom-font" variant="subtitle2" component="b">{"Mobile: "}</Typography>
                                            </td>
                                            <td className="inv-table-data-left" colSpan={6}>
                                                <Typography className="custom-font" variant="subtitle2" component="b">{billingData.customer.phone_number}</Typography>
                                            </td>
                                        </tr>
                                        : null}
                                </tbody>
                            </table>
                        </Box>

                        <Box p={1} />
                        { StoreHelper.getInvTemp() === 'default' ? <DefaultInvoice /> : null}
                        { StoreHelper.getInvTemp() === 'grocery' ? <GroceryInvoice /> : null}
                        { StoreHelper.getInvTemp() === 'othertpl' ? <OtherInvoice /> : null}

                        <Box p={1} />
                        <PaymentDetails />
                        <Box p={1} />
                        <TaxDetails />
                        <Box p={1} />
                        <ReturnDetails />
                        <Box>
                            <Grid container direction="row" justify="center" >
                                <Grid item>
                                    <Barcode value={responseData.invoice_num} height={50} fontSize={12} />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box p={0} className="align-left">
                            <Typography className="custom-font" variant="body2" component="b">{StoreHelper.getReturnPolicy()}</Typography>
                        </Box>
                    </>
                    : null}
            </Box>
        )
    }
}

export default PrintBill;
