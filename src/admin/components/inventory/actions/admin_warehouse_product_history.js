import { ItemList } from 'orm'

class AdminWarehouseProductHistoryList extends ItemList {
    getEntityKey() {
        return "admin/warehouse_product_history"
    }
}

export const adminWarehouseProductHistoryList = new AdminWarehouseProductHistoryList("admin_warehouse_product_history__default")
