import {
    REQUESTING,
    RECEIVED_BALANCE,
    RECEIVED_BALANCES,
    RECEIVED_BALANCE_UPDATE,
    RECEIVED_BALANCE_REMOVAL,
    RECEIVED_BALANCE_ENTITY_EDGE,
    BalanceActionService
} from '../actions/balance_action'
import { combinedReducers } from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const BalanceReducer = (state = BalanceActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                isRequesting: true,
                ...state
            }
        case RECEIVED_BALANCES:
            return {
                ...state,
                balances: action.balances ? action.balances : state.balances,
                isRequesting: false
            }
        case RECEIVED_BALANCE:
            return {
                ...state,
                balance: action.balance ? action.balance : state.balance,
                isRequesting: false
            }
        case RECEIVED_BALANCE_UPDATE:
            console.log(action.type)
            return {
                ...state,
                balance: action.balance ? action.balance : state.balance,
                balances: action.balance ?
                    [..._.filter(state.balances, x => x.id != action.balance.id), action.balance] : state.balances,
                isRequesting: false
            }
        case RECEIVED_BALANCE_ENTITY_EDGE:
            return {
                ...state,
                balanceEntityEdge: action.balanceEntityEdge ? action.balanceEntityEdge : state.balanceEntityEdge,
                isRequesting: false
            }
        default:
            return state;
    }
}

export default BalanceReducer;
