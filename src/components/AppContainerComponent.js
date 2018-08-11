import React from 'react';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import {Container, Row, Col} from 'reactstrap';
import HomePage from '../views/HomePage';
import TaskForm from '../views/TaskForm';

class AppContainer extends React.Component {
    constructor(props){
        super(props);
        console.log("ヾ(・ω・ｏ) HELLO THERE ヾ(・ω・ｏ)");
    }
    render(){
        return (
            <Container>
                <Row>
                    <Col sm="3"><NavLink to="/todoapp/tasks">View Tasks</NavLink></Col>
                    <Col sm="3"><NavLink to="/todoapp/new">New Task</NavLink></Col>
                </Row>
                <hr/>
                <Row>
                    <Route path="/todoapp/tasks" component={HomePage}/>
                    <Route path="/todoapp/new" component={TaskForm}/>
                </Row>
            </Container>
        )
    }
}

export default AppContainer
