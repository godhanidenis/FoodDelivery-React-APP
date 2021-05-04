import { has, isEmpty, size } from 'lodash'
import { http } from '../lib'
import cookie from 'react-cookies'
import {showSuccess, showError} from './Error'

export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN"
export const CLEAR_AUTH_TOKEN = "CLEAR_AUTH_TOKEN"
export const USER_LOGGED_IN = "USER_LOGGED_IN"
export const ANNOUNCE_LOGGING_IN_USER = "ANNOUNCE_LOGGING_IN_USER"
export const ANNOUNCE_USER_NOT_LOGGED_IN = "ANNOUNCE_USER_NOT_LOGGED_IN"
export const ANNOUNCE_SENDING_TOKEN_EMAIL = "ANNOUNCE_SENDING_TOKEN_EMAIL"
export const ANNOUNCE_TOKEN_EMAIL_SENT = "ANNOUNCE_TOKEN_EMAIL_SENT"
export const ANNOUNCE_TOKEN_EMAIL_NOT_SENT = "ANNOUNCE_TOKEN_EMAIL_NOT_SENT"
export const ANNOUNCE_SETTING_PASSWORD = "ANNOUNCE_SETTING_PASSWORD"
export const ANNOUNCE_PASSWORD_SET = "ANNOUNCE_PASSWORD_SET"
export const ANNOUNCE_PASSWORD_NOT_SET = "ANNOUNCE_PASSWORD_NOT_SET"
export const ANNOUNCE_USER_LOGGED_OUT = "ANNOUNCE_USER_LOGGED_OUT"
export const ANNOUNCE_UPDATING_USER = "ANNOUNCE_UPDATING_USER"
export const ANNOUNCE_USER_UPDATED = "ANNOUNCE_USER_UPDATED"
export const ANNOUNCE_USER_NOT_UPDATED = "ANNOUNCE_USER_NOT_UPDATED"

export function announceUserNotLoggedIn() {
    return {
        type: ANNOUNCE_USER_NOT_LOGGED_IN
    }
}

export function announceUserLoggedIn(token, user) {
    setAuthToken(token)
    cookie.save('user', user, { path: '/'})
    return {
        type: USER_LOGGED_IN,
        token,
        user
    }
}

export function announceLoggingInUser() {
    return {
        type: ANNOUNCE_LOGGING_IN_USER
    }
}

export function announceSendingTokenEmail() {
    return {
        type: ANNOUNCE_SENDING_TOKEN_EMAIL
    }
}

export function announceTokenEmailSent() {
    return {
        type: ANNOUNCE_TOKEN_EMAIL_SENT
    }
}

export function announceTokenEmailNotSent() {
    return {
        type: ANNOUNCE_TOKEN_EMAIL_NOT_SENT
    }
}

export function announceSettingPassword() {
    return {
        type: ANNOUNCE_SETTING_PASSWORD
    }
}

export function announcePasswordSet(user) {
    cookie.remove('user', { path: '/' })
    cookie.save('user', user, {path: '/' })
    return {
        type: ANNOUNCE_PASSWORD_SET
    }
}

export function announcePasswordNotSet() {
    return {
        type: ANNOUNCE_PASSWORD_NOT_SET
    }
}

export function announceUserLoggedOut() {
    return {
        type: ANNOUNCE_USER_LOGGED_OUT
    }
}

export function announceUpdatingUser() {
    return {
        type: ANNOUNCE_UPDATING_USER
    }
}

export function announceUserUpdated(user) {
    cookie.remove('user', { path: '/' })
    cookie.save('user', user, {path: '/' })
    return {
        type: ANNOUNCE_USER_UPDATED
    }
}

export function announceUserNotUpdated() {
    return {
        type: ANNOUNCE_USER_NOT_UPDATED
    }
}


export function login(email, password) {                                                                           
    return async(dispatch, getState) => {
        try {                                                                                                       
            dispatch(announceLoggingInUser())                                                                      
            let [json, success] = await http.post(getState(), 'login/login', { email: email, password: password })                                                                                            
            if (success.status === 200 && has(json, 'token')) {
                dispatch(announceUserLoggedIn(json.token, json.user || {}))                                         
            } else {
                dispatch(announceUserNotLoggedIn())                                                                 
                showError("Failed", "Failed to login with your credentials")
            }                                        
            if (!json.token) {
                showError("Failed", json.message)
            }
        } catch (e) {
            showError("Failed", e.message)
        }                                                                                                          
    }
}

export function auto_login(user_id, otp) {
    return async(dispatch, getState) => {
        try {                                                                                                       
            dispatch(announceLoggingInUser())                                                                       
            let [json, success] = await http.post(getState(), 'login/auto_login', { user: user_id, otp: otp })                                                                                            
            if (success.status === 200 && has(json, 'token')) {
                dispatch(announceUserLoggedIn(json.token, json.user || {}))                                         
            } else {
                dispatch(announceUserNotLoggedIn())
                return { 'errors': 'Failed to login' }
            }                                        
            if (!json.success) {
                return { 'errors': json.message }
            }
            return json
        } catch (e) {
            return {'errors': e}
        }                                                                                                          
    }
}

export function isLoggedIn() {
    const token = authToken()
    return ! isEmpty(token) && size(token) > 0
}

export function authToken() {
    return cookie.load('apitoken')
}

export function setAuthToken(token) {
    return cookie.save('apitoken', token, { path: '/' })
}

export function clearAuthentication() {
    cookie.remove('apitoken', { path: '/' })
    cookie.remove('user', { path: '/' })
    return {
        type: CLEAR_AUTH_TOKEN
    }
}

export function sendTokenEmail(user) {
    return async(dispatch, getState) => {
        dispatch(announceSendingTokenEmail())
        let success
        [success] = await http.post(getState(), 'user/send_otp_email', { user: user })
        if (success.status === 200) {
            dispatch(announceTokenEmailSent())
        } else {
            dispatch(announceTokenEmailNotSent())
        }
    }
}

export function sendForgotPasswordEmail(email) {
    return async(dispatch, getState) => {
        dispatch(announceSendingTokenEmail())
        let success
        [success] = await http.post(getState(), 'login/send_otp_email', { email: email })
        if (success.status === 200) {
            dispatch(announceTokenEmailSent())
        } else {
            dispatch(announceTokenEmailNotSent())
        }
    }
}

export function loggedInUser() {
    return cookie.load('user')
}

export function setPassword(password, on_done) {
    return async(dispatch, getState) => {
        dispatch(announceSettingPassword())
        let [json, success] = await http.post(getState(), 'user/set_password',{ password: password })
        if (success.status === 200) {            
            dispatch(announcePasswordSet(json.user))
            on_done()
        } else {
            dispatch(announcePasswordNotSet())
            showError('Unable to set password')
        }
    }
}

export function setLanguage(language_code, on_done) {
    return async(dispatch, getState) => {
        let [json, success] = await http.post(getState(), 'user/set_language', {language_code: language_code})
        if (success.status === 200 && has(json, 'status') && json['status'] === 'success') {            
            on_done()
        } else {
            showError('Unable to set language')
        }
    }
}

export function updateUser(values, on_done) {
    return async(dispatch, getState) => {
        dispatch(announceUpdatingUser())
        let [json, success] = await http.post(getState(), 'user/update_user', values)
        if (success.status === 200 && has(json, 'status') && json['status'] === 'success') {            
            dispatch(announceUserUpdated(json.user))
            on_done()
        } else {
            dispatch(announceUserNotUpdated())
            showError('Unable to update user')
        }
    }
}

export function refreshLoggedInUserCookieFromUser(user) {
    cookie.save('user', user, {path: '/' }) 
}
