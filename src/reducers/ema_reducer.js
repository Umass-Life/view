import {
    EMAActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_EMA_LIST,
} from '../actions/ema_action.js'
import {combinedReducers} from 'redux';
import _ from 'lodash';
const sformat = require('string-format');

const EMAReducer = (state = EMAActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                ...state,
                isRequesting: true,
                id: action.id ? action.id : null,
            }
        case RECEIVED_EMA_LIST:
            return {
                ...state,
                emaList: action.emaList && action.emaList.length ? action.emaList : [],
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RESETTING:
            return EMAActionService.buildEmptyState()
        default:
            return state;
    }
}

export default EMAReducer;

/*
case RECEIVED_CONTRACT:
    return {
        ...state,
        contract: action.contract ? action.contract : state.contract,
        id: action.id ? action.id : null,
        isRequesting: false

*/
