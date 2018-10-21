import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import sematable, {Table, makeSelectors} from 'sematable'
import {Button, Row, Col} from 'reactstrap'
import {NavLink, Link, withRouter} from 'react-router-dom';
var sformat = require('string-format')
const selectors = makeSelectors("EmaDataTable");
import {EMAActionService} from '../../actions/ema_action';
const util = require('../../utilities');
import _ from "lodash";
const { dformat } = util;

const EMALevel = ({row}) => {
    const colorMap = {
        "Feeling great": "success",
        "Feeling good": "info",
        "Neither": "secondary",
        "A little stressed": "warning",
        "Stressed out": "danger"
    }
    return (<Row>
                <Col sm='2' >
                    <Button style={{'width': '200px'}} color={colorMap[row.stressLevel]} size="sm" disabled={false}>
                        {row.stressLevel}
                    </Button>
                </Col>
            </Row>);
}
//{key: 'stressLevel', header: 'Stress Level', sortable: true, searchable: true, className:"my-data-table-td"},
const columns = [
    {key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true, className:"my-data-table-td"},
    {key: 'dateTime', header: 'Timestamp', sortable: true, searchable: true, className:"my-data-table-td"},
    {key: 'actions', header: "Stress Levels", Component: EMALevel}
]

const propTypes = {
    headers: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    primaryKey: PropTypes.string.isRequired
}


class _EMADataTable extends React.Component{
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

const emaToDataTable = (emaList) => {
    var emaDataTableList = _.map(emaList, emaDatum => {
        return {
            id: String(emaDatum.id),
            dateTime: dformat(new Date(emaDatum.dateTime*1000), {detailed:true, month_num: true}),
            stressLevel: emaDatum.stressLevel,
        }
    });
    return emaDataTableList
}

const mapStateToProps = state => {

    return {
        tableFilter: selectors.getFilter(state),
        tablePageInfo: selectors.getPageInfo(state),
        table: state.sematable.SleepDataTable,
    }
}

_EMADataTable.propTypes = propTypes;
const EMADataTable = connect(mapStateToProps)(sematable('EMADataTable', _EMADataTable, columns, {defaultPageSize: 50}));
export {
    EMADataTable,
    emaToDataTable
}
