import React, { Component } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import LeftDrawer from './drawer';
import { Grid, Typography, Toolbar, AppBar, IconButton, Box } from '@material-ui/core';
//import { NotificationsNone} from '@material-ui/icons';
//import CategoryItem from '../AppBar/Category';
//import CustomerItem from '../AppBar/Customer';
//import Item from '../AppBar/Item';
import SearchByName from '../Search/searchByName';
import SearchCustomer from '../Search/searchCustomer';
import SearchByCategory from '../Search/searchByCategory';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import StoreHelper from '../../Helper/storeHelper'
import Clock from './Clock';
import Helper from '../../Helper/storeHelper';
import { Helmet } from "react-helmet";

class header extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            categorySearch: false,
            productSearch: true,
            customerSearch: false
        }
    }

    handleMenu = () => {
        this.setState({
            open: true
        })
    }

    handleMenuClose = () => {
        this.setState({
            open: false
        })
    }


    render() {
        const { open, categorySearch, productSearch, customerSearch } = this.state
        return (
            <React.Fragment>
                <Helmet>
                    <title>{Helper.getStoreName()} -Galla App</title>
                </Helmet>
                {this.props.isLogged && StoreHelper.isLoggedIn() ?
                    <>
                        <AppBar position="fixed" id='main-header' className="padding-0">
                            <Toolbar>
                                <IconButton title="Menu [Alt+M]" id="menu-icon-btn" edge="start" color="inherit" aria-label="menu" onClick={() => { this.handleMenu() }}>
                                    <MenuIcon />
                                </IconButton>
                                <Grid container direction="row" justify={'space-between'} alignItems="center">
                                    <Grid item xs>
                                        <Typography variant="subtitle1" component="strong" className="font-weight-900">
                                            {this.props.theme.pageTitle}
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} container direction="row">
                                        {categorySearch ?
                                            <Grid item xs className={'position-relative'}>
                                                <Box pr={1}>
                                                    <SearchByCategory />
                                                </Box>
                                            </Grid>
                                            : null}
                                        {productSearch ?
                                            <Grid item xs className={'position-relative'}>
                                                <Box pr={1}>
                                                    <SearchByName />
                                                </Box>
                                            </Grid>
                                            : null}
                                        {customerSearch ?
                                            <Grid item xs>
                                                <Box pr={1}>
                                                    <SearchCustomer />
                                                </Box>
                                            </Grid>
                                            : null}
                                    </Grid>
                                    <Grid item xs>
                                        <Box pr={2} className="align-right-important display-grid">
                                            <Typography variant='body2' component='span' noWrap={true}>
                                                Store : {Helper.getLocationName()}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box pl={2} className="align-right-important">
                                            <Clock />
                                            {/* <IconButton>
                                            <NotificationsNone className={'notification'}/>
                                        </IconButton> */}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                        <Box p={4} />
                        <LeftDrawer open={open} close={() => (this.handleMenuClose())} />
                    </>
                    : <Redirect to={`${process.env.PUBLIC_URL}/login`} />}
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme,
    isLogged: state.isLogged
});
export default connect(mapStateToProps, null)(header)
