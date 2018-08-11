import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button} from 'reactstrap'
import BalanceDataTable from './balance_data_table';
import {BalanceActionService} from '../../actions/balance_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
const util = require('../../utilities')
import _ from "lodash"
const {dformat} = util;
const sformat = require('string-format')
const tableSelector = makeSelectors("BalanceDataTable");
const COMPONENT_URL = "/balances"

class BalanceComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            balances: []
        }
        this.mapBalanceToData = this.mapBalanceToData.bind(this);
    }

    mapBalanceToData(balances){
        return _.map(balances, balance => {
            return {
                ...balance,
                id: String(balance.id),
                name: balance.name,
                amount: balance.cachedAmount,
                enabled: balance.enabled ? "YES" : "NO",
                latestTransactionTime: balance.latestTransactionId?
                    dformat(new Date(balance.modifiedDate), {pretty: true}) : "-"
            }
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({balances: nextProps.balances});
    }

    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(BalanceActionService.fetchAll(response => {
            console.log("obtaind balances");
            console.log(response);
        },
        error => {
            console.log(error);
            console.log(JSON.stringify(error));
        }));

    }
    render(){
        return (
            <Card>
                <CardBlock>
                    <CardTitle>Balance Management</CardTitle>
                    <hr/>
                    <CardSubtitle>
                    </CardSubtitle>
                    <BalanceDataTable data={this.mapBalanceToData(this.state.balances)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        balances: state.balanceComponent.balances
    }
}

export default connect(mapStateToProps)(BalanceComponent);
