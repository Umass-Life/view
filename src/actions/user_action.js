import axios from 'axios'
import config from '../config'
const {API_ROOT, ACC_ROOT, defaultAxiosHeaders} = config

const REQUESTING_USERS = "REQUESTING_USERS"
const RECEIVED_USERS = "RECEIVED_USERS"
const REQUEST_USER = "REQUEST_USER"
const RECEIVED_USER = "RECEIVED_USER"
const RECEIVED_USER_REMOVAL = "RECEIVED_USER_REMOVAL";
const SELECT_SESSION_USER = "SELECT_SESSION_USER";

const sformat = require('string-format');

//actions

const _requestUsers = () => {
    return {
        type: REQUESTING_USERS
    }
}
const _receivedUsers = (users) => {
    return {
        type: RECEIVED_USERS,
        users: users
    }
}

const _receivedUser = (user) => {
    return {
        type: RECEIVED_USER,
        responseData: null,
        user: user
    }
}

const _receivedUserRemoval = (response) => {
    return {
        type: RECEIVED_USER_REMOVAL,
        userRemoved: response.data
    }
}

const _selectSessionUserByFitbitId = (fitbitId) => {
    return {
        type: SELECT_SESSION_USER,
        fitbitId: fitbitId
    }
}
//ACTION CREATORS
class UserActionService {
    static buildEmptyState = () => {
        return {
            isRequesting: false,
            users: [],
            user: null,
            sessionUser: null,
            _type: "UserComponentObject"
        }
    }
    static fetchUsers = ( onSuccess, onError,options={includeProfile: true}) => {
        if (!onSuccess){ onSuccess = () => {}; }
        if (!onError) { onError = () => {}; }
        return (dispatch) => {
            dispatch(_requestUsers());
            var _arr = [];
            for(var key in options){ _arr.push(sformat("{0}={1}", key,options[key])); }
            var url = API_ROOT + "/users"
            if (_arr.length > 0){
                url += "?"+_arr.join("&")
            }
            console.log(url);
            axios.get(url, {
                headers: defaultAxiosHeaders({}),
                withCredentials: true
            }).then(response => {
                var users = response.data.FitbitUsers;
                if (response.data && response.data.FitbitProfiles){
                    var profiles = response.data.FitbitProfiles
                    if (profiles.length == users.length){
                        users = _.map(profiles, (p, idx) => { return {...users[idx], ...p } });
                    } else {
                        console.log("ERR profiles mismatch");
                    }
                }
                onSuccess(response);
                dispatch(_receivedUsers(users));
            }).catch(error => {
                console.log('[USER_ACTION ERR]');
                console.log(error);
                onError(error);
                dispatch(_receivedUsers(null))
            })
        }
    }
    static fetchUserById = (userId) => {
        return (dispatch) => {
            dispatch(_requestUsers());
            let url = API_ROOT + "/users/" + userId

            console.log("fetching User by id: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedUser(response.data));
            }).catch(error => {
                console.log('[USER_ACTION fetchByUserId ERR]')
                console.log(error);
                dispatch(_receivedUser(null));
            });
        }
    }

    static createStrainUser = (strainUserJson, onSuccess, onFailure) => {
        if (!onSuccess) { onSuccess = ()=>{}; }
        if (!onFailure) { onFailure = ()=>{}; }
        return (dispatch) => {
            dispatch(_requestUsers());
            let url = ACC_ROOT + "/strain-user"
            axios.post(url, strainUserJson,{ 
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedUser(response.data.StrainUser));
                onSuccess(response);
            }).catch(error => {
                dispatch(_receivedUser(null));
                onFailure(error);
            });
        }
    }

    static getFitbitAuthenticationLink = (strainUser) => {
        if (strainUser && strainUser.id){
            var url = API_ROOT + "/users/authorize?strainUserId=" + strainUser.id;
            return url;
        }
        return null;
    }

    static selectSessionUserbyFitbitId = (fitbitId) => {
        return (dispatch) => {
            dispatch(_selectSessionUserByFitbitId(fitbitId));
        }
    }

    //
    // static create = (user, onSuccess, onFailure) => {
    //     return (dispatch) => {
    //         const url = sformat("{0}/users/", API_ROOT);
    //         axios.post(url, user, {
    //             headers: defaultAxiosHeaders(),
    //             withCredentials:true
    //         }).then(response => {
    //             onSuccess();
    //         }).catch(error => {
    //             console.log("[USER_ACTION create ERR");
    //             console.log(error);
    //             dispatch(_receivedUser(null))
    //             onFailure();
    //         })
    //     }
    // }
    //
    // static update = (id, updateSchema, onSuccess, onFailure) => {
    //     return (dispatch) => {
    //         const url = sformat("{0}/users/update/{1}", API_ROOT, id);
    //         dispatch(_requestUsers())
    //         axios.post(url, updateSchema, {
    //             headers: defaultAxiosHeaders(),
    //             withCredentials: true
    //         }).then(response => {
    //             dispatch(_receivedUser(response));
    //             onSuccess();
    //         }).catch(error => {
    //             dispatch(_receivedUser(null));
    //             onFailure(error);
    //         })
    //     }
    // }

}

export {UserActionService, REQUESTING_USERS, RECEIVED_USERS, RECEIVED_USER, SELECT_SESSION_USER}
