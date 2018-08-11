import _ from "lodash"
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
import {dformat} from '../../utilities'
var sformat = require('string-format')
const selectors = makeSelectors("TransactionDataTable");
import { TransactionActionService } from '../../actions/transaction_action';
const ROUTE_URL = "/transactions"

//TODO refactor *URGENT*
//TODO stream data (onSort, onPaginate, onPageSizeIncreased, onFilterIncrased)
const _ActionButtonContainer = ({dispatch, row, history}) => {
    const onRemove = () => {
        const transactionId = row.id
        dispatch(TransactionActionService.setEnabledById(transactionId, false, response => {
            console.log(sformat("SET ENABLE {0} with response: ", transactionId));
            console.log(response);
        }, error => {
            console.log(sformat("REMOVED id={0} FAILED WITH ERROR: ", transactionId));
            console.log(error.response.data.error);
        }));
    }
    let style = {
        'width':'70px',
        'margin-left': '15px'
    }
    let viewStyle= { 'width':'70px' }
    let updateStyle= { 'width':'70px', 'margin-left': '15px' }
    let removeStyle = { 'width':'70px', 'margin-left': '33px' }
    return(
        <Row>
            <Col sm='2'>
                <Link to={sformat("{0}/{1}/view", ROUTE_URL, row.id)}>
                    <Button color="primary" size="sm" style={viewStyle}>View</Button>
                </Link>
            </Col>
            <Col sm='2'>
                <Link to={sformat("{0}/{1}/update", ROUTE_URL, row.id)}>
                    <Button size="sm" color="warning" style={updateStyle}>Update</Button>
                </Link>
            </Col>
            <Col sm='2' >
                <Button color="danger" size="sm" style={removeStyle} onClick={onRemove}>Remove</Button>
            </Col>
        </Row>
    )
}

let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));

const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'title', header: 'title', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'amount', header: 'amount', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'targetDate', header: 'Target Date', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'creatorName', header: 'Creator', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'isNotificationPayment', header: 'Notification', className:"my-data-table-td"},
    {key: 'active', header: 'Active', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class _TransactionDataTable extends React.Component{
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(nextProps){
        // this.setState({users: nextProps.users});
        if (nextProps.filter.length > this.props.filter.length){
            // SEARCH NEXT FILTER TOKEN
            // send request for the data[length-1] and union with initialData
        }

        if (nextProps.tablePageInfo.page > this.props.tablePageInfo.page){
            // SEARCH NEXT PAGE RANGE -> [page*pageSize, (page+1)*pageSize]
        }

        if(nextProps.tablePageInfo.pageSize > this.props.tablePageInfo.pageSize){
            // SEARCH REMAINING INCREASE PAGEZE DIFFERENCE -> [page*pageSize, (page*newPageSize - page*pageSize)]

        }

    }

    render(){
        return(
            <Table {...this.props}
            columns={columns}/>
        )
    }
}

const mapTransactionsToData = (transactions) => {
    return _.map(transactions, (transaction) => {
        return {
            ...transaction,
            targetDate: dformat(new Date(transaction.targetDate), {month_num: true}),
            active: String(transaction.enabled),
            amount: String(transaction.amount),
            creatorName: transaction.creator.username,
            isNotificationPayment: transaction.isNotificationPayment ? "YES" : "NO"
        }
    });
}

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.TransactionDataTable
    }
}

_TransactionDataTable.propTypes = propTypes;
const TransactionDataTable = connect(mapStateToProps)(sematable('TransactionDataTable', _TransactionDataTable, columns, {defaultPageSize: 20}));

export {
    TransactionDataTable,
    mapTransactionsToData
}
