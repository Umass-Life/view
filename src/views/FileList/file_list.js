import React from 'react';
import { ListGroup, ListGroupItem, Button,
Row, Col, Container} from 'reactstrap';
import _ from 'lodash';
import {connect} from 'react-redux';
import  { FileEntityAction } from '../../actions/file_entity_action'

const FileList = ({files, removeFile, mode}) => {
    const removeCell = (i) => {
        return () => removeFile(i);
    }
    const overflowCSS = {
        'overflow': 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
    }
    const renderCells = () =>

        (_.map(files, (x,i) => (<ListGroupItem key={i} style={{'height': '40px', 'padding': '10px 15px'}}>
                <Row>
                    <Col sm={7} style={overflowCSS}>{x.name}</Col>
                    <Col sm={3}><a href={FileEntityAction.downloadById(x.id)}>download</a></Col>
                    <Col sm={2}>  <Button disabled={mode=="MODE_VIEW"} color="danger" onClick={removeCell(i)} size={"sm"} style={{'margin-top':'-9px'}}>
                    <i className="fa fa-times" aria-hidden="true"></i></Button></Col>
                </Row>
        </ListGroupItem>)))

    return (
        <ListGroup>
            {renderCells()}
        </ListGroup>
    )
}

export default FileList;
