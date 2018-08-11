import React from 'react';
import { ListGroup, ListGroupItem, Button,
FormGroup, Label,
Modal, ModalHeader, ModalFooter, ModalBody,
Row, Col, Container} from 'reactstrap';
import _ from 'lodash';
import {connect} from 'react-redux';
import { dformat } from '../../utilities';
import { EntityPolicyEdgeAction } from '../../actions/entity_policy_edge_action';
import { TCPActionService } from '../../actions/tcp_action';
import Select from 'react-select'
import DatePicker from 'react-date-picker';

class EntityPolicyModalForm extends React.Component {
    constructor(props){
        super(props);
        const _date = new Date();
        this.state = {
            modal: false,
            edge: {
                policy: null,
                startDate: _date.getTime()
            },
            _defaultStartDate: _date
        }
        this.toggle = this.toggle.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
        this.onChangedInput = this.onChangedInput.bind(this);
        this.appendEdge = this.appendEdge.bind(this);
        this.isEdgeReady = this.isEdgeReady.bind(this);
    }

    appendEdge(){
        const edge = this.state.edge;
        const push_ready_edge = {policy: edge.policy, startDate: edge.startDate};
        this.props.onPushEdge(push_ready_edge);
        this.toggle();
    }
    toggle(){

        this.setState({
            modal: !this.state.modal,
            transactionType: null,
            edge: {
                policy: null,
                startDate: this.state._defaultStartDate.getTime()
            }
        });
    }
    getSelectOptions(In, extract){ // extract -> [value, label]
        return _.map(In, x => { let tuple = extract(x); let a = tuple[0]; let b = tuple[1]; return {value: a, label: b} });
    }
    onChangedInput(key, value){
        const newObj = this.state.edge;
        newObj[key]=value;
        this.setState({
            edge: newObj
        })
    }
    isEdgeReady(){
        const edge = this.state.edge;
        return edge.policy!=null && edge.policy.id!=null && edge.startDate != null;
    }
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(TCPActionService.listByType(this.props.transactionType, res => {}, err => {}));
    }
    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;
    }

    render(){
        const edge = this.state.edge;
        const size = 7;
        const labelSize=3;
        return (
            <div>
            <Button color="danger" onClick={this.toggle} disabled={this.props.mode == "MODE_VIEW"}>
                <i className="fa fa-plus" aria-hidden="true"></i>{' '}
                Add Policy Assignment
            </Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.transactionType}>
                <ModalHeader toggle={this.toggle}>Transaction Policy Assignment</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                    <Label sm={labelSize}>Policies</Label>
                    <Col sm={size}>
                        <Select
                            options={this.getSelectOptions(this.props.policies, x => [x, x.title])}
                            onChange={(e => this.onChangedInput("policy", e.value))}
                            value={edge && edge.policy ? this.getSelectOptions([edge.policy], x => [x, x.title])[0] : null}
                        />
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={labelSize}>Start Date</Label>
                        <Col sm={size}>
                            <DatePicker
                                calendarClassName={"my-calendar-in-view"}
                                onChange={ e => this.onChangedInput("startDate", e.getTime()) }
                                value={edge.startDate ? new Date(edge.startDate) : this.state._defaultStartDate}
                            />
                        </Col>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.appendEdge} disabled={!this.isEdgeReady()}>Add</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        policies: state.TCPComponent.policies
    }
}

export default connect(mapStateToProps)(EntityPolicyModalForm);
