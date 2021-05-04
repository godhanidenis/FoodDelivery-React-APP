import { isObject, map, isEmpty } from 'lodash';
import queryString from 'query-string'
import fetch from 'isomorphic-fetch'
import { authToken } from '../actions/auth'
import { clearAuthentication } from '../actions/auth'

export function getHeaders(state, customHeaders) {
    let headers = {
        "Content-type": "application/json;charset=UTF-8"
    }
    if (authToken()) {
        headers['X-FOODSPACE-AUTHENTICATION-TOKEN'] = 'Token ' + authToken()
    }

    return Object.assign({}, headers, customHeaders)
}

function addQueryParams(url, params) {
    const parsedUrl = queryString.parseUrl(url)
    parsedUrl.query = Object.assign({}, params, parsedUrl.query)
    return parsedUrl.url + '?' + queryString.stringify(parsedUrl.query)
}

export function absUrl(url) {
    // @ts-ignore
    const apiBaseUrl = window.LOCAL_SETTINGS.API_BASE
    return apiBaseUrl + url
}

export function put(state, url, data) {
    // TODO state not being used - remove from function
    return post(state, url, data, 'PUT')
}

export function post(state, url, data, method='POST', params={}) {
    // TODO state not being used - remove from function
    try {
        if (isObject(data)) {
            data = JSON.stringify(data)
        }

        const headers = getHeaders()
        url = addQueryParams(absUrl(url + '/'), params)

        let res = fetch(url, {
            method: method,
            headers: headers,
            body: data
        })
        
        return res.then(handleResponse)
    } catch (error) {
        throw error
    }
}

export function patch(state, url, data, params={}) {
    return post(state, url, data, 'PATCH', params)
}

export function get(url, params, custom_headers) {
    let headers = getHeaders(custom_headers)

    if (params) {
        url = absUrl(url + serialize(params))
    } else {
        url = absUrl(url)
    }

    let res = fetch(url, {
        method: "GET",
        headers: headers
    })

    return res.then(handleResponse)
}

export function del(state, url, params) {
    // TODO state not being used - remove from function
    return post(state, url, params, 'DELETE')
}

function handleMaintenanceMode() {
    window.location.reload()
}

function handleResponse(response) {
    let contentType = response.headers.get("content-type");
    const xPagination = response.headers.get("x-pagination");
    const pagination = parsePagination(xPagination)
    const isJson = contentType && contentType.indexOf("application/json") !== -1
    const isSuccessful = response.status < 400

    if ( response.status == 401 ) {
        clearAuthentication()
    }
    if ( response.status === 503 ) {
        handleMaintenanceMode()
    }
    
    if (isJson) {
        if (isEmpty(pagination)) {
            return Promise.all([response.json(), response, isSuccessful, {}])
        } else {
            let payload = response.json()
            return Promise.all([payload, response, isSuccessful, pagination])
        }
    } else {
        return Promise.all([response.text(), response, isSuccessful, {}]);
    }
}

function parsePagination(pagination_string) {
    let context = {}
    if (pagination_string !== null && pagination_string.indexOf(';') !== -1) {
        let items = pagination_string.split(';')
        map(items, function(item) {
            let value = item.split('=')
            context[value[0]] = parseInt(value[1], 10)
        })
    }
    return context
}

function serialize(obj) {
    return '?' + Object.keys(obj).reduce(
        function(a, k){
            if (obj[k] !== null && obj[k] !== undefined) {
                a.push(k + '=' + encodeURIComponent(obj[k]));
            }
            return a
        }, []).join('&')
}
