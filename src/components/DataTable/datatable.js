import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors('UserDataTable');

//TODO refactor *URGENT*
//TODO stream data (onSort, onPaginate, onPageSizeIncreased, onFilterIncrased)
class _ActionButtonContainer extends React.Component{
    render(){
        let style = {
            'width':'70px',
            'margin-left': '10px'
        }
        return(
            <Row>
                <Col sm='2'>
                    <Link to={sformat("/userManagement/users/{0}/view",this.props.row.id)}>
                        <Button color="primary" size="sm" style={style}>View</Button>
                    </Link>
                </Col>
                <Col sm='2'>
                    <Link to={sformat("/userManagement/users/{0}/update", this.props.row.id)}>
                        <Button size="sm" color="warning" style={style}>Update</Button>
                    </Link>
                </Col>
                <Col sm='2' >
                    <Button color="danger" size="sm"  style={style}>Remove</Button>
                </Col>
            </Row>
        )
    }
}

let ActionButtonContainer = _ActionButtonContainer;

const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'username', header: 'Username', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'password', header: 'Password',className:"my-data-table-td"},
    {key: 'roles', header: 'Roles', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'enabled', header: 'Active', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class UserDataTable extends React.Component{
    constructor(props){
        super(props);
        // props.name, props.data, props.
        this.state = {
            name: props.name

        }

    }
    componentWillReceiveProps(nextProps){
        // this.setState({users: nextProps.users});
        if (nextProps.filter.length > this.props.filter.length){
            // SEARCH NEXT FILTER TOKEN
            // send request for the data[length-1] and union with initialData
            // nextProps.onNewData([...nextProps.table.initialData, {id: 99, username:'kkk', password:'123', roles:'ADMIN', enabled:'true'}]);
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
        table: state.sematable.UserDataTable
    }
}

UserDataTable.propTypes = propTypes;
export default connect(mapStateToProps)(sematable('UserDataTable', UserDataTable, columns));
