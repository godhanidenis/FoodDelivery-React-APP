import { get } from 'lodash'
import {
    CLEAR_AUTH_TOKEN,
    USER_LOGGED_IN,
    ANNOUNCE_LOGGING_IN_USER,
    ANNOUNCE_USER_NOT_LOGGED_IN,
    authToken
} from 'actions/auth'

const initialState = {
    token: authToken(),
    user: null,
    isLoading: false,
    isLoggedIn: false,
    API_BASE: get(window, 'LOCAL_SETTINGS.API_BASE', '/')
}

export default function auth(state = initialState, action) {
    switch (action.type) {
        case ANNOUNCE_LOGGING_IN_USER:
            return Object.assign({}, state, {isLoading: true, })
        case ANNOUNCE_USER_NOT_LOGGED_IN:
            return Object.assign({}, state, {token: null, user: null, isLoading: false, hasCheckedLogin: true})
        case USER_LOGGED_IN:
            return Object.assign({}, state, {
                user: action.user,
                isLoading: false,
                isLoggedIn: true,
                hasCheckedLogin: true,
                token: action.token,
                
            })
        case CLEAR_AUTH_TOKEN:
            return Object.assign({}, state, {user: null, token: null, isLoading: false, hasCheckedLogin: false, isLoggedIn: false})
        default:
            return state
    }
}
