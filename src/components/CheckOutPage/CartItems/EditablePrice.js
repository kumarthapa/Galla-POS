import React, { Component } from 'react'
import { Grid, Typography, Box, IconButton, Button, TextField } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { withStyles } from "@material-ui/core/styles";
import CartHelper from '../../../Helper/cartHelper';
import StoreHelper from '../../../Helper/storeHelper';

const Styles = theme => ({
    firstamount: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
    }, secondamount: {
        textDecorationLine: 'line-through',
        fontSize: 14,

    }, discountamount: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
    }
});
class EditablePrice extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isEditing: false,
            newPrice: ""
        }
    }

    componentDidMount() {
        const { product } = this.props;
        this.setState({
            newPrice: product.finalprice
        })
        //console.log('testing', product.finalprice)
    }

    editNow = (mrp) => {
        this.setState({
            isEditing: true,
            newPrice: mrp
        })
    }

    onPriceChange = event => {
        this.setState({
            newPrice: event.target.value
        })
    }

    updatePrice = () => {
        const { product } = this.props;
        var tax = Number(product.tax);
        const { newPrice } = this.state;
        var detailPrice = CartHelper.getDetailPriceFromNewPrice(tax, newPrice)
        var priceUpdatedProduct = { ...product, ...detailPrice };
        this.props.updatePrice(priceUpdatedProduct);
        this.setState({
            isEditing: false
        })
    }

    render() {
        const { classes, product } = this.props;
        const rulesAppliedData = CartHelper.getRulesAppliedData(product);
        var dicountedPrice = rulesAppliedData.price
        var mrp = product.finalprice
        var displayDiscountPercentage = true

        //Condition if rules applied as coupon
        if (CartHelper.isGiftVoucherApplicable()) {
            dicountedPrice = product.finalprice
            displayDiscountPercentage = false
        }

        return (
            <Grid container direction="row">
                {!this.state.isEditing ?
                    <Grid item lg={8} md={8} sm={8} xs={9}>
                        <Grid container direction="row">
                            <Box pl={2}>
                                <Typography variant="subtitle1" component="span" className={classes.firstamount}>
                                    {CartHelper.getCurrencyFormatted(dicountedPrice)}
                                </Typography>
                            </Box>
                            {parseInt(mrp) > parseInt(dicountedPrice) ?
                                <Box pl={2}>
                                    <Typography variant="subtitle1" component="span" className={classes.secondamount}>
                                        {CartHelper.getCurrencyFormatted(mrp)}
                                    </Typography>
                                </Box>
                                : null
                            }
                            {StoreHelper.isPriceEditable() === 1 ?
                                <Box pl={2}>
                                    <IconButton aria-label="edit-button" size="small" onClick={() => this.editNow(mrp)}>
                                        <Edit size="small" />
                                    </IconButton>
                                </Box>
                                : null
                            }
                        </Grid>
                    </Grid>
                    :
                    <Grid item lg={8} md={8} sm={8} xs={9}>
                        <Grid container direction="row" justify="flex-start" alignItems="center" wrap="nowrap">
                            <Box pl={2} pt={1}>
                                <TextField
                                    label="Price"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    value={this.state.newPrice}
                                    onChange={this.onPriceChange}
                                />
                            </Box>
                            <Box pl={1} pt={1}>
                                <Button variant="contained" color="secondary" onClick={this.updatePrice}>
                                    Save
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                }
                {
                    rulesAppliedData.discount_label !== '' && displayDiscountPercentage ?
                        <Grid item lg={4} md={4} sm={4} xs={3}>
                            <Typography variant="subtitle1" component="span" className={classes.discountamount}>
                                ({rulesAppliedData.discount_label})Off
                            </Typography>
                        </Grid>
                        : null
                }
            </Grid >
        )
    }
}

export default withStyles(Styles)(EditablePrice)
