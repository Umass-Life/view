import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors('RoleDataTable');
import {RoleActionService, ROLE_TYPES} from '../../actions/role_action';

//TODO refactor *URGENT*
//TODO stream data (onSort, onPaginate, onPageSizeIncreased, onFilterIncrased)
const _ActionButtonContainer = ({dispatch, row, history}) => {
    const onRemove = () => {
        const roleId = row.id
        dispatch(RoleActionService.remove(roleId, response => {
            console.log(sformat("REMOVED {0} with response: ", roleId));
            console.log(response);
        }, error => {
            console.log(sformat("REMOVED roleId={0} FAILED WITH ERROR: ", roleId));
            console.log(error.response.data.error);
        }));
    }
    let style = {
        'width':'70px',
        'margin-left': '0px'
    }
    return(
        <Row>
            <Col sm='2' >
                <Button color="danger" size="sm" style={style} onClick={onRemove}>Remove</Button>
            </Col>
        </Row>
    )
}

let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));

const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'name', header: 'Role', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'username', header: 'Username', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'enabled', header: 'Active', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class RoleDataTable extends React.Component{
    constructor(props){
        super(props);
        console.log("ROLE DATA TABLE");
        console.log(this.props);
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
        table: state.sematable.RoleDataTable
    }
}

RoleDataTable.propTypes = propTypes;
export default connect(mapStateToProps)(sematable('RoleDataTable', RoleDataTable, columns, {defaultPageSize: 10}));
