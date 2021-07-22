import React, { Component } from 'react';
import { IconButton, Avatar } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { updatePaymentMode } from '../../../../redux/action/cartAction'
import StoreHelper from '../../../../Helper/storeHelper'

const Styles = theme => ({
    iconButton: {
        margin: theme.spacing(1),
        background: '#ccc',
    },
    iconActive: {
        margin: theme.spacing(1),
        background: '#000',
    }
});


class Walletpayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isActive: 0
        }
    }

    componentDidMount() {
        var isWalletAllowed = StoreHelper.isWalletAllowed();
        if (isWalletAllowed === 1) {
            const walletOptions = JSON.parse(StoreHelper.getWalletOptions());
            if (walletOptions && walletOptions.length > 0) {
                var firstWallet = walletOptions[0]['name']
                this.props.updatePaymentMode(firstWallet);
            }
        }
    }

    handleWallet = (wallet, index) => {
        this.props.updatePaymentMode(wallet);
        this.setState({
            isActive: index
        })
    }

    render() {
        const { classes } = this.props;
        const { isActive } = this.state;
        const walletOptions = JSON.parse(StoreHelper.getWalletOptions());
        const isWalletAllowed = StoreHelper.isWalletAllowed();

        return (
            <>
                {isWalletAllowed === 1 ?
                    <>
                        {walletOptions.map((wallet, index) => (
                            <IconButton className={isActive === index ? classes.iconActive : classes.iconButton} aria-label={wallet.name} onClick={() => this.handleWallet(wallet.name, index)} key={index}>
                                <Avatar alt={wallet.name} src={wallet.icon} />
                            </IconButton>
                        ))}
                    </>
                    : null}
            </>
        )
    }

}

//properties defines
Walletpayment.propTypes = {
    updatePaymentMode: PropTypes.func.isRequired
}
//maping state to props
const mapStateToProps = state => ({
    checkoutData: state.checkoutData
});

export default connect(mapStateToProps, { updatePaymentMode })(withStyles(Styles)(Walletpayment));