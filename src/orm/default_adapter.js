import * as httpAdapter from './http_adapter'
import * as indexedDBAdapter from './indexed_db_adapter'

export function getEnabledAdapter() {
    if (localStorage.getItem("isOnline") === "false") {
        return indexedDBAdapter
    }
    return httpAdapter
}

export function tryFetchMatchingItems(listKey, entityKey, requiredItemIds, url, fixResponse) {
    return getEnabledAdapter().tryFetchMatchingItems(listKey, entityKey, requiredItemIds, url, fixResponse)
}

export function tryFetchListAndItems(listKey, entityKey, url, fixResponse) {
    return getEnabledAdapter().tryFetchMatchingItems(listKey, entityKey, url, fixResponse)
}

export function fetchListIfNeeded(listKey, entityKey, url, fixResponse) {
    return getEnabledAdapter().fetchListIfNeeded(listKey, entityKey, url, fixResponse)
}

export function ensureObjectsLoaded(entityKey, listKey, objectIds, url, fixResponse) {
    return getEnabledAdapter().ensureObjectsLoaded(entityKey, listKey, objectIds, url, fixResponse)
}

export function ensureObjectLoaded(entityKey, listKey, objectId, url, fixResponse) {
    return getEnabledAdapter().ensureObjectLoaded(entityKey, listKey, objectId, url, fixResponse) 
}

export function saveNewObject(entityKey, listKey, item, onDone) {
    return getEnabledAdapter().saveNewObject(entityKey, listKey, item, onDone)
}

export function saveObject(entityKey, listKey, item) {
    return getEnabledAdapter().saveObject(entityKey, listKey, item)
}

export function deleteObject(entityKey, listKey, itemId) {
    return getEnabledAdapter().deleteObject(entityKey, listKey, itemId)
}
