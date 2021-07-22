import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withStyles } from "@material-ui/core/styles";
import { Grid, Avatar, Box, Typography, Fab, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Lock, Description, Info, Reply, PanTool, Money, Dashboard, CardGiftcard, Payment, AccountCircle, PlayCircleFilled, ContactMail, Edit, Note, LocalLibrary, Storage, Cancel, CreditCard, History } from '@material-ui/icons';
import Helper from '../../Helper/storeHelper';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { clearCart } from '../../redux/action/cartAction';
import { clearReturningProducts } from '../../redux/action/returnAction';
import { clearEditProducts } from '../../redux/action/editAction';
import { pageTitle, returnIsActive, editIsActive, openCancelPopup } from '../../redux/action/themeAction';




const Styles = theme => ({
    logbutton: {
        borderRadius: 0,
        fontSize: 15,
        textTransform: 'capitalize',
        border: '1px solid #191717',
        padding: '10px 0',
        fontWeight: '700',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        maxWidth: 350,
    }
});


class drawer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            newSale: true,
            returnSale: true,
            editSale: false,
            cancelInvoice: false,
            salesRecord: true,
            suspended: true,
            openRegister: true,
            closeRegister: true,
            stockRequest: true,
            inventory: false,
            discountCoupon: false,
            paymentHistory: false,
            profileDetail: false,
            help: true,
            productTour: false,
            contactus: true,
            creditnote: false,
            credithistory: false,
        }
    }

    componentDidMount() {
        if (Number(Helper.canEditInvoice()) === 1) {
            this.setState({ editSale: true })
        }
        if (Helper.canCancelInvoice() === 1) {
            this.setState({ cancelInvoice: true })
        }
        if (Helper.isCreditAllowed()) {
            this.setState({ credithistory: true })
        }
        if (Helper.canCreateCreditNote()) {
            this.setState({ creditnote: true })
        }
    }

    startNewSale = () => {

        this.props.clearReturningProducts();
        this.props.clearEditProducts();
        this.props.clearCart();
        this.props.pageTitle('New Sale');
        this.props.close();
        this.props.history.push(`${process.env.PUBLIC_URL}/`);
    }

    startReturnSale = () => {
        this.props.returnIsActive(true);
        this.props.close();
        if (this.props.location.pathname !== '/') {
            this.props.history.push(`${process.env.PUBLIC_URL}/`);
        }
    }

    startEditInvoice = () => {
        this.props.editIsActive(true);
        //this.props.pageTitle('Edit Sale');
        this.props.close();
        if (this.props.location.pathname !== '/') {
            this.props.history.push(`${process.env.PUBLIC_URL}/`);
        }
    }

    handleCancelInvoice = () => {
        this.props.openCancelPopup(true);
        this.props.close();
    }

    goToPage = (route) => {
        this.props.history.push(`${process.env.PUBLIC_URL + '/' + route}`);
        this.props.close();
    }

    render() {
        const { classes } = this.props;
        const { newSale, returnSale, editSale, cancelInvoice, salesRecord, suspended, openRegister, closeRegister, stockRequest, inventory, discountCoupon, paymentHistory, profileDetail, help, productTour, contactus, credithistory, creditnote } = this.state
        return (
            <Drawer open={this.props.open} onClose={this.props.close} className="drawer">
                <List className="avatar-container">
                    <Box>
                        <ListItem>
                            <Grid container direction="row">
                                {/* <Grid item md={12} sm={12} xs={12}>
                                    <IconButton  onClick={this.props.close} className={'drawer-close'}>
                                        <CloseIcon />
                                    </IconButton>
                                </Grid> */}
                                <Grid item xs={4}>
                                    <Grid item container direction="row" justify="center">
                                        <Grid item xs={12} container direction="row" justify="center">
                                            <Box p={1}>
                                                <Avatar className={'avatar'} src={Helper.getCompanyLogo()}>
                                                    photo
                                                </Avatar>
                                            </Box>
                                            <Box p={1} className="width-100 display-grid align-center">
                                                <Typography variant='subtitle2' component='span' className={'brand-name'} noWrap={true}>
                                                    {Helper.getCompany()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={8} container alignItems="center">
                                    <Grid container direction="row" justify="center">
                                        <Box pb={0} className={'display-grid'}>
                                            <Typography variant='h6' component='h6' noWrap={true}>
                                                {Helper.getCompany()}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid container direction="row" justify="space-between">
                                        <Grid item></Grid>
                                        <Grid item>
                                            <Box pb={0} className={'display-grid'}>
                                                <Typography variant='body1' component='span' className={'emp-name'} noWrap={true}>
                                                    {Helper.getUserName()}
                                                </Typography>
                                            </Box>
                                            <Box pb={0} className={'display-grid'}>
                                                <Typography variant='body2' component='span' className={'emp-position'} noWrap={true}>
                                                    Sales Manager
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </Box>
                </List>
                <List className={'menu-list padding-0'}>
                    {newSale ?
                        <ListItem button onClick={this.startNewSale}>
                            <ListItemIcon><Description /></ListItemIcon>
                            <ListItemText primary={'New Sale'} />
                        </ListItem>
                        : null}
                    {returnSale ?
                        <ListItem button onClick={this.startReturnSale}>
                            <ListItemIcon><Reply /></ListItemIcon>
                            <ListItemText primary={'Return Sale'} />
                        </ListItem>
                        : null}
                    {editSale ?
                        <ListItem button onClick={this.startEditInvoice}>
                            <ListItemIcon><Edit /></ListItemIcon>
                            <ListItemText primary={'Edit Sale'} />
                        </ListItem>
                        : null}
                    {cancelInvoice ?
                        <ListItem button onClick={this.handleCancelInvoice}>
                            <ListItemIcon><Cancel /></ListItemIcon>
                            <ListItemText primary={'Cancel Invoice'} />
                        </ListItem>
                        : null}
                    {creditnote ?
                        <ListItem button onClick={() => this.goToPage('creditnote')}>
                            <ListItemIcon><CreditCard /></ListItemIcon>
                            <ListItemText primary={'Credit Note'} />
                        </ListItem>
                        : null}
                    {credithistory ?
                        <ListItem button onClick={() => this.goToPage('credit-history')}>
                            <ListItemIcon><CreditCard /></ListItemIcon>
                            <ListItemText primary={'Credit history'} />
                        </ListItem>
                        : null}

                    <ListItem button onClick={() => this.goToPage('customer-history')}>
                        <ListItemIcon><History /></ListItemIcon>
                        <ListItemText primary={'Customer history'} />
                    </ListItem>

                    {salesRecord ?
                        <ListItem button onClick={() => this.goToPage('salesrecord')}>
                            <ListItemIcon><Money /></ListItemIcon>
                            <ListItemText primary={'Sales Record'} />
                        </ListItem>
                        : null}
                    {suspended ?
                        <ListItem button onClick={() => this.goToPage('suspended')}>
                            <ListItemIcon><PanTool /></ListItemIcon>
                            <ListItemText primary={'Suspended Sale'} />
                        </ListItem>
                        : null}
                    {openRegister ?
                        <ListItem button onClick={() => this.goToPage('openregister')}>
                            <ListItemIcon><LocalLibrary /></ListItemIcon>
                            <ListItemText primary={'Open Register'} />
                        </ListItem>
                        : null}
                    {closeRegister ?
                        <ListItem button onClick={() => this.goToPage('closeregister')}>
                            <ListItemIcon><Note /></ListItemIcon>
                            <ListItemText primary={'Close Register'} />
                        </ListItem>
                        : null}
                    {stockRequest ?
                        <ListItem button onClick={() => this.goToPage('stockrequest')}>
                            <ListItemIcon><Storage /></ListItemIcon>
                            <ListItemText primary={'Stock Request'} />
                        </ListItem>
                        : null}
                    {inventory ?
                        <ListItem button>
                            <ListItemIcon><Dashboard /></ListItemIcon>
                            <ListItemText primary={'Inventory'} />
                        </ListItem>
                        : null}
                    {discountCoupon ?
                        <ListItem button>
                            <ListItemIcon><CardGiftcard /></ListItemIcon>
                            <ListItemText primary={'Discount Coupons'} />
                        </ListItem>
                        : null}
                    {paymentHistory ?
                        <ListItem button>
                            <ListItemIcon><Payment /></ListItemIcon>
                            <ListItemText primary={'Payment History'} />
                        </ListItem>
                        : null}
                    {profileDetail ?
                        <ListItem button>
                            <ListItemIcon><AccountCircle /></ListItemIcon>
                            <ListItemText primary={'Profile Details'} />
                        </ListItem>
                        : null}
                    {help ?
                        <ListItem button onClick={() => this.goToPage('help')}>
                            <ListItemIcon><Info /></ListItemIcon>
                            <ListItemText primary={'Help'} />
                        </ListItem>
                        : null}
                    {productTour ?
                        <ListItem button>
                            <ListItemIcon><PlayCircleFilled /></ListItemIcon>
                            <ListItemText primary={'Product tour'} />
                        </ListItem>
                        : null}
                    {contactus ?
                        <ListItem button onClick={() => this.goToPage('contactus')}>
                            <ListItemIcon><ContactMail /></ListItemIcon>
                            <ListItemText primary={'Contact us'} />
                        </ListItem>
                        : null}
                </List>
                <Fab variant="extended" className={classes.logbutton} onClick={() => Helper.logOut()}>
                    <Lock /> <Typography variant='subtitle2' component="strong">Logout</Typography>
                </Fab>
            </Drawer>
        )
    }
}

drawer.propTypes = {
    clearCart: PropTypes.func.isRequired,
    clearReturningProducts: PropTypes.func.isRequired,
    pageTitle: PropTypes.func.isRequired,
    returnIsActive: PropTypes.func.isRequired,
    editIsActive: PropTypes.func.isRequired,
    clearEditProducts: PropTypes.func.isRequired,
    openCancelPopup: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    // suspendedCart: state.suspendedCart,
    // cartProduct: state.cartProduct,
    // discount: state.discount,
});

export default connect(mapStateToProps, {
    clearCart,
    clearReturningProducts,
    pageTitle,
    returnIsActive,
    editIsActive,
    clearEditProducts,
    openCancelPopup
})(withStyles(Styles)(withRouter(drawer)));
