import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button,
FormGroup, Label, Input} from 'reactstrap'
import {Bar, Doughnut, Line, Pie, Polar, Radar} from "react-chartjs-2";
import {SleepTSDataTable, sleepTSToData} from './sleep_ts_data_table';
import {SleepActionService} from '../../actions/sleep_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import DatePicker from 'react-date-picker'
const util = require('../../utilities')
import _ from "lodash"
const {dformat} = util;
const sformat = require('string-format')
const tableSelector = makeSelectors("SleepTSDataTable");
const COMPONENT_URL = "/sleep"


/**{{
maintainAspectRatio: false
}}
*/
// var sleep_states_map = {'wake':0, 'rem':1, 'light':2, 'deep':3, 'awake':4, 'restless': 5, 'asleep':6};
// var sleep_states = ['wake', 'rem', 'light', 'deep', 'awake','restless', 'asleep'];

var sleep_states_map = {'deep':0, 'light':1, 'rem':2, 'wake':3, 'awake':4, 'asleep': 5, 'restless':6};
var sleep_states = ['deep', 'light', 'rem', 'wake', 'awake','asleep', 'restless'];

class SleepTSComponent extends React.Component {
    constructor(props){
        super(props);
        const _date = new Date();
        this.state = {
            sleepList: [],
            sleep: null,
            date: _date,
            radio: {nameRadio: true, roomRadio: false}
        }
        this.setRadio = this.setRadio.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getLine = this.getLine.bind(this);
        this.getCalendarDate = this.getCalendarDate.bind(this);
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
        if(this.props.filterText!=nextProps.filterText){
            this.fetchData(nextProps.filterText);
        }
        this.setState({sleepList: nextProps.sleepList, sleep: nextProps.sleep});

    }

    fetchData(sleepId){
        const {dispatch} = this.props;
        const queryJson = {}

        dispatch(SleepActionService.fetchTimeSerieBySleepId(sleepId, response => {}, error => {
            console.log(error);
            console.log(JSON.stringify(error));
        }));

        dispatch(SleepActionService.fetchSleepById(sleepId, response=>{}, error => {}))
    }

    componentDidMount(){
        const { dispatch } = this.props;
        //case path: /:id/view
        if (this.props.match && this.props.match.params){
            const id = this.props.match.params.id;
            if (id && !isNaN(parseInt(id))){
                this.fetchData(id)
            }
        }
    }

    getLine(){
        var sleepData = []
        if (this.state.sleepList && this.state.sleepList.length){
            const sleepLineData = _.chain(this.state.sleepList)
            .map(sleepDatum => {
                return {
                    x: new Date(sleepDatum.dateTime),
                    y: sleep_states_map[sleepDatum.level]
                }
            }).value();
            sleepData = []
            for(var i = 0; i < sleepLineData.length-1; i++){
                var sleepLineDatum = sleepLineData[i];
                var sleepLineDatumTo = {...sleepLineDatum}
                sleepLineDatumTo.x = new Date(sleepLineData[i+1].x.getTime());

                sleepData.push(sleepLineDatum);
                sleepData.push(sleepLineDatumTo);
            }
        }
        const line = {
          datasets: [
            {
              label: 'Sleep Data',
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
              data: sleepData
            }
          ]
        };
        return line;
    }

    getOptions(){
        const options = {
            stepSize: 100000,
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 0.5,
                        callback: function(label, index, labels) {
                            if (label >= 0 && label < sleep_states.length) {
                                return sleep_states[label] ;
                            } else {
                              return "";
                            }
                        }
                    }
                }],
                xAxes: [{
                    title: "time",
                    type: 'time',
                    gridLines: { lineWidth: 0 },
                    time: { unit: "minute" }
                }]
            }
        }
        return options;
    }

    getCalendarDate(){
        if (this.state.sleep && this.state.sleep.dateOfSleep){
            return moment(this.state.sleep.dateOfSleep).toDate();
        }
        return new Date();
    }

    render(){
        const filterStyle = {'margin-top':'5px', 'margin-right':'5px', 'width': '80px'}
        const dateColStyle = {'margin-left':'-30px'}
        const filterButtonColStyle = {'margin-left':'-50px'}
        const radioColStyle = {'margin-left': '80px'}
        return (
            <Card>
                <CardBlock className="card-body">
                <CardTitle>Sleep Dataset</CardTitle>
                <hr/>
                  <div className="chart-wrapper">
                    <Line data={this.getLine()}
                          options={this.getOptions()}
                    />
                  </div>
                </CardBlock>
                <CardBlock>
                    <CardSubtitle>
                        <Row>
                        <Col sm={2}><Button outline color="primary" style={filterStyle}>Previous</Button></Col>
                        <Col sm={2} style={dateColStyle}>
                            <FormGroup row><span style={filterStyle}></span>
                                <DatePicker
                                    calendarClassName={"my-calendar-in-view"}
                                    onChange={e => {
                                        this.setState({date: new Date(e.getTime())}, this.fetchData(this.props.filterText))
                                    }}
                                    value={this.getCalendarDate()}
                                    disabled={true}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={2}><Button outline color="primary" style={filterStyle}>Next</Button></Col>
                        <Col sm={{'size':2, 'offset':1}} style={radioColStyle} >
                          <FormGroup check>
                            <Label check>
                              <Input type="radio" name="roomRadio"
                                onChange={this.setRadio}
                                checked={this.state.radio.roomRadio}
                              />{' '}
                              Fitbit-ID
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input type="radio" name="nameRadio"
                                onChange={this.setRadio}
                                checked={this.state.radio.nameRadio}
                              />{' '}
                              Name
                            </Label>
                          </FormGroup>
                        </Col>
                        </Row>
                    </CardSubtitle>
                    <SleepTSDataTable data={sleepTSToData(this.state.sleepList)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sleep: state.sleepComponent.sleep,
        sleepList: state.sleepComponent.sleepTS,
        filterText: state.sematable && state.sematable.SleepTSDataTable && state.sematable.SleepTSDataTable.filterText
                    ? state.sematable.SleepTSDataTable.filterText : ""
    }
}

export default connect(mapStateToProps)(SleepTSComponent);


/*
{x:new Date(1533458400000), y:0},
{x:new Date(1533460379990), y:0},
{x:new Date(1533460380000), y:1},
{x:new Date(1533460649990), y:1},
{x:new Date(1533460650000), y:3},

{x:new Date(1533461129990), y:3},
{x:new Date(1533461130000), y:2},

{x:new Date(1533462120000), y:2},
{x:new Date(1533462120000), y:3},

{x:new Date(1533464130000), y:3},
{x:new Date(1533464130000), y:1},


{x:new Date(1533464490000), y:1},
{x:new Date(1533464490000), y:2},

{x:new Date(1533464970000), y:2},
{x:new Date(1533464970000), y:3},

{x:new Date(1533465960000), y:3},
{x:new Date(1533465960000), y:2},

//

{x:new Date(1533465990000), y:2},
{x:new Date(1533465990000), y:3},

{x:new Date(1533466350000), y:3},
{x:new Date(1533466350000), y:1},

{x:new Date(1533467910000), y:1},
{x:new Date(1533467910000), y:2},

{x:new Date(1533471330000), y:2},
{x:new Date(1533471330000), y:1},

{x:new Date(1533471600000), y:1},
{x:new Date(1533471600000), y:0},

{x:new Date(1533472950000), y:0},
{x:new Date(1533472950000), y:1},

{x:new Date(1533477750000), y:1},
{x:new Date(1533477750000), y:2},

{x:new Date(1533480390000), y:2},
{x:new Date(1533480390000), y:3},

{x:new Date(1533480780000), y:3},
{x:new Date(1533480780000), y:1},

{x:new Date(1533481230000), y:1},
{x:new Date(1533481230000), y:2},

{x:new Date(1533481590000), y:2},
{x:new Date(1533481590000), y:1},

{x:new Date(1533482910000), y:1},
{x:new Date(1533482910000), y:0},

*/
