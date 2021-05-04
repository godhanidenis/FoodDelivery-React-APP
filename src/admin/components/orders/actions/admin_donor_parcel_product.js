import { ItemList } from 'orm'

class DonorParcelProductList extends ItemList {
    getEntityKey() {
        return "admin/donor_parcel_product"
    }
}

export const adminDonorParcelProductList = new DonorParcelProductList("admin_donor_parcel_product__default")
