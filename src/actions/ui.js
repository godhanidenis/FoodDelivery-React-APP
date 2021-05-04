import { get } from 'lodash'

export const SET_ACTIVE_MODAL = "SET_ACTIVE_MODAL"
export const CONFIRMATION_MODAL_KEY = "CONFIRMATION_MODAL"

export function confirmModal({text, onConfirmed, can_cancel}) {
    return {
        type: SET_ACTIVE_MODAL,
        active_modal: CONFIRMATION_MODAL_KEY,
        modal_params: {text: text, onConfirmed: onConfirmed, can_cancel: can_cancel}
    }
}

export function getActiveModal(state) {
    return get(state, ['ui', 'active_modal'], null)
}

export function getModalParams(state) {
    return get(state, ['ui', 'modal_params'], {})
}

export function setActiveModal(modal_key, params) {
    return {
        type: SET_ACTIVE_MODAL,
        active_modal: modal_key,
        modal_params: params
    }
}

export function clearActiveModal() {
    return setActiveModal("")
}

