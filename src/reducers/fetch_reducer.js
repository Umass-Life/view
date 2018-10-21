import {
    FetchService,
    REQUESTING,
    RECEIVED,
    RESETTING
} from '../actions/fetch_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const FetchReducer = (state = FetchService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                ...state,
                isRequesting: true,
                id: action.id ? action.id : null,

            }
        case RECEIVED:
            return {
                ...state,
                data: action.data,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RESETTING:
            return FetchService.buildEmptyState()
        default:
            return state;
    }
}

export default FetchReducer;


/*
case RECEIVED_CONTRACT:
    return {
        ...state,
        contract: action.contract ? action.contract : state.contract,
        id: action.id ? action.id : null,
        isRequesting: false

*/
