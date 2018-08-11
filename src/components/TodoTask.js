import React from 'react';
import {Container, Row, Col, Button} from 'reactstrap';

class TodoTask extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col sm='2'>{this.props.id}</Col>
                    <Col sm='4'>{this.props.text}</Col>
                    <Col sm='1'>
                        <Button color='warning'>Update</Button>
                    </Col>
                    <Col sm='1'>
                        <Button color='danger' style={{'marginLeft': '5px'}}>Delete</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default TodoTask;
