import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;
const USER_ROUTE = API_ROOT + "/users";
const AGR_ROUT = API_ROOT + "/activities";
const f = API_ROOT + "/activities";

const FETCH = (url, queries, onSuccess, onFailure) => {
    for(var key in queries){ _arr.push(sformat("{0}={1}", key,queries[key])); }
    var url = API_ROOT + "/users"
    if (_arr.length > 0){
        url += "?"+_arr.join("&")
    }
    axios.get(url, {
        headers: defaultAxiosHeaders({}),
        withCredentials: true
    }).then(response => {
        var users = response.data
        onSuccess(response);
    }).catch(error => {
        console.log(error);
        onFailure(error);
    })
}
