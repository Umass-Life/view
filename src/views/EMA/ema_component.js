import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Row, Col, Container, Card, CardTitle, CardBody, CardBlock, CardSubtitle, Button,
FormGroup, Label, Input} from 'reactstrap'
import {Bar, Doughnut, Line, Pie, Polar, Radar} from "react-chartjs-2";
import {EMADataTable,  emaToDataTable} from './ema_data_table';
import {EMAActionService} from '../../actions/ema_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import DatePicker from 'react-date-picker';
const util = require('../../utilities')
import _ from "lodash"
const {dformat, formatDateDay, truncateDecimal, msToHours} = util;
const sformat = require('string-format')
const tableSelector = makeSelectors("EMADataTable");
const COMPONENT_URL = "/ema"

class EMAComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
        this.fetchData = this.fetchData.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.sessionUser && this.props.hasRefreshed(this.props, nextProps)){
            this.fetchData();
        }
    }

    fetchData(){
        const {dispatch} = this.props;
        dispatch(EMAActionService.fetchAll(response => {}, error => {
            console.log(error);
            console.log(JSON.stringify(error));
        }));
    }

    componentDidMount(){
        this.fetchData();
    }

    render(){
        const filterStyle = {'margin-top':'5px', 'margin-right':'5px'}
        const dateColStyle = {'margin-left':'-30px'}
        const filterButtonColStyle = {'margin-left':'-50px'}
        const radioColStyle = {'margin-left': '80px'}
        return (
            <Card>
                <CardBlock>
                <CardTitle>Stress Level Assessment</CardTitle>
                    <EMADataTable data={emaToDataTable(this.props.emaList)}/>
                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        emaList: state.EMAComponent.emaList,
    }
}

export default connect(mapStateToProps)(EMAComponent);
