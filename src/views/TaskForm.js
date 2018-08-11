import React from 'react';
import { Button, FormGroup, Form, Input, FormText, Label,
         Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { TaskActionService } from '../actions/action';
import {Redirect} from 'react-router-dom';


class TaskForm extends React.Component {
    constructor(props){
        super(props);
        this.state = { inputbox: null, redirect:false, localSession };
        this.onChange = this.onChange.bind(this);
        console.log("TASK FORM")
        console.log(props);
    }
    onChange(e){
        this.setState({text: e.target.value});
    }

    getInputValue(){
        return this.state.inputbox == null ? "" : this.state.inputbox.value;
    }


    render(){
        if (this.state.redirect) return (<Redirect to="/todoapp/tasks"/>);
        return(
            <Container>
                <Row><Col sm="6"><h3>Create New Task</h3></Col></Row>
                <Row>
                    <Col sm="6">
                        <Form>
                            <FormGroup>
                                <Label for="taskText">{"To-Do Text:"}</Label>
                                <Input type="text" name="text" id="taskText" placeholder="what to do today..."  getRef={e => { this.state.inputbox=e }}/>
                            </FormGroup>
                            <Button onClick={()=>{
                                var x =this.props.onSubmit(this.getInputValue())
                                console.log(this.state.inputbox.value);
                                this.state.inputbox.value = "";
                                this.setState({redirect: true});
                            }}>Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

// const mapStateToProps = (state) => {
//
// };

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (text) => dispatch(TaskActionService.create(text))
    }

}

export default connect(null, mapDispatchToProps)(TaskForm);
