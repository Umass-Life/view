import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors("HeartrateDataTable");
import {HeartrateActionService} from '../../actions/heartrate_action';
import RemarkModal from '../RemarkBox/remark_modal';
const util = require('../../utilities')
const {dformat, formatDateDay, msToHours, truncateDecimal} = util;
import _ from "lodash"
const ROUTE_URL = "/contracts"

// id: String(sleep.id),
// dateOfSleep: sleep.dateOfSleep,
// fitbitUserId: sleep.fitbitUserId,
// duration: sleep.duration,
// efficiency: sleep.efficiency,
// endTime: new Date(sleep.endTime),
const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'dateTime', header: 'Time', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'restingHeartRate', header: 'Resting-HR', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'fatBurn', header: 'Fat Burn (kcal/min)', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'peak', header: 'Peak (kcal/min)', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'cardio', header: 'Cardio (kcal/min)', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'outOfZone', header: 'Out Of Zone (kcal/min)', sortable: true, searchable: true, className:"my-data-table-td"}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class _HeartrateDataTable extends React.Component{
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

const getHRZone = (zones, zone_key) => _.find(zones, (x) => x['name'] == zone_key)

const getCal = (zone) => {
    if (zone && zone.caloriesOut){

        return zone.caloriesOut
    }
    return 0.0;
}

const getMin = (zone) => {
    if (zone && zone.minutes){
        return zone.minutes
    }
    return 0;
}

const zoneDataToString = (cal, min) => sformat("{0} / {1}", truncateDecimal(cal), min);

const heartratesToData = (heartrates) => {
    return _.map(heartrates, heartrate => {
        var zones = heartrate.heartRateZones ? heartrate.heartRateZones : [];
        var p = getHRZone(zones, "Peak");
        var c = getHRZone(zones, "Cardio");
        var f = getHRZone(zones, "Fat Burn");
        var o = getHRZone(zones, "Out of Range");
        var peakCal = getCal(p);
        var peakMin = getMin(p);
        var fatCal = getCal(f);
        var fatMin =  getMin(f);
        var cardioCal = getCal(c);
        var cardioMin =  getMin(c);
        var outCal = getCal(o);
        var outMin =  getMin(o);
        return {
            id: heartrate.id,
            dateTime: dformat(new Date(heartrate.dateTime), {month_num: true}),
            cardio: zoneDataToString(cardioCal, cardioMin),
            fatBurn: zoneDataToString(fatCal, fatMin),
            outOfZone: zoneDataToString(outCal, outMin),
            peak: zoneDataToString(peakCal, peakMin),
            restingHeartRate: heartrate.restingHeartRate ? heartrate.restingHeartRate : 0
        }
    });
}

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.HeartrateDataTable,
    }
}

_HeartrateDataTable.propTypes = propTypes;
const HeartrateDataTable = connect(mapStateToProps)(sematable('HeartrateDataTable', _HeartrateDataTable, columns, {defaultPageSize: 10, sortKey: 'id', sortDirection: 'desc'}));
export {
    HeartrateDataTable,
    heartratesToData
}
