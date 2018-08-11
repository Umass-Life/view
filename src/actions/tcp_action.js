import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;
const API_ROUTE = API_ROOT + "/policies"
const EDGE_API_ROUTE = API_ROOT + "/entityPolicyEdges"

const REQUESTING = "REQUESTING";
const RECEIVED_POLICY = "RECEIVED_POLICY"
const RECEIVED_POLICIES = "RECEIVED_POLICIES"
const RECEIVED_POLICY_REMOVAL = "RECEIVED_POLICY_REMOVAL"
const RECEIVED_POLICY_UPDATE = "RECEIVED_POLICY_UPDATE"
const RECEIVED_POLICY_ENTITY_EDGE = "RECEIVED_POLICY_ENTITY_EDGE"
const RECEIVED_POLICY_ENTITY_EDGES = "RECEIVED_POLICY_ENTITY_EDGES"

const POLICY_PERCENT = "PERCENT";
const POLICY_RAW = "RAW";
const POLICY_CONSTANT = "CONSTANT";
const POLICY_TYPES = [POLICY_PERCENT, POLICY_RAW, POLICY_CONSTANT];

const DISCRETE_TIME_MONTH = "MONTH";
const DISCRETE_TIME_DAY = "DAY";
const DISCRETE_TIME_ANNUAL = "ANNUAL";
const DISCRETE_TIME_QUARTER = "QUARTER";
const DISCRETE_TIME_BI_ANNUAL = "BI-ANNUAL";
const DISCRETE_TIMES = [DISCRETE_TIME_DAY, DISCRETE_TIME_MONTH, DISCRETE_TIME_ANNUAL, DISCRETE_TIME_QUARTER, DISCRETE_TIME_BI_ANNUAL]

const _request = () => ({ type: REQUESTING })
const _receivedPolicy = (policy) => ({ type: RECEIVED_POLICY, policy: policy })
const _receivedPolicies = (policies) => ({ type: RECEIVED_POLICIES, policies: policies })
const _receivedPolicyUpdate = (policy) => ({ type: RECEIVED_POLICY_UPDATE, policy: policy })
const _receivedPolicyRemoval = (policy) => ({ type: RECEIVED_POLICY_REMOVAL, policy: policy })

const _receivedEdge = (policyEntityEdge) => ({ type: RECEIVED_POLICY_ENTITY_EDGE, policyEntityEdge: policyEntityEdge})

class TCPActionService {
    static buildEmptyState(){
        return {
            policies: [],
            policy: {},
            policyEntityEdge: {},
            isRequesting: false
        }
    }
    static fetchAll(onSuccess, onFailure){
        return dispatch => {
            dispatch(_request())
            axios.get(API_ROUTE, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedPolicies(response.data.policies));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedPolicies([]));
            });
        }
    }
    static fetchById(id, onSuccess, onFailure){
        const url = sformat("{0}/{1}", API_ROUTE, id);
        return dispatch => {
            dispatch(_request());
            axios.get(url,{
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedPolicy(response.data.policy));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedPolicy(null));
            });
        }
    }
    static create(data, onSuccess, onFailure){
        const url = API_ROUTE;
        return dispatch => {
            dispatch(_request());
            axios.post(url, data, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedPolicy(response.data.policy));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedPolicy(null));
            })
        }
    }
    static updateById(id, data, onSuccess, onFailure){
        const url = sformat("{0}/update/{1}", API_ROUTE, id);
        return dispatch => {
            dispatch(_request());
            axios.post(url, data, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedPolicyUpdate(response.data.policy));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedPolicyUpdate(null));
            })
        }
    }

    static setEnabledById(id, enable, onSuccess, onFailure){
        const url = sformat("{0}/setEnabled/{1}", API_ROUTE, id);
        return dispatch => {
            dispatch(_request());
            axios.post(url, {enabled: enable}, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedPolicyUpdate(response.data.policy));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedPolicyUpdate(null));
            })
        }
    }

    static listByType(type, onSuccess, onFailure){
        const url = sformat("{0}?type={1}", API_ROUTE, type);
        return dispatch => {
            dispatch(_request())
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedPolicies(response.data.policies));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedPolicies([]));
            });
        }
    }

}

export {
    TCPActionService,
    REQUESTING,
    RECEIVED_POLICY,
    RECEIVED_POLICIES,
    RECEIVED_POLICY_UPDATE,
    RECEIVED_POLICY_REMOVAL,
    RECEIVED_POLICY_ENTITY_EDGE,
    POLICY_RAW,
    POLICY_PERCENT,
    POLICY_CONSTANT,
    POLICY_TYPES,
    DISCRETE_TIMES,
    DISCRETE_TIME_DAY,
    DISCRETE_TIME_MONTH,
    DISCRETE_TIME_ANNUAL,
    DISCRETE_TIME_QUARTER,
    DISCRETE_TIME_BI_ANNUAL
}
