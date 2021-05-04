import React from 'react'
import TotalsWidget from './TotalsWidget'
import { unpackCityData } from './actions/admin_dashboard'

export default function TotalsWidgetMealsDelivered({data}) {

    if ( ! data ) {
        return null
    }

    const rows = unpackCityData(data.totals_by_city)
    const actions = [
      { label: 'View Orders', href: '/admin/parcels'},
      { label: 'View Reports', href: '/admin/reports/beneficiary_parcels' }
    ]

    return (
        <TotalsWidget title="Meals Delivered"
                      grand_total={data.total}
                      detail_rows={rows}
                      actions={actions}
        />
    )
}
