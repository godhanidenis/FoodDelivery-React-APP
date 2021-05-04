import { ItemList } from 'orm'
import { map, head, filter } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'

const BRINGG_CONFIGURATION_ID = "global"

class AdminBringHistory extends ItemList {
    getEntityKey() {
        return "bringg/history"
    }
    
}

export const adminBringgHistory = new AdminBringHistory("admin_bringg_history__default")
