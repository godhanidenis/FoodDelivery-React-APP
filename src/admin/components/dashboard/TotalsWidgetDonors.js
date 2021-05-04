import React from 'react'
import TotalsWidget from './TotalsWidget'
import { unpackCityData } from './actions/admin_dashboard'

export default function TotalsWidgetMealsDelivered({data}) {

    if ( ! data ) {
        return null
    }

    const rows = unpackCityData(data.totals_by_city)
    const actions = [
      { label: 'View Donors', href: '/admin/donors'},
    ]

    return (
        <TotalsWidget title="Donors"
                      grand_total={data.total}
                      detail_rows={rows}
                      actions={actions}
        />
    )
}
