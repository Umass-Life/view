import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const util = require('../utilities')
const {dformat, formatDateDay} = util;
const {EMA_ROOT, defaultAxiosHeaders} = config;
const API_ROUTE = EMA_ROOT + "/ema"

const RESETTING = "RESETTING";
const REQUESTING = "REQUESTING";
const RECEIVED_EMA_LIST = "RECEIVED_EMA_LIST";

const _request = () => ({ type: REQUESTING })
const _reset = () => ({type: RESETTING});
const _receivedEMAList = (emaList, id) => ({ type: RECEIVED_EMA_LIST, emaList: emaList, id: id})

class EMAActionService {
    static buildEmptyState(){
        return {
            emaList: [],
            isRequesting: false,
            id: null
        }
    }

    static fetchAll(onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            const url = API_ROUTE;// sformat("{0}?fid={1}{2}{3}", API_ROUTE, fid, fromStr, toStr);
            console.log("EMA.fetchAll: " + url);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                const emaList = response.data.StressLevels
                dispatch(_receivedEMAList(emaList, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedEMAList([],options.id));
            });
        }
    }

    static reset = () => ( _reset() );
}

export {
    EMAActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_EMA_LIST,
}
