import {
    ActivityActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_ACTIVITIES,
    RECEIVED_ACTIVITY_TS,
    RECEIVED_LATEST_AGGREGATE_INFO,
    RECEIVED_LATEST_INTRADAY_INFO
} from '../actions/activity_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const ActivityReducer = (state = ActivityActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                ...state,
                isRequesting: true,
                id: action.id ? action.id : null,
            }
        case RECEIVED_ACTIVITIES:
            return {
                ...state,
                activities: action.activities ? action.activities : state.activities,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RECEIVED_ACTIVITY_TS:
            return {
                ...state,
                activityTimeserie: action.activityTimeserie ? action.activityTimeserie : [],
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RECEIVED_LATEST_AGGREGATE_INFO:
            return {
                ...state,
                latestAggregateInfo: action.latestAggregateInfo ?  action.latestAggregateInfo : null,
                latestIntradayInfo: null,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RECEIVED_LATEST_INTRADAY_INFO:
            return {
                ...state,
                latestIntradayInfo: action.latestIntradayInfo ?  action.latestIntradayInfo : null,
                latestAggregateInfo: null,
                id: action.id ? action.id : null,
                isRequesting: false
            }
        case RESETTING:
            return ActivityActionService.buildEmptyState()
        default:
            return state;
    }
}

export default ActivityReducer;

/*
case RECEIVED_CONTRACT:
    return {
        ...state,
        contract: action.contract ? action.contract : state.contract,
        id: action.id ? action.id : null,
        isRequesting: false

*/
