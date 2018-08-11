import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;

const RESETTING = "RESETTING";
const REQUESTING = "REQUESTING";
const RECEIVED_ENTITY_POLICY_EDGE = "RECEIVED_ENTITY_POLICY_EDGE"
const RECEIVED_ENTITY_POLICY_EDGES = "RECEIVED_ENTITY_POLICY_EDGES"
const RECEIVED_ENTITY_POLICY_EDGE_REMOVAL = "RECEIVED_ENTITY_POLICY_EDGE_REMOVAL"
const RECEIVED_ENTITY_POLICY_EDGE_UPDATE = "RECEIVED_ENTITY_POLICY_EDGE_UPDATE"

const _reset = () => ({type:RESETTING});
const _request = () => ({ type: REQUESTING });
const _receivedEdge = (edge) => ({ type: RECEIVED_ENTITY_POLICY_EDGE, entityPolicyEdge: edge})
const _receivedEdges = (edges) => ({ type: RECEIVED_ENTITY_POLICY_EDGES, entityPolicyEdges: edges })
const _receivedEdgeRemoval = (ok) => ({ type: RECEIVED_ENTITY_POLICY_EDGE_REMOVAL, ok: ok})
const _receivedEdgeUpdate = (edge) => ({ type: RECEIVED_ENTITY_POLICY_EDGE_UPDATE, entityPolicyEdge: edge})

const API_ROUTE = API_ROOT + "/entityPolicyEdges"

class EntityPolicyEdgeAction {
    static buildEmptyState(){
        return {
            entityPolicyEdge: null,
            entityPolicyEdges: [],
            isRequesting: false
        }
    }
    static listByIdAndType(id, type, onSuccess, onFailure){
        const url = sformat("{0}?entityId={1}&type={2}", API_ROUTE, id, type);
        return dispatch => {
            dispatch(_request());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                const xx = _receivedEdges(response.data.entityPolicyEdges);
                dispatch(xx);
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedEdges([]));
            })
        }
    }

    static removeByIdAndType(id, type, onSuccess,  onFailure){
        const url = sformat("{0}/remove/{1}/{2}", API_ROUTE, type, id);
        return dispatch => {
            dispatch(_request());
            axios.post(url, null, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedEdgeRemoval(response.data.ok));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedEdgeRemoval({ok: 0}));
            })
        }
    }

    static reset = () => (_reset());
}

export {
    RESETTING,
    REQUESTING,
    RECEIVED_ENTITY_POLICY_EDGE,
    RECEIVED_ENTITY_POLICY_EDGES,
    RECEIVED_ENTITY_POLICY_EDGE_REMOVAL,
    RECEIVED_ENTITY_POLICY_EDGE_UPDATE,
    EntityPolicyEdgeAction
}
