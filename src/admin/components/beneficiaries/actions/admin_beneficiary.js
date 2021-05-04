import { ItemList } from 'orm'
import { map, head, filter } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'
import { EnhancedFilter } from "../../../../admin/actions/enhanced_filter";

class BeneficiaryList extends ItemList {
    getEntityKey() {
        return "admin/beneficiary"
    }

    getAsOptions() {
        const items = this.getVisibleObjects()
        return map(items, function(item) { return {label: item.company.name,
                                                   value: item.company.id}})
    }

    saveObject(props) {
        return super.saveObject(props)
        // return (dispatch, getState) => {
        //     dispatch(super.saveObject(props))
        //     dispatch(onEventUpdated())
        // }
    }

    saveNewObject(props) {
        return super.saveNewObject(props)
        // return (dispatch, getState) => {
        //     dispatch(super.saveNewObject(props))
        //     dispatch(onEventUpdated())
        // }
    }

    getForCompany({company_id}) {
        // Assumes the matching beneficiary is already loaded
        return head(filter(this.getAllObjects(), (x) => x.company.id === company_id))
    }

    getEnhancedFilter() {
        if (!this.enhanced_filter) {
          this.enhanced_filter = new EnhancedFilter(this);
        }
        return this.enhanced_filter;
      }

}

class BeneficiaryAddressManager extends ItemList {
    getEntityKey() {
        return "admin/beneficiary/add_address"
    }

    addAddress({beneficiary_id, values}) {
        values.beneficiary_id = beneficiary_id
        return super.saveNewObject(values)
    }
   
}


export const adminBeneficiaryList = new BeneficiaryList("admin_beneficiary__default")
export const adminBeneficiaryAutoCompleteList = new BeneficiaryList("admin_beneficiary_auto_complete__default")
export const adminBeneficiaryAddressManager = new BeneficiaryAddressManager("admin_beneficiary_add_address__default")
