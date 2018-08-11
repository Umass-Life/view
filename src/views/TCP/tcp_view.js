import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import VirtualizedSelect from 'react-virtualized-select';
import { TransactionActionService,
        TRANSACTION_STATES,
        TRANSACTION_TYPES
} from '../../actions/transaction_action';
import { TCPActionService,
        POLICY_TYPES,
        DISCRETE_TIMES
} from '../../actions/tcp_action';
import { BalanceActionService } from '../../actions/balance_action';
import {Link, withRouter} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format');

const MODE_UPDATE = "MODE_UPDATE"
const MODE_VIEW = "MODE_VIEW"
const MODE_CREATE = "MODE_CREATE"

const COMPONENT_URL = "/policies";

class TCPView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            policyId: this.props.match.params.id,
            mode: MODE_CREATE,
            localPolicy: {},
            transactionType: TRANSACTION_TYPES[0],
            renewPeriod: DISCRETE_TIMES[0],
            policyType: POLICY_TYPES[0],
            _buttonStyle:{'width':'80px'},
        }
        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.onChangedInput = this.onChangedInput.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
    }
    // View Configuration - Method that triggers form to render based on mode //
    configureViewType(){
        /* BUG FIX FOR REACT-ROUTER-DOM NOT UPDATING MATCH
            if location pathname doesn't match with params in match,
            re-redirect to self.
        */
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
        } else if (this.state.mode == MODE_CREATE){
            this.setState({localPolicy: {}})
        }
    }

    getSelectOptions(In, extract){ // extract -> [value, label]
        return _.map(In, x => { let tuple = extract(x); let a = tuple[0]; let b = tuple[1]; return {value: a, label: b} });
    }

    onChangedInput(key, value){
        const newObj = this.state.localPolicy;
        newObj[key]=value;
        this.setState({
            localPolicy: newObj
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
        const localPolicy = this.state.localPolicy;
        return {
            policyId: this.state.policyId,
            title: localPolicy.title,
            remark: localPolicy.remark,
            constant: localPolicy.constant,
            transactionType: this.state.transactionType,
            policyType: this.state.policyType,
            isNegative: new Boolean(localPolicy.isNegative),
            renewPeriod: this.state.renewPeriod,
            activeFrequency: localPolicy.activeFrequency
        };
    }

    create(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(TCPActionService.create(json, (response) => {
            this.props.history.replace(sformat("{0}/{1}/view", COMPONENT_URL, response.data.policy.id));
        }, (error) => {
            console.log("FAILED");
            console.log(error)
        }));
    }

    update(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(TCPActionService.updateById(this.state.policyId, json, (response)=>{
            this.props.history.push(sformat("{0}/{1}/view", COMPONENT_URL, response.data.policy.id));
        }, (error) => {
            console.log("UPDATE FAILED");
            alert("Update failed " + ((error.response && error.response.data) ? ": " + error.response.data.error : ""));
        }))
    }

    remove(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(TCPActionService.setEnabledById(this.state.policyId, false, (response)=>{
            this.props.history.replace(sformat("/{0}/{1}/view", COMPONENT_URL, this.state.policyId));
        }, (error)=>{
            console.log("-> FAIL REMOVAL");
            alert("Removal failed " + (error.response && error.response.data) ? ": " + error.response.data.error : "");
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
                        <Link to={sformat("{0}/{1}/update", COMPONENT_URL, this.state.policyId)}>
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
        const localPolicy = this.state.localPolicy;
        switch(this.state.mode){
            case MODE_CREATE:
                return (<div>Create Transaction Creation Policy (TCP)</div>)
            default:
                return (<div>
                    TCP # {localPolicy.id}: {localPolicy.title} {
                        (() => {
                            if (this.state.localPolicy.enabled) return (<Badge color="success">Is Active</Badge>)
                            else return <Badge color="danger">Deactivated</Badge>
                        })()
                    } </div>
                )
        }
    }

    // Component Cycle...=========
    componentDidMount(){
        const { dispatch } = this.props;
        //case path: /:id/:method
        if (this.props.match && this.props.match.params){
            const id = this.props.match.params.id;
            if (id && !isNaN(parseInt(id))){
                dispatch(TCPActionService.fetchById(id, (response) => {
                    console.log(response);
                }, (error) => {
                    console.log("FETCH CONTRACT BY ERR");
                    console.log(error);
                }));
            }
        }
    }

    componentWillReceiveProps(nextProps){
        const {dispatch} = this.props;
        if (nextProps.policy){
            this.setState({
                localPolicy: nextProps.policy,
            });
        }
        this.configureViewType();
    }

    render(){
        const size = 5;
        return (
            <Card>
                <CardBlock>
                    <CardTitle>{this.getTitle()}</CardTitle>
                    <hr/>
                        <FormGroup row>
                            <Label sm={2}>Title</Label>
                            <Col sm={size}>
                                <Input type="text" placeholder="title here.."
                                    value={this.state.localPolicy.title}
                                    onChange={e => this.onChangedInput("title", e.target.value)}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Value</Label>
                            <Col sm={size}>
                                <Input type="number" placeholder="amount here.." min="0"
                                    value={this.state.localPolicy.constant}
                                    onChange={e => this.onChangedInput("constant", Math.abs(e.target.value))}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Is Negative</Label>
                            <Col sm={size}>
                                <FormGroup check>
                                <Label check className={'label-static'}>
                                    <Input type="checkbox"
                                         value={this.state.localPolicy.isNegative}
                                         onChange={e => this.onChangedInput("isNegative", e.target.value) }
                                         disabled={this.modifiableField_C_U(true, true)}
                                    />{' '}
                                </Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Transaction Type</Label>
                            <Col sm={size}>
                                <Select type='text'
                                    options={this.getSelectOptions(TRANSACTION_TYPES, x=>[x,x])}
                                    value={this.getSelectOptions([this.state.transactionType], x=>[x,x])[0]}
                                    onChange={e => this.setState({transactionType: e.value})}
                                    disabled={this.modifiableField_C_U(true, false)}
                                    clearable={false}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Policy Type</Label>
                            <Col sm={size}>
                                <Select type='text'
                                    options={this.getSelectOptions(POLICY_TYPES, x=>[x,x])}
                                    value={this.getSelectOptions([this.state.policyType], x=>[x,x])[0]}
                                    onChange={e => this.setState({policyType: e.value})}
                                    disabled={this.modifiableField_C_U(true, true)}
                                    clearable={false}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Renew Period</Label>
                            <Col sm={size}>
                                <Select type='text'
                                    options={this.getSelectOptions(DISCRETE_TIMES, x=>[x,x])}
                                    value={this.getSelectOptions([this.state.renewPeriod], x=>[x,x])[0]}
                                    onChange={e => this.setState({renewPeriod: e.value})}
                                    disabled={this.modifiableField_C_U(true, true)}
                                    clearable={false}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Active Length</Label>
                            <Col sm={size}>
                                <Input type="number" placeholder="number of times " min="0"
                                    value={this.state.localPolicy.activeFrequency}
                                    onChange={e => this.onChangedInput("activeFrequency", Math.abs(e.target.value))}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Remark</Label>
                            <Col sm={size}>
                                <Input type="textarea" placeholder="remark here.."
                                    value={this.state.localPolicy.remark}
                                    onChange={e => this.onChangedInput("remark", e.target.value)}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            {this.getButtons()}
                        </FormGroup>


                </CardBlock>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        policy: state.TCPComponent.policy
    }
}
export default withRouter(connect(mapStateToProps)(TCPView));
