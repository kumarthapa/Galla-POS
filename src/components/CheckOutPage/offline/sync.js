import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import StoreHelper from '../../../Helper/storeHelper'
import { Typography } from '@material-ui/core'
import { syncOfflineOrder, removeOfflineOrder } from '../../../redux/action/offlineAction'

class sync extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '',
        }
    }
    componentDidMount() {
        this.handleStartSyncing()
        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
    }

    handleStartSyncing = () => {
        this.timer = setInterval(() => {
            if (StoreHelper.isOnline()) {
                this.setOfflineLabel()
                const { offlineData } = this.props
                if (offlineData.orders.length > 0) {
                    this.syncOfflineOrders()
                }
            } else {
                this.setOfflineLabel()
            }
        }, 60000);
    }

    handleConnectionChange = (event) => {
        if (event.type === "online") {
            console.log("You are now back online.");
            this.setOfflineLabel()
            const { offlineData } = this.props
            if (offlineData.orders.length > 0) {
                this.syncOfflineOrders()
            }
        }
        if (event.type === "offline") {
            console.log("You lost connection.");
            this.setOfflineLabel()
        }
    }

    setOfflineLabel = () => {
        const { offlineData } = this.props
        if (StoreHelper.isOnline()) {
            if (offlineData.orders.length > 0) {
                this.setState({ status: offlineData.orders.length + ' OFFLINE' })
            } else {
                this.setState({ status: '' })
            }
        } else {
            if (offlineData.length > 0) {
                this.setState({ status: offlineData.orders.length + ' OFFLINE' })
            } else {
                this.setState({ status: 'OFFLINE' })
            }
        }
    }

    syncOfflineOrders = () => {
        //Starting loop for pushing offline orders
        let orderTimer = setInterval(() => {
            const { offlineData } = this.props
            if (offlineData.orders.length > 0) {
                this.setState({ status: 'Syncing... ' })
                //taking first order
                var order = offlineData.orders[0]
                this.props.syncOfflineOrder(order)
                    .then(res => res.json())
                    .then(resData => {
                        if (resData.success) {
                            this.props.removeOfflineOrder(0)
                        }
                    })
            } else {
                clearInterval(orderTimer)
                this.setOfflineLabel()
            }
        }, 5000);
    }

    componentWillUnmount() {
        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
    }


    render() {
        const { status } = this.state
        return (
            <div className="status-water-mark">
                <Typography variant="h6" component="span">
                    {status}
                </Typography>
            </div>
        )
    }
}
sync.propTypes = {
    syncOfflineOrder: PropTypes.func.isRequired,
    removeOfflineOrder: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    offlineData: state.offlineData
});
const actions = {
    syncOfflineOrder,
    removeOfflineOrder
};
export default connect(mapStateToProps, actions)(sync)
