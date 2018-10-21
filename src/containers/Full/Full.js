import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';

// Business Logic Component
import UserComponent from '../../views/User/user_component';
import UserView from '../../views/User/user_view';
import RoleComponent from '../../views/Role/role_component';
import RoleView from '../../views/Role/role_view';
import SleepComponent from '../../views/Sleep/sleep_component';
import SleepTSComponent from '../../views/SleepTimeSerie/sleep_ts_component';
import HeartrateComponent from '../../views/Heartrate/heartrate_component';
import ActivityComponent from '../../views/Activity/activity_component';
import ActivityTSComponent from '../../views/ActivityTimeSerie/activity_ts_component';
import EMAComponent from '../../views/EMA/ema_component'
import {UserActionService} from '../../actions/user_action';
import {connect} from 'react-redux';

class Full extends Component {
    constructor(props){
        console.log("(￣▽￣)ノ APP INITIALIZED (￣▽￣)ノ");
        super(props);
        this.state = {
            sessionUser: null
        }
        this.renderComponent = this.renderComponent.bind(this);
    }
    isAuthenticated(){
        // dispatch(SessionActionService.requestAuthentication());
    }

    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(UserActionService.fetchUsers())
        // this.isAuthenticated();
    }

    componentWillReceiveProps(nextProps){
        this.setState({sessionUser: nextProps.sessionUser})
    }

    renderComponent(f){

        return (props) => {
            const sessionUser = this.props.sessionUser;
            var newProps = {
                ...props,
                sessionUser: sessionUser,
                refresh: new Date().getTime(),
                hasRefreshed: (thisProps, nextProps) => {
                    return nextProps.refresh!=thisProps.refresh
                }
            }
            return f(newProps);
        }
    }

  render() {
    //   if (this.state.localSession.hasReceived && !this.state.localSession.isAuthenticated) return (<Redirect from="/" to="/login"/>);
    // else if (this.state.localSession.hasReceived && this.state.localSession.isAuthenticated) { return (
    /**
    {(props) => {
        var newProps = {...this.props, refresh: new Date().getTime()}
        console.log("WHAT");
        return (<ActivityComponent  {...newProps}/>)
    }}/>
    // <Route path="/userManagement/users/:id/view" name="UserView" render={this.renderComponent((props) => <UserView {...props}/>)}/>
    */
      return (<div className="app root-style">
        <Header {...this.state}/>
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/userManagement/users/:id/:method" name="UserView" render={this.renderComponent((props) => <UserView{...props}/>)}/>
                <Route path="/userManagement/users/create" name="UserView" render={this.renderComponent((props) => <UserView{...props}/>)}/>
                <Route path="/userManagement/users" name="UserComponent" render={this.renderComponent((props) => <UserComponent{...props}/>)}/>

                <Route path="/roleManagement/roles/:id/view" name="RoleView" component={RoleView}/>
                <Route path="/roleManagement/roles/create" name="RoleView" component={RoleView}/>
                <Route path="/roleManagement/roles" name="RoleComponent" component={RoleComponent}/>

                <Route path="/sleep/:id/view" name="SleepTSComponent" render={this.renderComponent((props) => <SleepTSComponent {...props}/>)} />
                <Route path="/sleep" name="SleepComponent" render={this.renderComponent((props) => <SleepComponent {...props}/>)} />


                <Route path="/heartrate" name="HeartrateComponent" render={this.renderComponent( (props) => <HeartrateComponent {...props} />)}/>
                <Route path="/activities/timeserie" name="ActivityTSComponent" render={this.renderComponent( (props) => <ActivityTSComponent {...props} />)}/>
                <Route path="/activities" name="ActivityComponent" render={this.renderComponent( (props) => <ActivityComponent {...props} />)}/>
                <Route path="/ema" name="EMAComponent" render={this.renderComponent( (props) => <EMAComponent {...props} />)}/>


                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
  // )} else return (<h1> Loading.... </h1>)
  )}
}


// const mapDispatchToProps = (dispatch) => {
//     return SessionActionService.requestAuthentication();
// }
const mapStateToProps = (state) => {
    return {
        sessionUser: state.userComponent.sessionUser
    }
}

export default connect(mapStateToProps)(Full);
