import { ItemList } from 'orm'
import { map } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'

class ParcelDriverHistoryList extends ItemList {
    getEntityKey() {
        return "admin/parcel_driver_history"
    }
}

export const adminParcelDriverHistoryList = new ParcelDriverHistoryList("admin_parcel_driver_history__default")
