import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import moment from 'moment'
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col, UncontrolledTooltip} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
import {UserActionService} from '../../actions/user_action';
import {FetchService} from '../../actions/fetch_action';
const util = require('../../utilities')
const {dformat, formatDateDay} = util;
var sformat = require('string-format')
const selectors = makeSelectors('UserDataTable');
const FETCH_INTRA = "activities/intraday"
const FETCH_AGGR = "activities"
const FETCH_HRT = "hr"
const FETCH_SLP = "sleep"

const INTRA_NAME = "Intra"
const AGGR_NAME = "Aggr"
const HRT_NAME = "Hrt"
const SLP_NAME = "Slp"


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
            const tail = sformat("/{0}/fetch-api?fid={1}&save=true", path, fid)
            dispatch(FetchService.fetch(tail, (response) => {
                console.log('200 OK: ' + path)
                console.log(response.data);

            }, (err) => {
                alert("error");
                console.log(err);
            }, {id: path+"_"+fid}));
        }
    }

    const renderName = (name) => {
        if (row.fetchState && row.fetchState.id){
            const code = row.fetchState.id;
            const items = code.split("_");
            if (items && items.length==2){
                const path = items[0];
                const fid = items[1];
                if (fid == row.fitbitId){
                    // current row is being fetched.
                    const a = path == FETCH_INTRA && name == INTRA_NAME;
                    const b = path == FETCH_AGGR && name == AGGR_NAME;
                    const c = path == FETCH_SLP && name == SLP_NAME;
                    const d = path == FETCH_HRT && name == HRT_NAME
                    if (a || b || c || d){
                        if (row.fetchState.isRequesting){
                            return "load"
                        }
                    }
                }
            }
        }
        return name;
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
    const isBefore = (date_string) => {
        if (!date_string) return true;
        const now_moment = moment(moment().format("YYYY-MM-DD")); // get today at 00:00:00 otherwise will give exact time.
        const date_moment = moment(date_string);
        // console.log(sformat("{0} before {1}", date_moment, now_moment))
        return date_moment.isBefore(now_moment);
    }

    const getAggreButtonColor = () => {
        const toDate = (type) => {
            const latestInfo = row.latestAggregateInfo ;
            return latestInfo && latestInfo[type] ? formatDateDay(latestInfo[type].dateTime) : null;
        }
        const AGGREGATE_KEYS = ['steps', 'calories', 'elevation', 'floors', 'distance', 'minutesSedentary',
                                'minutesLightlyActive', 'minutesFairlyActive', 'minutesVeryActive'];

        const _isBefore =  _.chain(AGGREGATE_KEYS)
                .map(KEY => isBefore(toDate(KEY)))
                .reduce((bool_a, bool_b) => bool_a || bool_b)
                .value();
        return _isBefore ? "warning" : "success";
    }

    const getIntraButtonColor = () => {
        const INTRA_KEYS = ['steps','calories','elevation','floors','distance'];
        const toDate = (type) => {
            const latestInfo = row.latestIntradayInfo ;
            return latestInfo && latestInfo[type] ? formatDateDay(latestInfo[type].dateTime) : null;
        }

        const _isBefore =  _.chain(INTRA_KEYS)
                .map(KEY => {
                    const _isBefore = isBefore(toDate(KEY));
                    return _isBefore
                })
                .reduce((bool_a, bool_b) => bool_a || bool_b)
                .value();
        return _isBefore ? "warning" : "success";
    }

    const getHrButtonColor = () => {
        const latestDate = row.latestHr && row.latestHr.dateTime ?
                        formatDateDay(row.latestHr.dateTime) : null;
        return isBefore(latestDate) ?  "warning" : "success";
    }

    const getSleepButtonColor = () => {
        const latestDate = row.latestSleep && row.latestSleep.dateOfSleep ?
                        formatDateDay(row.latestSleep.dateOfSleep) : null;
        return isBefore(latestDate) ?  "warning" : "success";
    }

    const renderLatestAggr = () => {
        const AGGREGATE_KEYS = ['steps', 'calories', 'elevation', 'floors', 'distance', 'minutesSedentary',
                                'minutesLightlyActive', 'minutesFairlyActive', 'minutesVeryActive'];
        const toDate = (type) => {
            const latestInfo = row.latestAggregateInfo ;
            return latestInfo && latestInfo[type] ? formatDateDay(latestInfo[type].dateTime) : '-';
        }
        const steps = toDate('steps')
        const calories = toDate('calories')
        const elevation = toDate('elevation')
        const floors = toDate('floors')
        const distance = toDate('distance')
        const minutesSedentary = toDate('minutesSedentary')
        const minutesLightlyActive = toDate('minutesLightlyActive')
        const minutesFairlyActive = toDate('minutesFairlyActive')
        const minutesVeryActive = toDate('minutesVeryActive')

        return (<div>
            <div>steps: {steps}</div>
            <div>calories: {calories}</div>
            <div>elevation: {elevation}</div>
            <div>distance: {distance}</div>
            <div>sedentary: {minutesSedentary}</div>
            <div>light: {minutesLightlyActive}</div>
            <div>fair: {minutesFairlyActive}</div>
            <div>very: {minutesVeryActive}</div>
            </div>)
    }

    const renderLatestIntra = () => {
        const toDate = (type) => {
            const latestInfo = row.latestIntradayInfo;
            return latestInfo && latestInfo[type] ? formatDateDay(latestInfo[type].dateTime) : '-';
        }
        const steps = toDate('steps');
        const calories = toDate('calories');
        const elevation = toDate('elevation');
        const floors = toDate('floors');
        const distance = toDate('distance');
        const heart = toDate('heart');

        return (<div>
            <div>steps: {steps}</div>
            <div>calories: {calories}</div>
            <div>elevation: {elevation}</div>
            <div>distance: {distance}</div>
            <div>heart: {heart}</div>
            </div>)

    }
    const renderLatestHr = () => {
        return row.latestHr && row.latestHr.dateTime ?
                        sformat('heartrate: {0}', formatDateDay(row.latestHr.dateTime)) : '-';
    }
    const renderLatestSleep = () => {
        return row.latestSleep && row.latestSleep.dateOfSleep ?
                        sformat('sleep: {0}', formatDateDay(row.latestSleep.dateOfSleep)) : '-';
    }
    return (

        <Row>
            <Col sm='2' >
                <Button color="warning" size="sm" style={style} disabled={row.isSelected} onClick={selectUser(row)}>
                    {row.isSelected ? "Selected" : "Select"}
                </Button>
            </Col>
            <Col sm='2' >
                <UncontrolledTooltip target={"aggr_"+row.id}>
                {renderLatestAggr()}
                </UncontrolledTooltip>
                <Button id={"aggr_"+row.id} outline color={getAggreButtonColor()} size="sm" style={style} onClick={fetchData(FETCH_AGGR, row.fitbitId)}>
                    {renderName(AGGR_NAME)}
                </Button>

            </Col>
            <Col sm='2' >
                <UncontrolledTooltip target={"intra_"+row.id}>
                {renderLatestIntra()}
                </UncontrolledTooltip>
                <Button id={"intra_"+row.id} outline color={getIntraButtonColor()} size="sm" style={style} onClick={fetchData(FETCH_INTRA, row.fitbitId)}>
                    {renderName(INTRA_NAME)}
                </Button>
            </Col>
            <Col sm='2' >
                <UncontrolledTooltip target={"sleep_"+row.id}>
                {renderLatestSleep()}
                </UncontrolledTooltip>
                <Button id={"sleep_"+row.id} outline color={getSleepButtonColor()} size="sm" style={style} onClick={fetchData(FETCH_SLP, row.fitbitId)}>
                    {renderName(SLP_NAME)}
                </Button>
            </Col>
            <Col sm='2' >
                <UncontrolledTooltip target={"hr_"+row.id}>
                {renderLatestHr()}
                </UncontrolledTooltip>
                <Button id={"hr_"+row.id} outline color={getHrButtonColor()} size="sm" style={style} onClick={fetchData(FETCH_HRT,row.fitbitId)}>
                    {renderName(HRT_NAME)}
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
