import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import UserDataTable from './user_data_table';
import {UserActionService} from '../../actions/user_action';
import {ActivityActionService} from '../../actions/activity_action';
import {SleepActionService} from '../../actions/sleep_action';
import {HeartrateActionService} from '../../actions/heartrate_action';
import { makeSelectors } from 'sematable';
import {Link} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format')
const tableSelector = makeSelectors("UserDataTable");

class UserComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            fitbitId: null,
            sessionUser: null,
            latestAggregateInfo: {},
            latestIntradayInfo: {},
            latestHr: {},
            latestSleep: {},
        }
        this.userToDataTableData = this.userToDataTableData.bind(this);
        this.onChangedInput = this.onChangedInput.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.fetchLatestInfo = this.fetchLatestInfo.bind(this);
    }

    fetchLatestInfo(){
        const {dispatch} = this.props;
        dispatch(UserActionService.fetchUsers((response)=>{
            const fitbitUsers = response.data && response.data.FitbitUsers ? response.data.FitbitUsers : [];

            _.forEach(fitbitUsers, (fitbitUser) => {
                dispatch(ActivityActionService.fetchLatestAggregate(fitbitUser.fitbitId, ()=>{}, ()=>{}, {id: fitbitUser.fitbitId}));
                dispatch(ActivityActionService.fetchLatestIntraday(fitbitUser.fitbitId, ()=>{}, ()=>{}, {id: fitbitUser.fitbitId}));
                dispatch(HeartrateActionService.fetchLatest(fitbitUser.fitbitId, ()=>{}, ()=>{}, {id: fitbitUser.fitbitId}));
                dispatch(SleepActionService.fetchLatest(fitbitUser.fitbitId, ()=>{}, ()=>{}, {id: fitbitUser.fitbitId}));
            });
        }));
    }

    componentDidMount(){
        this.fetchLatestInfo();
    }

    componentWillReceiveProps(nextProps){
        const { hasRefreshed } = nextProps;
        if (hasRefreshed(this.props, nextProps)){
            if (nextProps.users && nextProps.users.length){
                // on component load
            }
        }
        if (nextProps.latestId && nextProps.latestAggregateInfo){
            var latestAggregateInfo = this.state.latestAggregateInfo;
            latestAggregateInfo[nextProps.latestId] = nextProps.latestAggregateInfo
            this.setState({
                latestAggregateInfo: latestAggregateInfo,
                users: nextProps.users,
                sessionUser: nextProps.sessionUser
            });
        } if (nextProps.latestId && nextProps.latestIntradayInfo){
            var latestIntradayInfo = this.state.latestIntradayInfo;
            latestIntradayInfo[nextProps.latestId] = nextProps.latestIntradayInfo
            this.setState({
                latestIntradayInfo: latestIntradayInfo,
                users: nextProps.users,
                sessionUser: nextProps.sessionUser
            });
        } if (nextProps.latestHrId){
            var latestHr = this.state.latestHr;;
            latestHr[nextProps.latestHrId] = nextProps.latestHr;
            this.setState({
                latestHr: latestHr,
                users: nextProps.users,
                sessionUser: nextProps.sessionUser
            });
        } if (nextProps.latestSleepId){
            var latestSleep = this.state.latestSleep;;
            latestSleep[nextProps.latestSleepId] = nextProps.latestSleep;
            this.setState({
                latestSleep: latestSleep,
                users: nextProps.users,
                sessionUser: nextProps.sessionUser
            });
        } else {
            this.setState({
                users: nextProps.users,
                sessionUser: nextProps.sessionUser
            });
        }
    }
    userToDataTableData(users){
        if(!users) return [];
        var renderedUsers = _.map(users, (user => {
            var sessionUserFitbitId = -1
            if (this.state.sessionUser && this.state.sessionUser.fitbitId){
                sessionUserFitbitId = this.state.sessionUser.fitbitId
            }
            return {
                id: String(user.fitbitUserId),
                fitbitId: String(user.fitbitId),
                memberSince: String(user.memberSince),
                displayName: "******", //user.displayName,
                gender: user.gender,
                isSelected: user.fitbitId == sessionUserFitbitId,
                latestAggregateInfo: this.state.latestAggregateInfo[user.fitbitId],
                latestIntradayInfo: this.state.latestIntradayInfo[user.fitbitId],
                latestHr: this.state.latestHr[user.fitbitId],
                latestSleep: this.state.latestSleep[user.fitbitId],
                fetchState: this.props.fetchState
            }
        }));
        return renderedUsers;
    }
    fetchUsers(){
        const {dispatch} = this.props;
    }
    onChangedInput(newFitbitId){
        this.setState({...this.state, fitbitId: newFitbitId});
    }
    onRegister(){

        var min = 0;
        var max = 100000000
        var id = Math.round(min +  Math.random() * (max - min));
        var url = "http://localhost:8771/users/authorize?strainUserId=" + id
        window.open(url);
    }
    render(){
        return (
            <Card>
                <CardBlock>
                    <CardTitle>User Management</CardTitle>
                    <hr/>
                    <CardSubtitle>
                        <Link to={sformat("/userManagement/users/create")}>
                            <Button outline color="primary">Create User</Button>
                       </Link>
                    </CardSubtitle>
                    <UserDataTable data={this.userToDataTableData(this.state.users)}/>
                </CardBlock>
            </Card>
        )
    }
}

/**
<FormGroup row>
    <Label for="fitbitId" sm={1}>Fitbit ID</Label>
    <Col sm={2}>
        <Input type="text"
        value={this.state.fitbitId}
        onChange={e => this.onChangedInput(e.target.value)}
        />
    </Col>
</FormGroup>
*/


const mapStateToProps = state => {
    return {
        users: state.userComponent.users,
        sessionUser: state.userComponent.sessionUser,
        latestAggregateInfo: state.activityComponent.latestAggregateInfo,
        latestId: state.activityComponent.id,
        latestIntradayInfo: state.activityComponent.latestIntradayInfo,
        latestHrId: state.heartrateComponent.id,
        latestHr: state.heartrateComponent.latestHr,
        latestSleep: state.sleepComponent.latestSleep,
        latestSleepId: state.sleepComponent.id,
        fetchState: state.fetchComponent
        // tableFilter: tableSelector.getFilter(state),
        // tablePageInfo: tableSelector.getPageInfo(state)
        // UserDataTable: state.sematable.UserDataTable
    }
}

export default connect(mapStateToProps)(UserComponent);
