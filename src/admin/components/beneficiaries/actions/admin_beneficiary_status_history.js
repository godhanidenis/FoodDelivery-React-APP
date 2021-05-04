import { ItemList } from 'orm'
import { map } from 'lodash'
import { onEventUpdated } from 'admin/actions/admin_calendar'

class BeneficiaryStatusHistoryList extends ItemList {
    getEntityKey() {
        return "admin/beneficiary_status_history"
    }
    
}

export const adminBeneficiaryStatusHistoryList = new BeneficiaryStatusHistoryList("admin_beneficiary_status_history__default")
