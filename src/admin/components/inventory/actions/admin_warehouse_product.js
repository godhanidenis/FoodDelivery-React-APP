import { ItemList } from 'orm'
import { EnhancedFilter } from "../../../../admin/actions/enhanced_filter";
class AdminWarehouseProductList extends ItemList {
    getEntityKey() {
        return "admin/warehouse_product"
    }

    getEnhancedFilter() {
        if (!this.enhanced_filter) {
          this.enhanced_filter = new EnhancedFilter(this);
        }
        return this.enhanced_filter;
      }
}

export const adminWarehouseProductList = new AdminWarehouseProductList("admin_warehouse_product__default")
export const adminWarehouseProductAutoCompleteList = new AdminWarehouseProductList("admin_warehouse_product_auto_complete__default")
