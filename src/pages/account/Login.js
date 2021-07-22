import React, { Component } from 'react'
import { Typography, Box, Grid, Card, CardMedia, Fade, Button, TextField } from '@material-ui/core'
import Helper from '../../Helper/storeHelper'
import CartHelper from '../../Helper/cartHelper'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoogedIn, LogInNow, clearStoreData, loadtStoreData, resetAllData } from '../../redux/action/isLoggedInAction';
import { loading, alert, resetInteraction } from '../../redux/action/InterAction';
import { toogleLocationPopup, clearCounterData } from '../../redux/action/storeCounterAction';
import { saveDenomination } from '../../redux/action/openCloseRegisterAction';
import { clearProducts } from '../../redux/action/productsAction';
import Cookies from 'universal-cookie';
import BannerImage from './Fete-POS-Login-Home-Banner.png'
import { Helmet } from "react-helmet";

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            current_counter: 'counter 1',
            username_error: false,
            password_error: false,
            //counter_error:false,
            isStoreLoaded: false,
            phone: '',
            storeCode: '',
            phone_error: false,
            storecode_error: false,
            bannerLoaded: false
        }
    }

    componentDidMount() {
        this.props.clearCounterData();
        this.props.clearProducts();
        this.props.resetInteraction();
        this.props.clearStoreData();
        if (Helper.getStoreApiUrl() && Helper.getStoreName()) {
            this.setState({
                isStoreLoaded: true
            })
        }
        //console.log(BannerImage)
    }

    handleUsername = event => {
        //console.log(event.target.value);
        this.setState({
            username: event.target.value
        })
    }


    handlePassword = event => {
        //console.log(event.target.value);
        this.setState({
            password: event.target.value
        })
    }

    handleCounter = event => {

        //console.log(event.target.value);
        this.setState({
            current_counter: event.target.value
        })
    }

    handlePhone = event => {
        this.setState({
            phone: event.target.value
        })
    }

    handleStoreCode = event => {
        this.setState({
            storeCode: event.target.value
        })
    }




    handleSubmit = event => {
        event.preventDefault();
        if (this.state.username === '') {
            this.setState({ username_error: true });
            return;
        } else if (this.state.password === '') {
            this.setState({ password_error: true });
            return;
        } else {
            this.setState({ username_error: false, password_error: false });
            this.props.loading(true);
        }

        let formData = {
            username: this.state.username,
            pwd: btoa(this.state.password)
        }

        this.props.LogInNow(formData);
    }

    validateStore = (event) => {
        event.preventDefault();
        const { phone, storeCode } = this.state
        var formData = {}
        formData.phone = phone
        formData.store_code = storeCode
        this.props.loading(true);
        this.props.loadtStoreData(formData)
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    const cookies = new Cookies();
                    const expiryDate = new Date()
                    expiryDate.setMonth(expiryDate.getMonth() + 12)
                    cookies.set('url', resData.data.url, { path: `${process.env.PUBLIC_URL}/`, expires: expiryDate });
                    cookies.set('store_name', resData.data.storename, { path: `${process.env.PUBLIC_URL}/`, expires: expiryDate });
                    this.setState({
                        isStoreLoaded: true
                    })
                    this.props.loading(false);
                } else {
                    this.props.loading(false);
                    this.props.alert(true, resData.message);
                }
            })
    }

    componentDidUpdate() {
        //console.log(storeData)
        const storeData = this.props.store_data.data;
        if (!CartHelper.isEmpty(storeData)) {
            if (storeData.success) {
                var response = this.props.store_data;
                this.props.isLoogedIn(true);
                Helper.setThisDataInSession('islogin', 'yes');
                Helper.setThisDataInSession('sales_counter', this.state.current_counter);
                Helper.setAllDataInSession('user', response.data.data);
                Helper.setAllDataInSession('configs', response.data.configs);
                //Helper.setThisDataInSession('user_data', JSON.stringify(response.data.data));
                //Helper.setThisDataInSession('config_data', JSON.stringify(response.data.configs));
                var denominationsArray = []
                var denominationsData = response.data.configs.denominations.split(',');
                if (denominationsData.length > 0) {
                    denominationsData.forEach((data) => {
                        var denom = {}
                        denom.denom = Number(data);
                        denom.count = 0
                        denom.total = 0;
                        denominationsArray.push(denom);
                    })
                }
                this.props.saveDenomination(denominationsArray);
                Helper.setThisDataInSession('salesexes', JSON.stringify(response.data.salesexes));
                this.props.loading(false);
                this.toogleLocationPopup();
                this.props.history.push(`${process.env.PUBLIC_URL}/`);
            } else {
                this.props.loading(false);
                this.props.alert(true, this.props.store_data.data.msg);
                this.props.clearStoreData();
            }
        }
    }

    onLoad = (event) => {
        //console.log(event)
        this.setState({
            bannerLoaded: true
        })
    }

    toogleLocationPopup = () => {
        const { store_counters } = this.props
        const locationId = Number(Helper.getLocationId())
        const location = store_counters.location.location
        if (!locationId && CartHelper.isEmpty(location)) {
            this.props.toogleLocationPopup(true);
        }
    }

    changeStore = () => {
        const cookies = new Cookies();
        cookies.remove('url', { path: `${process.env.PUBLIC_URL}/` });
        cookies.remove('store_name', { path: `${process.env.PUBLIC_URL}/` });
        this.props.resetAllData();
        this.setState({
            isStoreLoaded: false
        })
    }

    render() {

        const { username, password, username_error, password_error, isStoreLoaded, phone, phone_error, storeCode, storecode_error, bannerLoaded } = this.state
        return (
            <React.Fragment>
                <Helmet>
                    <title>{Helper.getStoreName()} -Galla App</title>
                </Helmet>
                {!bannerLoaded ?
                    <Box component="div" className="loader-container position-absolute">
                        <Box component="div" className="loader"></Box>
                        <Box component="div" className="loader-text">Loading...</Box>
                    </Box>
                    : null
                }
                <Fade in={bannerLoaded} timeout={3000}>
                    <Box component="div" className="login-container">
                        <Box className="height-100">
                            <Grid container direction="row" justify="space-between" alignItems="center" className="height-100" >
                                <Grid item xs={12} sm={5} md={8} lg={9} className="login-container height-100">
                                    <Card className="login-container height-100 no-border-radius">
                                        <CardMedia
                                            overlay={'Hi..'}
                                            image={BannerImage}
                                            title="Fete Banner"
                                            className="login-container height-100"

                                        />
                                        <img onLoad={this.onLoad} src={BannerImage} style={{ display: "none" }} alt="Fete Banner" />
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={7} md={4} lg={3} className="login-container height-100">
                                    {isStoreLoaded ?
                                        <Box p={3} className="login-container height-100 background-white">
                                            <Grid container direction="row" justify="space-between" alignItems="center" className="height-100" >
                                                <form onSubmit={this.handleSubmit} noValidate autoComplete="on">
                                                    <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                        <Grid item xs={12} className="avatar-container-login">
                                                            <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                                <Typography variant="h6" component="strong" >{Helper.getStoreName()}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                error={username_error}
                                                                id="username"
                                                                type="text"
                                                                label="Username"
                                                                margin="normal"
                                                                className="width-100"
                                                                value={username}
                                                                onChange={this.handleUsername}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                error={password_error}
                                                                id="password"
                                                                type="password"
                                                                label="Password"
                                                                margin="normal"
                                                                className="width-100"
                                                                value={password}
                                                                onChange={this.handlePassword}
                                                                variant="outlined"
                                                            />
                                                            <Box p={1} />
                                                        </Grid>
                                                        <Grid item container xs={12} justify="space-between" alignItems="center">
                                                            <Grid item>
                                                                {/* <Button type="button" size="small" variant="contained" color="secondary" className="color-white" onClick={() => this.changeStore()}>
                                                                    Change Store
                                                                </Button> */}
                                                            </Grid>
                                                            <Grid item>
                                                                <Button type="submit" size="large" variant="contained" color="secondary" className="">
                                                                    Login
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </Grid>
                                        </Box>
                                        :
                                        <Box p={3} className="login-container height-100 background-white">
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-between"
                                                alignItems="center"
                                                className="height-100"
                                            >
                                                <form onSubmit={this.validateStore} noValidate autoComplete="on">
                                                    <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                        {/* <Grid item xs={12} className="avatar-container-login">
                                                            <Grid container direction="row" justify="center" alignItems="center" spacing={0}
                                                            >
                                                                <img alt="FETE Logo" src={`https://feteon-content.s3.ap-south-1.amazonaws.com/Feteon.png`} className="fete-logo-icon" />
                                                            </Grid>
                                                        </Grid> */}
                                                        <Grid item xs={12} className="avatar-container-login">
                                                            <Grid container direction="row" justify="center" alignItems="center" spacing={0}>
                                                                <Typography variant="h6" component="strong" >Galla</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                error={phone_error}
                                                                id="phone"
                                                                type="text"
                                                                label="Phone"
                                                                margin="normal"
                                                                className="width-100"
                                                                value={phone}
                                                                onChange={this.handlePhone}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                error={storecode_error}
                                                                id="storecode"
                                                                type="text"
                                                                label="Store Code"
                                                                margin="normal"
                                                                className="width-100"
                                                                value={storeCode}
                                                                onChange={this.handleStoreCode}
                                                                variant="outlined"
                                                            />
                                                            <Box p={1} />
                                                        </Grid>
                                                        <Grid item container xs={12} justify="flex-end">
                                                            <Button type="submit" size="large" variant="contained" color="secondary" className="">
                                                                Validate
                                                    </Button>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </Grid>
                                        </Box>
                                    }
                                    <Box className="absolute display-flex align-item-baseline right-15 bottom-15 galla-app-logo-box">
                                        <img alt="FETE Logo" src={`https://galla.app/wp-content/uploads/2020/11/Galla-Web-Logo-2.png`} className="fete-logo-icon" />
                                        {/* <span className="partner-text">partnered</span>
                                        <img alt="Softomation-Logo" src={`${process.env.PUBLIC_URL}/assets/images/Softomation-Logo.jpg`} className="partner-logo-icon" width="100" /> */}
                                    </Box>

                                </Grid>

                            </Grid>
                        </Box>
                    </Box>
                </Fade>
            </React.Fragment>
        )
    }
}

Login.propTypes = {
    loadtStoreData: PropTypes.func.isRequired,
    LogInNow: PropTypes.func.isRequired,
    clearStoreData: PropTypes.func.isRequired,
    isLoogedIn: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    resetInteraction: PropTypes.func.isRequired,
    saveDenomination: PropTypes.func.isRequired,
    resetAllData: PropTypes.func.isRequired,
    toogleLocationPopup: PropTypes.func.isRequired,
    clearCounterData: PropTypes.func.isRequired,
    clearProducts: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    store_counters: state.storeCounter,
    store_data: state.storeData
});


export default connect(mapStateToProps, { loadtStoreData, isLoogedIn, LogInNow, clearStoreData, loading, alert, resetInteraction, saveDenomination, resetAllData, toogleLocationPopup, clearCounterData, clearProducts })(Login);
