import {
    RESETTING,
    REQUESTING,
    RECEIVED_CUSTOMER_PROFILES,
    RECEIVED_CUSTOMER_PROFILE,
    RECEIVED_CUSTOMER_PROFILE_REMOVED,
    CustomerProfileActionService
} from '../actions/customer_profile_action'
import {combinedReducers} from 'redux';
import _ from 'lodash'
const sformat = require('string-format');

const CustomerProfileReducer = (state = CustomerProfileActionService.buildEmptyState(), action) => {
    switch(action.type){
        case REQUESTING:
            return {...state, isRequesting: true}
        case RECEIVED_CUSTOMER_PROFILE_REMOVED:
            return {
                ...state,
                isRequesting: false,
                customerProfiles: [...(_.filter(state.customerProfiles, x => x.id!=action.disabledCustomerProfile.id)), action.disabledCustomerProfile]
            };
        case RECEIVED_CUSTOMER_PROFILES:
            // User will be wrapped List<Map<String, Object {CustomerProfiles}>>
            let customerProfiles = action.customerProfiles;
            if (!action.customerProfiles || action.customerProfiles.length == 0) customerProfiles = state.customerProfiles;
            return {
                ...state,
                customerProfiles: customerProfiles,
                isRequesting: false
            }
        case RECEIVED_CUSTOMER_PROFILE:
            let customerProfile = action.customerProfile;
            if(!action.customerProfile) customerProfile = state.customerProfile;
            return {
                ...state,
                customerProfile: customerProfile,
                isRequesting: false
            }
        case RESETTING:
            return CustomerProfileActionService.buildEmptyState();
        default:
            return state;
    }
}

export default CustomerProfileReducer;
