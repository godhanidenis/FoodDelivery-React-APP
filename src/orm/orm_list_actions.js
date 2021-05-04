import difference from 'lodash/difference'
import keys from 'lodash/keys'
import map from 'lodash/map'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import { cleanId } from '../lib'
import { ORM_LIST_KEY, ORM_OBJECT_KEY } from '.'
import { get, intersection, union } from 'lodash'
import { removeObjectsFromState } from './orm_objects_actions'

export const INIT_LIST = 'ORM_INIT_LIST'
export const ANNOUNCE_LIST_LOADED = 'ORM_ANNOUNCE_LIST_LOADED'
export const ANNOUNCE_LIST_LOAD_FAILED = 'ORM_ANNOUNCE_LIST_LOAD_FAILED'
export const ANNOUNCE_LIST_LOADING = 'ORM_ANNOUNCE_LIST_LOADING'
export const ANNOUNCE_MATCHING_ITEMS_LOADED = 'ORM_ANNOUNCE_MATCHING_ITEMS_LOADED'
export const ANNOUNCE_MATCHING_ITEMS_LOAD_FAILED = 'ORM_ANNOUNCE_MATCHING_ITEMS_LOAD_FAILED'
export const ANNOUNCE_MATCHING_ITEMS_LOADING = 'ORM_ANNOUNCE_MATCHING_ITEMS_LOADING'
export const SET_ITEMS_FLAG = 'ORM_SET_ITEMS_FLAG'
export const INVALIDATE_LIST = 'ORM_INVALIDATE_LIST'
export const UPDATE_LIST_PAGINATION = 'ORM_UPDATE_LIST_PAGINATION'
export const UPDATE_LIST_FILTER = 'ORM_UPDATE_LIST_FILTER'
export const CLEAR_LIST_FILTER = "ORM_CLEAR_LIST_FILTER"
export const UPDATE_LIST_ORDERING = 'ORM_UPDATE_LIST_ORDERING'
export const UPDATE_LIST_SELECTION = 'ORM_UPDATE_LIST_SELECTION'
export const UPDATE_LIST_DISPLAY_MODE = 'ORM_UPDATE_LIST_DISPLAY_MODE'
export const CLEAR_LIST = 'ORM_CLEAR_LIST'
export const ANNOUNCE_HANDLING_POST = "ORM_ANNOUNCE_HANDLING_POST"
export const ANNOUNCE_POST_COMPLETED = "ORM_ANNOUNCE_POST_COMPLETED"

export function announceClearList(listKey) {
    return {
        type: CLEAR_LIST,
        listKey: listKey
    }
}

export function clearList(listKey) {
    return (dispatch, getState) => {
        const itemList = getState()[ORM_LIST_KEY][listKey]

        if (!itemList) {
            return
        }
        const entityKey = itemList.entityKey
        const lists = getState()[ORM_LIST_KEY]
        const objectIdsToKeep = union(map(lists, (l, key) => {
            if (key === listKey || l.entityKey !== entityKey) {
                return []
            }
            return intersection(l.visibleItemIds, itemList.visibleItemIds)
        }))

        const objectIdsToRemove = difference(itemList.visibleItemIds, objectIdsToKeep)
        dispatch(announceClearList(listKey))
        dispatch(removeObjectsFromState(entityKey, objectIdsToRemove))
    }
}

export function updateListPagination(listKey, pagination) {
    return {
        type: UPDATE_LIST_PAGINATION,
        listKey: listKey,
        pagination: pagination
    }
}

export function updateListFilter(listKey, filter) {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_LIST_FILTER,
            listKey: listKey,
            filter: filter
        })
        dispatch(invalidateList(listKey))
    }
}

export function clearListFilter(listKey) {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_LIST_FILTER,
            listKey: listKey
        })
        dispatch(invalidateList(listKey))
    }
}

export function updateListOrdering( listKey, ordering) {
   
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_LIST_ORDERING,
            ordering: ordering,
            listKey:listKey
        })
        dispatch(invalidateList(listKey))
    }
    
}

export function updateListSelection(listKey, selectedIds) {
    return {
        type: UPDATE_LIST_SELECTION,
        listKey: listKey,
        selected_ids: selectedIds
    }
}

export function getSelectedIds(listKey, state) {
    const itemList = get(state, `${ORM_LIST_KEY}.${listKey}`) || {}
    return get(itemList, "selected_ids")
}

export function invalidateList(listKey) {
    return {
        type: INVALIDATE_LIST,
        listKey
    }
}

export function announceListLoading(entityKey, listKey) {
    return {
        type: ANNOUNCE_LIST_LOADING,
        listKey,
        entityKey
    }
}

export function announceMatchingItemsLoading(entityKey, listKey, loadingItemIds) {
    return {
        type: ANNOUNCE_MATCHING_ITEMS_LOADING,
        listKey,
        entityKey,
        loadingItemIds
    }
}

export function announceListLoaded(entityKey, listKey, payload, pagination) {
    return {
        type: ANNOUNCE_LIST_LOADED,
        entityKey: entityKey,
        visibleItemIds: payload.map(i => i.id),
        pagination: pagination,
        listKey: listKey,
        receivedAt: Date.now()
    }
}

export function announceMatchingItemsLoaded(entityKey, listKey) {

    return {
        type: ANNOUNCE_MATCHING_ITEMS_LOADED,
        listKey,
        entityKey,
        receivedAt: Date.now()
    }
}

export function announceListLoadFailed(entityKey, listKey, error) {
    console.trace(error)
    return {
        type: ANNOUNCE_LIST_LOAD_FAILED,
        listKey: listKey,
        entityKey: entityKey,
        error: error,
        receivedAt: Date.now()
    }
}

export function announceMatchingItemsLoadFailed(entityKey, listKey, error) {
    return {
        type: ANNOUNCE_MATCHING_ITEMS_LOAD_FAILED,
        listKey: listKey,
        entityKey: entityKey,
        error: error,
        receivedAt: Date.now()
    }
}

export function announceHandlingPost(entityKey, listKey) {
    return {
        type: ANNOUNCE_HANDLING_POST,
        listKey,
        entityKey
    }
}

export function announcePostCompleted(entityKey, listKey) {
    return {
        type: ANNOUNCE_POST_COMPLETED,
        listKey,
        entityKey
    }
}

export function getMissingItemIds(state, requiredItemIds, entityKey) {
    // Returns a list of itemIds which aren't already loaded or invalidated or already loading
    const requiredItemRefs = map(requiredItemIds, cleanId)
    const matchingItems = state[ORM_OBJECT_KEY][entityKey] || {}
    let matchingItemIds = keys(matchingItems.itemsById || {}).map(cleanId)

    const invalidatedItemRefs = map(matchingItems.invalidatedItemIds || [], cleanId)
    matchingItemIds = difference(matchingItemIds, invalidatedItemRefs)

    const matchingItemRefs = map(matchingItemIds, cleanId)
    let unMatchingItemIds = difference(requiredItemRefs, matchingItemRefs)

    const loadingItemIds = map(matchingItems.loadingItemIds || [], cleanId)
    unMatchingItemIds = difference(unMatchingItemIds, loadingItemIds)

    unMatchingItemIds = compact(unMatchingItemIds)

    return unMatchingItemIds
}

export function shouldFetchList(state, listKey) {
    const itemList = get(state, `${ORM_LIST_KEY}.${listKey}`) || {}
    if (itemList.isLoading) {
        return false
    }
    if (itemList.itemsInvalidated) {
        return true
    }

    return isEmpty(itemList)
}

export function getLastListError(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.lastError`) || null
}

export function isListLoading(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.isLoading`) || false
}

export function isListSaving(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.isSaving`) || false
}

export function isListHandlingPost(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.handlingPost`) || false
}

export function isListInvalidated(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.itemsInvalidated`) || false
}

export function isListFirstLoadTriggered(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.firstLoadTriggered`, false)
}

export function getVisibleItemIds(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.visibleItemIds`)
}

export function getPagination(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.pagination`) || {}
}

export function getFilter(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.filter`) || {}
}

export function hasListObjectsLoaded(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.has_list_loaded`, false)
}

export function isLoadingObjects(listKey, state) {
    return get(state, `${ORM_LIST_KEY}.${listKey}.loadingMatchingItems`, false)
}
