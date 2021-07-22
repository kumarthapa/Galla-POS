import React, { Component } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadEditProducts, clearEditProducts, saveEditInvoiceNo } from '../../../redux/action/editAction';
import { restoreCartProduct, clearCart } from '../../../redux/action/cartAction';
import CartHelper from '../../../Helper/cartHelper';
import { loading, alert } from '../../../redux/action/InterAction';
import { pageTitle } from '../../../redux/action/themeAction';

class EditPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            invoice: '',
        }
        this.textInput = React.createRef();
    }
    componentDidMount() {

        //this.props.clearReturningProducts();

    }

    handleInvoice = event => {
        this.setState({
            invoice: event.target.value
        })
    }

    submitInvoice = event => {
        event.preventDefault();
        var form = {
            orderno: this.state.invoice
        }
        this.props.loadEditProducts(form);
        this.props.loading(true);
    }

    componentDidUpdate() {
        this.textInput.current.focus();
        var editData = this.props.editData;

        if (!CartHelper.isEmpty(editData)) {
            if (editData.success) {
                this.props.clearCart();
                this.props.pageTitle('Edit Sale');
                this.props.saveEditInvoiceNo(this.state.invoice);
                editData.data.forEach(product => {
                    this.props.restoreCartProduct(product);
                })
                this.props.loading(false);
                this.props.toggle();
            } else {
                this.props.loading(false);
                this.props.alert(true, editData.message);
                this.props.clearEditProducts();
                this.props.toggle();
            }
        }
    }

    render() {
        const { invoice } = this.state;
        return (
            <React.Fragment>
                <Dialog open={this.props.openEdit} scroll={'body'} className={'dialog'} onClose={this.props.toggle}>
                    <DialogActions>
                        <Avatar onClick={this.props.toggle} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent className={'display-in-center'}>
                        <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h5" className="bold-i">Edit Invoice</Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h6">Enter or Scan invoice number </Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Box>
                                    <form onSubmit={this.submitInvoice} className="display-flex justify-center">
                                        <input type="text" name={'orderid'} className={'input orderid'} placeholder={'Invoice number'} value={invoice} onChange={this.handleInvoice} ref={this.textInput} />
                                        <Button variant="contained" color="secondary" type="submit">Load</Button>
                                    </form>
                                </Box>
                            </Grid>
                            <Grid item xs={12}></Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}


EditPopup.propTypes = {
    loadEditProducts: PropTypes.func.isRequired,
    clearEditProducts: PropTypes.func.isRequired,
    restoreCartProduct: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    pageTitle: PropTypes.func.isRequired,
    saveEditInvoiceNo: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    editData: state.editData
});
export default connect(mapStateToProps, {
    loadEditProducts,
    clearEditProducts,
    restoreCartProduct,
    clearCart,
    loading,
    alert,
    pageTitle,
    saveEditInvoiceNo
})(EditPopup)
