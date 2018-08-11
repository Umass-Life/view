import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button,
FormGroup, Label, Input, ButtonToolbar, ButtonGroup } from 'reactstrap'
import Select from 'react-select';
import {Bar, Doughnut, Line, Pie, Polar, Radar} from "react-chartjs-2";
import {ActivityActionService} from '../../actions/activity_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import DatePicker from 'react-date-picker'
const util = require('../../utilities')
import _ from "lodash"
const {dformat, formatDateDay} = util;
const sformat = require('string-format')
const COMPONENT_URL = "/activities"

const resourceTypes = ['steps', 'calories' , 'distance', 'floors', 'elevation'];
const options = _.map(resourceTypes, x => { return {value: x, label: x}});
const DATE_INTERVAL = 14;

class ActivityTSComponent extends React.Component {
    constructor(props){
        super(props);
        const _date = new Date();
        const _date2= new Date();
        _date2.setDate(_date.getDate()-DATE_INTERVAL);
        this.state = {
            activitiesr: [],
            from: _date2,
            to: _date,
            page_n: 0,
            page_size: 360,
            resourceType: resourceTypes[0],
            radio: {week: true, day: false},
            selectedOption: options[0]
        }
        this.setRadio = this.setRadio.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.renderBarChart = this.renderBarChart.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.resetDataQuery = this.resetDataQuery.bind(this);
        this.changeDataQueryByAdding = this.changeDataQueryByAdding.bind(this);
        this.renderIntradayPage = this.renderIntradayPage.bind(this);
        this.dropdownChanged = this.dropdownChanged.bind(this)
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

    resetDataQuery(){
        const _date = new Date();
        const _date2= new Date();
        _date2.setDate(_date.getDate()-DATE_INTERVAL);

        this.setState({
            from: _date2,
            to: _date,
            page_n: 0,
        }, this.fetchData)
    }

    changeDataQueryByAdding(isAdd){
        if (this.state.radio.week){
            const {from, to} = this.state;
            const from_moment = moment(from);
            const to_moment = moment(to);
            if (isAdd) {
                from_moment.add(DATE_INTERVAL, 'day');
                to_moment.add(DATE_INTERVAL, 'day');
            } else {
                from_moment.subtract(DATE_INTERVAL, 'day');
                to_moment.subtract(DATE_INTERVAL, 'day');
            }
            this.setState({
                from: from_moment.toDate(),
                to: to_moment.toDate()
            }, this.fetchData)
        } else {
            var {page_n} = this.state;
            if (isAdd){
                if (page_n > 0) page_n-=1;
            } else {
                page_n+=1;

            }
            this.setState({
                page_n: page_n
            }, this.fetchData)
        }

    }
    next(){ this.changeDataQueryByAdding(true); }

    prev(){ this.changeDataQueryByAdding(false); }

    componentWillReceiveProps(nextProps){
        const { hasRefreshed } = this.props;
        console.log(nextProps);
        if (hasRefreshed(this.props, nextProps) && nextProps.sessionUser){
            this.fetchData(nextProps.sessionUser);
        }
    }

    fetchData(sessionUser){
        const {dispatch} = this.props;
        if (!sessionUser) sessionUser = this.props.sessionUser;
        const {from, to, selectedOption, page_n, page_size} = this.state;
        const resource = selectedOption.value
        const fromStr = formatDateDay(from);
        const toStr = formatDateDay(to)
        const fid = sessionUser && sessionUser.fitbitId ? sessionUser.fitbitId : null;
        console.log(sessionUser, '\n',fromStr, toStr, resource, page_n, page_size)
        if (fid){
            if(this.state.radio.week){
                dispatch(ActivityActionService.fetchActivtyTimeserie(fid,resource, fromStr, toStr,
                    response => {}, error => {
                    console.log(error);
                    console.log(JSON.stringify(error));
                }));
            } else if (this.state.radio.day){
                //intraday request
                dispatch(ActivityActionService.fetchIntradayActivtyTimeserie(fid,resource, page_n, page_size,
                    response => {}, error => {
                    console.log(error);
                    console.log(JSON.stringify(error));
                }));

            }

        }
    }

    componentDidMount(){
        if (this.props.sessionUser && this.props.sessionUser.fitbitId){
            this.fetchData()
        }
    }

    renderBarChart(){
        const alpha = 0.5
        var data = []
        const { activityTimeserie } = this.props;
        if (activityTimeserie && activityTimeserie.length){
            console.log(activityTimeserie);
            data = _.map(activityTimeserie, datum => {
                var x = null;
                if (this.state.radio.day){
                    x = new Date(datum.dateTime);
                } else if (this.state.radio.week){
                    x = formatDateDay(datum.dateTime);
                }
                return {
                    x: x,
                    y: datum.value
                }
            });
            console.log(data);
        }

        var OutBar = {datasets: [{
                label: this.state.selectedOption.value,
                backgroundColor: sformat('rgba(0, 153, 0,{0})', 0.1),
                borderWidth: 2,
                data: data
            }]
        }

        var OutLine = {
          // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: this.state.selectedOption.value,
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
        return this.state.radio.week ? OutBar : OutLine;
    }

    getOptions(){
        const options = {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                    }
                }],
                xAxes: [{
                    title: "time",
                    type: 'time',
                    time: this.state.radio.week ?
                        { unit: "day" , stepSize : 1} :
                        { unit: "minute" , stepSize : 30},
                }]
            }
        }
        return options;
    }

    renderIntradayPage(){
        if (this.state.radio.day){
            return (
                <Col sm={3}>
                Page: {this.state.page_n}
                </Col>
            )
        }
        return (<div></div>)
    }

    dropdownChanged(selectedOption){
        this.setState({ selectedOption }, this.fetchData);
    }

    render(){
        const { selectedOption } = this.state;
        const isClearable = false;
        const isSearchable = false;
        const filterStyle = {'margin-top':'5px', 'margin-right':'5px'}
        const dateColStyle = {'margin-left':'-30px'}
        const filterButtonColStyle = {'margin-left':'-50px'}
        const dayRadio = "btn btn-outline-secondary " + (this.state.radio.day ? "active" : "")
        const weekRadio = "btn btn-outline-secondary " + (this.state.radio.week ? "active" : "")
        return (
            <Card>
            <CardBlock className="card-body">
            <CardTitle>Activity Timeserie</CardTitle>
            <hr/>
            <Row>
                <Col sm="2">
                <Select
                    clearable={isClearable}
                    searchable={isSearchable}
                    value={selectedOption}
                    onChange={this.dropdownChanged}
                    options={options}
                />
                </Col>
              <Col sm="10" className="d-none d-sm-inline-block">
                <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-3" data-toggle="buttons" aria-label="First group">
                    <Label htmlFor="day" className={dayRadio} check>
                      <Input type="radio" name="day" id='day'
                      onChange={this.setRadio}
                      checked={this.state.radio.day}/> Day
                    </Label>
                    <Label htmlFor="week" className={weekRadio} check>
                      <Input type="radio" name="week" id='week'
                      onChange={this.setRadio}
                      checked={this.state.radio.week}/> Week
                    </Label>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </Row>
              <div className="chart-wrapper">
                {this.state.radio.week ? (<Bar data={this.renderBarChart()} options={this.getOptions()}/>) :
                <Line data={this.renderBarChart()} options={this.getOptions()}/>}

              </div>
            </CardBlock>
                <CardBlock>
                    <CardSubtitle>
                        <Row>
                        <Col sm={2}><Button outline color="primary" onClick={this.prev}>Previous</Button></Col>
                        <Col sm={2}><Button outline color="primary" onClick={this.next}>Next</Button></Col>
                        <Col sm={3} style={dateColStyle}>
                            <FormGroup row><span style={filterStyle}>From</span>
                                <DatePicker calendarClassName={"my-calendar-in-view"} value={this.state.from} />
                            </FormGroup>
                        </Col>
                        <Col sm={3} style={dateColStyle}>
                            <FormGroup row>
                            <span style={filterStyle}>To</span>
                            <DatePicker calendarClassName={"my-calendar-in-view"} value={this.state.to}/>
                            </FormGroup>
                        </Col>
                        {this.renderIntradayPage()}
                        </Row>
                    </CardSubtitle>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        activityTimeserie: state.activityComponent.activityTimeserie,
        activities: state.activityComponent.activities,
    }
}

export default connect(mapStateToProps)(ActivityTSComponent);
