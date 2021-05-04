import fetch from 'isomorphic-fetch'
import cookie from 'react-cookies'
import moment from 'moment'
import { map, keys, join } from 'lodash'
import { authToken, clearAuthentication } from 'actions/auth'

export const DUPLICATE_LOADING_ERROR_MESSAGE = 'DUPLICATE_LOADING_ERROR_MESSAGE'
export const DUPLICATE_SAVING_ERROR_MESSAGE = 'DUPLICATE_SAVING_ERROR_MESSAGE'
export const MAINTENANCE_MODE = 'MAINTENANCE_MODE'

const throttles = {}

const AUTH_TOKEN_HEADER_NAME = 'X-FOODSPACE-AUTHENTICATION-TOKEN'

export function stringifyIds(ids) {
    const x = map(ids, function(id) { return "" + id })
    return x
}

export function populateDefaultRequestHeaders(headers) {
    const csrftoken = cookie.load('csrftoken')
    headers['X-CSRFToken'] = csrftoken

    const auth_token = authToken()
    if ( auth_token ) {
        headers[AUTH_TOKEN_HEADER_NAME] = 'Token ' + auth_token
    }
}

const serializeQueryParams = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function absUrl(url) {
    const apiBaseUrl = window.LOCAL_SETTINGS.API_BASE
    return apiBaseUrl + url
}

export function impfetch(state, url, dispatch, args) {

    url = "" + url

    let absolute_url = url
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
        absolute_url = state.settings.API_BASE + url
    }

    args = args || {}
    if ( ! args.headers ) {
        args.headers = {}
        args.headers['Content-type'] = 'application/json; charset=UTF-8'
    }
    populateDefaultRequestHeaders(args.headers)

    if ( ! args.credentials ) {
        args.credentials = 'same-origin'
    }

    if ( args.params ) {
        let param_payload = JSON.stringify(args.params)
        absolute_url += "?params=" + param_payload
        if ( args.params.filter ) {
            absolute_url += "&"+serializeQueryParams(args.params.filter)
        }
    }

    const throttle = throttles[absolute_url] || {}
    const THROTTLE_HIT_PAUSE_SECONDS = 0.5
    const now = moment()

    const last_run_was_x_milliseconds_ago = (throttle.last_run_at && now.diff(throttle.last_run_at, 'milliseconds')) || null
    const is_running = throttle.running && last_run_was_x_milliseconds_ago < THROTTLE_HIT_PAUSE_SECONDS*1000

    const last_failure_was_x_milliseconds_ago = (throttle.last_failure_at && now.diff(throttle.last_failure_at, 'milliseconds')) || null
    const failed_recently = last_failure_was_x_milliseconds_ago && last_failure_was_x_milliseconds_ago < THROTTLE_HIT_PAUSE_SECONDS*1000
    if ( is_running || failed_recently ) {
        return new Promise(function(resolve, reject) {
            // Note we accept because we don't know if this will be an error.
            // The calling component is highly likely to call again if the data
            // is still not present so this has a small chance of site integrity.
            setTimeout(function() {

                if ( args.method === "POST" || args.method === "PUT" || args.method === "DELETE" ) {
                    reject(DUPLICATE_SAVING_ERROR_MESSAGE)
                } else {
                    reject(DUPLICATE_LOADING_ERROR_MESSAGE)
                }
            }, 100) // Mini pause to prevent reject thrashing.
        })
    }

    // we continue to reference the main throttles object to help with multi-threading
    throttles[absolute_url] = throttle
    throttles[absolute_url].running = true
    throttles[absolute_url].last_run_at = moment()

    const res = fetch(absolute_url, args)
    res.then(function(response) {    
       
        if ( ( (""+response.status)[0] === "4" ) || ( (""+response.status)[0] === "5" ) ) {
            throttles[absolute_url].last_failure_at = moment()
            if ( (response.status === 301 || response.status === 401) && dispatch ) {
                dispatch(clearAuthentication())
            }
        } else {
            throttles[absolute_url].last_failure_at = null
        }
        throttles[absolute_url].running = false
    })
    return res
}


export function format_hours(decimal_hours, parts, show_seconds) {
    parts = parts || convert_hours_to_parts(decimal_hours)
    let {hours, minutes, seconds} = parts
    if (hours   < 10 && hours >= 0) {hours   = "0"+hours}
    if (minutes < 10 && minutes >= 0) {minutes = "0"+minutes}
    if (seconds < 10 && seconds >= 0) {seconds = "0"+seconds}

    if ( show_seconds === true ) {
        return hours+':'+minutes+':'+seconds
    } else {
        return hours+':'+minutes
    }
}

export function convert_hours_to_parts(hours) {
    if ( ! hours ) {
        hours = 0
    }
    const raw_seconds = hours*60*60
    var sec_num = parseInt(raw_seconds, 10)
    hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    var seconds = sec_num - (hours * 3600) - (minutes * 60)
    return {hours: hours, minutes:minutes, seconds:seconds}
}

function package_url(url, params) {
    let absolute_url = absUrl(url)
    if ( params ) {
        absolute_url += "?" + encodeQueryData(params)
    }
    return absolute_url
}

export function download(url, params, post_params) {
    let form = document.createElement('form');

    let absolute_url = package_url(url, params)
    
    form.setAttribute('action', absolute_url);
    form.setAttribute('method', 'post')

    let input = document.createElement('input');
    input.name = AUTH_TOKEN_HEADER_NAME
    input.value = authToken()
    form.appendChild(input)

    if ( post_params ) {
        let post_params_input = document.createElement('input')
        post_params_input.name = 'post_params'
        post_params_input.value = JSON.stringify(post_params)
        form.appendChild(post_params_input)
    }
    
    document.body.appendChild(form)
    form.submit()
    
    document.body.removeChild(form);
}

export function hash_flat_object(obj) {
    // only suitable for very simple object types
    return hash_string(JSON.stringify(obj))
}

export function hash_string(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

function encodeQueryData(data) {
    const encoded_params = map(keys(data), (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    return join(encoded_params, "&")
}            
