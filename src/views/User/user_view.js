import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import FileList from '../FileList/file_list';
import { TRANSACTION_TYPE_EMPLOYEE } from '../../actions/transaction_action';
import {FileEntityAction} from '../../actions/file_entity_action';
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
                username: "",
                password: "",
                confirmPassword: "",
                enabled: false,
                roles: []
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
            files: [],
            initialFiles: [],
            _buttonStyle:{'width':'80px'}
        }
        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.removeFile = this.removeFile.bind(this);
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
            username: user.username,
            password: user.password,
            confirmPassword: user.confirmPassword,
            firstname: profile.firstname,
            lastname: profile.lastname,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            citizenId: profile.citizenId,
            address: profile.address,
            salary: parseFloat(profile.salary),
            fileEntities: _.map(this.state.files, x => x.id)
        };
    }

    onFileUpload(e){
        const { dispatch } = this.props;
        var file = e.target.files[0];
        dispatch(FileEntityAction.create(file, TRANSACTION_TYPE_EMPLOYEE, res => {
            if (res.data.fileEntity && res.data.fileEntity.id){
                this.setState({files: [...this.state.files, res.data.fileEntity]});
            }
        }, err => {}));
        e.target.value = null;
    }

    removeFile(i){
        this.setState({files: _.filter(this.state.files, (x,j) => i != j )});
    }

    create(){
        const {dispatch} = this.props;
        dispatch(UserActionService.create(this.jsonFromForm(), () => {
            this.props.history.replace('/userManagement/users');
        }, () => {
            console.log("FAILED");
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

    remove(){
        const {dispatch} = this.props;
        dispatch(UserActionService.remove(this.state.userId, (response)=>{
            this.props.history.replace('/userManagement/users');
        }, (error)=>{
            console.log("-> FAIL REMOVAL");
            console.log(error);
        }));
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
                return (<div>
                    Profile - {this.state.localProfile.firstname} {this.state.localProfile.lastname} {
                        (() => {
                            if (this.state.localUser.enabled) return (<Badge color="success">Is Active</Badge>)
                            else return <Badge color="danger">Deactivated</Badge>
                        })()
                    } </div>
                )
        }
    }

    // Component Cycle...=========
    componentDidMount(){
        const { dispatch } = this.props;
        FileEntityAction.reset();
        if (this.props.match && this.props.match.params){
            const userId = this.props.match.params.id;
            if (userId && !isNaN(parseInt(userId))){
                dispatch(UserActionService.fetchUserById(userId));
                dispatch(FileEntityAction.listByIdAndType(userId, TRANSACTION_TYPE_EMPLOYEE, res=>{}, err=>{}));
            }
        }
        this.configureViewType(this.props);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.user){
            const newLocalUser = {
                username: nextProps.user.username,
                password: nextProps.user.password,
                enabled: nextProps.user.enabled,
                roles: nextProps.user.roles,
                userId: nextProps.user.id
            }
            this.setState({localUser: newLocalUser, localProfile: nextProps.user.employeeProfile});
        }

        if (!_.isEqual(nextProps.files, this.state.initialFiles)){
            const newFiles = _.filter(this.state.files, file => file.entityId == -1);
            this.setState({files: [...nextProps.files, ...newFiles], initialFiles: nextProps.files})
        }

        if(!_.isEqual(this.props.match.params, nextProps.match.params)){
            this.configureViewType(nextProps);
        }
    }

    render(){
        const size = 5;
        const profile = this.state.localProfile;
        const user=  this.state.localUser;
        return (
            <Card>
                <CardBlock>
                    <CardTitle>{this.getTitle()}</CardTitle>
                    <hr/>
                    <Form>
                        <FormGroup row>
                            <Label for="username" sm={2}>Username</Label>
                            <Col sm={size}>
                                <Input type="text"
                                value={user.username}
                                onChange={e => this.onChangedInput("user", "username", e.target.value)}
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
        files: state.fileEntityComponent.files
    }
}
export default withRouter(connect(mapStateToProps)(UserView));
