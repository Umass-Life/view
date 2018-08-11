import {
    RECEIVED_ROLES,
    REQUESTING,
    RECEIVED_ROLE,
    RECEIVED_ROLE_REMOVED,
    RoleActionService,
} from '../actions/role_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const RoleReducer = (state = RoleActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {...state, isRequesting: true}
        case RECEIVED_ROLE_REMOVED:
            return {
                ...state,
                isRequesting: false,
                roles: _.filter(state.roles, x => x.id!=action.removedRoleId)
            };
        case RECEIVED_ROLES:
            // User will be wrapped List<Map<String, Object {Role, User}>>
            let roles = action.roles;
            if (!action.roles || action.roles.length == 0) roles = state.roles;
            return {
                ...state,
                roles: roles,
                isRequesting: false
            }
        case RECEIVED_ROLE:
            let role = action.role;
            if(!action.role) role = state.role;
            return {
                ...state,
                role: role,
                isRequesting: false
            }
        default:
            return state;
    }
}

export default RoleReducer
