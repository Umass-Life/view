import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import {RoleActionService, ROLE_TYPES} from '../../actions/role_action';
import {UserActionService} from '../../actions/user_action';
import {Link, withRouter} from 'react-router-dom';
import _ from "lodash"
import Select from 'react-select';
const sformat = require('string-format');

const MODE_UPDATE = "MODE_UPDATE"
const MODE_VIEW = "MODE_VIEW"
const MODE_CREATE = "MODE_CREATE"

const COMPONENT_URL = "/roles/"

class RoleView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roleId: this.props.match.params.id,
            mode: MODE_CREATE,
            localRole: {
                name: "",
                user: null,
                enabled: false
            },
            localInput: {
                nameInput: null,
                userInput: null,
            },
            _buttonStyle:{'width':'200px'}
        }
        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
    }
    // View Configuration - Method that triggers form to render based on mode //
    configureViewType(){
        /* BUGFIX FOR REACT-ROUTER-DOM NOT UPDATING MATCH
            if location pathname doesn't match with params in match,
            re-redirect to self.
        */
        console.log("[Role-VIEW] configuring view type");
        if(this.props.match.url != this.props.history.location.pathname){
            this.props.history.push(this.props.history.location.pathname);
        }
        if (this.props.match && this.props.match.params){
            const method = this.props.match.params.method;
            if (typeof(method) == 'string'){
                const x  = method.toLowerCase();
                switch(x){
                    case 'update': this.setState({mode: MODE_UPDATE}); break;
                    default: this.setState({mode: MODE_VIEW});
                }
            }
        }
    }

    //
    modifiableField_C_U(createBool, updateBool){
        switch(this.state.mode){
            case(MODE_UPDATE): return !updateBool;
            case(MODE_CREATE): return !createBool;
            default: return true;
        }
    }

    jsonFromForm(){
        return {
            role: this.state.localInput.nameInput.value,
            username: this.state.localInput.userInput.value,
        };
    }

    create(){
        const {dispatch} = this.props;
        console.log(this.jsonFromForm());
        dispatch(RoleActionService.create(this.jsonFromForm(), (response) => {
            this.props.history.replace('/roleManagement/roles');
        }, (error) => {
            console.log("FAILED");
            console.log(error);
        }));
    }

    update(){
        const {dispatch} = this.props;
        console.log("UPDATE");
        const json = this.jsonFromForm();
        console.log(json);
        dispatch(ActionService.update(this.state.Id, json, ()=>{
            this.props.history.push(sformat("/roleManagement/roles/{0}/view", this.state.Id));
        }, (error) => {
            console.log("UPDATE FAILED");
            console.log(error);
        }))
    }

    remove(){
        const {dispatch} = this.props;
        console.log("REMOVE");
        dispatch(RoleActionService.remove(this.state.Id, (response)=>{
            console.log("-> REMOVED !");
            console.log(response);
            this.props.history.replace('/roleManagement/roles');
        }, (error)=>{
            console.log("-> FAIL REMOVAL");
            console.log(error);
        }));
    }

    getSelectOptions(In, extract){ // extract -> [value, label]
        return _.map(In, x => { let tuple = extract(x); let a = tuple[0]; let b = tuple[1]; return {value: a, label: b} });
    }
    // Render Methods ===========
    getButtons(){
        /*
        <Col sm="1"><Button outline color="primary" style={this._buttonStyle}>Create</Button></Col>
        <Col sm="1"><Button color="warning" style={this._buttonStyle}>Update</Button></Col>
        <Col sm="1"><Button color="danger" style={this._buttonStyle}>Delete</Button></Col>
        */
        const mode = this.state.mode;

        switch(mode){
            case MODE_VIEW:
                return (
                    <Row>
                    <Col sm="4"><Button color="danger" style={this.state._buttonStyle} onClick={this.remove}>Remove</Button></Col>
                    </Row>
                );
            case MODE_UPDATE:
                return (<Row>
                    <Col sm="4"><Button color="warning" style={this.state._buttonStyle} onClick={this.update}>Update</Button></Col>

                    </Row>
                )
            default: // MODE_CREATE
                return (<Row><Col sm="4"><Button outline color="primary" style={this.state._buttonStyle} onClick={this.create}>Create</Button></Col></Row>)
        }
    }
    getTitle(){
        switch(this.state.mode){
            case MODE_CREATE:
                return (<div> Create Role </div>)
            default:
                return (<div>
                    Role - {this.state.localRole.user.username}
                    </div>
                )
        }
    }

    // Component Cycle...=========
    componentDidMount(){
        const { dispatch } = this.props;
        switch(this.state.mode){
            case MODE_VIEW:
                if (this.props.match && this.props.match.params){
                    const Id = this.props.match.params.id;
                    if (Id & !isNaN(parseInt(Id))){
                        dispatch(RoleActionService.fetchById(Id));
                    }
                }
                break;
            case MODE_CREATE:
                dispatch(UserActionService.fetchUsers());
            default:
                break;
        }
    }
    componentWillReceiveProps(nextProps){
        let newLocalAuthority = this.state.localRole;
        if (nextProps.authority){
            newLocalAuthority = {
                name: nextProps.authority.role,
                user: nextProps.authority.user,
                enabled: nextProps.authority.enabled,
                roleId: nextProps.authority.id
            }
            this.setState({localRole: newLocalAuthority, roleId: newLocalAuthority.roleId});
        } else {
            this.setState({localRole: newLocalAuthority});
        }
        this.configureViewType();
    }

    render(){
        const size = 5;
        console.log("STATE");
        console.log(this.state);
        return (
            <Card>
                <CardBlock>
                    <CardTitle>{this.getTitle()}</CardTitle>
                    <hr/>
                    <Form>
                        <FormGroup row>
                            <Label for="role" sm={1}>Role</Label>
                            <Col sm={3}>
                            {
                                ((self) => {
                                    if (self.state.mode == MODE_VIEW){
                                        return (
                                            <Col sm={size}>
                                                <Select name="role" value={self.localRole.name}/>
                                                <Input type="text" name="role" id="role"
                                                getRef={e => self.getInputRef("name", e, self.state.localRole.name)}
                                                readOnly={self.modifiableField_C_U(false, false)}/>
                                            </Col>
                                        )
                                    } else {
                                        return (
                                            <Select
                                                name="role"
                                                options={self.getSelectOptions(ROLE_TYPES, x => [x, x])}
                                                onChange={x => {
                                                    self.setState({localInput: {
                                                        ...self.state.localInput,
                                                        nameInput: x
                                                    }})
                                                }}
                                                value={self.state.localInput.nameInput}
                                            />
                                        )
                                    }
                                })(this)
                            }
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="user" sm={1}>User</Label>
                            <Col sm={3}>
                            {
                                ((self) => {
                                    if(self.state.mode == MODE_VIEW){
                                        return (
                                            <Col sm={size}>
                                                <Input type="text" name="user" id="user"
                                                getRef={e => self.getInputRef("username", e, self.state.localRole.user.username)}
                                                readOnly={self.modifiableField_C_U(false, false)}/>
                                            </Col>
                                        )
                                    } else {
                                        return (
                                            <Select
                                                name="user"
                                                options={self.getSelectOptions(self.props.userComponent.users, x => [x.username, x.username])}
                                                onChange={x => {
                                                    self.setState({localInput: {
                                                        ...self.state.localInput,
                                                        userInput: x
                                                    }})
                                                }}
                                                value={self.state.localInput.userInput}
                                            />
                                        )
                                    }
                                })(this)
                            }
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
        role : state.roleComponent.role,
        userComponent: state.userComponent
        // tableFilter: tableSelector.getFilter(state),
        // tablePageInfo: tableSelector.getPageInfo(state)
        // DataTable: state.sematable.DataTable
    }
}
export default withRouter(connect(mapStateToProps)(RoleView));
