import {
    TransactionActionService,
    REQUESTING,
    RECEIVED_TRANSACTION,
    RECEIVED_TRANSACTIONS,
    RECEIVED_TRANSACTION_UPDATE,
    RECEIVED_TRANSACTION_REMOVAL,
    TRANSACTION_TYPE_EMPLOYEE,
    TRANSACTION_TYPE_CONTRACT,
    TRANSACTION_TYPES
} from '../actions/transaction_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const TransactionReducer = (state = TransactionActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                isRequesting: true,
                ...state
            }
        case RECEIVED_TRANSACTIONS:
            return {
                ...state,
                transactions: action.transactions ? action.transactions : state.transactions,
                isRequesting: false
            }
        case RECEIVED_TRANSACTION:
            return {
                ...state,
                transaction: action.transaction ? action.transaction : state.transaction,
                isRequesting: false
            }
        case RECEIVED_TRANSACTION_UPDATE:
            return {
                ...state,
                transactions: action.transaction ? action.transaction : state.transaction,
                transactions: action.transaction ?
                    [..._.filter(state.transactions, x => x.id != action.transaction.id), action.transaction] : state.transactions,
                isRequesting: false
            }
        default:
            return state;
    }
}

export default TransactionReducer;
