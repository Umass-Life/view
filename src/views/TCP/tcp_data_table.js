import _ from "lodash"
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
import {dformat} from '../../utilities'
var sformat = require('string-format')
const selectors = makeSelectors("TCPDataTable");
import { TCPActionService } from '../../actions/tcp_action';
const ROUTE_URL = "/policies"

//TODO stream data (onSort, onPaginate, onPageSizeIncreased, onFilterIncrased)
const _ActionButtonContainer = ({dispatch, row, history}) => {
    const onRemove = () => {
        const policyId = row.id
        dispatch(TCPActionService.setEnabledById(policyId, false, response => {
            console.log(sformat("SET ENABLE {0} with response: ", policyId));
            console.log(response);
        }, error => {
            console.log(sformat("REMOVED id={0} FAILED WITH ERROR: ", policyId));
            console.log(error.response.data.error);
        }));
    }
    // let viewStyle= { 'width':'70px' }
    // let updateStyle= { 'width':'70px', 'margin-left': '15px' }
    // let removeStyle = { 'width':'70px', 'margin-left': '33px' }

    let viewStyle= {}
    let updateStyle= {'margin-top': '5px' }
    let removeStyle = {'margin-top': '5px' }
    return(
        <div>
        <Row>
            <Col sm='2'>
                <Link to={sformat("{0}/{1}/view", ROUTE_URL, row.id)}>
                    <Button color="primary" size="sm" style={viewStyle}>View</Button>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col sm='2'>
                <Link to={sformat("{0}/{1}/update", ROUTE_URL, row.id)}>
                    <Button size="sm" color="warning" style={updateStyle}>Update</Button>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col sm='2' >
                <Button color="danger" size="sm" style={removeStyle} onClick={onRemove}>Remove</Button>
            </Col>
        </Row>
        </div>
    )
}

let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));

const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'title', header: 'Title', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'constant', header: 'Value', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'policyType', header: 'Policy Type', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'transactionType', header: 'Transaction Type', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'renewPeriod', header: "Renew Period", className:"my-data-table-td"},
    {key: 'activeFrequency', header: "Active Length", className:"my-data-table-td"},
    {key: 'active', header: 'Active', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class _TCPDataTable extends React.Component{
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

const mapPolicyToData = (policies) => {
    return _.map(policies, (policy) => {
        return {
            ...policy,
            value: policy.isNegative ? String(-1*policy.constant) : String(policy.constant),
            active: String(policy.enabled),
            activeFrequency: String(policy.activeFrequency)
        }
    });
}

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.TCPDataTable
    }
}

_TCPDataTable.propTypes = propTypes;
const TCPDataTable = connect(mapStateToProps)(sematable('TCPDataTable', _TCPDataTable, columns, {defaultPageSize: 20}));

export {
    TCPDataTable,
    mapPolicyToData
}
