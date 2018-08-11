import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors("SleepDataTable");
import {SleepActionService} from '../../actions/sleep_action';
import RemarkModal from '../RemarkBox/remark_modal';
const util = require('../../utilities')
import _ from "lodash"
const {dformat} = util;


const _ActionButtonContainer = ({dispatch, row, history}) => {
    let style = {
        'width':'80px'
    }
    return (
        <Row>
            <Col sm='3'>
                <Link to={sformat("sleep/{0}/view", row.id)}>
                    <Button color="primary" size="sm" style={style}>View</Button>
                </Link>
            </Col>
        </Row>
    )
}

let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));

// id: String(sleep.id),
// dateOfSleep: sleep.dateOfSleep,
// fitbitUserId: sleep.fitbitUserId,
// duration: sleep.duration,
// efficiency: sleep.efficiency,
// endTime: new Date(sleep.endTime),
const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'fitbitUserId', header: 'Owner', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'dateOfSleep', header: 'Date', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'duration', header: 'Length', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'efficiency', header: 'Quality', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'endTime', header: 'End', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Actions", Component: ActionButtonContainer}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class _SleepDataTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            remark: "",
            modal: false
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        this.setState({modal: !this.state.modal})
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
            <Table {...this.props} columns={columns}/>

            </div>
        )
    }
    //<RemarkModal className="ContractRemark" toggle={this.toggle} modal={this.state.modal} remark={this.state.remark}/>
}

const sleepToData = (sleepList) => {
    var newSleepList = _.map(sleepList, sleep => {
        return {
            id: String(sleep.id),
            dateOfSleep: sleep.dateOfSleep,
            fitbitUserId: sleep.fitbitUserId,
            duration: new String(sleep.duration/6000),
            efficiency: sleep.efficiency,
            endTime: dformat(new Date(sleep.endTime))
        }
    });
    return newSleepList
}

const mapStateToProps = state => {

    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.SleepDataTable,
    }
}

_SleepDataTable.propTypes = propTypes;
const SleepDataTable = connect(mapStateToProps)(sematable('SleepDataTable', _SleepDataTable, columns, {defaultPageSize: 50}));
export {
    SleepDataTable,
    sleepToData
}
