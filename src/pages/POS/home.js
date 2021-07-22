import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ProductPannel from '../../components/ProductPage/ProductPannel';
import SelectPannel from '../../components/ProductPage/SelectedProduct'
import Helper from '../../Helper/storeHelper'
import { connect } from "react-redux";
import { pageTitle } from '../../redux/action/themeAction';
import PropTypes from 'prop-types';
import CartHelper from '../../Helper/cartHelper';


class home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            displayNow: false
        }
    }


    componentDidMount() {
        if (CartHelper.isEmpty(this.props.returnData) && !this.props.returnData.success) {
            this.props.pageTitle('New Sale');
        }

        var iterval = setInterval(() => {
            if (Helper.isLoggedIn()) {
                this.setState({
                    displayNow: true
                })
                clearInterval(iterval);
            }
        }, 100)
    }

    render() {
        return (
            <Grid container>
                <Grid item lg={8} md={8} sm={8} xs={12}>
                    {this.state.displayNow ?
                        <ProductPannel />
                        : null
                    }
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={12}>
                    {this.state.displayNow ?
                        <SelectPannel />
                        : null
                    }
                </Grid>
            </Grid>
        )
    }
}
home.propTypes = {
    pageTitle: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    returnData: state.returnData,
});
export default connect(mapStateToProps, { pageTitle })(home)
