import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Tabs, Tab } from '@material-ui/core';
import 'date-fns';
import GiftCards from "./GiftCards"
import Sales from "./Sales"



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            className="width-100 tabpanel"
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} className="background-white">
                    {children}
                </Box>
            )}
        </div>
    );
}

class index extends Component {

    constructor(props) {
        super(props)

        this.state = {
            activeTab: "GIFTCARDS",
        }
    }

    handleChange = (event, value) => {
        this.setState({
            activeTab: value
        })
    };

    render() {
        const { activeTab } = this.state
        return (
            <Box p={3} className="height-100-overflow">
                <div className="display-flex">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={activeTab}
                        onChange={this.handleChange}
                        aria-label="Vertical tabs example"
                        className="background-lite-gray"
                    >
                        <Tab label="GIFTCARDS" value="GIFTCARDS" />
                        <Tab label="SALES" value="SALES" />
                        {/* <Tab label="REWARDS" value={2} /> */}
                    </Tabs>
                    <TabPanel value="GIFTCARDS" index={activeTab}>
                        <GiftCards />
                    </TabPanel>
                    <TabPanel value="SALES" index={activeTab}>
                        <Sales />
                    </TabPanel>
                    {/* <TabPanel value={2} index={activeTab}>
                            Item Three
                        </TabPanel> */}
                </div>
            </Box>
        )
    }
}

export default withRouter(index)