import axios from 'axios'
import config from '../config'
const {API_ROOT, defaultAxiosHeaders} = config
import _ from 'lodash'
const sformat = require('string-format')

const RESETTING = "RESETTING";
const REQUESTING = "REQUESTING";
const RECEIVED_CUSTOMER_PROFILES = "RECEIVED_CUSTOMER_PROFILES";
const RECEIVED_CUSTOMER_PROFILE = "RECEIVED_CUSTOMER_PROFILE";
const RECEIVED_CUSTOMER_PROFILE_REMOVED = "RECEIVED_CUSTOMER_PROFILE_REMOVED"

const API_ROUTE = API_ROOT + "/customerProfiles"

const _reset = () => ({type: RESETTING});
const _requestCustomerProfile = () => {
    return {
        type: REQUESTING,
        isRequesting: true
    }
}

const _receivedCustomerProfiles = (profiles) => {
    return {
        type: RECEIVED_CUSTOMER_PROFILES,
        customerProfiles: profiles,
        isRequesting: false
    }
}

const _receivedCustomerProfile = (profile) => {
    return {
        type: RECEIVED_CUSTOMER_PROFILE,
        customerProfile: profile,
        isRequesting: false
    }
}

const _receivedCustomerProfileRemoved = (disabledProfile) => {
    return {
        type: RECEIVED_CUSTOMER_PROFILE_REMOVED,
        disabledCustomerProfile: disabledProfile
    }
}

class CustomerProfileActionService {
    static buildEmptyState = () => {
        return {
            isRequesting: false,
            customerProfiles: [],
            customerProfile: {},
        }
    }

    static fetchCustomerProfiles = (onSuccess = ()=>{}, onFailure = ()=>{}) => {
        return dispatch => {
            const url = sformat("{0}", API_ROUTE);
            dispatch(_requestCustomerProfile());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedCustomerProfiles(response.data)) //List<Role> is in body.
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedCustomerProfiles([]))
            });
        }
    }

    static fetchCustomerProfileById = (id, onSuccess, onFailure) => {
        return dispatch => {
            const url = sformat("{0}/{1}",API_ROUTE,id);
            dispatch(_requestCustomerProfile());
            axios.get(url, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedCustomerProfile(response.data.customerProfile)) //Map<String,Object> with field role is given.
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedCustomerProfile(null))
            });
        }
    }

    static create = (data, onSuccess, onFailure) => {
        return dispatch => {
            const url = sformat("{0}/",API_ROUTE);
            dispatch(_requestCustomerProfile());
            axios.post(url, data, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedCustomerProfile(response.data.customerProfile))
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedCustomerProfile(null))
            });
        }
    }

    static update = (id, data, onSuccess, onFailure) => {
        return dispatch => {
            const url = sformat("{0}/update/{1}", API_ROUTE, id);
            axios.post(url, data, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedCustomerProfile(response.data.customerProfile))
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedCustomerProfile(null))
            });
        }
    }

    static remove = (id, onSuccess, onFailure) => {
        return dispatch => {
            const url = sformat("{0}/remove/{1}", API_ROUTE, id);
            dispatch(_requestCustomerProfile());
            axios.post(url, {}, {
                headers: defaultAxiosHeaders(),
                withCredentials: true
            }).then(response => {
                dispatch(_receivedCustomerProfileRemoved(response.data.customerProfile));
                onSuccess(response)
            }).catch(error => {
                onFailure(error);
                dispatch(_receivedCustomerProfileRemoved(-1));
            });
        }
    }

    static reset = () => (_reset());
}

export { CustomerProfileActionService,
    RESETTING,
    REQUESTING,
    RECEIVED_CUSTOMER_PROFILES,
    RECEIVED_CUSTOMER_PROFILE,
    RECEIVED_CUSTOMER_PROFILE_REMOVED,
}
