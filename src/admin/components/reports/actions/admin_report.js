import { ItemList } from 'orm'
import { map, head, filter } from 'lodash'
import { download } from 'actions/lib'
import moment from 'moment'

class AdminReport extends ItemList {
    getEntityKey() {
        return "admin/report/beneficiary_parcel"
    }

    generateMonthlyBeneficiaryParcelReport(filter_values) {
        if ( filter_values.arrive_at_any_date_in_month ) {
            filter_values.arrive_at_any_date_in_month = moment(filter_values.arrive_at_any_date_in_month).toISOString()
        }
        return this.generateDateRangeBeneficiaryParcelReport(filter_values)
    }

    generateWeeklyBeneficiaryParcelReport(filter_values) {
        if ( filter_values.arrive_at_any_date_in_week ) {
            filter_values.arrive_at_any_date_in_week = moment(filter_values.arrive_at_any_date_in_week).toISOString()
        }
        return this.generateDateRangeBeneficiaryParcelReport(filter_values)
    }

    generateDateRangeBeneficiaryParcelReport(filter_values) {
        if ( filter_values.arrive_at_from ) {
            filter_values.arrive_at_from = moment(filter_values.arrive_at_from).toISOString()
        }
        if ( filter_values.arrive_at_to ) {
            filter_values.arrive_at_to = moment(filter_values.arrive_at_to).toISOString()
        }

        return download("admin/report/beneficiary_parcel/download/", filter_values)
    }

}

export const adminReport = new AdminReport("admin_report__default")
