import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import {UserActionService} from '../../actions/user_action';
import {Link, withRouter} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format');

const MODE_UPDATE = "MODE_UPDATE"
const MODE_VIEW = "MODE_VIEW"
const MODE_CREATE = "MODE_CREATE"

class UserView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: this.props.match.params.id,
            mode: MODE_CREATE,
            localUser: {
                email: "",
                password: "",
                confirmPassword: "",
            },
            localProfile: {
                firstname: "",
                lastname: "",
            	phoneNumber: "",
            	email:"",
            	address:"",
            	citizenId: "",
            	salary: 0.0,
            },
            _buttonStyle:{'width':'80px'}
        }
        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.onChangedInput = this.onChangedInput.bind(this);
    }
    // View Configuration - Method that triggers form to render based on mode //
    configureViewType(nextProps){
        if (nextProps.match && nextProps.match.params){
            const method = nextProps.match.params.method;
            if (typeof(method) == 'string'){
                const x  = method.toLowerCase();
                switch(x){
                    case 'update': this.setState({mode: MODE_UPDATE}); break;
                    default: this.setState({mode: MODE_VIEW});
                }
            }
        } else {
            if (this.state.mode == MODE_CREATE){
                this.setState({localUser: {}, localProfile: []});
            }
        }
    }

    onChangedInput(type, key, value){
        if (type == "profile"){
            const newObj = this.state.localProfile;
            newObj[key]=value;
            this.setState({
                localProfile: newObj
            })
        } else {
            const newObj = this.state.localUser;
            newObj[key]=value;
            this.setState({
                localUser: newObj
            })
        }
    }

    modifiableField_C_U(createBool, updateBool){
        switch(this.state.mode){
            case(MODE_UPDATE): return !updateBool;
            case(MODE_CREATE): return !createBool;
            default: return true;
        }
    }

    jsonFromForm(){
        const profile = this.state.localProfile;
        const user = this.state.localUser;
        return {
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword
        };
    }

    create(){
        const {dispatch} = this.props;
        const strainUserJson = this.jsonFromForm()
        dispatch(UserActionService.createStrainUser(strainUserJson, (response) => {
            console.log("200 OK CREATE STRAIN USER");
            console.log(response);
            const strainUser = response.data.StrainUser;
            const link = UserActionService.getFitbitAuthenticationLink(strainUser);
            window.location = link;
        }, (error) => {
            console.log("FAILED");
            console.log("ERR: " + error.response);
        }));
    }
    update(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(UserActionService.update(this.state.userId, json, ()=>{
            this.props.history.push(sformat("/userManagement/users/{0}/view", this.state.userId));
        }, (error) => {
            console.log("UPDATE FAILED");
            console.log(error);
        }))
    }
    // Render Methods ===========
    getButtons(){
        const mode = this.state.mode;
        switch(mode){
            case MODE_VIEW:
                return (
                    <Row>
                    <Col sm="1">
                        <Link to={sformat("/userManagement/users/{1}/update", this.props.match.url, this.state.userId)}>
                            <Button color="warning" style={this._buttonStyle}>Edit</Button>
                        </Link>
                    </Col>
                    </Row>
                );
            case MODE_UPDATE:
                return (<Row>
                    <Col sm="1"><Button color="warning" style={this._buttonStyle} onClick={this.update}>Update</Button></Col>
                    <Col sm="1"><Button color="danger" style={this._buttonStyle} onClick={this.remove}>Remove</Button></Col>
                    </Row>
                )
            default: // MODE_CREATE
                return (<Col sm="1"><Button outline color="primary" style={this._buttonStyle} onClick={this.create}>Create</Button></Col>)
        }
    }
    getTitle(){
        switch(this.state.mode){
            case MODE_CREATE:
                return (<div>User Registration</div>)
            default:
                return (
                    <div>
                        Profile - {this.state.localProfile.firstname} {this.state.localProfile.lastname} {
                            (() => {
                                if (this.state.localUser.enabled) return (<Badge color="success">Is Active</Badge>)
                                else return <Badge color="danger">Deactivated</Badge>
                            })()
                        } 
                    </div>
                )
        }
    }

    // Component Cycle...
    
    componentDidMount(){
        const { dispatch } = this.props;
        if (this.props.match && this.props.match.params){
            const userId = this.props.match.params.id;
            if (userId && !isNaN(parseInt(userId))){
                dispatch(UserActionService.fetchUserById(userId));
            }
        }
        this.configureViewType(this.props);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.user){
            const newLocalUser = {
                email: nextProps.user.email,
                password: nextProps.user.password,
                userId: nextProps.user.id
            }
            this.setState({localUser: newLocalUser, localProfile: nextProps.user.employeeProfile});
        }

        if(!_.isEqual(this.props.match.params, nextProps.match.params)){
            this.configureViewType(nextProps);
        }
    }

    render(){
        const size = 5;
        const profile = this.state.localProfile;
        const user =  this.state.localUser;
        return (
            <Card>
                <CardBlock>
                    <CardTitle>{this.getTitle()}</CardTitle>
                    <hr/>
                    <Form>
                        <FormGroup row>
                            <Label for="email" sm={2}>Email</Label>
                            <Col sm={size}>
                                <Input type="text"
                                value={user.email}
                                onChange={e => this.onChangedInput("email", "email", e.target.value)}
                                readOnly={this.modifiableField_C_U(true, false)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="password" sm={2}>Password</Label>
                            <Col sm={size}>
                                <Input type="password" name="password" id="password"
                                value={user.password}
                                onChange={e => this.onChangedInput("user", "password", e.target.value)}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row hidden={this.state.mode == MODE_VIEW}>
                            <Label for="confirmPassword" sm={2}>Confirm Password</Label>
                            <Col sm={size}>
                                <Input type="password" name="confirmPassword" id="confirmPassword"
                                value={user.confirmPassword}
                                onChange={e => this.onChangedInput("user", "confirmPassword", e.target.value)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row hidden={this.state.mode == MODE_CREATE}>
                            <Label for="roles" sm={2}>Roles</Label>
                            <Col sm={size}>
                                <Input type="text" name="roles" id="roles"
                                value={user.roles && user.roles.length > 0 ?
                                    user.roles.length > 1 ?
                                        _.chain(user.roles).map(x => x.role).reduce((a, b) => a + ", " + b).value() : user.roles[0].role
                                    : ""
                                }
                                readOnly={true}/>
                            </Col>
                        </FormGroup>
                        
                        <FormGroup>
                            {this.getButtons()}
                        </FormGroup>
                    </Form>

                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userComponent.user, // a userwrapper is sent
    }
}
export default withRouter(connect(mapStateToProps)(UserView));


/**
 
<FormGroup row>
        <Label for="firstname" sm={2}>Firstname</Label>
        <Col sm={size}>
            <Input type="text" name="firstname" id="firstname"
            value={profile.firstname}
            onChange={e => this.onChangedInput("profile", "firstname", e.target.value)}
            readOnly={this.modifiableField_C_U(true, true)}/>
        </Col>
    </FormGroup>
    <FormGroup row>
        <Label for="lastname" sm={2}>Lastname</Label>
        <Col sm={size}>
            <Input type="text" name="lastname" id="lastname"
            value={profile.lastname}
            onChange={e => this.onChangedInput("profile", "lastname", e.target.value)}
            readOnly={this.modifiableField_C_U(true, true)}/>
        </Col>
    </FormGroup>
    <FormGroup row>
        <Label for="email" sm={2}>Email</Label>
        <Col sm={size}>
            <Input type="email" name="email" id="email"
            value={profile.email}
            onChange={e => this.onChangedInput("profile", "email", e.target.value)}
            readOnly={this.modifiableField_C_U(true, true)}/>
        </Col>
    </FormGroup>
    <FormGroup row>
        <Label for="phoneNumber" sm={2}>Phone Number</Label>
        <Col sm={size}>
            <Input type="text" name="phoneNumber" id="phoneNumber"
            value={profile.phoneNumber}
            onChange={e => this.onChangedInput("profile", "phoneNumber", e.target.value)}
            readOnly={this.modifiableField_C_U(true, true)}/>
        </Col>
    </FormGroup>
    <FormGroup row>
        <Label for="address" sm={2}>Address</Label>
        <Col sm={size}>
            <Input type="text" name="address" id="address"
            value={profile.address}
            onChange={e => this.onChangedInput("profile", "address", e.target.value)}
            readOnly={this.modifiableField_C_U(true, true)}/>
        </Col>
    </FormGroup>
    <FormGroup row>
        <Label for="citizenId" sm={2}>Citizen Identification</Label>
        <Col sm={size}>
            <Input type="text" name="citizenId" id="citizenId"
            value={profile.citizenId}
            onChange={e => this.onChangedInput("profile", "citizenId", e.target.value)}
            readOnly={this.modifiableField_C_U(true, true)}/>
        </Col>
    </FormGroup>
    <FormGroup row>
        <Label for="salary" sm={2}>Salary</Label>
        <Col sm={size}>
            <Input type="number" name="salary" id="salary"
            value={profile.salary}
            onChange={e => this.onChangedInput("profile", "salary", e.target.value)}
            readOnly={this.modifiableField_C_U(true, true)}/>
        </Col>
    </FormGroup>
    <FormGroup row>
        <Label sm={2}>Files</Label>
        <Col sm={size}>
            <Input type="file" onChange={this.onFileUpload} hidden={this.state.mode==MODE_VIEW}/>
            <FileList files={this.state.files} removeFile={this.removeFile} mode={this.state.mode}/>
        </Col>
    </FormGroup>


 */