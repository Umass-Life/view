import _ from "lodash"
var sformat = require("string-format");
import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config;

const RESETTING = "RESETTING";
const REQUESTING = "REQUESTING";
const RECEIVED_FILE = "RECEIVED_FILE"
const RECEIVED_FILES = "RECEIVED_FILES"
const RECEIVED_FILE_REMOVAL = "RECEIVED_FILE_REMOVAL"
const RECEIVED_FILE_UPDATE = "RECEIVED_FILE_UPDATE"
const RECEIVED_FILE_DOWNLOAD = "RECEIVED_FILE_DOWNLOAD"

const _reset = () => ({type:RESETTING});
const _request = () => ({ type: REQUESTING });
const _receivedFile = (file) => ({ type: RECEIVED_FILE, file: file})
const _receivedFiles = (files) => ({ type: RECEIVED_FILES, files: files })
const _receivedFileRemoval = (ok) => ({ type: RECEIVED_FILE_REMOVAL, ok: ok})
const _receivedFileUpdate = (file) => ({ type: RECEIVED_FILE_UPDATE, file: file})
const _receivedDownload = () => ({ type: RECEIVED_FILE_DOWNLOAD })

const API_ROUTE = API_ROOT + "/files"

class FileEntityAction {
    static buildEmptyState(){
        return {
            file: null,
            files: [],
            isRequesting: false
        }
    }

    static create(file, type, onSuccess, onFailure){
        const url = sformat("{0}/upload", API_ROUTE);
        return dispatch => {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("name", file.name);
            formData.append("size", file.size);
            formData.append("entityType", type);
            console.log(formData);
            axios.post(url, formData, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedFile(response.data.fileEntity));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedFile(null));
            });
        }
    }

    static listByIdAndType(id, type, onSuccess, onFailure){
        const url = sformat("{0}/request?id={1}&type={2}", API_ROUTE, id, type);
        return dispatch => {
            dispatch(_request());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedFiles(response.data.fileEntities));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedFiles([]));
            })
        }
    }

    static downloadById(id, ){
        const url = sformat("{0}/download/{1}", API_ROUTE, id);
        return url;
    }

    static reset = () => (_reset());
}

export {
    RESETTING,
    REQUESTING,
    RECEIVED_FILE,
    RECEIVED_FILES,
    RECEIVED_FILE_REMOVAL,
    RECEIVED_FILE_UPDATE,
    RECEIVED_FILE_DOWNLOAD,
    FileEntityAction
}
