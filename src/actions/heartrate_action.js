import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;
const API_ROUTE = API_ROOT + "/hr"
const util = require('../utilities')
const {dformat, formatDateDay} = util;

const REQUESTING = "REQUESTING";
const RECEIVED_HR = "RECEIVED_HR"
const RECEIVED_HRS= "RECEIVED_HR_LIST"
const RESETTING = "RESETTING";
const RECEIVED_LATEST_HR = "RECEIVED_LATEST_HR"

const _request = () => ({type: REQUESTING})
const _reset = () => ({type: RESETTING});
const _receivedHR = (hr, id) => ({ type: RECEIVED_HR, heartrate: hr, id: id})
const _receivedHRS = (hrs, id) => ({ type: RECEIVED_HRS, heartrates: hrs, id: id})
const _receivedLatest = (latestHr, id) => ({ type: RECEIVED_LATEST_HR, latestHr: latestHr, id: id})

class HeartrateActionService {
    static buildEmptyState(){
        return {
            heartrates: [],
            heartrate: null,
            isRequesting: false,
            latestHr: null,
            id: null
        }
    }
    static fetchById(fid, from, to, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            var _arr = [];
            const fromStr = from ? "&from=" + formatDateDay(from) : "";
            const toStr = to ? "&to=" + formatDateDay(to) : "";
            const url = API_ROUTE+sformat("?includeZone=true&fid={0}{1}{2}", fid, fromStr, toStr);
            console.log("Heartrate.fetchAll: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                var hrs = response.data.FitbitHeartrates
                var zones = [];
                if (response.data.HeartrateZones && hrs.length > 0){
                    zones = response.data.HeartrateZones;
                    if (zones.length == hrs.length){
                        hrs = _.map(zones, (zone, idx) => { return {heartRateZones:zone, ...hrs[idx]} });
                    } else {
                        console.log("ERR len(ZONES)!=len(HRS)");
                        console.log(zones);
                        console.log(hrs);
                    }
                }

                dispatch(_receivedHRS(hrs, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedHRS([],options.id));
            });
        }
    }

    static fetchLatest(fid, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            var url = sformat("{0}/latest?fid={1}", API_ROUTE, fid);
            console.log(url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                console.log(response.data);
                dispatch(_receivedLatest(response.data.FitbitHeartrate, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedLatest(null,options.id));
            });
        }
    }

    static reset = () => ( _reset() );
}

export {
    HeartrateActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_HR,
    RECEIVED_HRS,
    RECEIVED_LATEST_HR
}
