import { ItemList } from 'orm'
import { map } from 'lodash'

class DriverList extends ItemList {
    getEntityKey() {
        return "admin/driver"
    }

    getAsOptions() {
        const items = this.getVisibleObjects()
        return map(items, function(item) { return {label: item.display_name,
                                                   value: item.id}})
    }
}

export const adminDriverList = new DriverList("admin_driver__default")
export const adminDriverAutoCompleteList = new DriverList("admin_driver_auto_complete__default")
