import { ItemList } from 'orm'
import { map } from 'lodash'
import { EnhancedFilter } from "../../../../admin/actions/enhanced_filter";
class AdminProductList extends ItemList {
    getEntityKey() {
        return "admin/product"
    }

    getAsOptions() {
        const items = this.getVisibleObjects()
        let res = map(items, function(item) { return {label: `${item.name} @ ${item.weight_kg}kg`,
                                                      value: item.id,
                                                      original_item: item}})
        return res
    }
    getEnhancedFilter() {
        if (!this.enhanced_filter) {
          this.enhanced_filter = new EnhancedFilter(this);
        }
        return this.enhanced_filter;
      }
}

export const adminProductList = new AdminProductList("admin_product__default")
export const adminProductAutoCompleteList = new AdminProductList("admin_product_auto_complete__default")

