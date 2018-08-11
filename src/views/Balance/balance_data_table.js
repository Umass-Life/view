import _ from "lodash"
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors("BalanceDataTable");
import { TransactionAction } from '../../actions/balance_action';
const ROUTE_URL = "/balances"

//TODO refactor *URGENT*
//TODO stream data (onSort, onPaginate, onPageSizeIncreased, onFilterIncrased)
const _ActionButtonContainer = ({dispatch, row, history}) => {
    let viewStyle= { 'width':'70px' }
    let updateStyle= { 'width':'70px', 'margin-left': '15px' }
    let paymentStyle = {'width':'104px', 'margin-left': '33px'}
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
                <Link to={sformat("/transactions/create?balanceId={0}", row.id)}>
                    <Button outline color="primary" size="sm" style={paymentStyle}>Add Payment</Button>
                </Link>
            </Col>

        </Row>
    )
}

let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));

const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'name', header: 'name', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'cachedAmount', header: 'Amount', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'state', header: 'State', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'latestTransactionTime', header: 'Latest Transaction', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class BalanceDataTable extends React.Component{
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

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.TransactionDataTable
    }
}

BalanceDataTable.propTypes = propTypes;
export default connect(mapStateToProps)(sematable('BalanceDataTable', BalanceDataTable, columns, {defaultPageSize: 20}));
