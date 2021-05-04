// @ts-nocheck
import React from 'react'
import TotalsWidget from './TotalsWidget'
import { unpackCityData } from './actions/admin_dashboard'

export default function TotalsWidgetMealsDelivered({data}) {

    if ( ! data ) {
        return null
    }

    const rows = unpackCityData(data.totals_by_city)
    const actions = [
      { label: 'View Beneficiaries', href: '/admin/beneficiaries'},
    ]

    return (
        <TotalsWidget title="Beneficiaries"
                      grand_total={data.total}
                      detail_rows={rows}
                      actions={actions}
        />
    )
}
