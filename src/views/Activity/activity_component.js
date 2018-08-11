import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button,
FormGroup, Label, Input} from 'reactstrap'
import moment from 'moment';
import {Bar, Doughnut, Line, Pie, Polar, Radar} from "react-chartjs-2";
import {ActivityDataTable, activitiesToData} from './activity_data_table';
import {ActivityActionService} from '../../actions/activity_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import DatePicker from 'react-date-picker'
const util = require('../../utilities')
import _ from "lodash"
const {dformat, formatDateDay} = util;
const sformat = require('string-format')
const tableSelector = makeSelectors("ActivityDataTable");
const COMPONENT_URL = "/activities"
const DEFAULT_DATE_INTERVAL = 14;

class ActivityComponent extends React.Component {
    constructor(props){
        super(props);
        const _date = new Date();
        const _date2= new Date();
        _date2.setDate(_date.getDate() - DEFAULT_DATE_INTERVAL);
        this.state = {
            activities: [],
            from: _date2,
            to: _date,
            includeMinutesSedentary: false,
            radio: {nameRadio: true, roomRadio: false}
        }
        this.fetchData = this.fetchData.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.renderBarChart = this.renderBarChart.bind(this);
        this.changeQueryDataByAdding = this.changeQueryDataByAdding.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.fillInDates = this.fillInDates.bind(this);
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

    next(){ this.changeQueryDataByAdding(true);}
    prev(){ this.changeQueryDataByAdding(false); }

    changeDate(key){
        return e => {
            const o = {}
            o[key] =  e
            this.setState(o, ()=> { this.fetchData() });
        }
    }

    componentWillReceiveProps(nextProps){
        const { hasRefreshed } = this.props;
        if (hasRefreshed(this.props, nextProps)){
            this.fetchData(nextProps.sessionUser);
        }
        this.setState({
            activities: nextProps.activities,
        });
    }

    fetchData(sessionUser){
        const {dispatch} = this.props;
        const queryJson = {}
        var fid = null;
        const {from, to} = this.state;
        if (!sessionUser){
            sessionUser = this.props.sessionUser;
        }
        if (sessionUser){
            fid = sessionUser.fitbitId;
            dispatch(ActivityActionService.fetchLevels(fid, from, to, response => {}, error => {
                console.log(error);
                console.log(JSON.stringify(error));
            }));
        }
    }

    componentDidMount(){
        console.log("componentDidMount");
        console.log(this.props)
        this.fetchData(this.props.sessionUser)
    }

    fillInDates(data){
        if (data){
            // data.reverse();
            const TIME_FORMAT = "YYYY-MM-DD"
            const dateTimeToDisplayFormat = (_dt) => {
                const datum_moment = moment(_dt);
                return datum_moment.format(TIME_FORMAT)
            }
            const st = []
            var curDate = moment(this.state.from);
            const endDate = moment(this.state.to);
            // const endDate = moment(sleepBarData[sleepBarData.length-1].x);
            while(curDate.toDate().getTime() <= endDate.toDate().getTime()){
                var datum = _.find(data, _datum =>
                    dateTimeToDisplayFormat(_datum.dateTime) == curDate.format(TIME_FORMAT)
                );
                if (!datum){
                    datum = { dateTime: curDate.toDate().getTime() }
                }
                st.push(datum);
                curDate.add(1, 'day');
            }
            // console.log(st);
            return st;
        }
        return data;
    }

    renderBarChart(){
        const alpha = 0.5
        var Out = {
            'minutesSedentary': {
                label: 'Minutes Sedentary',
                backgroundColor: sformat('rgba(0, 153, 0,{0})', 0.1),
                borderWidth: 2,
                data: []
            },
            'minutesLightlyActive': {
                label: 'Minutes Lightly Active',
                backgroundColor: sformat('rgba(0, 153, 255,{0})', 0.1),
                borderWidth: 2,
                data: []
            },
            'minutesFairlyActive':{
                label: 'Minutes Fairly Active',
                backgroundColor: sformat('rgba(255, 153, 255,{0})', 0.2),
                borderWidth: 2,
                data: []
            },
            'minutesVeryActive':{
                label: 'Minutes Very Active',
                backgroundColor: sformat('rgba(200,0,0,{0})', 0.2),
                borderWidth: 2,
                data: []
            }
        }
        const build = (key, datum) => {
            Out[key].data.push({y: datum[key], x: formatDateDay(new Date(datum.dateTime))});
        }
        const dateFilledActivities = this.fillInDates(this.state.activities);
        console.log(dateFilledActivities);
        _.forEach(dateFilledActivities, (datum) => {
            if (this.state.includeMinutesSedentary){
                build('minutesSedentary', datum);
            }
            build('minutesLightlyActive', datum);
            build('minutesFairlyActive', datum);
            build('minutesVeryActive', datum);
        })
        Out =  _.map(Out, x => x);
        return { datasets: Out };
    }

    getOptions(){
        const options = {
            scales: {
                yAxes: [{
                    stacked: false,
                    ticks: {
                        min: 0,
                    }
                }],
                xAxes: [{
                    stacked: true,
                    title: "time",
                    type: 'time',
                    time: { unit: "day" },
                }]
            }
        }
        return options;
    }

    render(){
        const filterStyle = {'margin-top':'5px', 'margin-right':'5px'}
        const dateColStyle = {'margin-left':'-30px'}
        const filterButtonColStyle = {'margin-left':'-50px'}
        const radioColStyle = {'margin-left': '80px'}
        return (
            <Card>
            <CardBlock className="card-body">
            <CardTitle>Activity Aggregate Dataset</CardTitle>
            <hr/>``
              <div className="chart-wrapper">
                <Bar data={this.renderBarChart()} options={this.getOptions()}/>
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
                        <Col sm={2} style={{'margin-left':'-50px'}}>
                            <Label check>
                            <Input type="checkbox"
                                onChange={(e) => {this.setState({includeMinutesSedentary: !this.state.includeMinutesSedentary})}}
                                checked={this.state.includeMinutesSedentary}/>{' '}
                            Include Minutes Sedentary

                            </Label>
                        </Col>
                        </Row>
                    </CardSubtitle>
                    <ActivityDataTable data={activitiesToData(this.state.activities)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        activities: state.activityComponent.activities,
        filterText: state.sematable && state.sematable.ActivityDataTable && state.sematable.ActivityDataTable.filterText
                    ? state.sematable.ActivityDataTable.filterText : ""
    }
}

export default connect(mapStateToProps)(ActivityComponent);
