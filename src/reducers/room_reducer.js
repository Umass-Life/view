import {
    RESETTING,
    REQUESTING,
    RECEIVED_ROOMS,
    RECEIVED_ROOM,
    RECEIVED_ROOM_REMOVAL,
    RECEIVED_FILTERED_ROOMS,
    RoomActionService
} from '../actions/room_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const RoomReducer = (state = RoomActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {
                isRequesting: true,
                ...state
            }
        case RECEIVED_ROOMS:
            return {
                ...state,
                rooms: action.rooms ? action.rooms : state.rooms,
                isRequesting: false
            }
        case RECEIVED_FILTERED_ROOMS:
            return {
                ...state,
                filteredRooms: action.rooms ? action.rooms : state.rooms,
                isRequesting: false
            }
        case RECEIVED_ROOM:
            return {
                ...state,
                room: action.room ? action.room : state.room,
                isRequesting: false
            }
        case RECEIVED_ROOM_REMOVAL:
            return {
                ...state,
                rooms: (action.roomRemoved && removedRoomId) ?
                    _.filter(state.rooms, x => x.id != removedRoomId) : state.rooms,
                isRequesting: false
            }
        case RESETTING:
            return RoomActionService.buildEmptyState();
        default:
            return state;
    }
}

export default RoomReducer;
