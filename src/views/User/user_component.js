import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import UserDataTable from './user_data_table';
import {UserActionService} from '../../actions/user_action';
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
            sessionUser: null
        }
        this.userToDataTableData = this.userToDataTableData.bind(this);
        this.onChangedInput = this.onChangedInput.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }
    componentDidMount(){
        this.props.dispatch(UserActionService.fetchUsers());
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            users: nextProps.users,
            sessionUser: nextProps.sessionUser
        });
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
                displayName: user.displayName,
                gender: user.gender,
                isSelected: user.fitbitId == sessionUserFitbitId
            }
        }));
        return renderedUsers;
    }
    onChangedInput(newFitbitId){
        this.setState({...this.state, fitbitId: newFitbitId});
    }
    onRegister(){
        console.log(this.state.fitbitId);
        var min = 0;
        var max = 100000000
        var id = Math.round(min +  Math.random() * (max - min));
        var url = "http://localhost:8771/users/authorize?strainUserId=" + id
        window.open(url);
    }
    render(){
        console.log('11111');
        console.log(this.state.sessionUser);
        return (
            <Card>
                <CardBlock>
                    <CardTitle>User Management</CardTitle>
                    <hr/>
                    <CardSubtitle>
                        <Button outline color="primary" onClick={this.onRegister}>Create User</Button>
                    </CardSubtitle>
                    <UserDataTable data={this.userToDataTableData(this.state.users)} bob={()=>{return 1}}    />
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
        sessionUser: state.userComponent.sessionUser

        // tableFilter: tableSelector.getFilter(state),
        // tablePageInfo: tableSelector.getPageInfo(state)
        // UserDataTable: state.sematable.UserDataTable
    }
}

export default connect(mapStateToProps)(UserComponent);
