import {
    RESETTING,
    REQUESTING,
    RECEIVED_ENTITY_POLICY_EDGE,
    RECEIVED_ENTITY_POLICY_EDGES,
    RECEIVED_ENTITY_POLICY_EDGE_REMOVAL,
    EntityPolicyEdgeAction
} from '../actions/entity_policy_edge_action';
import _ from 'lodash';
const sformat = require('string-format');

const EntityPolicyEdgeReducer = (state = EntityPolicyEdgeAction.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                ...state,
                isRequesting: true
            }
        case RECEIVED_ENTITY_POLICY_EDGES:
            return {
                ...state,
                entityPolicyEdges: action.entityPolicyEdges ? action.entityPolicyEdges : state.entityPolicyEdges
            }
        case RECEIVED_ENTITY_POLICY_EDGE_REMOVAL:
            return {
                ...state,
                ok: action.ok ? action.ok : 0
            }
        default:
            return state;
    }
}

export default EntityPolicyEdgeReducer;
