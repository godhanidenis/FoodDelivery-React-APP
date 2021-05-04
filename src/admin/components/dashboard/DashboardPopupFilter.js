
import React from 'react'
import { adminDashboardList } from '../../../admin/components/dashboard/actions/admin_dashboard'
import PopupFilter from '../../../admin/components/filters/PopupFilter'
import FilterChips from '../../../admin/components/filters/FilterChips'
import { makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    filters: {
        position: 'absolute',
        top: 65,
        right: 20,
        display: "flex",
        marginBottom: "10px"
    },
}))

const FILTERS = [{name: 'cities'}, {name: 'date_range'}]

export default function DashboardPopupFilter({enabled_filters}) {
    const classes = useStyles();

    return (
        <div className={classes.filters} >
          <FilterChips enhanced_filter={adminDashboardList.getEnhancedFilter()} />
          <PopupFilter enhanced_filter={adminDashboardList.getEnhancedFilter()}
                       enabled_filters={FILTERS}
          />
        </div>
    )
    
}
