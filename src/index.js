import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Provider, connnect} from 'react-redux';
import store from './store';
// Styles; Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'

import '../scss/react-select.scss'
// Containers
import Full from './containers/Full/'
// Views
import Login from './views/Pages/Login/'
import Register from './views/Pages/Register/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

import { SessionActionService } from './actions/session_action'

class App extends React.Component {
    render(){
        return (
            <HashRouter>
              <Switch>
                <Route exact path="/login" name="Login Page" component={Login}/>
                <Route exact path="/register" name="Register Page" component={Register}/>
                <Route exact path="/404" name="Page 404" component={Page404}/>
                <Route exact path="/500" name="Page 500" component={Page500}/>
                <Route path="/" name="Home" component={Full}/>
              </Switch>
            </HashRouter>
        )
    }
}


ReactDOM.render((
    <Provider store={store}>
      <App/>
     </Provider>
), document.getElementById('root'));
