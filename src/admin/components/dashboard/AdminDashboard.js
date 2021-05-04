// @ts-nocheck
import React, {useEffect} from 'react'
import clsx from 'clsx'
import { makeStyles} from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'
import BusyMask from 'components/BusyMask'
import Alert from '@material-ui/lab/Alert'
import MealsDeliveredChart from './MealsDeliveredChart'
import TotalsWidgetBeneficiaries from './TotalsWidgetBeneficiaries'
import TotalsWidgetDonors from './TotalsWidgetDonors'
import TotalsWidgetMealsDelivered from './TotalsWidgetMealsDelivered'
import TotalsWidgetWeightDelivered from './TotalsWidgetWeightDelivered'
import OrdersSummaryTable from './OrdersSummaryTable'
import AdminMainLayout from '../layout/AdminMainLayout'
import { useDispatch } from 'react-redux'
import { adminDashboardList } from './actions/admin_dashboard'
import OrderStatusWidgets from '../../../admin/components/orders/widgets/OrderStatusWidgets'
import DashboardPopupFilter from '../../../admin/components/dashboard/DashboardPopupFilter'

export default function Dashboard(props) {
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminDashboardList.loadData())
        }
        fetchStaticObjects()
    }, [])

    const data = adminDashboardList.getData()
    const is_loading = adminDashboardList.isLoading()

    return (
        <AdminMainLayout active_key="donors"
                         breadcrumbs={[{name: 'admin_home'},
                                       {name: 'dashboard', label: "Dashboard", url: '/admin'}]}
        >
          <DashboardPopupFilter />
          <OrderStatusWidgets />

          <Grid container spacing={3}>

            <>
              { is_loading && <BusyMask /> }

              <Grid item xs={12} md={4} lg={3}>
                <TotalsWidgetWeightDelivered data={data.weight_delivered} />
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <TotalsWidgetMealsDelivered data={data.meals_delivered} />
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <TotalsWidgetDonors data={data.donor_counts} />
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <TotalsWidgetBeneficiaries data={data.beneficiary_counts} />
              </Grid>

              <Grid item xs={12}>
                <OrdersSummaryTable />
              </Grid>

              <Grid item xs={12} lg={6}>
                <MealsDeliveredChart data={data.beneficiary_meals_per_month} />
              </Grid>
            </>

          </Grid>
        </AdminMainLayout>
    )
}
