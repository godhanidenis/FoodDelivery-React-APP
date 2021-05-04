import { ItemList } from 'orm'
import { map, head, filter } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'

const BRINGG_CONFIGURATION_ID = "global"

class AdminBringConfiguration extends ItemList {
    getEntityKey() {
        return "bringg/configuration"
    }

    ensureConfigLoaded() {
        return this.ensureObjectLoaded(BRINGG_CONFIGURATION_ID)
    }

    getConfiguration() {
        return this.getObject(BRINGG_CONFIGURATION_ID)
    }
    
}

export const adminBringgConfiguration = new AdminBringConfiguration("admin_bringg_configuration__default")
