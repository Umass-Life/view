import React from 'react';
import { ListGroup, ListGroupItem, Button,
Row, Col, Container} from 'reactstrap';
import _ from 'lodash';
import {connect} from 'react-redux';
import { dformat } from '../../utilities';
import { EntityPolicyEdgeAction } from '../../actions/entity_policy_edge_action';
import EntityPolicyView from './entity_policy_view'

const EntityPolicyEdgeList = ({edges, removeEdge, mode}) => {
    const removeCell = (i) => {
        return () => removeEdge(i);
    }
    const overflowCSS = {
        'overflow': 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
    }
    const renderCells = () =>
        (_.map(edges, (x,i) => (<ListGroupItem key={i} style={{'height': '40px', 'padding': '10px 15px'}}>
                <Row>
                    <Col sm={5} style={overflowCSS}>{x.policy.title}</Col>
                    <Col sm={3}>{x && x.startDate ? dformat(new Date(x.startDate), {month_num: true}) : ""}</Col>
                    <Col sm={2}><EntityPolicyView edge={x} style={{'margin-top':'-9px'}}/></Col>
                    <Col sm={2}>  <Button disabled={mode=="MODE_VIEW"} color="danger" onClick={removeCell(i)} size={"sm"} style={{'margin-top':'-9px'}}>
                    <i className="fa fa-times" aria-hidden="true"></i></Button></Col>
                </Row>
        </ListGroupItem>)))

    return (
        <ListGroup style={{'margin-top':'10px'}}> 
            {renderCells()}
        </ListGroup>
    )
}

export default EntityPolicyEdgeList;
