import { ItemList } from 'orm'
import { map } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'

class ParcelStatusHistoryList extends ItemList {
    getEntityKey() {
        return "admin/parcel_status_history"
    }
}

export const adminParcelStatusHistoryList = new ParcelStatusHistoryList("admin_parcel_status_history__default")
