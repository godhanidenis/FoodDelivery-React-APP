import React from 'react'
import TotalsWidget from './TotalsWidget'
import { unpackCityData } from './actions/admin_dashboard'

export default function TotalsWidgetWeightDelivered({data}) {

    if ( ! data ) {
        return null
    }

    const actions = [
      { label: 'View Orders', href: '/admin/parcels'},
      { label: 'View Reports', href: '/admin/reports/beneficiary_parcels' }
    ]

    const rows = unpackCityData(data.totals_by_city)

    return (
        <TotalsWidget title="Food Delivered"
                      grand_total={data.total}
                      units="kg"
                      detail_rows={rows}
                      actions={actions}
        />
    )
}
