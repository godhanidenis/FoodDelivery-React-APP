import { http } from '../lib'
import { get, has } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import {
    announceObjectsLoaded,
    getObjectsFromState,
    announceSavingObject,
    announceNewObjectSaved,
    announceObjectSaveFailed,
    getObject,
    announceDeletingObject,
    announceObjectDeleted,
    announceObjectDeleteFailed,
    announceObjectSaved,
    getIsSavingObject
} from './orm_objects_actions'

import { ORM_LIST_KEY } from '.'

import {
    getMissingItemIds,
    announceMatchingItemsLoading,
    announceMatchingItemsLoaded,
    announceMatchingItemsLoadFailed,
    announceListLoadFailed,
    announceListLoaded,
    shouldFetchList,
    announceListLoading,
    announceHandlingPost,
    announcePostCompleted
} from './orm_list_actions'

import { getSubmissionErrors } from '../actions/Error'

let global_http_counter = 0
export const getGlobalHttpCounter = () => {
    return global_http_counter
}

export function tryFetchMatchingItems(listKey, entityKey, requiredItemIds, url, fixResponse) {
    // The second half of tryFetchListAndItems, separated out for clarity
    
    return async(dispatch, getState) => {

        if (!requiredItemIds) {
            return []
        }
        const state = getState()
        let requestFilter = {}
        const unmatching_item_ids = getMissingItemIds(state, requiredItemIds, entityKey)
        if (listKey) {
            const l = state[ORM_LIST_KEY][listKey]
            if (l && l.loadingMatchingItems && unmatching_item_ids.length === 0) {
                return getObjectsFromState(state, requiredItemIds)
            }
            requestFilter = Object.assign({}, requestFilter, l && l.filter, {all: true})
        }

        if (unmatching_item_ids.length > 0) {
            dispatch(announceMatchingItemsLoading(entityKey, listKey, requiredItemIds))
            requestFilter.ids = unmatching_item_ids
            return http
                .get(url || entityKey, requestFilter)
                .then(([json, response, success]) => {
                    global_http_counter += 1
                    if (success) {
                        json = fixResponse ? fixResponse(json) : json
                        dispatch(announceMatchingItemsLoaded(entityKey, listKey))
                        dispatch(announceObjectsLoaded(entityKey, json))
                        return json
                    } else {

                        dispatch(announceListLoadFailed(
                            entityKey, listKey,
                            "Failed to load list: " + entityKey + ": " + listKey + " : " + json.toString()))
                        return []
                    }
                })
                .catch(function(error) {
                    global_http_counter += 1
                    dispatch(announceMatchingItemsLoadFailed(entityKey, listKey, "Failed to load entity list: " + error))
                })
        } else {
            global_http_counter += 1
            return getObjectsFromState(state, requiredItemIds)
        }
    }
}

export function tryFetchListAndItems(listKey, entityKey, url, fixResponse, forceUpdate) {
    return async(dispatch, getState) => {
        const state = getState()

        const l = get(state, `${ORM_LIST_KEY}.${listKey}`) || {}

        let fetchPromise
        const visibleItemIds = l.visibleItemIds

        dispatch(announceListLoading(entityKey, listKey))

        if (!forceUpdate && !shouldFetchList(state, listKey)) {
            if (visibleItemIds) {
                return dispatch(tryFetchMatchingItems(listKey, visibleItemIds, entityKey, url, fixResponse))
            } else {
                return Promise.resolve([])
            }
        } else {
            const params = Object.assign({}, l.filter, l.pagination, l.ordering)

            if ( url === undefined ) {
                url = entityKey + "/"
            }
            fetchPromise = http.get(url, params, {})
        }

        let json, response, success, pagination
        try {
            [json, response, success, pagination] = await fetchPromise
        } catch (error) {
            dispatch(announceListLoadFailed(
                entityKey, listKey,
                "Failed to load list: " + entityKey + ": " + listKey + " : " + error))
            throw error
        }
        if (!success) {
            dispatch(announceListLoadFailed(entityKey, listKey, json.errors))
        } else {
            dispatch(announceObjectsLoaded(entityKey, json))
            dispatch(announceListLoaded(entityKey, listKey, json, pagination))
        }
        return json
    }
}

export function fetchListIfNeeded(listKey, entityKey, url, fixResponse, forceUpdate) {
   
    return (dispatch, getState) => {
       
        const state = getState()
        if (forceUpdate || shouldFetchList(state, listKey)) {
            if (entityKey === undefined) {
                entityKey = state[ORM_LIST_KEY][listKey].entityKey
            }
            return dispatch(tryFetchListAndItems(listKey, entityKey, url, fixResponse, forceUpdate))
        }
        return Promise.resolve([])
    }
}

export function ensureObjectsLoaded(entityKey, listKey, objectIds, url, fixResponse) {
    return (dispatch, getState) => {
        const objectIdsToLoad = getMissingItemIds(getState(), objectIds, entityKey)
        return dispatch(tryFetchMatchingItems(listKey, entityKey, objectIdsToLoad, url, fixResponse))
    }
}

export function ensureObjectLoaded(entityKey, listKey, objectId, url, fixResponse) {
    return ensureObjectsLoaded(entityKey, listKey, [objectId], fixResponse)
}

export function saveNewObject(entityKey, listKey, item, {postSaveFilter}) {
    const newValues = Object.assign({}, item)
    delete newValues.isNewInstance
    delete newValues.id

    const unique_id = uuidv4()

    return (dispatch, getState) => {
        const state = getState()
        dispatch(announceSavingObject(entityKey, listKey, {id:unique_id}))

        return http
            .post(state, entityKey, newValues)
            .then(([json, response, success]) => {
                global_http_counter += 1

                if ( postSaveFilter ) {
                    json = postSaveFilter(json)
                }

                if (success) {
                    dispatch(announceNewObjectSaved(entityKey, listKey, json, unique_id))
                    return json
                } else {
                    const submission_errors = getSubmissionErrors(json)
                    dispatch(announceObjectSaveFailed(entityKey,
                                                      listKey,
                                                      Object.assign({id:unique_id}, json),
                                                      submission_errors))
                    const res = { 'errors': submission_errors }
                    return res
                }
            })
            .catch(json => {
                global_http_counter += 1
                dispatch(announceObjectSaveFailed(entityKey, listKey, {id:unique_id}, json.errors))
                let res
                if (json.errors) {
                    res = { 'errors': json.errors }
                } else {
                    res = { 'errors': {_error: json.message } }
                }
                return res
            })
    }
}

export function patchObject(entityKey, listKey, item, {postUpdateFilter}) {
    const newValues = Object.assign({}, item)

    return (dispatch, getState) => {
        const state = getState()
        dispatch(announceSavingObject(entityKey, listKey, item))
        const url = `${entityKey}/${item.id}`
        return http
            .patch(state, url, newValues)
            .then(([json, response, success]) => {
                global_http_counter += 1

                if ( postUpdateFilter ) {
                    json = postUpdateFilter(json)
                }

                if ( success ) {
                    dispatch(announceObjectSaved(entityKey, listKey, json))
                    return json
                } else {
                    const submission_errors = getSubmissionErrors(json)
                    dispatch(announceObjectSaveFailed(entityKey,
                                                      listKey,
                                                      Object.assign({id:item.id}, json),
                                                      submission_errors))
                    return { 'errors': submission_errors }
                }
            }).catch(json => {
                global_http_counter += 1
                dispatch(announceObjectSaveFailed(entityKey,
                                                  listKey,
                                                  Object.assign({id:item.id, error:json.errors}),
                                                  json.errors))
                let res
                if (json.errors) {
                    res = { 'errors': json.errors }
                } else {
                    res = { 'errors': {_error: json.message } }
                }
                return res
            })
    }
}

export function saveObject(entityKey, listKey, item, {postUpdateFilter}) {
    return (dispatch, getState) => {
        const state = getState()
        dispatch(announceSavingObject(entityKey, listKey, item))
        const url = `${entityKey}/${item.id}`
        console.log("Save Object URL : ",url)
        console.log("Save Object listKey : ",listKey)
        console.log("Save Object item : ",item)
        
        return http
            .put(state, url, item)
            .then(([json, response, success]) => {
                global_http_counter += 1

                if ( postUpdateFilter ) {
                    json = postUpdateFilter(json)
                }

                if ( success ) {
                    dispatch(announceObjectSaved(entityKey, listKey, json))
                    return json
                } else {
                    const submission_errors = getSubmissionErrors(json)
                    dispatch(announceObjectSaveFailed(entityKey, listKey,
                                                      Object.assign({id:item.id}, json),
                                                      submission_errors))
                    return {'errors': submission_errors}
                }

            }).catch(json => {
                global_http_counter += 1
                dispatch(announceObjectSaveFailed(entityKey,
                                                  listKey,
                                                  Object.assign({id:item.id, error:json.errors}),
                                                  json.errors))
                let res
                if (json.errors) {
                    res = { 'errors': json.errors }
                } else {
                    res = { 'errors': {_error: json.message } }
                }
                return res
            })
    }
}

export function deleteObject(entityKey, listKey, itemId) {
    return (dispatch, getState) => {
        const item = getObject(getState(), entityKey, itemId)
        dispatch(announceDeletingObject(entityKey, listKey, itemId))
        if (item.isNewInstance) {
            return dispatch(announceObjectDeleted(entityKey, listKey, itemId))
        }
        return http
            .del(getState(),`${entityKey}/${itemId}`)
            .then(([json, response, success]) => {
                global_http_counter += 1
                if (success) {
                    dispatch(announceObjectDeleted(entityKey, listKey, itemId))
                    return json
                } else {
                    dispatch(announceObjectDeleteFailed(entityKey, listKey, itemId, json.errors))
                    return {'errors': json}
                }
            }) .catch(err => {
                global_http_counter += 1
                dispatch(announcePostCompleted(entityKey, listKey))
                return {'errors': err}
            })
    }
}

export function handlePost(entityKey, listKey, postData) {
    return (dispatch, getState) => {
        const state = getState()
        dispatch(announceHandlingPost(entityKey, listKey))

        return http
            .post(state, entityKey, postData)
            .then(([json, response]) => {
                global_http_counter += 1
                dispatch(announcePostCompleted(entityKey, listKey))
                return json
            }).catch(err => {
                global_http_counter += 1
                dispatch(announcePostCompleted(entityKey, listKey))
                return err
            })
    }
}
