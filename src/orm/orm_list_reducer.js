import { omit, union, difference, clone, keys, get, pull } from 'lodash'
import { setErrorMessage } from '../actions/Error'

import {
    INIT_LIST,
    ANNOUNCE_LIST_LOADED,
    ANNOUNCE_LIST_LOADING,
    ANNOUNCE_LIST_LOAD_FAILED,
    ANNOUNCE_MATCHING_ITEMS_LOADED,
    ANNOUNCE_MATCHING_ITEMS_LOAD_FAILED,
    ANNOUNCE_MATCHING_ITEMS_LOADING,
    SET_ITEMS_FLAG,
    INVALIDATE_LIST,
    UPDATE_LIST_PAGINATION,
    UPDATE_LIST_ORDERING,
    UPDATE_LIST_FILTER,
    CLEAR_LIST_FILTER,
    UPDATE_LIST_SELECTION,
    UPDATE_LIST_DISPLAY_MODE,
    CLEAR_LIST,
    ANNOUNCE_HANDLING_POST,
    ANNOUNCE_POST_COMPLETED
} from './orm_list_actions'

import { CREATE_OBJECT, ANNOUNCE_NEW_OBJECT_SAVED, ANNOUNCE_OBJECT_DELETED } from './orm_objects_actions'

const itemListTemplate = {
    entityKey: "",
    isLoading: false,
    itemsInvalidated: true,
    has_list_loaded: true,
    visibleItemIds: null,
    loadingMatchingItems: false,
    receivedAt: null,
    filter: null,
    pagination: null,
    ordering: null,
    handlingPost: false,
    lastError: null,
    firstLoadTriggered: false  // a bootup flag, so that we know everything is basically ready to go, but can't be relied on for a loading indicator.
}

function itemList(state=itemListTemplate, action) {

    let state_copy = clone(state)
    let l = Object.assign({}, itemListTemplate, state_copy || {})
    const visibleItemIds = clone(state_copy.visibleItemIds)
    
    switch (action.type) {
        case INIT_LIST:
            state_copy = Object.assign({}, l)
            return state_copy
            
        case INVALIDATE_LIST:
            state_copy = Object.assign({}, l, {
                isLoading: false,
                itemsInvalidated: true
            })
            return state_copy
        case ANNOUNCE_LIST_LOADING:
            state_copy = Object.assign({}, l, {
                isLoading: true,
                itemsInvalidated: false,
                has_list_loaded: false,
                lastError: null,
                firstLoadTriggered: true
            })
            return state_copy
        case CREATE_OBJECT:
            visibleItemIds.push(action.values.id)
            return Object.assign({}, state_copy, {visibleItemIds: visibleItemIds})
        case ANNOUNCE_LIST_LOADED:
            state_copy = Object.assign({}, l, {
                isLoading: false,
                has_list_loaded: true,
                receivedAt: action.receivedAt,
                visibleItemIds: action.visibleItemIds,
                pagination: action.pagination,
                lastError: null
            })
            return state_copy
        case ANNOUNCE_LIST_LOAD_FAILED:
            setErrorMessage("Failed to load: " + action.error_message)
            state_copy = Object.assign({}, l, {
                isLoading: false,
                has_list_loaded: false,
                lastError: action.error_message || "Internal failure",
            })
            return state_copy;
        case ANNOUNCE_MATCHING_ITEMS_LOADING:
            state_copy = Object.assign({}, l, {
                loadingMatchingItems: true,
                lastError: null,
                firstLoadTriggered: true
            })
            return state_copy
        case ANNOUNCE_MATCHING_ITEMS_LOADED:
            state_copy = Object.assign({}, l, {
                isLoading: false,
                loadingMatchingItems: false,
                receivedAt: action.receivedAt,
                lastError: null,
            })
            return state_copy
        case ANNOUNCE_MATCHING_ITEMS_LOAD_FAILED:
            setErrorMessage("Failed to load matching items: " + action.error_message)
            state_copy = Object.assign({}, l, {
                isLoading: false,
                loadingMatchingItems: false,
                lastError: action.error_message || "Load failure",
            })
            return state_copy;
        case UPDATE_LIST_PAGINATION:
            state_copy = Object.assign({}, l, {
                pagination: Object.assign({}, l.pagination, action.pagination)
            })
            return state_copy
        case UPDATE_LIST_ORDERING:
            state_copy = Object.assign({}, l, {
                ordering: Object.assign({}, l.pagination, {ordering:action.ordering.ordering})
                })
            return state_copy
        case ANNOUNCE_OBJECT_DELETED:
            pull(visibleItemIds, action.itemId)
            return Object.assign(l, {visibleItemIds: visibleItemIds})
        case UPDATE_LIST_FILTER:
            let newFilter = Object.assign({}, l.filter, action.filter)
            if (!action.filter) {
                newFilter = {}
            }
            keys(newFilter).forEach(k => {
                if (newFilter[k] === undefined) {
                    delete newFilter[k]
                }
            })
            state_copy = Object.assign({}, l, {
                filter: newFilter
            })
            return state_copy
        case CLEAR_LIST_FILTER:
            state_copy = Object.assign({}, l, {
                filter: null
            })
            return state_copy
        case UPDATE_LIST_SELECTION:
            state_copy = Object.assign({}, l, {
                selected_ids: action.selected_ids})
            return state_copy
        case UPDATE_LIST_DISPLAY_MODE:
            state_copy = Object.assign({}, l, {
                display_mode: action.display_mode})
            return state_copy
        case ANNOUNCE_NEW_OBJECT_SAVED:
            const oldIdIndex = visibleItemIds.indexOf(action.oldId)
            if (oldIdIndex > -1) {
                visibleItemIds[oldIdIndex] = clone(action.item.id)
            }
            return Object.assign(l, {visibleItemIds: visibleItemIds, lastError: null})
        case SET_ITEMS_FLAG:
            const flag_name = "flag_" + action.flag_name
            const flag_value = action.flag_value
            
            var flag_ids = l[flag_name] || []
            if ( flag_value === false ) {
                flag_ids = difference(flag_ids, action.selected_ids)
            } else {
                flag_ids = union(flag_ids, action.selected_ids)
            }
            state_copy = Object.assign({}, l)
            state_copy[flag_name] = flag_ids
            return state_copy
        case ANNOUNCE_HANDLING_POST:
            state_copy = Object.assign({}, l, {
                handlingPost: true
            })
            return state_copy
        case ANNOUNCE_POST_COMPLETED:
            state_copy = Object.assign({}, l, {
                handlingPost: false
            })
            return state_copy
        default:
            return state
    }
}

const initialORMState = {}

export default function orm(state=initialORMState, action) {
    if (!action.listKey) {
        return state
    }
    const itemState = Object.assign(
        {},
        itemListTemplate,
        {visibleItemIds: []},
        state[action.listKey],
        {entityKey: get(state, `${action.listKey}.entityKey`) || action.entityKey}
    )

    if (action.type === CLEAR_LIST) {
        return omit(state, [action.listKey])
    }
    
    return Object.assign({}, state, {[action.listKey]: itemList(itemState, action)})
}
