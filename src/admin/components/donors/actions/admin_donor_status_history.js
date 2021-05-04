import { ItemList } from 'orm'
import { map } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'

class DonorStatusHistoryList extends ItemList {
    getEntityKey() {
        return "admin/donor_status_history"
    }
    
}

export const adminDonorStatusHistoryList = new DonorStatusHistoryList("admin_donor_status_history__default")
