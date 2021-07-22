import React, { Component } from 'react'
import { Box, Typography } from '@material-ui/core';
import CartHelper from '../../../Helper/cartHelper'

class taxDetails extends Component {

    isTaxVisible = (taxDetails) => {
        var isTaxVisible = false
        if (taxDetails && taxDetails.tax_data && taxDetails.tax_data.length > 0) {
            var taxTotal = 0
            taxDetails.tax_data.forEach((tax) => {
                if (tax && tax.tax_total && Number(tax.tax_total) > 0) {
                    taxTotal += Number(tax.tax_total);
                }
            })

            if (taxTotal && Number(taxTotal) > 0) {
                isTaxVisible = true
            }
        }
        return isTaxVisible;
    }

    render() {
        const taxDetails = CartHelper.getTaxDetailsToPrint()
        return (
            <>
                {!CartHelper.isEmpty(taxDetails) && this.isTaxVisible(taxDetails) ?
                    <Box p={0} className="align-left background-white">
                        <table className="inv-table" colSpan={12}>
                            <tbody>
                                <tr className="inv-table-row">
                                    <th className="inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">{"Tax%"}</Typography>
                                    </th>
                                    <th className="inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">{"Taxable Amt"}</Typography>
                                    </th>
                                    <th className="inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">{"Tax Amt"}</Typography>
                                    </th>
                                    {taxDetails && taxDetails.tax_names && taxDetails.tax_names.length > 0 ?
                                        <>
                                            {taxDetails.tax_names.map((name, i) => (
                                                <th className="inv-table-data-left" colSpan={2} key={i}>
                                                    <Typography className="custom-font" variant="body2" component="p">{name}</Typography>
                                                </th>
                                            ))}
                                        </>
                                        : null
                                    }
                                </tr>
                                {taxDetails && taxDetails.tax_data && taxDetails.tax_data.length > 0 ?
                                    <>
                                        {taxDetails.tax_data.map((tax, index) => (

                                            <React.Fragment key={index}>
                                                {tax && tax.tax_total && Number(tax.tax_total) > 0 ?
                                                    <>
                                                        <tr className="inv-table-row" >
                                                            <td className="inv-table-data-left" colSpan={2}>
                                                                <Typography className="custom-font" variant="body2" component="p">{tax.tax_percent}</Typography>
                                                            </td>
                                                            <td className="inv-table-data-left" colSpan={2}>
                                                                <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(tax.slab_total)}</Typography>
                                                            </td>
                                                            <td className="inv-table-data-left" colSpan={2}>
                                                                <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(tax.tax_total)}</Typography>
                                                            </td>
                                                            {tax && tax.tax_rates && tax.tax_rates.length > 0 ?
                                                                <>
                                                                    {tax.tax_rates.map((rate, i) => (
                                                                        <td className="inv-table-data-left" colSpan={2} key={i}>
                                                                            <Typography className="custom-font" variant="body2" component="p">{Number(rate).toFixed(2)}</Typography>
                                                                        </td>
                                                                    ))}
                                                                </>
                                                                : null
                                                            }
                                                        </tr>
                                                    </>
                                                    : null
                                                }
                                            </React.Fragment>
                                        ))}
                                    </>
                                    : null
                                }
                            </tbody>
                        </table>
                    </Box>
                    : null}
            </>
        )
    }
}

export default taxDetails
