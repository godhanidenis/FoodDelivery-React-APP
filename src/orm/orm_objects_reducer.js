import { keys, union, difference, clone, get, omit } from 'lodash'
import { setErrorMessage } from 'actions/Error'
import { cleanId } from '../lib'

import {
    ANNOUNCE_OBJECTS_LOAD_FAILED,
    ANNOUNCE_OBJECTS_LOADED,
    ANNOUNCE_LOADING_OBJECTS,
    ANNOUNCE_OBJECT_SAVED,
    ANNOUNCE_OBJECT_SAVE_FAILED,
    ANNOUNCE_SAVING_OBJECT,
    INVALIDATE_OBJECTS,
    INVALIDATE_ALL_OBJECTS,
    CREATE_OBJECT,
    ANNOUNCE_NEW_OBJECT_SAVED,
    ANNOUNCE_OBJECT_REPLACED,

    ANNOUNCE_DELETING_OBJECT,
    ANNOUNCE_OBJECT_DELETED,
    ANNOUNCE_OBJECT_DELETE_FAILED,
    UPDATE_OBJECT,
    REMOVE_OBJECTS

} from './orm_objects_actions'

import { ANNOUNCE_MATCHING_ITEMS_LOADING } from './orm_list_actions'

const initialState = {
    itemsById: {},
    loadingItemIds: [],
    savingItemIds: [],
    invalidatedItemIds: [],
    lastError: null,
    lastErrorItemId: null
}

function objectReducer(state = initialState, action) {

    let stateCopy = Object.assign({}, state)
    const itemsById = clone(state.itemsById)

    switch (action.type) {
        case ANNOUNCE_DELETING_OBJECT:
            itemsById[action.itemId] = Object.assign({}, itemsById[action.itemId], {isDeleting: true})
            return Object.assign({}, state, {
                itemsById: itemsById,
                lastError: null,
                lastErrorItemId: null,
            })
        case ANNOUNCE_OBJECT_DELETED:
            delete itemsById[action.itemId]
            itemsById[action.itemId] = action.item
            return Object.assign({}, state, {
                itemsById: itemsById,
                lastError: null,
                lastErrorItemId: null,
            })
        case ANNOUNCE_OBJECT_DELETE_FAILED:
            itemsById[action.itemId] = Object.assign({}, itemsById[action.itemId], {isDeleting: false})
            return Object.assign({}, state, {
                itemsById: itemsById,
                lastError: "Delete failed",
                lastErrorItemId: action.itemId,
            })
        case ANNOUNCE_NEW_OBJECT_SAVED:
            delete itemsById[action.oldId]
            itemsById[action.item.id] = action.item
            return Object.assign({}, state, {
                itemsById: itemsById,
                savingItemIds: difference(state.savingItemIds || [], [cleanId(action.oldId)]).map(cleanId),
                loadingItemIds: difference(state.loadingItemIds || [], [cleanId(action.oldId)]).map(cleanId),
                invalidatedItemIds: difference(state.invalidatedItemIds || [], [cleanId(action.item.id)]).map(cleanId),
                lastError: null,
                lastErrorItemId: null,
            })
        case ANNOUNCE_OBJECT_REPLACED:
            itemsById[action.item.id] = action.item
            return Object.assign({}, state, {
                itemsById: itemsById,
            })

        case INVALIDATE_ALL_OBJECTS:
            {
                const toInvalidate = keys(itemsById).filter(itemId => !get(itemsById, itemId, {}).isNewIstance)
                return Object.assign({}, state, {invalidatedItemIds: toInvalidate,
                                                 lastError: null,
                                                 lastErrorItemId: null})
            }
        case INVALIDATE_OBJECTS:
            {
                const toInvalidate = action.objectIds.filter(itemId => !get(itemsById, itemId, {}).isNewIstance)
                return Object.assign({}, state, {invalidatedItemIds: union(state.invalidatedItemIds || [], toInvalidate).map(cleanId),
                                                 lastError: null,
                                                 lastErrorItemId: null})
            }
        case CREATE_OBJECT:
            const values = action.values
            return Object.assign({}, state, {itemsById: Object.assign({}, state.itemsById, {[values.id]: action.values})})
        case ANNOUNCE_LOADING_OBJECTS:
            return Object.assign({}, state, {
                loadingItemIds: union(state.loadingItemIds, action.objectIdsToLoad).map(cleanId)
            })
        case ANNOUNCE_MATCHING_ITEMS_LOADING:
            return Object.assign({}, state, {
                loadingItemIds: union(state.loadingItemIds, action.loadingItemIds).map(cleanId),
                lastError: null,
                lastErrorItemId: null,
            })
        case ANNOUNCE_OBJECTS_LOADED:
            stateCopy = Object.assign({}, state, {
                loadingItemIds: difference(state.loadingItemIds || [], keys(action.itemsById).map(cleanId)),
                invalidatedItemIds: difference(state.invalidatedItemIds || [], keys(action.itemsById).map(cleanId)),
                itemsById: Object.assign({}, state.itemsById, action.itemsById),
                lastError: null,
                lastErrorItemId: null,
            })
            return stateCopy
        case ANNOUNCE_OBJECTS_LOAD_FAILED:
            setErrorMessage("Failed to load objects: " + action.errorMessage)
            return stateCopy = Object.assign({}, state, {lastError: null, lastErrorItemId: null,})
        case ANNOUNCE_SAVING_OBJECT:
            return Object.assign({}, state, {
                savingItemIds: union(state.savingItemIds, [cleanId(action.item.id)]).map(cleanId),
                lastError: null,
                lastErrorItemId: null,
            })
        case ANNOUNCE_OBJECT_SAVED:
            return Object.assign({}, state, {
                savingItemIds: difference(state.savingItemIds || [], [cleanId(action.item.id)]).map(cleanId),
                itemsById: Object.assign({}, state.itemsById, {[cleanId(action.item.id)]: clone(action.item)}),
                lastError: null,
                lastErrorItemId: null,
            })

        case REMOVE_OBJECTS:
            const newItemsById = omit(state.itemsById, action.objectIds)
            return Object.assign({}, state, { itemsById: newItemsById})
        case UPDATE_OBJECT:
            {
                const newItemsById = Object.assign({}, state.itemsById, {[action.id]: clone(action.values)})
                return Object.assign({}, stateCopy,
                                     {
                                         itemsById: newItemsById,
                                         lastError: null,
                                         lastErrorItemId: null,
                                     })
            }
        case ANNOUNCE_OBJECT_SAVE_FAILED:
            setErrorMessage("Failed to save object: " + action.errorMessage)
            return Object.assign({}, state, {
                savingItemIds: difference(state.savingItemIds || [], [cleanId(action.item.id)]).map(cleanId),
                lastError: action.errorMessage || "Internal error",
                lastErrorItemId: action.item.id,
            })
        default:
            return state
    }
}

const initialORMState = {
}

export default function ormObjects(state=initialORMState, action) {
    if (!action.entityKey) {
        return state
    }
    const itemState = Object.assign({}, initialState, state[action.entityKey])

    return Object.assign({}, state, {[action.entityKey]: objectReducer(itemState, action)})
}
