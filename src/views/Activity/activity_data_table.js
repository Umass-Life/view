import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors("ActivityDataTable");
import {ActivityActionService} from '../../actions/activity_action';
import RemarkModal from '../RemarkBox/remark_modal';
const util = require('../../utilities')
import _ from "lodash"
const {dformat} = util;
const ROUTE_URL = "/activities"

// id: String(sleep.id),
// dateOfSleep: sleep.dateOfSleep,
// fitbitUserId: sleep.fitbitUserId,
// duration: sleep.duration,
// efficiency: sleep.efficiency,
// endTime: new Date(sleep.endTime),
const columns = [
    {key: 'dateTime', header: 'Time', primaryKey: true,sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'minutesSedentary', header: 'Minutes Sedentary', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'minutesLightlyActive', header: 'Minutes Lightly Active', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'minutesFairlyActive', header: 'Minutes Fairly Active', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'minutesVeryActive', header: 'Minutes Very Active', sortable: true, searchable: true, className:"my-data-table-td"},

]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class _ActivityDataTable extends React.Component{
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

const activitiesToData = (activities) => {
    return _.map(activities, activity => {
        return {
            dateTime: dformat(new Date(activity.dateTime), {month_num: true}),
            minutesSedentary: activity.minutesSedentary,
            minutesLightlyActive: activity.minutesLightlyActive,
            minutesFairlyActive: activity.minutesFairlyActive,
            minutesVeryActive: activity.minutesVeryActive,
        }
    });
}

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.ActivityDataTable,
    }
}

_ActivityDataTable.propTypes = propTypes;
const ActivityDataTable = connect(mapStateToProps)(sematable('ActivityDataTable', _ActivityDataTable, columns, {defaultPageSize: 10, sortKey:"dateTime", sortDirection:"desc"}));
export {
    ActivityDataTable,
    activitiesToData
}
