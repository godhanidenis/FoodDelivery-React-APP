import { ItemList } from 'orm'
import { head, get, map, size } from 'lodash'

class ProductCategoryList extends ItemList {
    getEntityKey() {
        return "admin/product_category"
    }

    getObject(itemId) {
        const objects = this.getAllObjects()
        this.objects_by_id = {}
        this.recursivelyFlattenObjects(objects)
        return this.objects_by_id[itemId]
    }

    recursivelyFlattenObjects(objects) {
        if ( ! objects ) {
            return
        }
        map(objects, (object) => this.objects_by_id[get(object, "id")] = object)
        map(objects, (object) => this.recursivelyFlattenObjects(get(object, "children", [])))
    }

}

export const adminProductCategoryList = new ProductCategoryList("admin_product_category__default")
export const adminProductCategoryForProductTreeList = new ProductCategoryList("admin_product_category_for_product_tree__default")
