import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const util = require('../utilities')
const {dformat, formatDateDay} = util;
const {API_ROOT, defaultAxiosHeaders} = config;
const API_ROUTE = API_ROOT + "/sleep"
const API_TS_ROUTE = API_ROUTE + "/serie"


const REQUESTING = "REQUESTING";
const RECEIVED_SLEEP = "RECEIVED_SLEEP"
const RECEIVED_SLEEP_LIST = "RECEIVED_SLEEP_LIST"
const RECEIVED_SLEEP_TS = "RECEIVED_SLEEP_TS"
const RESETTING = "RESETTING";

const _request = () => ({ type: REQUESTING })
const _reset = () => ({type: RESETTING});
const _receivedSleep = (sleep, id) => ({ type: RECEIVED_SLEEP, sleep: sleep, id: id})
const _receivedSleepList = (sleepList, id) => ({ type: RECEIVED_SLEEP_LIST, sleepList: sleepList, id: id})
const _receivedSleepTS = (sleepTS, id) => ({ type: RECEIVED_SLEEP_TS, sleepTS: sleepTS, id: id})

class SleepActionService {
    static buildEmptyState(){
        return {
            sleepList: [],
            sleepTS: [],
            sleep: null,
            isRequesting: false,
            id: null
        }
    }

    static fetchById(fid, from, to, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            // var _arr = [];
            // for(var key in data){ _arr.push(sformat("{0}={1}", key,data[key])); }
            const fromStr = from ? "&from=" + formatDateDay(from) : "";
            const toStr = to ? "&to=" + formatDateDay(to) : "";
            const url = sformat("{0}?fid={1}{2}{3}", API_ROUTE, fid, fromStr, toStr);
            console.log("Sleep.fetchAll: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedSleepList(response.data.FitbitSleepList, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedSleepList([],options.id));
            });
        }
    }

    static fetchTimeSerieBySleepId(sleepId, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            var _arr = [];
            const url = sformat("{0}/{1}/serie", API_ROUTE, sleepId);
            console.log("Sleep.fetchTimeSerie: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedSleepTS(response.data.SleepTimeSerieList, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedSleepTS([],options.id));
            });
        }
    }

    static fetchSleepById(sleepId, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            var _arr = [];
            const url = sformat("{0}/{1}", API_ROUTE, sleepId);
            console.log("Sleep.ById: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedSleep(response.data.FitbitSleep, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedSleep(null,options.id));
            });
        }
    }

    static reset = () => ( _reset() );
}

export {
    SleepActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_SLEEP_LIST,
    RECEIVED_SLEEP_TS,
    RECEIVED_SLEEP,
}

/*
refernece code
static searchByRooms(from, to, roomIds=[], onSuccess, onFailure, options={id:null}){
    const url = sformat("{0}/searchByRooms", API_ROUTE);
    const data = { from: from, to: to, rooms: roomIds, includeBalance: true}
    return dispatch => {
        dispatch(_request())
        axios.post(url, data, {
            headers: defaultAxiosHeaders(),
            withCredentials: true
        }).then(response => {
            onSuccess(response);
            dispatch(_receivedContractWrappers(response.data.contractWrappers, options.id));
        }).catch(error => {
            onFailure(error);
            dispatch(_receivedContractWrappers([],options.id));
        });
    }
}


    // static fetchById(id, onSuccess, onFailure, options={id:null, includeBalance:false}){
    //     const url = sformat("{0}/{1}?includeBalance={2}", API_ROUTE, id, options.includeBalance);
    //     return dispatch => {
    //         dispatch(_request());
    //         axios.get(url,{
    //             headers: defaultAxiosHeaders(),
    //             withCredentials: true
    //         }).then(response => {
    //             if(options.includeBalance && response.data.balance){
    //                 response.data.contract.balance = response.data.balance;
    //             }
    //             onSuccess(response);
    //             dispatch(_receivedContract(response.data.contract, options.id));
    //         }).catch(error => {
    //             onFailure(error);
    //             dispatch(_receivedContract(null,options.id));
    //         });
    //     }
    // }

*/
