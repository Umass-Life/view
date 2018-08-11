import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Container, Card, CardTitle,
    CardBody, CardBlock, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText, Alert, Badge
} from 'reactstrap'
import DatePicker from 'react-date-picker';
import Select from 'react-select'
import {BalanceActionService} from '../../actions/balance_action';
import { TransactionActionService, TRASACTION_TYPES } from '../../actions/transaction_action'
import { TransactionDataTable, mapTransactionsToData } from '../Transaction/transaction_data_table'
import {Link, withRouter} from 'react-router-dom';
import { dformat } from '../../utilities'
import _ from "lodash"
const sformat = require('string-format');

const MODE_UPDATE = "MODE_UPDATE"
const MODE_VIEW = "MODE_VIEW"
const MODE_CREATE = "MODE_CREATE"

const COMPONENT_URL = "/balances";

class BalanceView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            balanceId: this.props.match.params.id,
            mode: MODE_VIEW,
            localBalance: {},
            balanceEntityEdge: {},
            transactions: [],
            _buttonStyle:{'width':'80px'},
        }

        this.modifiableField_C_U = this.modifiableField_C_U.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.update = this.update.bind(this);
        this.recalculateCachedAmount = this.recalculateCachedAmount.bind(this);
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
        }
    }

    getSelectOptions(In, extract){ // extract -> [value, label]
        return _.map(In, x => { let tuple = extract(x); let a = tuple[0]; let b = tuple[1]; return {value: a, label: b} });
    }

    onChangedInput(key, value){
        const newObj = this.state.localBalance;
        newObj[key]=value;
        this.setState({
            localBalance: newObj
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
        const localBalance = this.state.localBalance;
        return {
            name: localBalance.name,
            remark: localBalance.remark,
        };
    }

    update(){
        const {dispatch} = this.props;
        const json = this.jsonFromForm();
        dispatch(BalanceActionService.updateById(this.state.balanceId, json, ()=>{
            this.props.history.push(sformat("{0}/{1}/view", COMPONENT_URL, this.state.balanceId));
        }, (error) => {
            console.log("UPDATE FAILED");
            alert("Update failed " + ((error.response && error.response.data) ? ": " + error.response.data.error : ""));
        }))
    }

    recalculateCachedAmount(){
        const {dispatch} = this.props;
        dispatch(BalanceActionService.recalculateCachedAmount(this.state.balanceId, res => {
            console.log("cached amount recalculated: " + JSON.stringify(res.data.balance));
        }, err => {
            console.log("recalculatiopn failed");
            console.log(err.response.data);
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
                        <Link to={sformat("{0}/{1}/update", COMPONENT_URL, this.state.balanceId)}>
                            <Button color="warning" style={this._buttonStyle}>Edit</Button>
                        </Link>
                    </Col>
                    </Row>
                );
            default:
                return (<Row>
                    <Col sm="1"><Button color="warning" style={this._buttonStyle} onClick={this.update}>Update</Button></Col>
                    </Row>
                )
        }
    }
    getTitle(){
        const localBalance = this.state.localBalance;
        switch(this.state.mode){
            case MODE_CREATE:
                return (<div>Create Balance</div>)
            default:
                return (<div>
                    Balance #{localBalance.id} : {localBalance.name}{
                        (() => {
                            if (localBalance.enabled) return (<Badge color="success">Is Active</Badge>)
                            else return <Badge color="danger">Deactivated</Badge>
                        })()
                    } </div>
                )
        }
    }
    componentDidMount(){
        const { dispatch } = this.props;
        if (this.props.match && this.props.match.params){
            const id = this.props.match.params.id;
            if (id && !isNaN(parseInt(id))){
                dispatch(BalanceActionService.getBalanceEntityEdgeByBalance(id, res => {},
                (error) => {
                    console.log("FETCH BALNACE BY ERR");
                    console.log(error);
                }));
                dispatch(TransactionActionService.fetchByBalance(id, res => {},
                (error) => {
                    console.log("CANNOT FETCH TRANSACTIONS FOR ID " + id);
                    console.log(error);
                }))
            }
        }
    }
    componentWillReceiveProps(nextProps){
        const {dispatch} = this.props;
        if (nextProps.balance){
            this.setState({
                localBalance: nextProps.balance,
                transactions: nextProps.transactions
            });
        }
        this.configureViewType();
    }

    render(){
        const size = 5;
        const balance = this.state.localBalance;
        return (
            <div>
            <Card>
                <CardBlock>
                    <CardTitle>{this.getTitle()}</CardTitle>
                    <hr/>
                        <FormGroup row>
                            <Label sm={2}>Name</Label>
                            <Col sm={size}>
                                <Input type="text"
                                    value={balance.name}
                                    onChange={e => this.onChangedInput("name", e.target.value)}
                                    disabled={this.modifiableField_C_U(false, true)}
                                />

                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Total Amount</Label>
                            <Col sm={size} className="label-static">
                                {balance.cachedAmount}
                                <Button outline color="warning" onClick={this.recalculateCachedAmount} style={{'margin-left':'10px'}}>Recalculate</Button>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Payment Status</Label>
                            <Col sm={size} className="label-static">
                                {balance.state}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Latest Transaction</Label>
                            <Col sm={size} className="label-static">
                                {balance.latestTransactionId ? "#"+String(balance.latestTransactionId) : "no transactions have been made"}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Created Date</Label>
                            <Col sm={size} className="label-static">
                                {dformat(new Date(balance.createDate), {pretty: true})}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Modified Date</Label>
                            <Col sm={size} className="label-static">
                                {dformat(new Date(balance.modifiedDate), {pretty: true})}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Remark</Label>
                            <Col sm={size} >
                                <Input type="textarea"
                                    value={balance.remark}
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
            <Card >
                <CardBlock>
                <CardTitle> Transactions </CardTitle>
                <hr/>
                <CardSubtitle>
                    <Link to={"/transactions/create?balanceId="+balance.id}><Button outline color="primary">Create</Button></Link>
                </CardSubtitle>
                <TransactionDataTable data={mapTransactionsToData(this.state.transactions)}/>
                </CardBlock>
            </Card>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        entity: state.balanceComponent.balanceEntityEdge.entity,
        edge: state.balanceComponent.balanceEntityEdge,
        balance: state.balanceComponent.balanceEntityEdge.balance,
        transactions: state.transactionComponent.transactions
    }
}
export default withRouter(connect(mapStateToProps)(BalanceView));
