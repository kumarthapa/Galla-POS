import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import CartHelper from '../../../../Helper/cartHelper'

export class DefaultInvoice extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    getTotalQty = (items) => {
        var qty = 0
        if (items) {
            items.forEach(item => {
                qty += Number(item.qty)
            })
        }
        return qty.toFixed(3);
    }


    render() {
        var billingData = CartHelper.getBillingData();
        return (
            <>
                {!CartHelper.isEmpty(billingData) && billingData.success ?
                    <table className="inv-table background-white" colSpan={12}>
                        <tbody>
                            <tr className="inv-table-row">
                                <th className="inv-table-data inv-table-data-left" colSpan={5}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Description'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Rate'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Qty'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={3}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Amount'}</Typography>
                                </th>
                            </tr>

                            {billingData.data.map(product => (
                                <tr key={product.id} className="inv-table-row">
                                    <td className="inv-table-data inv-table-data-left" colSpan={5}>
                                        <Typography className="custom-font" variant="body2" component="b">{product.name}</Typography>

                                        {product.hsn_code && product.hsn_code !== '111' ?
                                            <Typography className="custom-font" variant="caption" component="span">
                                                <br />HSN:{product.hsn_code}
                                            </Typography>
                                            : null}
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="b">{CartHelper.getCurrencyFormatted(Number(product.price).toFixed(2))}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="b">{Number(product.qty).toFixed(3)}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={3}>
                                        <Typography className="custom-font" variant="body2" component="b">{CartHelper.getCurrencyFormatted(Number(product.price * product.qty).toFixed(2))}</Typography>
                                    </td>
                                </tr>
                            ))}

                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Subtotal'}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.subtotal)}</Typography>
                                </td>
                            </tr>
                            {billingData.sales_data.applyDisWithoutTax === "0" && Number(billingData.sales_data.discount) > 0 ?
                                <tr className="inv-table-row">
                                    <td colSpan={5}></td>
                                    <td className="inv-table-data align-right" colSpan={4}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Discount'}</Typography>
                                    </td>
                                    <td className="inv-table-data align-right" colSpan={3}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.discount)}</Typography>
                                    </td>
                                </tr>
                                : null}
                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Tax'}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.tax)}</Typography>
                                </td>
                            </tr>
                            {billingData.sales_data.applyDisWithoutTax === "1" && Number(billingData.sales_data.discount) > 0 ?
                                <tr className="inv-table-row">
                                    <td colSpan={5}></td>
                                    <td className="inv-table-data align-right" colSpan={4}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Discount'}</Typography>
                                    </td>
                                    <td className="inv-table-data align-right" colSpan={3}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.discount)}</Typography>
                                    </td>
                                </tr>
                                : null}
                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font print-heading" variant="h6" component="b">{'To be paid'}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font print-heading" variant="h6" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.nettotal)}</Typography>
                                </td>
                            </tr>
                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="body2" component="span">{'Total qty'}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="body2" component="span">{this.getTotalQty(billingData.data)}</Typography>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    : null}
            </>
        )
    }
}

export default DefaultInvoice;
