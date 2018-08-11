import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors("SleepTSDataTable");
import {SleepActionService} from '../../actions/sleep_action';
import RemarkModal from '../RemarkBox/remark_modal';
const util = require('../../utilities')
import _ from "lodash"
const {dformat} = util;
const ROUTE_URL = "/contracts"

// id: String(sleep.id),
// dateOfSleep: sleep.dateOfSleep,
// fitbitUserId: sleep.fitbitUserId,
// duration: sleep.duration,
// efficiency: sleep.efficiency,
// endTime: new Date(sleep.endTime),
const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'fitbitSleepId', header: 'Sleep-ID', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'dateTime', header: 'Time', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'seconds', header: 'Seconds', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'level', header: 'Level', sortable: true, searchable: true, className:"my-data-table-td"}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}

class _SleepTSDataTable extends React.Component{
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

const sleepTSToData = (sleepTS) => {
    return _.map(sleepTS, sleepDatum => {
        return {
            id: String(sleepDatum.id),
            dateTime: dformat(new Date(sleepDatum.dateTime), {detailed:true, month_num: true}),
            level: sleepDatum.level,
            seconds: sleepDatum.seconds,
            fitbitSleepId: String(sleepDatum.fitbitSleepId)
        }
    });
}

const mapStateToProps = state => {
    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.SleepTSDataTable,
    }
}

_SleepTSDataTable.propTypes = propTypes;
const SleepTSDataTable = connect(mapStateToProps)(sematable('SleepTSDataTable', _SleepTSDataTable, columns, {defaultPageSize: 10}));
export {
    SleepTSDataTable,
    sleepTSToData
}



// //TODO refactor *URGENT*
// //TODO stream data (onSort, onPaginate, onPageSizeIncreased, onFilterIncrased)
// const _ActionButtonContainer = ({dispatch, row, history}) => {
//     const onRemove = () => {
//         const contractId = row.id
//         dispatch(ContractActionService.setEnableById(contractId, false, response => {
//             console.log(sformat("SET ENABLE {0} with response: ", contractId));
//             console.log(response);
//         }, error => {
//             console.log(sformat("REMOVED id={0} FAILED WITH ERROR: ", contractId));
//             console.log(error.response.data.error);
//         }));
//     }
//     let remarkStyle= { 'width':'70px' }
//     let viewStyle= { 'width':'70px', 'margin-left': '0px' }
//     let updateStyle = { 'width':'70px', 'margin-left': '0px' }
//     let removeStyle = { 'width':'70px', 'margin-left': '0px' }
//     return(
//         <Row>
//             <Col sm='2' >
//                 <Button color="secondary"
//                         size="sm"
//                         style={remarkStyle}
//                         onClick={row.toggle}
//                         hidden={!row.remark || row.remark.length < 1}>
//                     Remark
//                 </Button>
//             </Col>
//             <Col sm='2'>
//                 <Link to={sformat("{0}/{1}/view", ROUTE_URL, row.id)}>
//                     <Button color="primary" size="sm" style={viewStyle}>View</Button>
//                 </Link>
//             </Col>
//             <Col sm='2'>
//                 <Link to={sformat("{0}/{1}/update", ROUTE_URL, row.id)}>
//                     <Button size="sm" color="warning" style={updateStyle}>Update</Button>
//                 </Link>
//             </Col>
//             <Col sm='2' >
//                 <Button color="danger" size="sm" style={removeStyle} onClick={onRemove}>Remove</Button>
//             </Col>
//         </Row>
//     )
// }
//let ActionButtonContainer = withRouter(connect(null)(_ActionButtonContainer));
