import {
    HeartrateActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_HR,
    RECEIVED_HRS
} from '../actions/heartrate_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const HeartrateReducer = (state = HeartrateActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                isRequesting: true,
                id: action.id ? action.id : null,
                ...state
            }
        case RECEIVED_HRS:
            return {
                ...state,
                heartrates: action.heartrates ? action.heartrates : state.heartrates,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RESETTING:
            return HeartrateActionService.buildEmptyState()
        default:
            return state;
    }
}

export default HeartrateReducer;


/*
case RECEIVED_CONTRACT:
    return {
        ...state,
        contract: action.contract ? action.contract : state.contract,
        id: action.id ? action.id : null,
        isRequesting: false

*/
