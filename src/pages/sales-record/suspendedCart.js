import React, { Component } from 'react'
import { Card, Box, Grid, Typography, CardActionArea, CardContent, Button, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import CartHelper from '../../Helper/cartHelper';
import { connect } from "react-redux";
import { restoreCartProduct, removeFromSuspended, clearSuspendedCart } from '../../redux/action/cartAction'
import { alert } from '../../redux/action/InterAction'

class suspendedCart extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    componentDidMount() {

    }

    componentDidCatch() {

    }
    restoreSuspendedCart = (cartitems, index) => {
        if (CartHelper.isEmpty(this.props.cartProduct)) {
            cartitems.forEach(item => {
                this.props.restoreCartProduct(item);
            })
            this.props.removeFromSuspended(index);
            this.props.close();
        } else {
            this.props.alert(true, 'Please clear or suspend your current cart then restore it.')
        }
    }
    removeItem = (index) => {
        this.props.removeFromSuspended(index);
    }
    clearSuspendedCart = () => {
        this.props.clearSuspendedCart();
    }

    render() {
        const { suspendedCart } = this.props;
        return (
            <Box className={'suspendedCart-block'} p={1}>
                {suspendedCart.length > 0 ?
                    <>
                        {suspendedCart.map((susp_cart, index) => (
                            <Grid container spacing={1} key={index} >
                                <Grid item xs={12}>
                                    <Card >
                                        <CardContent className={'padding-0 position-relative'}>
                                            <Box className={'remove-Item'}>
                                                <IconButton aria-label="delete" onClick={() => this.removeItem(index)}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                        <CardActionArea onClick={() => this.restoreSuspendedCart(susp_cart, index)}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={3}>
                                                    <Box p={2}>
                                                        {'Suspended Cart:-'}{index + 1}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={8} container>
                                                    {susp_cart.map((item, i) => (
                                                        <Grid item xs={6} key={i}>
                                                            <Box className={'items'} >
                                                                <Typography variant="body1" component="span">{i + 1}-{item.name}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                                <Grid item xs={1}>

                                                </Grid>
                                            </Grid>
                                        </CardActionArea>


                                    </Card>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid container justify="flex-end">
                            <Box>
                                <Button color="secondary" onClick={this.clearSuspendedCart}>Clear All</Button>
                            </Box>
                        </Grid>

                    </>
                    :
                    <Grid container spacing={1} justify="center">
                        <Box p={2}>{' You have not suspended any cart.'}</Box>
                    </Grid>
                }
            </Box>

        )
    }
}

const mapStateToProps = state => ({
    suspendedCart: state.suspendedCart,
    cartProduct: state.cartProduct,
});

export default connect(mapStateToProps, { restoreCartProduct, removeFromSuspended, clearSuspendedCart, alert })(suspendedCart)
