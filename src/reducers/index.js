import auth from './auth'
import ui from './ui'
import orm_list_reducer from '../orm/orm_list_reducer'
import orm_objects_reducer from '../orm/orm_objects_reducer'
import settings from './settings'
import { ORM_LIST_KEY, ORM_OBJECT_KEY } from '../orm'
import { combineReducers } from 'redux'
import {CLEAR_AUTH_TOKEN,} from 'actions/auth'


const appReducer = combineReducers({
    [ORM_OBJECT_KEY]: orm_objects_reducer,
    [ORM_LIST_KEY]: orm_list_reducer,
    auth,
    settings,
    ui
})

const rootReducer = (state, action) => {
    if ( action.type === CLEAR_AUTH_TOKEN ) {
        return undefined
    }
    
    return appReducer(state, action)
}
export default rootReducer;
