import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
import {UserActionService} from '../../actions/user_action';
import {FetchService} from '../../actions/fetch_action';
var sformat = require('string-format')
const selectors = makeSelectors('UserDataTable');

const _ActionButtonContainer = ({dispatch, row, history}) => {
    let style = {
        'width':'75px',
        'margin-left': '5px'
    }
    const selectUser = (row) => {
        return (() => {
            dispatch(UserActionService.selectSessionUserbyFitbitId(row.fitbitId))
        });
    }

    const fetchData = (path, fid) => {
        return () => {
            const tail = sformat("/{0}/fetch-api?fid={1}&save=true&from=2018-07-30", path, fid)
            dispatch(FetchService.fetch(tail, (response) => {
                console.log('200 OK: ' + path)
                console.log(response.data);

            }, (err) => {
                alert("error");
                console.log(err);
            }));
        }
    }

    const renew = (id) => {
        const path = '/users/renew?id='+id;
        return () => {
            dispatch(FetchService.post(path, (response) => {
                console.log('200 OK: ' + path)
                console.log(response.data);

            }, (err) => {
                alert("error");
                console.log(err);
            }));
        }
    }

    return (
        <Row>
            <Col sm='2' >
                <Button color="warning" size="sm" style={style} disabled={row.isSelected} onClick={selectUser(row)}>
                    {row.isSelected ? "Selected" : "Select"}
                </Button>
            </Col>
            <Col sm='2' >
                <Button color="primary" size="sm" style={style} onClick={fetchData('activities', row.fitbitId)}>
                    Aggr
                </Button>
            </Col>
            <Col sm='2' >
                <Button color="primary" size="sm" style={style} onClick={fetchData('activities/intraday', row.fitbitId)}>
                    Intr
                </Button>
            </Col>
            <Col sm='2' >
                <Button color="primary" size="sm" style={style} onClick={fetchData('sleep', row.fitbitId)}>
                    Slp
                </Button>
            </Col>
            <Col sm='2' >
                <Button color="primary" size="sm" style={style} onClick={fetchData('hr',row.fitbitId)}>
                    Hrt
                </Button>
            </Col>
            <Col sm='2' >
                <Button color="primary" size="sm" style={style} onClick={renew(row.id)}>
                    Renew
                </Button>
            </Col>
        </Row>
    )
}

/*
<Col sm='3'>
    <Link to={sformat("/userManagement/users/{0}/view", row.id)}>
        <Button color="primary" size="sm" style={style}>View</Button>
    </Link>

*/

let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));

const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'fitbitId', header: 'Fitbit ID', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'displayName', header: 'Name', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'gender', header: 'Gender', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'memberSince', header: 'Registered', sortable: true, searchable: true, className:"my-data-table-td"},
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
            <Table {...this.props} columns={columns}/>
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
export default connect(mapStateToProps)(sematable('UserDataTable', UserDataTable, columns, {defaultPageSize: 10}));
