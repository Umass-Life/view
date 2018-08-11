import {
    FileEntityAction,
    RESETTING,
    REQUESTING,
    RECEIVED_FILE,
    RECEIVED_FILES,
    RECEIVED_FILE_REMOVAL,
    RECEIVED_FILE_UPDATE,
    RECEIVED_FILE_DOWNLOAD
} from '../actions/file_entity_action';
import _ from 'lodash';
const sformat = require('string-format');

const FileEntityReducer = (state = FileEntityAction.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                ...state,
                isRequesting: true
            }
        case RECEIVED_FILE:
            return {
                ...state,
                isRequesting: false,
                file: action.file
            }
        case RECEIVED_FILES:
            return {
                ...state,
                isRequesting: false,
                files: action.files
            }
        case RECEIVED_FILE_UPDATE:
            return state;
        case RECEIVED_FILE_REMOVAL:
            return state;
        case RECEIVED_FILE_DOWNLOAD:
            return {
                ...state,
                isRequesting: false
            }
        case RESETTING:
            return FileEntityAction.buildEmptyState();
        default:
            return state;
    }
}

export default FileEntityReducer
