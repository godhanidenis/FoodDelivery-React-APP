import { ItemList } from 'orm'

class WarehouseList extends ItemList {
    getEntityKey() {
        return "admin/warehouse"
    }
}

export const adminWarehouseList = new WarehouseList("admin_warehouse__default")
export const adminWarehouseAutoCompleteList = new WarehouseList("admin_warehouse_auto_complete__default")
