import { ItemList } from '../orm'
import { get, size } from 'lodash'

class StatusList extends ItemList {
    getEntityKey() {
        return "status"
    }

    filterOnStatus(status_id) {
        return this.updateListFilter({status:status_id})
    }
    
}

export const statusList = new StatusList("status__default")
