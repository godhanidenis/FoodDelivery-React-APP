// @ts-nocheck
import React from 'react'
import { map } from 'lodash'
import { Grid, makeStyles, Avatar } from '@material-ui/core'
import KpiWidget from '../../../../components/layout/KpiWidget'
import { PARCEL_STATUS_COLOURS } from '../../../../muiTheme'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  blackChip: {
    color: '#ffffff',
    backgroundColor: '#000000',
    marginLeft: 10,
  },
}))

export default function OrderStatusWidgets() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>

        {map( [ { field_name:'today', title: 'Scheduled Today' },
                { field_name:'ready_to_go', title: 'Ready to Go' },
                { field_name:'picking', title: 'Picking' },
                { field_name:'in_transit', title: 'In Transit' },
                { field_name:'complete', title: 'Completed Today' },
                { field_name:'cancelled', title: 'Cancelled Today' },

              ], ({field_name, title}) => 
                <Grid item xs={12} md={4} lg={2}>
                  <KpiWidget title={title} color={PARCEL_STATUS_COLOURS[field_name]} kpi={"--"} link={`?scheduled_date=${field_name}`} variant={"outlined"} />
                </Grid>
            )}

       </Grid>
    </div>
  )
}
