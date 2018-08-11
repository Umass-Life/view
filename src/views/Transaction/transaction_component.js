import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button} from 'reactstrap'
import { TransactionDataTable, mapTransactionsToData } from './transaction_data_table';
import { TransactionActionService } from '../../actions/transaction_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
const util = require('../../utilities')
import _ from "lodash"
const {dformat} = util;
const sformat = require('string-format')
const tableSelector = makeSelectors("TransactionDataTable");
const COMPONENT_URL = "/transactions"

class TransactionComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            transactions: []
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            transactions: nextProps.transactions
        })
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(TransactionActionService.fetchAll(response => {},
        error => {
            console.log(JSON.stringify(error));
        }));
    }

    render(){
        return(
            <Card>
                <CardBlock>
                    <CardTitle>Transaction Management</CardTitle>
                    <hr/>
                    <CardSubtitle>
                        <Link to={sformat("{0}/create", COMPONENT_URL)}><Button outline color="primary">Create</Button></Link>
                    </CardSubtitle>
                    <TransactionDataTable data={mapTransactionsToData(this.state.transactions)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        transactions: state.transactionComponent.transactions
    };
}

export default connect(mapStateToProps)(TransactionComponent)
