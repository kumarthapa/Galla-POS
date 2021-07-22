import React, { Component } from 'react'
import { Dialog, DialogActions, DialogContent, Avatar, Grid, Typography, Button, Box } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { Check } from '@material-ui/icons';
import { connect } from "react-redux";
import { clearCart, clearCustomer } from '../../../redux/action/cartAction';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';
import PrintBill from '../Print/PrintBill';
//import ReactDOM from 'react-dom';
import { clear_customer_data, notifyCustomer } from '../../../redux/action/customerAction';
import CartHelper from '../../../Helper/cartHelper';
import StoreHelper from '../../../Helper/storeHelper';
import Alert from '@material-ui/lab/Alert';

class Success extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: "",
            responseMsgS: "",
            responseMsgE: ""
        }
    }


    componentDidMount() {
        // this.props.clearCart();
        // this.props.clearCustomer();
        // this.props.clear_customer_data();
        if (CartHelper.isNewSale()) {
            this.findAndUpdateQTH();
        }
    }

    onEmailChange = event => {
        this.setState({
            email: event.target.value
        })
    }

    findAndUpdateQTH = () => {
        const { cartProduct, productData } = this.props
        cartProduct.forEach(product => {
            let cartItemQty = Number(product.qty);
            var productFromAll = productData.products.data.find((p) => p.id === product.id);
            var catProduct = productData.category_products.find((p) => p.id === product.id);
            var bestProduct = productData.bestsellings.find((p) => p.id === product.id);
            var recproduct = productData.recommended.find((p) => p.id === product.id);
            this.updateQTH(productFromAll, cartItemQty);
            this.updateQTH(catProduct, cartItemQty);
            this.updateQTH(bestProduct, cartItemQty);
            this.updateQTH(recproduct, cartItemQty);
        })
    }

    updateQTH = (product, qty) => {
        if (product && qty) {
            var locationName = StoreHelper.getLocationName()
            var newQth = Number(product.qty) - qty
            product.qty = Number(newQth).toFixed(2);
            if (product.stock) {
                product.stock.forEach((stock) => {
                    if (stock.location_name === locationName) {
                        var newStQth = Number(stock.quantity) - qty
                        stock.quantity = Number(newStQth).toFixed(2);
                    }
                })
            }
        }
    }

    sendEmail = () => {
        var form = {}
        const { checkoutData } = this.props
        var responseData = checkoutData.responseData
        form.invoice_no = responseData.invoice_num
        form.email = this.state.email
        if (this.state.email) {
            this.props.notifyCustomer(form)
                .then(res => res.json())
                .then(resData => {
                    if (resData.success) {
                        this.setState({
                            responseMsgS: resData.msg,
                            email: ""
                        })
                    } else {
                        this.setState({
                            responseMsgE: resData.msg,
                        })
                    }
                    this.closeResMsg();
                });
        } else {
            this.setState({
                responseMsgE: "Please enter valid email address to send invoice.",
            })
            this.closeResMsg();
        }
    }

    closeResMsg = () => {
        setTimeout(() => {
            this.setState({
                responseMsgE: "",
                responseMsgS: ""
            })
        }, 5000)
    }

    render() {

        return (
            <Dialog open={this.props.success} scroll={'body'} className={'dialog'}>
                <DialogActions>
                    <Avatar onClick={this.props.close} className={'popup-close-button'}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent>
                    <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                        <Grid item xs={12} className={'align-center'}>
                            <Check />
                        </Grid>
                        <Grid item xs={12} className={'align-center'}>
                            <Typography variant="h5" component="h5">Order successfully placed</Typography>
                        </Grid>
                        <Grid item xs={12} className={'align-center'}>
                            <Typography variant="body2" component="p">We recommend to send invoice via email or sms </Typography>
                        </Grid>
                        <Grid item xs={12} className={'align-center'}>
                            <Box>
                                <input type="email" name={'email'} className={'input customer-email'} placeholder={'Email'} value={this.state.email} onChange={this.onEmailChange} />
                            </Box>
                        </Grid>
                        {/* <Grid item xs={12} className={'align-center'}>
                                <Box>
                                    <input type="number" name={'mobile'} className={'input customer-mobile'} placeholder={'Mobile'}/>
                                </Box>
                            </Grid> */}
                        <Grid item xs={6} className={'align-right'}>
                            <Box>
                                <ReactToPrint
                                    trigger={() => <Button variant="contained" color="secondary" className={'success-page-button print-button'} disabled={CartHelper.isEmpty(this.props.checkoutData.billingData)}>PRINT</Button>}
                                    content={() => this.componentRef}
                                />
                                <div style={{ display: "none" }}><PrintBill ref={el => (this.componentRef = el)} /></div>
                            </Box>
                        </Grid>
                        <Grid item xs={6} className={'align-left'}>
                            <Box>
                                <Button variant="contained" color="secondary" className={'success-page-button email-sms-button'} onClick={this.sendEmail}>EMAIL</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} className="align-center">
                            {this.state.responseMsgS ?
                                <Alert severity="success">
                                    {this.state.responseMsgS}</Alert>
                                : null}
                            {this.state.responseMsgE ?
                                <Alert severity="error">
                                    {this.state.responseMsgE}</Alert>
                                : null}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        )
    }
}

Success.propTypes = {
    clearCart: PropTypes.func.isRequired,
    clearCustomer: PropTypes.func.isRequired,
    clear_customer_data: PropTypes.func.isRequired,
    notifyCustomer: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
    cartProduct: state.cartProduct,
    productData: state.productData,
});
export default connect(mapStateToProps, { clearCart, clearCustomer, clear_customer_data, notifyCustomer })(Success)
