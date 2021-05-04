import { UPDATE_SETTINGS } from 'actions/settings'

const initialState = {
    API_BASE: '',
}


export default function settings(state = initialState, action) {
    switch (action.type) {
        case UPDATE_SETTINGS:
            return Object.assign({}, state,
                                 action.new_settings,
                                 {configured: true})
        default:
            return state
    }
    
}
