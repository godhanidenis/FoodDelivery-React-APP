import {
    SET_ACTIVE_MODAL,
} from 'actions/ui'

const initialState = {
    active_modal: '',
    modal_params: {},
}

export default function ui(state = initialState, action) {
    switch (action.type) {
        case SET_ACTIVE_MODAL:
            return Object.assign({}, state, {active_modal: action.active_modal, modal_params: action.modal_params })
        default:
            return state
    }
}
