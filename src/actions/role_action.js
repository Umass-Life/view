import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config
import _ from 'lodash'
const sformat = require('string-format')

const REQUESTING = "REQUESTING";
const RECEIVED_ROLES = "RECEIVED_ROLES";
const RECEIVED_ROLE = "RECEIVED_ROLE";
const RECEIVED_ROLE_REMOVED = "RECEIVED_ROLE_REMOVED"
// ROLES - must have same name as Role enum defined in the server.
const ADMIN = "ADMIN";
const EMPLOYEE = "EMPLOYEE";
const CUSTOMER = "CUSTOMER";
const ROLE_TYPES = [ADMIN, EMPLOYEE, CUSTOMER]

const API_ROUTE = API_ROOT + "/authorities"

const _requestRoles = () => {
    return {
        type: REQUESTING,
        isRequesting: true
    }
}

const _receivedRoles = (roles) => {
    return {
        type: RECEIVED_ROLES,
        roles: roles,
        isRequesting: false
    }
}

const _receivedRole = (role) => {
    return {
        type: RECEIVED_ROLE,
        role: role,
        isRequesting: false
    }
}

const _receivedRoleRemoved = (id) => {
    return {
        type: RECEIVED_ROLE_REMOVED,
        removedRoleId: id
    }
}

class RoleActionService {
    static hasPermission = (permittedRoles, roles) => {
        if (_.isMatch(roles, ADMIN)) return true;
        roles = (roles === undefined || roles == null) ? [] : roles;
        permittedRoles = (permittedRoles === undefined || permittedRoles == null) ? [] : permittedRoles;
        return permittedRoles.length > 0 ? _.intersection(roles, permittedRoles).length > 0 : true;
    }

    static buildEmptyState = () => {
        return {
            isRequesting: false,
            roles: [],
            role: {}
        }
    }

    static fetchRoles = (onSuccess = ()=>{}, onFailure = ()=>{}) => {
        return dispatch => {
            const url = sformat("{0}", API_ROUTE);
            dispatch(_requestRoles());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedRoles(response.data)) //List<Role> is in body.
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedRoles([]))
            });
        }
    }

    static getRoleById = (id, onSuccess, onFailure) => {
        return dispatch => {
            const url = sformat("{0}/{1}",API_ROUTE,id);
            dispatch(_requestRoles());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedRole(response.data.role)) //Map<String,Object> with field role is given.
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedRole(null))
            });
        }
    }

    static create = (data, onSuccess, onFailure) => {
        return dispatch => {
            const url = sformat("{0}/authorities/",API_ROOT);
            dispatch(_requestRoles());
            axios.post(url, data, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedRole(response.data.role))
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedRole(null))
            });
        }
    }

    static remove = (id, onSuccess, onFailure) => {
        return dispatch => {
            const url = sformat("{0}/remove/{1}", API_ROUTE, id);
            dispatch(_requestRoles());
            axios.post(url, {}, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedRoleRemoved(id));
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedRoleRemoved(-1));
            });
        }
    }
}

export { RoleActionService,
    REQUESTING, RECEIVED_ROLES, RECEIVED_ROLE, RECEIVED_ROLE_REMOVED,
    EMPLOYEE, ADMIN , ROLE_TYPES}
