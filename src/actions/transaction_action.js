import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;
const API_ROUTE = API_ROOT + "/transactions"

const REQUESTING = "REQUESTING";
const RECEIVED_TRANSACTION = "RECEIVED_TRANSACTION"
const RECEIVED_TRANSACTIONS = "RECEIVED_TRANSACTIONS"
const RECEIVED_TRANSACTION_REMOVAL = "RECEIVED_TRANSACTION_REMOVAL"
const RECEIVED_TRANSACTION_UPDATE = "RECEIVED_TRANSACTION_UPDATE"

const TRANSACTION_TYPE_CONTRACT = "CONTRACT"
const TRANSACTION_TYPE_EMPLOYEE = "EMPLOYEE_PROFILE"
const TRANSACTION_TYPE_CUSTOMER = "CUSTOMER_PROFILE"
const TRANSACTION_TYPES = [TRANSACTION_TYPE_CONTRACT, TRANSACTION_TYPE_EMPLOYEE]

const TRANSACTION_STATE_PENDING = "PENDING"
const TRANSACTION_STATE_OVERDUE = "OVERDUE"
const TRANSACTION_STATE_COMPLETE = "COMPLETE"
const TRANSACTION_STATE_INVALIDATED = "INVALIDATED"
const TRANSACTION_STATES = [TRANSACTION_STATE_PENDING, TRANSACTION_STATE_COMPLETE, TRANSACTION_STATE_OVERDUE, TRANSACTION_STATE_OVERDUE]

const _request = () => ({ type: REQUESTING })
const _receivedTransaction = (transaction) => ({ type: RECEIVED_TRANSACTION, transaction: transaction })
const _receivedTransactions= (transactions) => ({ type: RECEIVED_TRANSACTIONS, transactions: transactions })
const _receivedTransactionUpdate = (transaction) => ({ type: RECEIVED_TRANSACTION_UPDATE, transaction: transaction })
const _receivedTransactionRemoval = (transaction) => ({ type: RECEIVED_TRANSACTION_REMOVAL, transaction: transaction })

class TransactionActionService {
    static buildEmptyState(){
        return {
            transactions: [],
            transaction: {},
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
                dispatch(_receivedTransactions(response.data));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedTransactions([]));
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
                dispatch(_receivedTransaction(response.data.transaction));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedTransaction(null));
            });
        }
    }

    static fetchByBalance(balanceId, onSuccess, onFailure, options = {offset: 0, limit:1000}){
        const url = sformat("{0}?balanceId={1}&offset={2}&limit={3}", API_ROUTE, balanceId, options.offset, options.limit);
        return dispatch => {
            dispatch(_request());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedTransactions(response.data))
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedTransactions(null))
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
                dispatch(_receivedTransaction(response.data.transaction));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedTransaction(null));
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
                dispatch(_receivedTransactionUpdate(response.data.transaction));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedTransactionUpdate(null));
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
                dispatch(_receivedTransactionUpdate(response.data.transaction));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedTransactionUpdate(null));
            })
        }
    }
}

export {
    TransactionActionService,
    REQUESTING,
    RECEIVED_TRANSACTION,
    RECEIVED_TRANSACTIONS,
    RECEIVED_TRANSACTION_UPDATE,
    RECEIVED_TRANSACTION_REMOVAL,
    TRANSACTION_TYPE_EMPLOYEE,
    TRANSACTION_TYPE_CONTRACT,
    TRANSACTION_TYPE_CUSTOMER,
    TRANSACTION_TYPES,
    TRANSACTION_STATES,
    TRANSACTION_STATE_PENDING,
    TRANSACTION_STATE_COMPLETE,
    TRANSACTION_STATE_OVERDUE,
    TRANSACTION_STATE_INVALIDATED
}
