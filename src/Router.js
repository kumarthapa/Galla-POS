import React, { Component } from 'react';
//import { Box } from '@material-ui/core';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Login from './pages/account/Login';
import Index from './pages/POS/home';
import Helper from './Helper/storeHelper'
import Header from './components/theme/header';
import Footer from './components/theme/footer';

import OpenRegister from './pages/OpenCloseRegister/openRegister';
import CloseRegister from './pages/OpenCloseRegister/closeRegister';
import SuspendedSale from './pages/suspended'
import Help from './pages/help'
import SalesRecord from './pages/sales-record'
import StockRequest from './pages/stock-request'
import Cancelinvoice from './pages/cancel-invoice'
import Contactus from './pages/contact-us'
import CreditNote from './pages/credit-note'
import CreditHistory from './pages/credit-history'
import CustomerHistory from './pages/customer-history'
import CompleteReturn from './pages/complete-return'


class Router extends Component {
    render() {
        return (
            <BrowserRouter basename={`/`}>
                <Header />
                <Route exact path={`${process.env.PUBLIC_URL}/`} component={Index} />
                <Route path={`${process.env.PUBLIC_URL}/login`} component={Login} />
                <Route path={`${process.env.PUBLIC_URL}/openregister`} component={OpenRegister} />
                <Route path={`${process.env.PUBLIC_URL}/closeregister`} component={CloseRegister} />
                <Route path={`${process.env.PUBLIC_URL}/suspended`} component={SuspendedSale} />
                <Route path={`${process.env.PUBLIC_URL}/help`} component={Help} />
                <Route path={`${process.env.PUBLIC_URL}/salesrecord`} component={SalesRecord} />
                <Route path={`${process.env.PUBLIC_URL}/stockrequest`} component={StockRequest} />
                <Route path={`${process.env.PUBLIC_URL}/cancelinvoice`} component={Cancelinvoice} />
                <Route path={`${process.env.PUBLIC_URL}/contactus`} component={Contactus} />
                <Route path={`${process.env.PUBLIC_URL}/creditnote`} component={CreditNote} />
                <Route path={`${process.env.PUBLIC_URL}/credit-history`} component={CreditHistory} />
                <Route path={`${process.env.PUBLIC_URL}/customer-history`} component={CustomerHistory} />
                <Route path={`${process.env.PUBLIC_URL}/complete-return`} component={CompleteReturn} />
                <Footer />
                {!Helper.isLoggedIn() ?
                    <Redirect to={`${process.env.PUBLIC_URL}/login`} /> : null
                }
            </BrowserRouter>
        )
    }

}

export default Router