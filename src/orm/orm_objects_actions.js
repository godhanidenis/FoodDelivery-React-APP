import { size, get, keyBy, merge } from 'lodash'
import { ORM_OBJECT_KEY } from '.'
import { v4 as uuidv4 } from 'uuid'

export const ANNOUNCE_OBJECTS_SAVING = 'ANNOUNCE_OBJECTS_SAVING'
export const ANNOUNCE_SAVING_OBJECT = 'ANNOUNCE_SAVING_OBJECT'
export const ANNOUNCE_OBJECT_SAVED = 'ANNOUNCE_OBJECTS_SAVED'
export const ANNOUNCE_OBJECT_SAVE_FAILED = 'ANNOUNCE_OBJECT_SAVE_FAILED'
export const ANNOUNCE_NEW_OBJECT_SAVED = 'ANNOUNCE_NEW_OBJECTS_SAVED'

export const ANNOUNCE_OBJECTS_LOADED = 'ANNOUNCE_OBJECTS_LOADED'
export const ANNOUNCE_OBJECTS_LOAD_FAILED = 'ANNOUNCE_OBJECTS_LOAD_FAILED'
export const ANNOUNCE_LOADING_OBJECTS = 'ANNOUNCE_LOADING_OBJECTS'
export const INVALIDATE_OBJECTS = 'INVALIDATE_OBJECTS'
export const INVALIDATE_ALL_OBJECTS = 'INVALIDATE_ALL_OBJECTS'
export const ANNOUNCE_OBJECT_REPLACED = 'ANNOUNCE_OBJECT_REPLACED'

export const ANNOUNCE_CAPTURING_NEW_OBJECT = 'ANNOUNCE_CAPTURING_NEW_OBJECT'
export const UPDATE_NEW_OBJECT_DETAILS = 'UPDATE_NEW_OBJECT_DETAILS'

export const ANNOUNCE_SAVING_NEW_OBJECT = 'ANNOUNCE_SAVING_NEW_OBJECT'
export const ANNOUNCE_SAVED_NEW_OBJECT = 'ANNOUNCE_SAVED_NEW_OBJECT'
export const ANNOUNCE_SAVING_NEW_OBJECT_FAILED = 'ANNOUNCE_SAVING_NEW_OBJECT_FAILED'

export const VIEW_OBJECT = 'VIEW_OBJECT'
export const CLOSE_OBJECT = 'CLOSE_OBJECT'
export const CREATE_OBJECT = 'CREATE_OBJECT'
export const CANCEL_CREATING_NEW_OBJECT = 'CANCEL_CREATING_NEW_OBJECT'

export const SAVE_OBJECT = 'SAVE_OBJECT'
export const SAVE_NEW_OBJECT = 'SAVE_NEW_OBJECT'
export const UPDATE_OBJECT = 'UPDATE_OBJECT'

export const ANNOUNCE_DELETING_OBJECT = 'ANNOUNCE_DELETING_OBJECT'
export const ANNOUNCE_OBJECT_DELETED = 'ANNOUNCE_DELETED_OBJECT'
export const ANNOUNCE_OBJECT_DELETE_FAILED = 'ANNOUNCE_OBJECT_DELETE_FAILED'

export const REMOVE_OBJECTS = 'REMOVE_OBJECTS'

export function removeObjectsFromState(entityKey, objectIds) {
    return {
        type: REMOVE_OBJECTS,
        objectIds,
        entityKey
    }
}

export function announceDeletingObject(entityKey, listKey, itemId) {
    return {
        type: ANNOUNCE_DELETING_OBJECT,
        itemId: itemId,
        received_at: Date.now(),
        entityKey,
        listKey
    }
}

export function announceObjectDeleted(entityKey, listKey, itemId) {
    return {
        type: ANNOUNCE_OBJECT_DELETED,
        itemId: itemId,
        received_at: Date.now(),
        entityKey,
        listKey
    }
}

export function announceObjectDeleteFailed(entityKey, listKey, itemId, error) {
    return {
        type: ANNOUNCE_OBJECT_DELETE_FAILED,
        error: error,
        received_at: Date.now(),
        itemId,
        entityKey
    }
}

export function announceObjectSaved(entityKey, listKey, payload) {
    return {
        type: ANNOUNCE_OBJECT_SAVED,
        item: payload,
        received_at: Date.now(),
        entityKey
    }
}

export function announceNewObjectSaved(entityKey, listKey, item, oldId) {
    return {
        type: ANNOUNCE_NEW_OBJECT_SAVED,
        item: item,
        oldId: oldId,
        received_at: Date.now(),
        entityKey,
        listKey
    }
}

export function announceObjectSaveFailed(entityKey, listKey, item, error) {
    return {
        type: ANNOUNCE_OBJECT_SAVE_FAILED,
        error: error,
        received_at: Date.now(),
        item,
        entityKey
    }
}

export function announceSavingObject(entityKey, listKey, item) {
    return {
        type: ANNOUNCE_SAVING_OBJECT,
        item: item,
        received_at: Date.now(),
        entityKey
    }
}

function announceObjectCreated(entityKey, listKey, values) {
    return {
        type: CREATE_OBJECT,
        entityKey: entityKey,
        listKey: listKey,
        values
    }
}

export function replaceObjectWithoutSaving(entityKey, listKey, item) {
    return {
        type: ANNOUNCE_OBJECT_REPLACED,
        item: item,
        received_at: Date.now(),
        entityKey,
        listKey
    }
}

export function deepMergeObjectWithoutSaving(entityKey, listKey, item) {
    return (dispatch, getState) => {
        const state = getState()
        const old_object = getObject(state, entityKey, item.id)
        const merged_item = merge(old_object, item)
        dispatch(replaceObjectWithoutSaving(entityKey, listKey, merged_item))
    }
}

export function createObject(entityKey, listKey, values) {
    return (dispatch) => {
        const newValues = Object.assign({}, values)
        if (!newValues.id) {
            newValues.id = uuidv4();
        }
        newValues.isNewInstance = true
        dispatch(announceObjectCreated(entityKey, listKey, newValues))
        return newValues
    }
}

export function invalidateAllObjects(entityKey) {
    return {
        type: INVALIDATE_ALL_OBJECTS,
        entityKey
    }
}

export function invalidateObjects(objectIds, entityKey) {
    return {
        type: INVALIDATE_OBJECTS,
        objectIds: objectIds,
        entityKey
    }
}

export function announceObjectsLoaded(entityKey, payload) {

    return {
        type: ANNOUNCE_OBJECTS_LOADED,
        itemsById: keyBy(payload, item => item.id),
        received_at: Date.now(),
        entityKey
    }
}

export function announceObjectsLoadFailed(error, entityKey) {
    return {
        type: ANNOUNCE_OBJECTS_LOAD_FAILED,
        error: error,
        received_at: Date.now(),
        entityKey

    }
}

export function getObject(state, entityKey, objectId) {
    const itemsById = get(state, `${ORM_OBJECT_KEY}.${entityKey}.itemsById`, {})
    return itemsById[objectId] || {}

}

export function getAllObjects(state, entityKey) {
    console.log("Get_URL:", `${ORM_OBJECT_KEY}.${entityKey}.itemsById`);
    console.log("Get_RESULT:", get(state, `${ORM_OBJECT_KEY}.${entityKey}.itemsById`) || {});
    return get(state, `${ORM_OBJECT_KEY}.${entityKey}.itemsById`) || {}
}

export function getLastObjectError(entityKey, state) {
    return get(state, `${ORM_OBJECT_KEY}.${entityKey}.lastError`) || null
}

export function getIsSavingObject(entityKey, state) {
    return size(get(state, `${ORM_OBJECT_KEY}.${entityKey}.savingItemIds`, [])) > 0
}

export function getObjectsFromState(state, entityKey, objectIds) {
    const itemsById = get(state, `${ORM_OBJECT_KEY}.${entityKey}.itemsById`) || {}

    if (!(itemsById && objectIds && objectIds.map)) {
        return [];
    }

    return objectIds.map(function(objectId, index) {
        return itemsById[objectId] || {
            'id': objectId,
            'loaded': false
        }
    })
}

export function getCandidateObject(state) {
    const objectObjs = state.object || {}
    return objectObjs.candidate_object
}

export function updateObject(entityKey, listKey, values) {
    return {
        type: UPDATE_OBJECT,
        id: values.id,
        values: values,
        entityKey: entityKey,
        listKey: listKey
    }
}

