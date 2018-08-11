import {
    TCPActionService,
    REQUESTING,
    RECEIVED_POLICY,
    RECEIVED_POLICIES,
    RECEIVED_POLICY_UPDATE,
    RECEIVED_POLICY_REMOVAL
} from '../actions/tcp_action'
import _ from 'lodash';
const sformat = require('string-format');

const replaceItem = (In, item) => {
    return _.map(In, (x, i) => {
        if (x.id == item.id) { return item }
        return x;

    })
}
const TCPReducer = (state = TCPActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                ...state,
                isRequesting: true
            }
        case RECEIVED_POLICY:
            return {
                ...state,
                isRequesting: false,
                policy: action.policy ? action.policy : state.policy
            }
        case RECEIVED_POLICIES:
            return {
                ...state,
                isRequesting: false,
                policies: action.policies && action.policies.length > 0 ? action.policies : state.policies
            }
        case RECEIVED_POLICY_UPDATE:
            return {
                ...state,
                isRequesting: false,
                policy: action.policy ? action.policy : state.policy,
                policies: action.policy ? replaceItem(state.policies, action.policy) : state.policies
            }
        case RECEIVED_POLICY_REMOVAL:
            return {
                ...state,
                isRequesting: false,
                policies: action.policy ? action.policy : state.policy
            }
        default:
            return state;
    }
}

export default TCPReducer
