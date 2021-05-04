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
    announceObjectSaved
} from './orm_objects_actions'

import { ORM_LIST_KEY } from '.'

import {
    getMissingItemIds,
    announceMatchingItemsLoading,
    announceMatchingItemsLoaded,
    announceListLoadFailed,
    announceListLoaded,
    shouldFetchList,
    announceListLoading
} from './orm_list_actions'

import { get, isEmpty } from 'lodash'

async function getItemsPromise(db, entityKey, params) {

    let json
    if (!isEmpty(params)) {
        json = await db[entityKey].where(params).toArray()
    } else {
        json = await db[entityKey].toArray()
    }

    if (isEmpty(json)) {
        return {
            payload: [],
            pagination: []
        }
    }
    return {
        payload: json,
        pagination: []
    }
}

export function tryFetchMatchingItems(listKey, entityKey, requiredItemIds, url, fixResponse) {
    // The second half of tryFetchListAndItems, separated out for clarity
    return async (dispatch, getState) => {
        if (!requiredItemIds) {
            return []
        }
        const state = getState()
        let requestFilter = {}

        if (listKey) {
            const l = state[ORM_LIST_KEY][listKey]

            if (l && l.loadingMatchingItems) {
                return getObjectsFromState(state, requiredItemIds)
            }
            requestFilter = Object.assign({}, requestFilter, l && l.filter)
        }

        const unmatching_item_ids = getMissingItemIds(state, requiredItemIds, entityKey)
        if (unmatching_item_ids.length > 0) {
            dispatch(announceMatchingItemsLoading(entityKey, listKey, requiredItemIds))
            let json
            try {
                json = await getItemsPromise(state.db.db, entityKey, requestFilter)
            } catch (e) {
                return dispatch(announceListLoadFailed(
                    entityKey, listKey,
                    "Failed to load list: " + entityKey + ": " + listKey + " : " + json.toString()))
            }
            json = fixResponse ? fixResponse(json) : json
            dispatch(announceMatchingItemsLoaded(entityKey, listKey))
            dispatch(announceObjectsLoaded(entityKey, json))
        } else {
            return getObjectsFromState(state, requiredItemIds)
        }
    }
}

function tryFetchListAndItems(listKey, entityKey, url, fixResponse) {

    return async(dispatch, getState) => {
        const state = getState()

        const l = get(state, `${ORM_LIST_KEY}.${listKey}`) || {}

        const visibleItemIds = l.visibleItemIds
        if (!shouldFetchList(state, listKey)) {
            if (visibleItemIds) {
                return dispatch(tryFetchMatchingItems(listKey, visibleItemIds, entityKey, url, fixResponse))
            } else {
                return Promise.resolve([])
            }
        }

        dispatch(announceListLoading(entityKey, listKey))
        const params = Object.assign({}, l.filter, l.ordering || {})

        let json
        try {
            json = await getItemsPromise(state.db.db, entityKey, params)
        } catch (error) {
            dispatch(announceListLoadFailed(entityKey, listKey, "Failed to load list: " + entityKey + ": " + listKey + " : " + error))
            return
        }

        json = fixResponse ? fixResponse(json): json
        dispatch(announceListLoaded(entityKey, listKey, json, json.pagination))
        dispatch(announceObjectsLoaded(entityKey, json))
        return json
    }
}

export function fetchListIfNeeded(listKey, entityKey, url, fixResponse) {
    return (dispatch, getState) => {
        const state = getState()
        if (shouldFetchList(state, listKey)) {
            if (entityKey === undefined) {
                entityKey = state[ORM_LIST_KEY][listKey].entityKey
            }

            return dispatch(tryFetchListAndItems(listKey, entityKey, url, fixResponse))
        }
        return Promise.resolve([])
    }
}

export function saveNewObject(entityKey, listKey, item) {
    item = Object.assign({}, item)
    delete item.isNewInstance

    return async (dispatch, getState) => {
        dispatch(announceSavingObject(entityKey, listKey, item))
        const db = getState().db.db
        try {
            await db[entityKey].put(item)
            dispatch(announceNewObjectSaved(entityKey, listKey, item, item.id))
        } catch (e) {
            dispatch(announceObjectSaveFailed(entityKey, listKey, e))
            console.error({_error: e})
        }
        return await item
    }
}

export function saveObject(entityKey, listKey, item) {
    return async (dispatch, getState) => {
        dispatch(announceSavingObject(entityKey, listKey, item))
        const db = getState().db.db
        try {
            await db[entityKey].put(item)
            dispatch(announceObjectSaved(entityKey, listKey, item, item.id))
        } catch (e) {
            dispatch(announceObjectSaveFailed(entityKey, listKey, e))
            console.error({_error: e})
        }
        return await item
    }
}

export function deleteObject(entityKey, listKey, itemId) {

    return async (dispatch, getState) => {
        const item = getObject(getState(), entityKey, itemId)
        const db = getState().db.db
        if (!item) {
            return null
        }

        if (item.isNewInstance) {
            return dispatch(announceObjectDeleted(entityKey, listKey, itemId))
        }

        dispatch(announceDeletingObject(entityKey, listKey, itemId))
        try {
            await db[entityKey].delete(itemId)
            return dispatch(announceObjectDeleted(entityKey, listKey, itemId))
        } catch (e) {
            dispatch(announceObjectDeleteFailed(entityKey, listKey, itemId, e))
        }

    }
}

export function ensureObjectsLoaded(entityKey, listKey, objectIds, url, fixResponse) {
    return (dispatch, getState) => {
        const objectIdsToLoad = getMissingItemIds(getState(), objectIds, entityKey)
        return dispatch(tryFetchMatchingItems(listKey, entityKey, objectIdsToLoad, url, fixResponse))
    }
}

export function ensureObjectLoaded(entityKey, listKey, objectId, url, fixResponse) {
    return ensureObjectsLoaded(entityKey, listKey, [objectId], url, fixResponse)
}
