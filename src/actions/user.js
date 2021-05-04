import { ItemList } from '../orm'
import { get, size } from 'lodash'
import { loggedInUser, refreshLoggedInUserCookieFromUser, sendForgotPasswordEmail } from './auth'

class UserList extends ItemList {
    getEntityKey() {
        return "user"
    }

    ensureUserLoaded() {
        return (dispatch, getState) => {
            const user_id = get(loggedInUser(), "id")
            if ( ! user_id ) {
                return
            }
            dispatch(this.ensureObjectLoaded(user_id)).then( (res) => {
                if ( res && size(res) == 1 ) {
                    const user = res[0]
                    refreshLoggedInUserCookieFromUser(user)
                }
            })
        }
    }

    forgotPassword({email}) {
        return sendForgotPasswordEmail(email)
    }

    getUser() {
        const user_id = get(loggedInUser(), "id")
        return this.getObject(user_id)
    }

    invalidateUser() {
        const user_id = get(loggedInUser(), "id")
        return this.invalidateObject(user_id)
    }
    
}

export const userList = new UserList("user__default")
