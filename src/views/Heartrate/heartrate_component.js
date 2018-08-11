import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button,
FormGroup, Label, Input, ButtonToolbar, ButtonGroup } from 'reactstrap'
import {Bar, Doughnut, Line, Pie, Polar, Radar} from "react-chartjs-2";
import {HeartrateDataTable, heartratesToData} from './heartrate_data_table';
import {HeartrateActionService} from '../../actions/heartrate_action';
import {ActivityActionService} from '../../actions/activity_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import DatePicker from 'react-date-picker'
const util = require('../../utilities')
import _ from "lodash"
const {dformat, formatDateDay, msToHours, truncateDecimal} = util;
const sformat = require('string-format')
const tableSelector = makeSelectors("HeartrateDataTable");
const COMPONENT_URL = "/heartrate"
var DEFAULT_DATE_INTERVAL = 14;

class HeartrateComponent extends React.Component {
    constructor(props){
        super(props);
        const _date = new Date();
        const _date2= new Date();
        _date2.setDate(_date.getDate()-DEFAULT_DATE_INTERVAL);
        this.state = {
            heartrates: [],
            page_n: 0,
            page_size: 20 * 60, // minutes * sec/mintues
            from: _date2,
            to: _date,
            radio: {hour: true, day: false},
        }
        this.setRadio = this.setRadio.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.renderBarChart = this.renderBarChart.bind(this);
        this.getBarOptions = this.getBarOptions.bind(this);
        this.renderLine = this.renderLine.bind(this);
        this.getLineOptions = this.getLineOptions.bind(this);
        this.fillInDates = this.fillInDates.bind(this);
        this.changeQueryDataByAdding = this.changeQueryDataByAdding.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.change_hr_serie = this.change_hr_serie.bind(this);
        this.next_hr_serie = this.next_hr_serie.bind(this);
        this.prev_hr_serie = this.prev_hr_serie.bind(this);
        this.fetchHRTimeSerie = this.fetchHRTimeSerie.bind(this);
    }


    componentDidMount(){
        if (this.props.sessionUser && this.props.sessionUser.fitbitId){
            this.fetchData(this.props.sessionUser.fitbitId)
            this.fetchHRTimeSerie(this.props.sessionUser.fitbitId)
        }
    }

    setRadio(e){
        const name = e.target.name;
        const radio = this.state.radio;
        var newRadio = _.clone(radio);
        for(var key in radio){
            if (name==key) newRadio[key]=true;
            else newRadio[key]=false;
        }
        this.setState({radio: newRadio}, this.resetDataQuery);
    }

    resetDataQuery(){ this.setState({ page_n: 0,}, this.fetchHRTimeSerie) }

    change_hr_serie(goPrevious){
        const { page_n } = this.state;
        var new_page_n = page_n;
        if (goPrevious){
            new_page_n+=1;
        } else{
            if (page_n > 0){
                new_page_n-=1;
            }
        }
        this.setState({page_n: new_page_n}, () => {
            this.fetchHRTimeSerie()
        });
    }

    next_hr_serie(){ this.change_hr_serie(false); }

    prev_hr_serie(){ this.change_hr_serie(true);  }

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
    
    renderLine(){
        var data = []
        const { heartrateTimeserie } = this.props;
        if (heartrateTimeserie && heartrateTimeserie.length){
            data = _.map(heartrateTimeserie, datum => {
                return {
                    // x: new Date("2018-08-06T"+x.time),
                    x: new Date(datum.dateTime),
                    y: datum.value
                }
            });

        }
        const line = {
          // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Heartrate' + (data.length == 0 ? '' : (' at ' + data[0].x)),
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: data
            }
          ]
        };
        return line;
    }

    getLineOptions(){
        const options = {
            scales: {
                yAxes: [{}],
                xAxes: [{
                    title: "time",
                    type: 'time',
                    time: {
                        // unitStepSize: 6000,
                        unit: "minute",
                    }
                }]
            }
        }
        return options;
    }

    setRadio(e){
        const name = e.target.name;
        const radio = this.state.radio;
        var newRadio = _.clone(radio);
        for(var key in radio){
            if (name==key) newRadio[key]=true;
            else newRadio[key]=false;
        }
        this.setState({radio: newRadio}, () => {console.log(this.state)});
    }

    componentWillReceiveProps(nextProps){
        if (this.props.hasRefreshed(this.props, nextProps)){
            // fetchadata
            this.fetchData(nextProps.sessionUser.fitbitId);
            this.fetchHRTimeSerie(nextProps.sessionUser.fitbitId);
        }
        var _from = this.state.from;
        var _to = this.state.to
        if (nextProps.heartrates && nextProps.heartrates.length){
            _from = new Date(_.minBy(nextProps.heartrates, x => x.dateTime).dateTime);
            _to = new Date(_.maxBy(nextProps.heartrates, x => x.dateTime).dateTime);
        }
        this.setState({
            heartrates: nextProps.heartrates,
        });
    }

    fetchData(fid){
        const {dispatch} = this.props;
        const {from, to} = this.state;
        if (!fid){
            const { sessionUser } = this.props;
            fid = sessionUser.fitbitId;
        }
        if (fid){
            dispatch(HeartrateActionService.fetchById(fid, from, to, response => {}, error => {
                console.log(error);
                console.log(JSON.stringify(error));
            }));
        }
    }

    fetchHRTimeSerie(fid){
        const {dispatch} = this.props;
        const {page_n, page_size} = this.state;
        if (!fid){
            const { sessionUser } = this.props;
            fid = sessionUser.fitbitId;
        }
        if (fid){
            dispatch(ActivityActionService.fetchIntradayActivtyTimeserie(fid,"heart", page_n, page_size,
                response => {}, error => {
                console.log(error);
                console.log(JSON.stringify(error));
            }));
        }
    }


    // RESTING HEART REATE BAR GRAPH ////////////////////////
    /////////////////////////////////////////////////////////
    fillInDates(data){
        if (data && data.length > 1){
            // data.reverse();
            const st = []
            var curDate = moment(this.state.from)
            const endDate = moment(this.state.to)
            while(curDate.toDate().getTime() < endDate.toDate().getTime()){
                var datum = _.find(data, datum_i => datum_i.x == curDate.format('YYYY-MM-DD'));
                if (!datum){
                    datum = { x: curDate.format('YYYY-MM-DD'), y:0 }
                }
                st.push(datum);
                curDate.add(1, 'day');
            }
            return st;
        }
        return data;
    }

    renderBarChart(){
        var hrDataset = [];
        if (this.state.heartrates && this.state.heartrates.length){
            hrDataset = _.chain(this.state.heartrates)
                        .map(hrDatum => {
                            return { x: formatDateDay(hrDatum.dateTime), y: hrDatum.restingHeartRate ? hrDatum.restingHeartRate : 0 }
                        })
                        .groupBy(hrDatum => hrDatum.x)
                        .map(groupedHr => _.reduce(groupedHr, (_a, _b) => {
                            return {y: parseFloat(_a.y)+parseFloat(_b.y), x: _a.x};
                        }))
                        .value();
            hrDataset = this.fillInDates(hrDataset);
        }
        const barConfig = { datasets: [
          {
              label: 'Resting Heart Rate',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 2,
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: hrDataset
          }
        ]}
        return barConfig;
    }
    getBarOptions(){
        const options = {
            scales: {
                yAxes: [{
                    ticks: { min: 0 }
                }],
                xAxes: [{
                    title: "time",
                    type: 'time',
                    time: { unit: "day", stepSize:1}
                }]
            }
        }
        return options
    }

    render(){
        const filterStyle = {'margin-top':'5px', 'margin-right':'5px'}
        const dateColStyle = {'margin-left':'-30px'}
        const filterButtonColStyle = {'margin-left':'-50px'}
        const radioColStyle = {'margin-left': '80px'}
        const dayRadio = "btn btn-outline-secondary " + (this.state.radio.day ? "active" : "")
        const hourRadio = "btn btn-outline-secondary " + (this.state.radio.hour ? "active" : "")
        return (
            <Card>
                <CardBlock className="card-body">
                <CardTitle>Heartrate Timeserie</CardTitle>
                <hr/>
                <Row>

                <Col sm="10" className="d-none d-sm-inline-block">
                  <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                    <ButtonGroup className="mr-3" data-toggle="buttons" aria-label="First group">

                      <Label htmlFor="day" className={dayRadio} check>
                        <Input type="radio" name="day" id='day'
                        onChange={this.setRadio}
                        checked={this.state.radio.day}/> Day
                      </Label>
                      <Label htmlFor="hour" className={hourRadio} check>
                        <Input type="radio" name="hour" id='hour'
                        onChange={this.setRadio}
                        checked={this.state.radio.hour}/> Minutes
                      </Label>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Col>
                <Col sm="1" className="float-right d-none d-sm-inline-block">
                    <Button outline color="primary" onClick={this.prev_hr_serie}>{'<'}</Button>
                </Col>
                <Col sm="1" className="float-right d-none d-sm-inline-block">
                    <Button outline color="primary" onClick={this.next_hr_serie}>{'>'}</Button>
                </Col>
                </Row>
                  <div className="chart-wrapper">
                    <Line data={this.renderLine()} options={this.getLineOptions()}/>
                  </div>
                </CardBlock>
                <CardBlock className="card-body">
                <CardTitle>Daily Resting Heartrate</CardTitle>
                <hr/>
                  <div className="chart-wrapper">
                    <Bar data={this.renderBarChart()} options={this.getBarOptions()}/>
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
                    <HeartrateDataTable data={heartratesToData(this.state.heartrates)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        heartrateTimeserie: state.activityComponent.activityTimeserie,
        heartrates: state.heartrateComponent.heartrates,
        filterText: state.sematable && state.sematable.HeartrateDataTable && state.sematable.HeartrateDataTable.filterText
                    ? state.sematable.HeartrateDataTable.filterText : ""
    }
}

export default connect(mapStateToProps)(HeartrateComponent);
