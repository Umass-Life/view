import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;
const API_ROUTE = API_ROOT + "/balances"
const EDGE_API_ROUTE = API_ROOT + "/balanceEntityEdges"

const REQUESTING = "REQUESTING";
const RECEIVED_BALANCE = "RECEIVED_BALANCE"
const RECEIVED_BALANCES = "RECEIVED_BALANCES"
const RECEIVED_BALANCE_REMOVAL = "RECEIVED_BALANCE_REMOVAL"
const RECEIVED_BALANCE_UPDATE = "RECEIVED_BALANCE_UPDATE"
const RECEIVED_BALANCE_ENTITY_EDGE = "RECEIVED_BALANCE_ENTITY_EDGE"
const RECEIVED_BALANCE_ENTITY_EDGES = "RECEIVED_BALANCE_ENTITY_EDGES"

const _request = () => ({ type: REQUESTING })
const _receivedBalance = (balance) => ({ type: RECEIVED_BALANCE, balance: balance })
const _receivedBalances = (balances) => ({ type: RECEIVED_BALANCES, balances: balances })
const _receivedBalanceUpdate = (balance) => ({ type: RECEIVED_BALANCE_UPDATE, balance: balance })
const _receivedBalanceRemoval = (balance) => ({ type: RECEIVED_BALANCE_REMOVAL, balance: balance })

const _receivedEdge = (balanceEntityEdge) => ({ type: RECEIVED_BALANCE_ENTITY_EDGE, balanceEntityEdge: balanceEntityEdge})

class BalanceActionService {
    static buildEmptyState(){
        return {
            balances: [],
            balance: {},
            balanceEntityEdge: {},
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
                dispatch(_receivedBalances(response.data));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedBalances([]));
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
                dispatch(_receivedBalance(response.data.balance));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedBalance(null));
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
                dispatch(_receivedBalance(response.data.balance));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedBalance(null));
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
                dispatch(_receivedBalanceUpdate(response.data.balance));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedBalanceUpdate(null));
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
                dispatch(_receivedBalanceUpdate(response.data.balance));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedBalanceUpdate(null));
            })
        }
    }

    static searchByNameAndType(name, type, onSuccess, onFailure,
        options = { isLocal:false }){
        const url = sformat("{0}/search?name={1}&type={2}", API_ROUTE, name, type);
        return dispatch => {
            dispatch(_request());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedBalances(options.isLocal ? null : response.data.balances))
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedBalances(null));
            })
        }
    }

    static getBalanceEntityEdgeByBalance(balanceId, onSuccess, onFailure){
        const url = sformat("{0}?balanceId={1}", EDGE_API_ROUTE, balanceId);
        return dispatch => {
            dispatch(_request());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedEdge(response.data.balanceEntityEdge));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedEdge(null));
            })
        }
    }

    static recalculateCachedAmount(balanceId, onSuccess, onFailure){
        const url = sformat("{0}/recalculateCachedAmount/{1}", API_ROUTE, balanceId);
        return dispatch => {
            dispatch(_request());
            axios.post(url, null, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedBalance(response.data.balance));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedBalance(null));
            });
        }
    }
}

export {
    BalanceActionService,
    REQUESTING,
    RECEIVED_BALANCE,
    RECEIVED_BALANCES,
    RECEIVED_BALANCE_UPDATE,
    RECEIVED_BALANCE_REMOVAL,
    RECEIVED_BALANCE_ENTITY_EDGE
}
