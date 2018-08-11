import React, {Component} from "react";
import {Container, Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import {connect} from "react-redux"
import {SessionActionService} from '../../../actions/session_action';
import {Redirect} from "react-router-dom";

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            usernameInput: null,
            passwordInput: null,
            redirect: false
        }
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
        this.referenceInput = this.referenceInput.bind(this);
    }

    login(){
        let username = this.state.usernameInput.value;
        let password = this.state.passwordInput.value;
        console.log("[LOGGING IN] usr=\'{$username}\' pwd=\'{$password}\'");

        this.props.dispatch(SessionActionService.login(username, password))
        console.log("LOGIN SENTL: ");
        console.log(this.props.session);
    }

    onChange(){
        console.log(this.state.usernameInput.value);
    }

    referenceInput(name, e, defaultVal=""){
        this.state[name]=e;
        if (this.state[name]){
            console.log(defaultVal);
            this.state[name].value = defaultVal
        }
    }

    componentDidUpdate(){
        console.log("DISPATCH CHANGE REGISTERED !!!!!!!!");
        console.log(this.props.session);
        if (this.props.session && this.props.session.isAuthenticated){
            this.setState({'redirect':true});
        }
    }
  render() {
      if(this.state.redirect){
          this.state.redirect = false;
           return (<Redirect from="/login" to="/"/>)
       }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup className="mb-0">
                <Card className="p-4">
                  <CardBlock className="card-body">
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input type="text" placeholder="Username" getRef={e => {this.referenceInput('usernameInput', e, 'admin@ams.com')}} onChange={this.onChange}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                      <Input type="password" placeholder="Password" getRef={e => {this.referenceInput('passwordInput', e, '1234')}}/>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4" onClick={this.login}>Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                    </Row>
                  </CardBlock>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        session: state.session
    }
}

export default connect(mapStateToProps)(Login);
