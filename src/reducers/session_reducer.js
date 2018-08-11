import {RECEIVED_AUTHENTICATION, REQUEST_AUTHENTICATION, SessionActionService} from '../actions/session_action';

const buildSessionObj = SessionActionService.buildEmptyState;

let initState = {
    session: buildSessionObj(false, false, null, false, [])
}

const SessionReducer = (state = initState.session, action) => {
    switch(action.type){
        case(RECEIVED_AUTHENTICATION):
            return buildSessionObj(false, true, action.user, action.isAuthenticated, action.roles, action.balanceId);
        case(REQUEST_AUTHENTICATION):
            return buildSessionObj(true, false, state.user, state.isAuthenticated, state.roles, action.balanceId);
        default:
            return state;
    }
}

export default SessionReducer;
