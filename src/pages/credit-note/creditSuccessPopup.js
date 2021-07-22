import React, { Component } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button } from '@material-ui/core';
import { HighlightOff, CheckCircle } from "@material-ui/icons";
import { connect } from "react-redux";
import ReactToPrint from 'react-to-print';
import CartHelper from '../../Helper/cartHelper';
import PrintCreditNote from './PrintCreditNote';

class CreditSuccessPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }

    handleInvoice = event => {
        this.setState({
            invoice: event.target.value
        })
    }

    render() {
        const { credit } = this.props
        return (
            <React.Fragment>
                <Dialog open={credit.success} scroll={'body'} className={'dialog'}>
                    <DialogActions>
                        <Avatar onClick={this.props.toggle} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent>
                        <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                            <Grid item xs={12} className={'align-center color-green'}>
                                <CheckCircle />
                            </Grid>
                            <Grid item xs={12} className={'align-center color-green'}>
                                <Typography variant="h5" component="h5">Credit note generated successfully</Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Box className="width-100">
                                    <ReactToPrint
                                        trigger={() => <Button size="large" variant="contained" color="secondary" className={'print-button'} disabled={CartHelper.isEmpty(credit.credData) || CartHelper.isEmpty(credit.crRes)}>PRINT CREDIT NOTE</Button>}
                                        content={() => this.componentRef}
                                    />
                                    <div style={{ display: "none" }}><PrintCreditNote ref={el => (this.componentRef = el)} /></div>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => ({
    credit: state.credit
});

const mapActionsToProps = {

};
export default connect(mapStateToProps, mapActionsToProps)(CreditSuccessPopup)
