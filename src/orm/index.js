// @ts-ignore
import {showSuccess, showError} from 'actions/Error'

import {
    invalidateList,
    updateListFilter,
    clearListFilter,
    updateListOrdering,
    isListLoading,
    getLastListError,
    isListHandlingPost,
    getFilter,
    updateListSelection,
    getSelectedIds,
    clearList,
    isListSaving,
    isListInvalidated,
    isListFirstLoadTriggered,
    getPagination,
    updateListPagination,
    hasListObjectsLoaded,
    isLoadingObjects
} from './orm_list_actions'

import {
    getObjectsFromState,
    createObject,
    getObject,
    getAllObjects,
    invalidateObjects,
    updateObject,
    getIsSavingObject,
    getLastObjectError,
    replaceObjectWithoutSaving
} from './orm_objects_actions'

import * as httpAdapter from './http_adapter'

import { absUrl } from '../lib/http.js'

// @ts-ignore
import { get, startsWith, map, keys, size, filter, head } from 'lodash'

let STATE;

export function syncORMWithStore(store) {
    STATE = store;
}

export const ORM_LIST_KEY = '@lists'
export const ORM_OBJECT_KEY = '@objects'

export const adapters = {
    httpAdapter
}

export class ItemList {
    clearList() {
        return clearList(this.listKey)
    }

    static adapters = {
        http: 'http'
    }

    getAdapterName() {
        return this.adapterName
    }

    // @ts-ignore
    errorMessage(e) {
        
    }

    static itemUrl(url, absolute=false, params) {
        if (!startsWith(url, '/')) {
            url = '/' + url
        }
        if (absolute) {
            // @ts-ignore
            return absUrl((new this()).getEntityKey() + url, params)
        } else {
            return (new this()).getEntityKey() + url
        }
    }
    getEntityKey() {
        throw new Error('Method not implemented.')
    }

    // @ts-ignore
    constructor(listKey, adapter) {
        this.listKey = listKey
        this.pagination = {}
        this.fixResponse = this.fixResponse.bind(this)
       
        this.adapter = httpAdapter
        this.adapterName = 'http'

    }

    fixResponse(json) {
        return json
    }

    preSaveHook(formik_funcs) {
        if ( ! formik_funcs ) {
            return
        }
    }

    deleteObject(objectId, onDone) {
        // @ts-ignore
        return this.adapter.deleteObject(this.getEntityKey(), this.listKey, objectId, onDone)
    }

    getNewObjects() {
        return this.getObjects().filter(i => i.isNewInstance)
    }

    createObject(values) {
        return createObject(this.getEntityKey(), this.listKey, values);
    }

    // @ts-ignore
    saveObject(instance, onDone, formik_funcs) {
        // const wrappedOnDone = (res) => this.handleSaveResult(res, formik_funcs, onDone)
        if (instance.isNewInstance) {
            return this.adapter.saveNewObject(this.getEntityKey(), this.listKey, instance, {postSaveFilter: this.postSaveFilter})
        } else {
            return this.adapter.saveObject(this.getEntityKey(), this.listKey, instance, {postUpdateFilter: this.postUpdateFilter})
        }
    }

    postSaveFilter = (json) => {
        return json
    }

    postUpdateFilter = (json) => {
        return this.postSaveFilter(json)
    }
    
    // @ts-ignore
    saveNewObject(instance, onDone, formik_funcs) {
        // const wrappedOnDone = (res) => this.handleSaveResult(res, formik_funcs, onDone)
        const res = this.adapter.saveNewObject(this.getEntityKey(), this.listKey, instance, {postSaveFilter: this.postSaveFilter})
        return res
    } 

    // @ts-ignore
    patchObject(instance, onDone, formik_funcs) {
        // const wrappedOnDone = (res) => this.handleSaveResult(res, formik_funcs, onDone)
        return this.adapter.patchObject(this.getEntityKey(), this.listKey, instance, {postUpdateFilter: this.postUpdateFilter})
    }

    // @ts-ignore
    handlePost(postData, onDone, formik_funcs) {
        // const wrappedOnDone = (res) => this.handleSaveResult(res, formik_funcs, onDone)
        // @ts-ignore
        return this.adapter.handlePost(this.getEntityKey(), this.listKey, postData, onDone)
    }

    replaceObjectWithoutSaving(newInstance) {
        return replaceObjectWithoutSaving(this.getEntityKey(), this.listKey, newInstance)
    }

    invalidateObject(objectId) {
        return invalidateObjects([objectId], this.getEntityKey())
    }

    invalidateObjects(objectIds) {
        return invalidateObjects(objectIds, this.getEntityKey())
    }

    invalidateAllObjects() {
        const object_ids = map(this.getObjectsById(), (x) => x.id)
        return this.invalidateObjects(object_ids)
    }

    getState() {
        return STATE.getState()
    }

    getBaseUrl() {
        return this.getEntityKey() + "/"
    }

    updateObject(instance) {
        return updateObject(this.getEntityKey(), this.listKey, instance);
    }

    fetchListIfNeeded(forceUpdate) {
        // @ts-ignore
        
        return (dispatch, getState) => {
            return dispatch(this.adapter.fetchListIfNeeded(
                this.listKey,
                this.getEntityKey(),
                this.getBaseUrl(),
                this.fixResponse,
                forceUpdate)
            )
        }
    }

    invalidateList() {
        return invalidateList(this.listKey)
    }

    hasListObjectsLoaded() {
        return hasListObjectsLoaded(this.listKey, this.getState())
    }

    isListInvalidated() {
        return isListInvalidated(this.listKey, this.getState())
    }

    updateListFilter(newFilter, depart_warehouse_name) {
       
        return updateListFilter(this.listKey, Object.assign({}, newFilter, {page: 1},depart_warehouse_name))
    }

    clearListFilter() {
        return clearListFilter(this.listKey)
    }

    updateListOrdering(ordering) {
        return updateListOrdering( this.listKey, Object.assign({}, {ordering:ordering}, {page: 1}))
    }

    ensureObjectsLoaded(itemIds) {
        return this.adapter.ensureObjectsLoaded(this.getEntityKey(), this.listKey, itemIds, this.getBaseUrl(), this.fixResponse)
    }

    ensureObjectLoaded(itemId) {
        return this.adapter.ensureObjectsLoaded(this.getEntityKey(), this.listKey, [itemId], this.getBaseUrl(), this.fixResponse)
    }

    getObject(itemId) {
        if (itemId === null || itemId === undefined) {
            return {}
        }
        return getObject(this.getState(), this.getEntityKey(), itemId)
    }

    getObjectsById() {
        return get(this.getState(), `${ORM_OBJECT_KEY}.${this.getEntityKey()}.itemsById`) || {}
    }

    getVisibleObjects() {
        return this.getObjects(undefined)
    }

    getAsOptions() {
        return this.getAsOptionsWithEmptyOption({empty_label:null})
    }

    getOptionValueForLabel(name) {
        const options = this.getAsOptions()
        const option = head(filter(options, (option) => option.label==name))
        return get(option, "value", null)
    }
    
    getAsOptionsWithEmptyOption({empty_label}) {
        const items = this.getVisibleObjects()
        let res = map(items, function(item) { return {label: item.name, value: item.id, original_item: item}})
        if (empty_label) {
            // @ts-ignore
            res.push({label: empty_label, value: null})
        }
        return res
    }

    getAsOptionsFullValue() {
        const items = this.getVisibleObjects()
        return map(items, function(item) { return {label: item.name, value: item}})
    }

    getPagination() {
        return getPagination(this.listKey, this.getState())
    }

    updatePaginationNumItemsPerPage(items_per_page) {
        return updateListPagination(this.listKey, {items_per_page:items_per_page})
    }

    getIsSavingObject() {
        return getIsSavingObject(this.getEntityKey(), this.getState())
    }

    getIsUpdatingObject(item_id) {
        return getIsSavingObject(this.getEntityKey() + "/" + item_id, this.getState())
    }
    
    getObjects(itemIds) {
        const state = this.getState()
        if (state) {
            if (itemIds === undefined) {
                itemIds = get(state, `${ORM_LIST_KEY}.${this.listKey}.visibleItemIds`) || []
            }
            return getObjectsFromState(state, this.getEntityKey(), itemIds)
        } else {
            return []
        }
    }

    getVisibleItemIds() {
        const state = this.getState()
        if (state) {
            return get(state, `${ORM_LIST_KEY}.${this.listKey}.visibleItemIds`) || []
        } else {
            return []
        }
    }

    isReady() {
        // this does not include isLoading, specifically because while isLoading we might not want to refresh the screen, but isReady means the data isn't at all right yet.
        return isListFirstLoadTriggered(this.listKey, this.getState())
    }

    isLoading() {
        return !this.isReady() ||
               isListLoading(this.listKey, this.getState()) || 
               !hasListObjectsLoaded(this.listKey, this.getState()) ||
               isLoadingObjects(this.listKey, this.getState())
    }

    isSaving() {
        return isListSaving(this.listKey, this.getState())
    }

    isHandlingPost() {
        return isListHandlingPost(this.listKey, this.getState())
    }

    getLastError() {
        return getLastObjectError(this.listKey, this.getState()) ||
               getLastListError(this.listKey, this.getState())
    }

    getFilter() {
        return getFilter(this.listKey, this.getState())
    }

    selectObjectId(id) {
        return this.selectObjectIds([id])
    }
    
    selectObjectIds(ids) {
        return updateListSelection(this.listKey, ids)
    }

    getSelectedObjectIds() {
        return getSelectedIds(this.listKey, this.getState())
    }

    getSelectedObjectId() {
        const ids = this.getSelectedObjectIds()
        if ( ! ids || ids.length === 0 ) {
            return null
        }
        return ids[0]
    }

    getSelectedObject() {
        return this.getObject(this.getSelectedObjectId())
    }

    getAllObjects() {
        const state = this.getState()
        console.log("all_objects_state:", state);
        console.log("this.getEntityKey()", this.getEntityKey());
        return getAllObjects(state, this.getEntityKey())
    }

    getVisibleRelatedObjectIdsByField(field) {
        const visible_objects = this.getVisibleObjects()
        let related_object_ids = []
        map(visible_objects, (object) => {
            const related_object_id = get(object, field, null)
            if (related_object_id) {
                related_object_ids.push(related_object_id)
            }
        })
        return related_object_ids
    }

    getVisibleObjectsAsTree() {
        const all_objects = this.getAllObjects()
        console.log("all_objects", all_objects);
        const roots = filter(all_objects, (obj) => obj && obj.parent === null)
        return roots
    }


}
