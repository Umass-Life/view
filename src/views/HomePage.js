import React from 'react';
import {Container, Row, Col, ListGroup, ListGroupItem} from 'reactstrap';
import {connect} from 'react-redux';
import TodoTask from '../components/TodoTask';

class HomePage extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
    }
    render(){
        return(
            <Container>
                <Row>
                    <Col sm="12">
                        <h3>Task Lists</h3>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12">
                        <ListGroup>
                        {
                            (()=>{
                                if (this.props.tasks.length == 0){
                                    return (<h5>{"No To-Do's"}</h5>);
                                } else {
                                    return this.props.tasks.map( (task) => {
                                        return (<ListGroupItem key={task.id}><TodoTask {...task}/></ListGroupItem>);
                                    });
                                }
                            })()
                        }
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProp = (state) => {
    console.log("STATES");
    console.log(state);
    return {tasks: state.tasks};
}

const mapDispatchToProp = (dispatch) => {
    return null;
}

export default connect(mapStateToProp)(HomePage);
