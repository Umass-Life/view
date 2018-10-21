import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;

const REQUESTING = "REQUESTING";
const RECEIVED = "RECEIVED"
const RESETTING = "RESETTING";

const _request = (id) => ({ type: REQUESTING, id: id })
const _reset = () => ({type: RESETTING});
const _received= (data, id) => ({ type: RECEIVED, data: data, id: id})


class FetchService {
    static buildEmptyState(){
        return {
            data: null,
            isRequesting: false,
            id: null
        }
    }

    static fetch(path, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request(options.id))
            const url = API_ROOT + path;
            console.log("FetchService.fetch: " + url);
            console.log(options)
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_received(response.data, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_received(null,options.id));
            });
        }
    }

    static post(path, onSuccess, onFailure, options={id:null}){
        return dispatch => {
            dispatch(_request())
            const url = API_ROOT + path;
            console.log("FetchService.post: " + url);
            axios.post(url, {}, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_received(response.data, options.id));
            }).catch(error => {
                onFailure(error);
                dispatch(_received(null,options.id));
            });
        }
    }


    static reset = () => ( _reset() );
}

export {
    FetchService,
    REQUESTING,
    RECEIVED,
    RESETTING
}
