import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button,
FormGroup, Label, Input} from 'reactstrap'
import {Bar, Doughnut, Line, Pie, Polar, Radar} from "react-chartjs-2";
import {SleepDataTable, sleepToData} from './sleep_data_table';
import {SleepActionService} from '../../actions/sleep_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import DatePicker from 'react-date-picker'
const util = require('../../utilities')
import _ from "lodash"
const {dformat, formatDateDay, truncateDecimal, msToHours} = util;
const sformat = require('string-format')
const tableSelector = makeSelectors("SleepDataTable");
const COMPONENT_URL = "/sleep"
var DEFAULT_DATE_INTERVAL = 14;

class SleepComponent extends React.Component {
    constructor(props){
        super(props);
        const _date = new Date();
        const _date2= new Date();
        _date2.setDate(_date.getDate()-DEFAULT_DATE_INTERVAL);
        this.state = {
            sleepList: [],
            from: _date2,
            to: _date,
            radio: { nameRadio: true, roomRadio: false }
        }
        this.fetchData = this.fetchData.bind(this);
        this.renderBarChart = this.renderBarChart.bind(this);
        this.barOptions = this.barOptions.bind(this);
        this.fillInDates = this.fillInDates.bind(this);
        this.changeQueryDataByAdding = this.changeQueryDataByAdding.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.changeDate = this.changeDate.bind(this);

    }

    changeQueryDataByAdding(isAdding){
        const {from, to} = this.state;
        var from_m = moment(from);
        var to_m = moment(to);
        const DATE_INTERVAL = to_m.diff(from_m, 'days');
        if (isAdding){
            from_m.add(DATE_INTERVAL, 'day');
            to_m.add(DATE_INTERVAL, 'day');
        } else {
            from_m.subtract(DATE_INTERVAL, 'day');
            to_m.subtract(DATE_INTERVAL, 'day');
        }

        this.setState({
            from: from_m.toDate(),
            to: to_m.toDate()
        }, () => {
            this.fetchData();
        })
    }

    next(){
        this.changeQueryDataByAdding(true);
    }

    prev(){
        this.changeQueryDataByAdding(false);
    }

    changeDate(key){
        return e => {
            const o = {}
            o[key] =  e
            this.setState(o, ()=> { this.fetchData() });
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.sessionUser && this.props.hasRefreshed(this.props, nextProps)){
            this.fetchData(nextProps.sessionUser);
        }

        if(this.props.filterText!=nextProps.filterText){
            this.fetchData(nextProps.filterText);
        }
        this.setState({sleepList: nextProps.sleepList});
    }

    fetchData(sessionUser){
        const {dispatch} = this.props;
        const {from, to } = this.state;
        if (!sessionUser){
            sessionUser = this.props.sessionUser;
        }
        const fid = sessionUser.fitbitId;
        dispatch(SleepActionService.fetchById(fid, from, to, response => {}, error => {
            console.log(error);
            console.log(JSON.stringify(error));
        }));
    }

    fillInDates(sleepBarData){
        if (sleepBarData && sleepBarData.length > 1){
            sleepBarData.reverse();
            const st = []
            var curDate = moment(this.state.from);
            const endDate = moment(this.state.to);
            // const endDate = moment(sleepBarData[sleepBarData.length-1].x);
            while(curDate.toDate().getTime() <= endDate.toDate().getTime()){
                var datum = _.find(sleepBarData, sleepBarDatum => sleepBarDatum.x == curDate.format('YYYY-MM-DD'));
                if (!datum){
                    datum = { x: curDate.format('YYYY-MM-DD'), y:0 }
                }
                st.push(datum);
                curDate.add(1, 'day');
            }
            return st;
        }
        return sleepBarData;
    }

    // Bar Chart functions
    renderBarChart(){
        var sleepData = [];
        if (this.state.sleepList && this.state.sleepList.length){
            sleepData = _.chain(this.state.sleepList)
                        .map(fitbitSleep => {
                                return { x: formatDateDay(fitbitSleep.dateOfSleep), y: truncateDecimal(msToHours(fitbitSleep.duration)) }
                        })
                        .groupBy(sleepDatum => sleepDatum.x)
                        .map(groupedSleep => _.reduce(groupedSleep, (_a, _b) => {
                            return {y: parseFloat(_a.y)+parseFloat(_b.y), x: _a.x};
                        }))
                        .value();

            sleepData = this.fillInDates(sleepData);
        }
        const barConfig = { datasets: [
          {
              label: 'Hours of sleep',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 2,
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: sleepData
          }
        ]}
        return barConfig;
    }

    barOptions(){
        const options = {
            scales: {
                yAxes: [{
                    ticks: { min: 0, stepSize: 0.5 }
                }],
                xAxes: [{
                    title: "time",
                    type: 'time',
                    time: { unit: "day", stepSize: 1 }
                }]
            }
        }
        return options
    }

    componentDidMount(){
        if (this.props.sessionUser){
            this.fetchData(this.props.sessionUser)
        }
    }

    render(){
        const filterStyle = {'margin-top':'5px', 'margin-right':'5px'}
        const dateColStyle = {'margin-left':'-30px'}
        const filterButtonColStyle = {'margin-left':'-50px'}
        const radioColStyle = {'margin-left': '80px'}
        return (
            <Card>
                <CardBlock className="card-body">
                <CardTitle>Sleep Dataset</CardTitle>
                <hr/>
                  <div className="chart-wrapper">
                    <Bar data={this.renderBarChart()} options={this.barOptions()}/>
                  </div>
                </CardBlock>
                <CardBlock>

                    <CardSubtitle>
                        <Row>
                        <Col sm={2}><Button outline color="primary" onClick={this.prev}>Previous</Button></Col>
                        <Col sm={2}><Button outline color="primary" onClick={this.next}>Next</Button></Col>
                        <Col sm={3} style={dateColStyle}>
                            <FormGroup row><span style={filterStyle}>From</span>
                                <DatePicker
                                    calendarClassName={"my-calendar-in-view"}
                                    onChange={this.changeDate("from")}
                                    value={this.state.from}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={3} style={dateColStyle}>
                            <FormGroup row><span style={filterStyle}>To</span>
                                <DatePicker
                                    calendarClassName={"my-calendar-in-view"}
                                    onChange={this.changeDate("to")}
                                    value={this.state.to}
                                />
                            </FormGroup>
                        </Col>

                        </Row>
                    </CardSubtitle>
                    <SleepDataTable data={sleepToData(this.state.sleepList)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sleepList: state.sleepComponent.sleepList,
        filterText: state.sematable && state.sematable.SleepDataTable && state.sematable.SleepDataTable.filterText
                    ? state.sematable.SleepDataTable.filterText : ""
    }
}

export default connect(mapStateToProps)(SleepComponent);


//
// const BAR = {
//   datasets: [
//     {
//         label: 'Hours of sleep',
//         backgroundColor: 'rgba(255,99,132,0.2)',
//         borderColor: 'rgba(255,99,132,1)',
//         borderWidth: 2,
//         hoverBackgroundColor: 'rgba(255,99,132,0.4)',
//         hoverBorderColor: 'rgba(255,99,132,1)',
//         data: [
//             // {x:"2018-07-25", y:5},
//             // {x:"2018-07-26", y:6},
//             // {x:"2018-07-27", y:4},
//             // {x:"2018-07-28", y:8},
//             // {x:"2018-07-29", y:5},
//             // {x:"2018-07-30", y:6},
//             // {x:"2018-07-31", y:7},
//             // {x:"2018-08-01", y:7}
//         ]
//     }
//   ]
// };
