import { ItemList } from 'orm'
import { get, map, head, filter } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'
import { EnhancedFilter } from "../../../../admin/actions/enhanced_filter";
class DonorList extends ItemList {
    getEntityKey() {
        return "admin/donor"
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
        // Assumes the matching donor is already loaded
        return head(filter(this.getAllObjects(), (x) => x.company.id === company_id))
    }
    getEnhancedFilter() {
        if (!this.enhanced_filter) {
          this.enhanced_filter = new EnhancedFilter(this);
        }
        return this.enhanced_filter;
      }

}

class DonorAddressManager extends ItemList {
    getEntityKey() {
        return "admin/donor/add_address"
    }

    addAddress({donor_id, values}) {
        values.donor_id = donor_id
        return super.saveNewObject(values)
    }

    getDefaultAddress(donor) {
        const default_address = head(filter(get(donor, ["company", "addresses"], []), (address) => address.address_type == 'delivery'))
        return default_address
    }
}



export const adminDonorList = new DonorList("admin_donor__default")
export const adminDonorAutoCompleteList = new DonorList("admin_donor_auto_complete__default")
export const adminDonorAddressManager = new DonorAddressManager("admin_donor_add_address__default")
