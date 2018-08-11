import {
    RECEIVED_USERS,
    REQUESTING_USERS,
    RECEIVED_USER,
    RECEIVED_USER_REMOVAL,
    SELECT_SESSION_USER,
    UserActionService,
} from '../actions/user_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const UserReducer = (state = UserActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING_USERS:
            return {...state, isRequesting: true}
        case RECEIVED_USER_REMOVAL:
            return {
                ...state,
                user: {
                    ...state.user,
                    enabled: !action.userRemoved
                },
                isRequesting: false
            }
        case RECEIVED_USERS:
            if (!action.users || action.users.length == 0){
                return {...state, isRequesting: false}
            }
            return {
                ...state,
                isRequesting: false,
                users: action.users,
                sessionUser: state.sessionUser ? state.sessionUser : action.users[0]
            }
        case RECEIVED_USER:
            if(!action.responseData) return {...state, isRequesting: false};
            return {
                ...state,
                user: {
                    ...action.responseData.FitbitUser
                },
                isRequesting: false,
            }
        case SELECT_SESSION_USER:
            var newSessionUser = null;
            if (state.users && state.users.length && action.fitbitId){
                newSessionUser = _.find(state.users, x => x.fitbitId == action.fitbitId)
            }
            return {
                ...state,
                sessionUser: newSessionUser
            }
        default:
            return state;
    }
}

export default UserReducer
