import {
    REQUESTING,
    RECEIVED_SLEEP,
    RECEIVED_SLEEP_LIST,
    RECEIVED_SLEEP_TS,
    RESETTING,
    RECEIVED_LATEST_SLEEP,
    SleepActionService
} from '../actions/sleep_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const SleepReducer = (state = SleepActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                ...state,
                isRequesting: true,
                id: action.id ? action.id : null,
            }
        case RECEIVED_SLEEP:
            return {
                ...state,
                sleep: action.sleep,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RECEIVED_SLEEP_LIST:
            return {
                ...state,
                sleepList: action.sleepList ? action.sleepList : state.sleepList,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RECEIVED_SLEEP_TS:
            return {
                ...state,
                sleepTS: action.sleepTS ? action.sleepTS : state.sleepTS,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RECEIVED_LATEST_SLEEP:
            return {
                ...state,
                latestSleep: action.latestSleep ? action.latestSleep : null,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RESETTING:
            return SleepActionService.buildEmptyState()
        default:
            return state;
    }
}

export default SleepReducer;


/*
case RECEIVED_CONTRACT:
    return {
        ...state,
        contract: action.contract ? action.contract : state.contract,
        id: action.id ? action.id : null,
        isRequesting: false

*/
