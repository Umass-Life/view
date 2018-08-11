import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
import RemarkModal from '../RemarkBox/remark_modal';
var sformat = require('string-format')
const selectors = makeSelectors('CustomerProfileDataTable');
import {CustomerProfileActionService} from '../../actions/customer_profile_action';

//TODO refactor *URGENT*
//TODO stream data (onSort, onPaginate, onPageSizeIncreased, onFilterIncrased)
const _ActionButtonContainer = ({dispatch, row, history}) => {
    const onRemove = () => {
        const customerProfileId = row.id
        dispatch(CustomerProfileActionService.remove(customerProfileId, response => {}, error => {
            console.log(sformat("REMOVED customerProfileId={0} FAILED WITH ERROR: ", customerProfileId));
            console.log(error.response.data.error);
        }));
    }
    let style = {
        'width':'70px',
        'margin-left': '10px'
    }
    return(
        <Row>
            <Col sm='2' >
                <Button color="primary"
                        size="sm"
                        style={style}
                        onClick={row.toggle}
                        hidden={!row.remark || row.remark.length < 1}>
                    Remark
                </Button>
            </Col>
            <Col sm='2'>
                <Link to={sformat("/customerProfileManagement/customerProfiles/{0}/view", row.id)}>
                    <Button color="primary" size="sm" style={style}>View</Button>
                </Link>
            </Col>
            <Col sm='2'>
                <Link to={sformat("/customerProfileManagement/customerProfiles/{0}/update", row.id)}>
                    <Button size="sm" color="warning" style={style}>Update</Button>
                </Link>
            </Col>
            <Col sm='2' >
                <Button color="danger" size="sm" style={style} onClick={onRemove}>Remove</Button>
            </Col>
        </Row>
    )
}

let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));

const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'name', header: 'Name', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'phoneNumber', header: 'Phone Number', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'citizenId', header: 'Citizen Id', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'enabled', header: 'Active', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class CustomerProfileDataTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal: false
        }
        this.toggle  = this.toggle.bind(this);
    }
    toggle(){
        this.setState({modal: !this.state.modal});
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.data.length > 0) {
            _.forEach(nextProps.data, x => {
                x.toggle = () => this.setState({remark: x.remark, modal: !this.state.modal}) ;
            })
        }
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
            <div>
            <Table {...this.props}
            columns={columns}/>
            <RemarkModal className="RoomRemark" toggle={this.toggle} modal={this.state.modal} remark={this.state.remark}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.CustomerProfileDataTable
    }
}

CustomerProfileDataTable.propTypes = propTypes;
export default connect(mapStateToProps)(sematable('CustomerProfileDataTable', CustomerProfileDataTable, columns, {defaultPageSize: 10}));
