import React, {Component} from "react";
import {connect} from 'react-redux';
import {Container, Row, Col, Card, CardBlock, CardFooter, Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import {UserActionService} from '../../../actions/user_action';
import {Link, withRouter} from 'react-router-dom';
import _ from "lodash"
const sformat = require('string-format');

class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
        userId: this.props.match.params.id,
        localUser: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        _buttonStyle:{'width':'80px'}
    }
    this.create              = this.create.bind(this);
    this.onChangedInput      = this.onChangedInput.bind(this);
    this.jsonFromForm        = this.jsonFromForm.bind(this);
}

  onChangedInput(type, key, value){
      const newObj = this.state.localUser;
      newObj[key]=value;
      this.setState({
          localUser: newObj
      })
  }

  jsonFromForm(){
    const user = this.state.localUser;
    return {
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword
    };
  }

create(){
  const {dispatch} = this.props;
  const strainUserJson = this.jsonFromForm()
  dispatch(UserActionService.createStrainUser(strainUserJson, (response) => {
      console.log("200 OK CREATE STRAIN USER");
      console.log(response);
      const strainUser = response.data.StrainUser;
      const link = UserActionService.getFitbitAuthenticationLink(strainUser);
      window.location = link;
  }, (error) => {
      console.log("FAILED");
      console.log("ERR: " + error.response);
  }));
}

  render() {
    const size = 5;
    const user =  this.state.localUser;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBlock className="card-body p-4">
                  <h1>UMASS-LIFE REGISTRATION</h1>
                  <p className="text-muted">Create your account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon>@</InputGroupAddon>
                    <Input type="text"
                                value={user.email}
                                placeholder="Email (@umass.edu)"
                                onChange={e => this.onChangedInput("email", "email", e.target.value)}/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                    <Input type="password" name="password" id="password"
                                value={user.password}
                                placeholder="Password"
                                onChange={e => this.onChangedInput("user", "password", e.target.value)}/>
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                    <Input type="password" name="confirmPassword" id="confirmPassword"
                                value={user.confirmPassword}
                                placeholder="Confirm Password"
                                onChange={e => this.onChangedInput("user", "confirmPassword", e.target.value)}/>
                  </InputGroup>
                  <Button color="success" onClick={this.create} block>Create Account</Button>
                </CardBlock>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
      user: state.userComponent.user, // a userwrapper is sent
  }
}
export default withRouter(connect(mapStateToProps)(Register));
