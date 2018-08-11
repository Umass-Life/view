import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import FileList from '../FileList/file_list';
import {CustomerProfileActionService} from '../../actions/customer_profile_action';
import { TRANSACTION_TYPE_CUSTOMER } from '../../actions/transaction_action';
// import { ContractActionService } from '../../actions/contract_action';
import {FileEntityAction} from '../../actions/file_entity_action';
import {Link, withRouter} from 'react-router-dom';
// import { ContractDataTable, contractsToData } from '../Contract/contract_data_table';
import _ from "lodash"
const sformat = require('string-format');

const MODE_UPDATE = "MODE_UPDATE"
const MODE_VIEW = "MODE_VIEW"
const MODE_CREATE = "MODE_CREATE"

const COMPONENT_URL = "/customerProfileManagement/customerProfiles";

const CONTRACT_REQUEST_ID = "customerProfileView";

class CustomerProfileView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            customerProfileId: this.props.match.params.id,
            mode: MODE_CREATE,
            localProfile: {
                firstname: "",
                lastname: "",
            	phoneNumber: "",
            	email:"",
            	address: "",
            	citizenId: ""
            },
            contracts: [],
            files: [],
            initialFiles: [],
            _buttonStyle:{'width':'80px'}
        }

        this.onChangedInput = this.onChangedInput.bind(this);
        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.removeFile = this.removeFile.bind(this);
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
        } else if (this.state.mode == MODE_CREATE){
            this.setState({localProfile: {}});
        }
    }

    onChangedInput(key, value){
        const newObj = this.state.localProfile;
        newObj[key]=value;
        this.setState({
            localProfile: newObj
        })
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
        const profile = this.state.localProfile;
        return {
            firstname: profile.firstname,
            lastname: profile.lastname,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            citizenId: profile.citizenId,
            address: profile.address,
            remark: profile.remark,
            fileEntities: _.map(this.state.files, x => x.id)
        };
    }


    onFileUpload(e){
        const { dispatch } = this.props;
        var file = e.target.files[0];
        dispatch(FileEntityAction.create(file, TRANSACTION_TYPE_CUSTOMER, res => {
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
        dispatch(CustomerProfileActionService.create(this.jsonFromForm(), (res) => {
            this.props.history.replace(COMPONENT_URL);
        }, () => {
            console.log("FAILED");
        }));
    }

    update(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(CustomerProfileActionService.update(this.state.customerProfileId, json, (res)=>{
            this.props.history.push(sformat("{0}/{1}/view", COMPONENT_URL, this.state.customerProfileId));
        }, (error) => {
            console.log("UPDATE FAILED");
            console.log(error);
        }))
    }

    remove(){
        const {dispatch} = this.props;
        dispatch(CustomerProfileActionService.remove(this.state.customerProfileId, (response)=>{
            this.props.history.replace(COMPONENT_URL);
        }, (error)=>{
            console.log("-> FAIL REMOVAL");
            console.log(error);
        }));
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
                    <Col sm="1">
                        <Link to={sformat("{0}/{1}/update", COMPONENT_URL, this.state.customerProfileId)}>
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
                return (<Row><Col sm="1"><Button outline color="primary" style={this._buttonStyle} onClick={this.create}>Create</Button></Col></Row>)
        }
    }
    getTitle(){
        switch(this.state.mode){
            case MODE_CREATE:
                return (<div>Customer Registration</div>)
            default:
                return (<div>
                    Profile - {this.state.localProfile.firstname} {this.state.localProfile.lastname} {
                        (() => {
                            if (this.state.localProfile.enabled) return (<Badge color="success">Is Active</Badge>)
                            else return <Badge color="danger">Deactivated</Badge>
                        })()
                    } </div>
                )
        }
    }

    // Component Cycle...=========
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(FileEntityAction.reset());

        if (this.props.match && this.props.match.params){
            const profileId = this.props.match.params.id;
            if (profileId && !isNaN(parseInt(profileId))){
                dispatch(CustomerProfileActionService.fetchCustomerProfileById(profileId, (response) => {}, (error) => {
                    console.log("FETCH ID ERR");
                    console.log(error);
                }));
                const contractRequestOptions = {profileId: profileId, id: CONTRACT_REQUEST_ID};
                dispatch(FileEntityAction.listByIdAndType(profileId, TRANSACTION_TYPE_CUSTOMER, res=>{}, err=>{}));
                // dispatch(ContractActionService.fetchAll({}, res => {}, err => {}, contractRequestOptions));
            }
        }
        this.configureViewType(this.props);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.customerProfile){
            this.setState({localProfile: nextProps.customerProfile});
        }
        const contractComponent = nextProps.contractComponent;
        if (contractComponent && contractComponent.id == CONTRACT_REQUEST_ID){
            this.setState({contracts: contractComponent.contracts})
        }

        /*
        if request for files is different than what we initially got, we update it
        and join with new files.
        */
        if (!_.isEqual(nextProps.files, this.state.initialFiles)){
            const newFiles = _.filter(this.state.files, file => file.entityId == -1);
            this.setState({files: [...nextProps.files, ...newFiles], initialFiles: nextProps.files})
        }

        if(!_.isEqual(nextProps.match.params, this.props.match.params)){
            this.configureViewType(nextProps);
        }
    }

    render(){
        const size = 5;
        const customerProfile = this.state.localProfile;
        return (
            <div>
            <Card>
                <CardBlock>
                    <CardTitle>{this.getTitle()}</CardTitle>
                    <hr/>
                    <Form>
                        <FormGroup row>
                            <Label for="firstname" sm={2}>Firstname</Label>
                            <Col sm={size}>
                                <Input type="text" name="firstname" id="firstname"
                                value={customerProfile.firstname}
                                onChange={e => this.onChangedInput("firstname", e.target.value)}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="lastname" sm={2}>Lastname</Label>
                            <Col sm={size}>
                                <Input type="text" name="lastname" id="lastname"
                                value={customerProfile.lastname}
                                onChange={e => this.onChangedInput("lastname", e.target.value)}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="email" sm={2}>Email</Label>
                            <Col sm={size}>
                                <Input type="email" name="email" id="email"
                                value={customerProfile.email}
                                onChange={e => this.onChangedInput("email", e.target.value)}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="phoneNumber" sm={2}>Phone Number</Label>
                            <Col sm={size}>
                                <Input type="text" name="phoneNumber" id="phoneNumber"
                                value={customerProfile.phoneNumber}
                                onChange={e => this.onChangedInput("phoneNumber", e.target.value)}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="address" sm={2}>Address</Label>
                            <Col sm={size}>
                                <Input type="text" name="address" id="address"
                                value={customerProfile.address}
                                onChange={e => this.onChangedInput("address", e.target.value)}
                                readOnly={this.modifiableField_C_U(true, true)}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="citizenId" sm={2}>Citizen Identification</Label>
                            <Col sm={size}>
                                <Input type="text" name="citizenId" id="citizenId"
                                value={customerProfile.citizenId}
                                onChange={e => this.onChangedInput("citizenId", e.target.value)}
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
                        <FormGroup row>
                            <Label sm={2}>Remark</Label>
                            <Col sm={size}>
                                <Input type="textarea" placeholder="remark here.."
                                    value={customerProfile.remark}
                                    onChange={e => this.onChangedInput("remark", e.target.value)}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            {this.getButtons()}
                        </FormGroup>
                    </Form>

                </CardBlock>
            </Card>
            <Card>
                <CardBlock>
                    <CardTitle>Contracts</CardTitle>
                    <hr/>
                </CardBlock>
            </Card>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        customerProfile: state.customerProfileComponent.customerProfile,
        files: state.fileEntityComponent.files,
    }
}
export default withRouter(connect(mapStateToProps)(CustomerProfileView));
