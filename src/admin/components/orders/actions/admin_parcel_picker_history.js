import { ItemList } from 'orm'
import { map } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'

class ParcelPickerHistoryList extends ItemList {
    getEntityKey() {
        return "admin/parcel_picker_history"
    }
}

export const adminParcelPickerHistoryList = new ParcelPickerHistoryList("admin_parcel_picker_history__default")
