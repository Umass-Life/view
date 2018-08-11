import axios from 'axios';
import fetch from 'isomorphic-fetch';
import FormData from 'form-data';
import config from '../config';

const {API_ROOT} = config;
// ACTION CONSTANTS
const REQUEST_AUTHENTICATION = "REQUEST_AUTHENTICATION";
const RECEIVED_AUTHENTICATION = "RECEIVED_AUTHENTICATION";
const REQUEST_LOGIN = "REQUEST_LOGIN";
const RECEIVED_LOGIN = "RECEIVED_LOGIN";
const REQUEST_LOGOUT = "REQUEST_LOGOUT";
const RECEIVED_LOGOUT = "RECEIVED_LOGOUT";

// ACTIONS
const _receivedAuthentication = (response) => {
    return {
        type: RECEIVED_AUTHENTICATION,
        user: response.user,
        isAuthenticated: response.isAuthenticated,
        roles: response.roles,
        balanceId: response.balanceId
    }
}

const _requestAuthentication = () => {
    return {
        type: REQUEST_AUTHENTICATION
    }
}

// ACTION CREATORS
class SessionActionService {
    static requestAuthentication = (prevState = {}) => {
        return (dispatch) => {
            dispatch(_requestAuthentication());
            let url = API_ROOT + '/attemptAuthentication'
            axios.get(url, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                withCredentials: true
            }).then(response => {
                dispatch(_receivedAuthentication(response.data));
            }).catch(error => {
                dispatch(_receivedAuthentication({isAuthenticated: false}))
            })
        }
    }

    static login = (username, password) => {
        return (dispatch) => {
            dispatch(_requestAuthentication());
            let url = API_ROOT + "/login"
            let formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
                withCredentials: true
            }).then(response => {
                console.log("login success");
                console.log(response);
                let data = response.data;
                dispatch(_receivedAuthentication({
                    isAuthenticated:data.isAuthenticated,
                    user:data.user,
                    roles: data.roles
                }));
            }).catch(error => {
                console.log("login failed");
                dispatch(_receivedAuthentication({isAuthenticated:false}));
            })
        }
    }

    static logout = () => {
        let logoutAnyways = (dispatch) => {
            dispatch(_receivedAuthentication({
                isAuthenticated: false,
                user: null
            }))
        }
        return (dispatch) => {
            let url = API_ROOT + "/customLogout";
            axios.get(url, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
                withCredentials: true
            }).then(response => {
                logoutAnyways(dispatch)
            }).catch(error => {
                logoutAnyways(dispatch)
            })
        }
    }

    static ping_test = () => {
        return dispatch => {
            axios.get(API_ROOT + '/ping', {
                headers: {"Access-Control-Allow-Origin": "*"}
            }).then(response => {
                console.log("ping response")
                console.log(response);
                dispatch(_receivedAuthentication({isAuthenticated:false}));
            }).catch(error => {
                console.log("ping error");
                dispatch(_receivedAuthentication({isAuthenticated:false}));
            })
        }
    }

    static buildEmptyState(isRequesting = false, hasReceived = false, user = null, isAuthenticated = false, roles = [], balanceId){
        return {
            isRequesting: isRequesting,
            hasReceived: hasReceived,
            user: user,
            roles: roles,
            isAuthenticated: isAuthenticated,
            balanceId: balanceId,
            _type: "SessionObject"
        }
    }
}

export {REQUEST_AUTHENTICATION, RECEIVED_AUTHENTICATION, SessionActionService };
