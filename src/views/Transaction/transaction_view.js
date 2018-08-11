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
import { BalanceActionService } from '../../actions/balance_action';
import {Link, withRouter} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format');

const MODE_UPDATE = "MODE_UPDATE"
const MODE_VIEW = "MODE_VIEW"
const MODE_CREATE = "MODE_CREATE"

const COMPONENT_URL = "/transactions";

class TransactionView extends React.Component {
    constructor(props){
        super(props);
        const _targetDate = new Date();

        this.state = {
            transactionId: this.props.match.params.id,
            mode: MODE_CREATE,
            localTransaction: {},
            transactionType: TRANSACTION_TYPES[0],
            balances: [],
            selectedBalance:{},
            _buttonStyle:{'width':'80px'},
            _defaultTargetDate: _targetDate,
        }

        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.onChangedInput = this.onChangedInput.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
        this.loadBalances = this.loadBalances.bind(this);
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
            this.setState({localTransaction: {}})
        }
    }

    getSelectOptions(In, extract){ // extract -> [value, label]
        return _.map(In, x => { let tuple = extract(x); let a = tuple[0]; let b = tuple[1]; return {value: a, label: b} });
    }

    loadBalances(name, callback){
        const {dispatch} = this.props;
        dispatch(BalanceActionService.searchByNameAndType(name, this.state.transactionType, response => {
            if (response && response.data && response.data.balances){
                // this.setState({balances: response.data.balances});
                callback(null, {options: this.getSelectOptions(response.data.balances, x => [x, x.name])})
            }
            callback(null, {options: []})
        }, error =>{
            callback(null, {options: []})
        }));
    }

    onChangedInput(key, value){
        const newObj = this.state.localTransaction;
        newObj[key]=value;
        this.setState({
            localTransaction: newObj
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
        const localTransaction = this.state.localTransaction;
        return {
            transactionId: localTransaction.id,
            title: localTransaction.title,
            amount: parseFloat(localTransaction.amount),
            remark: localTransaction.remark,
            targetDate: localTransaction.targetDate ? localTransaction.targetDate : this.state._defaultTargetDate.getTime(),
            state: localTransaction.state,
            balanceId: this.state.selectedBalance.id,
            isNotificationPayment: localTransaction.isNotificationPayment
        };
    }

    create(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(TransactionActionService.create(json, (response) => {
            this.props.history.replace(sformat("/balances/{0}/view", json.balanceId));
        }, (error) => {
            console.log("FAILED");
            console.log(error)
        }));
    }

    update(){
        const {dispatch} = this.props;
        console.log("UPDATE");
        const json = this.jsonFromForm();
        console.log(json);
        dispatch(TransactionActionService.updateById(this.state.transactionId, json, (response)=>{
            this.props.history.push(sformat("{0}/{1}/view", COMPONENT_URL, this.state.transactionId));
        }, (error) => {
            console.log("UPDATE FAILED");
            alert("Update failed " + ((error.response && error.response.data) ? ": " + error.response.data.error : ""));
        }))
    }

    remove(){
        const {dispatch} = this.props;
        console.log("REMOVE");
        const json = this.jsonFromForm();
        dispatch(TransactionActionService.setEnabledById(this.state.transactionId, false, (response)=>{
            this.props.history.replace(sformat("/balances/{0}/view", json.balanceId));
        }, (error)=>{
            console.log("-> FAIL REMOVAL");
            alert("Removal failed " + (error.response && error.response.data) ? ": " + error.response.data.error : "");
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
                        <Link to={sformat("{0}/{1}/update", COMPONENT_URL, this.state.transactionId)}>
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
        const localTransaction = this.state.localTransaction;
        switch(this.state.mode){
            case MODE_CREATE:
                return (<div>Create Transaction</div>)
            default:
                return (<div>
                    Transaction # {localTransaction.id}: {localTransaction.title} {
                        (() => {
                            if (this.state.localTransaction.enabled) return (<Badge color="success">Is Active</Badge>)
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
        const getBalanceEntityEdge = (balanceId) => {
            dispatch(BalanceActionService.getBalanceEntityEdgeByBalance(balanceId, response => {
                const balanceEntityEdge = response.data.balanceEntityEdge;
                this.setState({
                    selectedBalance: balanceEntityEdge.balance,
                    transactionType: balanceEntityEdge.type
                })
            }, error =>{
                console.log("Unable to get balanceeEntityEdge");
                console.log(error);
            }));
        }
        if (this.props.match && this.props.match.params){
            const id = this.props.match.params.id;
            if (id && !isNaN(parseInt(id))){
                dispatch(TransactionActionService.fetchById(id, (response) => {
                    console.log("FETCH TRANSACTIOjn BY ID SUCCESS");
                    console.log(response);
                    const _transaction = response.data.transaction;
                    getBalanceEntityEdge(_transaction.balance.id);
                }, (error) => {
                    console.log("FETCH CONTRACT BY ERR");
                    console.log(error);
                }));
            } else if (this.props.location.search){
                const query = new URLSearchParams(this.props.location.search);
                getBalanceEntityEdge(query.get('balanceId'));
            }
        }
    }

    componentWillReceiveProps(nextProps){
        const {dispatch} = this.props;
        if (nextProps.transaction){
            this.setState({
                localTransaction: nextProps.transaction,
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
                                    value={this.state.localTransaction.title}
                                    onChange={e => this.onChangedInput("title", e.target.value)}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Payment Amount</Label>
                            <Col sm={size}>
                                <Input type="number" placeholder="amount here.."
                                    value={this.state.localTransaction.amount}
                                    onChange={e => this.onChangedInput("amount", e.target.value)}
                                    disabled={this.modifiableField_C_U(true, true)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Target Date </Label>
                            <Col sm={size}>
                                <DatePicker
                                    calendarClassName={"my-calendar-in-view"}
                                    onChange={(e)=>{
                                        if(this.state.mode != MODE_VIEW) this.onChangedInput("targetDate", e.getTime())
                                    }}
                                    value={this.state.localTransaction.targetDate ?
                                        new Date(this.state.localTransaction.targetDate) : this.state._defaultTargetDate}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Is Notification Payment</Label>
                            <Col sm={size}>
                                <FormGroup check>
                                <Label check className={'label-static'}>
                                    <Input type="checkbox"
                                         value={this.state.localTransaction.isNotificationPayment}
                                         onChange={e => { console.log(e); this.onChangedInput("isNotificationPayment", e.target.value); } }
                                         disabled={this.modifiableField_C_U(true, true)}
                                    />{' '}
                                </Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup row hidden={this.state.mode != MODE_VIEW}>
                            <Label sm={2}>Created Date <span style={{'font-style':'italic'}}>(read-only)</span></Label>
                            <Col sm={size}>
                                <DatePicker
                                    calendarClassName={"my-calendar-in-view"}
                                    value={new Date(this.state.localTransaction.created)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row hidden={this.state.mode != MODE_VIEW}>
                            <Label sm={2}>Updated Date <span style={{'font-style':'italic'}}>(read-only)</span></Label>
                            <Col sm={size}>
                                <DatePicker
                                    calendarClassName={"my-calendar-in-view"}
                                    value={new Date(this.state.localTransaction.lastModified)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row hidden={this.state.mode != MODE_VIEW}>
                            <Label sm={2}> Creator </Label>
                            <Col sm={size}>
                                <Input type="text"
                                    value={this.state.localTransaction.creator ? this.state.localTransaction.creator.username : "No creator"}
                                    disabled={this.modifiableField_C_U(false, false)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Transaction Type</Label>
                            <Col sm={size}>
                                <Select type='text'
                                    options={this.getSelectOptions(TRANSACTION_TYPES, x=>[x,x])}
                                    value={this.getSelectOptions([this.state.transactionType], x=>[x,x])[0]}
                                    onChange={e => this.setState({transactionType: e.value, balances: []})}
                                    disabled={this.modifiableField_C_U(true, false)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Balance</Label>
                            <Col sm={size}>
                            <VirtualizedSelect
                                async
                                backspaceRemoves={true}
                                loadOptions={this.loadBalances}
                                minimumInput={1}
                                onChange={e => this.setState({selectedBalance: e && e.value ? e.value : {}}) }
                                options={this.getSelectOptions(this.state.balances, x => [x, x.name])}
                                value={this.getSelectOptions([this.state.selectedBalance], x=>[x, x.name])[0]}
                                placeholder={"Search for a Balance name..."}
                                disabled={this.modifiableField_C_U(true, false)}
                            />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Remark</Label>
                            <Col sm={size}>
                                <Input type="textarea" placeholder="remark here.."
                                    value={this.state.localTransaction.remark}
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
        transaction: state.transactionComponent.transaction,
    }
}
export default withRouter(connect(mapStateToProps)(TransactionView));

/*
<AsyncComponent
    multi={false}
    value={this.state.value}
    onChange={this.onChange}
    onValueClick={this.gotoUser}
    loadOptions={this.getUsers}
    backspaceRemoves={this.state.backspaceRemoves} />
</Col>
*/
