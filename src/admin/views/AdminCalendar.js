import React from 'react'
import clsx from 'clsx'
import { get } from 'lodash'
import { makeStyles} from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Alert from '@material-ui/lab/Alert'
import AdminMainLayout from 'admin/components/layout/AdminMainLayout'
import { Calendar } from 'components/layout/Calendar'
import { adminCalendarList } from 'admin/actions/admin_calendar'
import { useHistory } from "react-router-dom"

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
}))

export default function AdminCalendar(props) {
    const classes = useStyles()
    const { window } = props
    const history = useHistory()

    const onSelectEvent = (event) => {
        if ( event.type === 'parcel' ) {
            if ( event.direction === 'donor_pickup' ) {
                history.push(`/admin/donor_pickup/${event.id_for_type}`)
            } else if ( event.direction === 'beneficiary_dropoff' ) {
                history.push(`/admin/beneficiary_dropoff/${event.id_for_type}`)
            } else {
                console.error("Unknown direction", event.direction, event)
            }
        } else {
            console.error("Unknown event type", event.type, event)
        }
    }

    return (
        <AdminMainLayout active_key='calendar'
                         breadcrumbs={[{name: 'admin_home'},
                                       {name: 'calendar',
                                        label: 'Calendar',
                                        url: '/admin/calendar'},
                                      ]}>
            <Calendar item_list={adminCalendarList} onSelectEvent={onSelectEvent}/>
        </AdminMainLayout>
    )
}
