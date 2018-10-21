import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;
const util = require('../utilities')
const {dformat, formatDateDay} = util;
const API_ROUTE = API_ROOT + "/activities"

const REQUESTING = "REQUESTING";
const RECEIVED_ACTIVITIES = "RECEIVED_ACTIVITIES"
const RECEIVED_ACTIVITY_TS = "RECEIVED_ACTIVITY_TS"
const RECEIVED_LATEST_INTRADAY_INFO = "RECEIVED_LATEST_INTRADAY_INFO";
const RECEIVED_LATEST_AGGREGATE_INFO = "RECEIVED_LATEST_AGGREGATE_INFO";
const RESETTING = "RESETTING";

const _request = () => ({ type: REQUESTING });
const _reset = () => ({type: RESETTING});
const _receivedActivities = (activities, id) => ({ type: RECEIVED_ACTIVITIES, activities: activities, id: id})
const _receivedActivityTS = (activityTimeserie, id) => ({ type: RECEIVED_ACTIVITY_TS, activityTimeserie: activityTimeserie, id: id})
const _receivedLatestAgg = (latestAggregateInfo, id) => ({ type: RECEIVED_LATEST_AGGREGATE_INFO, latestAggregateInfo: latestAggregateInfo, id : id})
const _receivedLatestIntr = (latestIntradayInfo, id) => ({ type: RECEIVED_LATEST_INTRADAY_INFO, latestIntradayInfo: latestIntradayInfo, id : id})

class ActivityActionService {
    static buildEmptyState(){
        return {
            activities: [],
            activityTimeserie: [],
            latestAggregateInfo: null,
            latestIntradayInfo: null,
            isRequesting: false,
            id: null
        }
    }

    static fetchLevels(fid, from, to, onSuccess, onFailure, options={}){
        return dispatch => {
            dispatch(_request())
            const fromStr = from ? "&from=" + formatDateDay(from) : "";
            const toStr = to ? "&to=" + formatDateDay(to) : "";
            const url = sformat("{0}/levels?fid={1}{2}{3}", API_ROUTE, fid, fromStr, toStr);
            console.log("Activity.fetchLevels: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                console.log(response.data);
                dispatch(_receivedActivities(response.data.aggregate, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedActivities([],options.id));
            });
        }
    }

    static fetchActivtyTimeserie(fid, resource, from, to, onSuccess, onFailure, options={}){
        return dispatch => {
            dispatch(_request())
            var url = sformat("{0}?fid={1}&r={2}&from={3}&to={4}", API_ROUTE, fid, resource, from, to);
            console.log("Activity.fetchAggregates: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                console.log(response.data);
                dispatch(_receivedActivityTS(response.data['FitbitActivities'], options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedActivityTS([],options.id));
            });
        }
    }

    static fetchIntradayActivtyTimeserie(fid, resource, page, count, onSuccess, onFailure, options={}){
        return dispatch => {
            dispatch(_request())
            var url = sformat("{0}/intraday?fid={1}&r={2}&page={3}&count={4}", API_ROUTE, fid, resource, page, count);
            console.log("Activity.fetchIntraday: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                console.log(response.data);
                dispatch(_receivedActivityTS(response.data[resource], options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedActivityTS([],options.id));
            });
        }
    }

    static fetchLatestIntraday(fid, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            var url = sformat("{0}/intraday/latest?fid={1}", API_ROUTE, fid);
            console.log("Activity.fetchLatestIntraday: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                console.log(response.data);
                dispatch(_receivedLatestIntr(response.data, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedLatestIntr(null,options.id));
            });
        }
    }
    static fetchLatestAggregate(fid, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            var url = sformat("{0}/latest?fid={1}", API_ROUTE, fid);
            console.log("Activity.fetchAggregateIntraday: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedLatestAgg(response.data, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedLatestAgg(null,options.id));
            });
        }
    }
    static reset = () => ( _reset() );
}

export {
    ActivityActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_ACTIVITY_TS,
    RECEIVED_ACTIVITIES,
    RECEIVED_LATEST_AGGREGATE_INFO,
    RECEIVED_LATEST_INTRADAY_INFO
}
