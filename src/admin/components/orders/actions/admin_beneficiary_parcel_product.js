import { ItemList } from 'orm'

class BeneficiaryParcelProductList extends ItemList {
    getEntityKey() {
        return "admin/beneficiary_parcel_product"
    }
}

export const adminBeneficiaryParcelProductList = new BeneficiaryParcelProductList("admin_beneficiary_parcel_product__default")
export const adminBeneficiaryParcelProductReportList = new BeneficiaryParcelProductList("admin_beneficiary_parcel_product_report__default")
