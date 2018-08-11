import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config

const REQUESTING = "REQUESTING"
const RECEIVED_ROOMS = "RECEIVED_ROOMS"
const RECEIVED_ROOM = "RECEIVED_ROOM"
const RECEIVED_ROOM_REMOVAL = "RECEIVED_ROOM_REMOVAL";
const RECEIVED_FILTERED_ROOMS = "RECEIVED_FILTERED_ROOMS"
const RESETTING = "RESETTING";

const DAILY_TWIN = 'DAILY_TWIN';
const DAILY_SINGLE = "DAILY_SINGLE";
const MONTHLY = 'MONTHLY'
const ROOM_TYPES = [DAILY_TWIN, DAILY_SINGLE, MONTHLY]

const sformat = require('string-format');
const COMPONENT_URL = "/rooms"
const API_ROUTE = API_ROOT + "/rooms"

//actions
const _reset = () => ({type: RESETTING})
const _request = () => {
    return {
        type: REQUESTING
    }
}
const _receivedRooms = (response) => {
    let rooms = (response && response.data) ? response.data : [];
    return {
        type: RECEIVED_ROOMS,
        rooms: rooms
    }
}

const _receivedFilteredRooms = (response) => {
    let rooms = (response && response.data) ? response.data : [];
    return {
        type: RECEIVED_FILTERED_ROOMS,
        rooms: rooms
    }
}

const _receivedRoom = (response) => {
    console.log("RECEIVED SINGLE ROOM IN ACTION ");
    console.log(response);
    return {
        type: RECEIVED_ROOM,
        room: response.data.room
    }
}

const _receivedRoomRemoval = (id, response) => {
    return {
        type: RECEIVED_ROOM_REMOVAL,
        roomRemoved: response.data.ok,
        removedRoomId: id
    }
}

//ACTION CREATORS

class RoomActionService {
    static buildEmptyState = () => {
        return {
            isRequesting: false,
            rooms: [],
            filteredRooms: [],
            room: null,
            _type: "RoomComponentObject"
        }
    }
    static fetchRooms = (onSuccess, onFailure) => {
        return (dispatch) => {
            dispatch(_request());
            let url = API_ROUTE
            axios.get(url, {
                headers: defaultAxiosHeaders({}),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedRooms(response));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedRooms(null))
            })
        }
    }
    static fetchRoomById = (roomId, onSuccess, onFailure) => {
        return (dispatch) => {
            dispatch(_request());
            let url = sformat("{0}/{1}", API_ROUTE, roomId);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedRoom(response));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedRoom(null));
            });
        }
    }

    static listAvailableRooms = (from, to, onSuccess, onFailure) => {
        return dispatch => {
            let url = sformat("{0}/searchAvailable?from={1}&to={2}", API_ROUTE, from, to);
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedFilteredRooms(response));
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedRooms(null));
            });
        }
    }

    static create = (data, onSuccess, onFailure) => {
        return (dispatch) => {
            const url = API_ROUTE;
            axios.post(url, data, {
                headers: defaultAxiosHeaders(),
                withCredentials:true
            }).then(response => {
                onSuccess(response);
                dispatch(_receivedRoom(response));
            }).catch(error => {
                dispatch(_receivedRoom(null))
                onFailure(error);
            })
        }
    }

    static update = (id, updateSchema, onSuccess, onFailure) => {
        return (dispatch) => {
            const url = sformat("{0}/update/{1}", API_ROUTE, id);
            dispatch(_request())
            axios.post(url, updateSchema, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedRoom(response));
                onSuccess(response);
            }).catch(error => {
                dispatch(_receivedRoom(null));
                onFailure(error);
            })
        }
    }

    static remove = (id, onSuccess, onFailure) => {
        return (dispatch) => {
            const url = sformat("{0}/remove/{1}", API_ROUTE, id);
            dispatch(_request());
            axios.post(url, {}, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedRoomRemoval(response))
                onSuccess(response);
            }).catch(error => {
                dispatch(_receivedRoomRemoval(error))
                onFailure(error);
            });
        }
    }

    static reset = () => (_reset());
}

export {
    RoomActionService,
    REQUESTING, RECEIVED_ROOM_REMOVAL, RECEIVED_ROOMS, RECEIVED_ROOM,
    DAILY_TWIN, DAILY_SINGLE, MONTHLY, ROOM_TYPES, RESETTING, RECEIVED_FILTERED_ROOMS
}
