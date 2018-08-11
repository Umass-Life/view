import React from 'react';
import { ListGroup, ListGroupItem, Button,
    FormGroup, Label,
    Modal, ModalHeader, ModalFooter, ModalBody,
    Row, Col, Container} from 'reactstrap';
import { dformat } from '../../utilities';
import _ from 'lodash';

class EntityPolicyView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modal: false
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle(){
        this.setState({modal: !this.state.modal})
    }

    render(){
        const policy = this.props.edge.policy;
        const edge = this.props.edge;
        const labelSize=5;
        const size=7;
        const colStyle = {'margin-top':'5px'}
        const labStyle = {'font-weight': 'bold'}
        return (
        <div>
        <Button outline color="primary" onClick={this.toggle} style={{'margin-top':'-9px'}} size="sm">
            View
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.transactionType}>
            <ModalHeader toggle={this.toggle}>Transaction Creation Policy</ModalHeader>
            <ModalBody>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>Policy</Label> <Col sm={size} style={colStyle}>{policy.title} (#{policy.id})</Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>Policy Type</Label> <Col sm={size} style={colStyle} style={colStyle}>{policy.policyType}</Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>Policy Constant</Label> <Col sm={size}>{policy.isNegative ? -1*policy.constant : policy.constant} </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>Renew Period</Label> <Col sm={size} style={colStyle}>{policy.renewPeriod}</Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>Policy Remark</Label> <Col sm={size} style={colStyle}>{policy.remark}</Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>Start Date</Label> <Col sm={size} style={colStyle}>{dformat(new Date(edge.startDate), {pretty:true})}</Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>End Date</Label> <Col sm={size} style={colStyle}>{dformat(new Date(edge.endDate), {pretty:true})}</Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={labelSize} style={labStyle}>Renewa Date</Label> <Col sm={size} style={colStyle}>{dformat(new Date(edge.renewDate),{pretty:true})}</Col>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggle}>OK</Button>
            </ModalFooter>
        </Modal>
        </div>
    )}

};

export default EntityPolicyView;
