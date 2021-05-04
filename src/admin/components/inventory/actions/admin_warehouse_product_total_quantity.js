import { ItemList } from 'orm'

class AdminWarehouseProductList extends ItemList {
    getEntityKey() {
        return "admin/warehouse_product_total"
    }
}

export const adminWarehouseProductTotalQuantityList = new AdminWarehouseProductList("admin_warehouse_product_total_quantity__default")