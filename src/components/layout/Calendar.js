/** @jsx jsx */
import React, { Component, useEffect, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const useStyles = makeStyles((theme) => ({
    event: {
        cursor: "pointer"
    }
}))

export const Calendar = ({item_list, onSelectEvent}) => {

    const classes = useStyles()
    const date_field_name = "start_at"
    const dispatch = useDispatch()
    const [start, setStart] = useState(moment())
    const [end, setEnd] = useState(moment(). add(1,'days'))

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(item_list.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])

    const handleDateSelect = ({start, end}) => {
        setStart(moment(start))
        setEnd(moment(end))
    }

    const localOnSelectEvent = (eventInfo) => {
        const extended_props = eventInfo.event.extendedProps
        return onSelectEvent(extended_props)
    }

    useEffect(() => {
        dispatch(item_list.updateListFilter({datetime_from: start.toISOString(),
                                             datetime_to: end.toISOString()}))
        dispatch(item_list.fetchListIfNeeded())
        
    }, [start, end])

    const renderEventContent = (eventInfo) => {
        return (
            <div className={classes.event}>
              <b>{eventInfo.timeText}</b>
              <i>{eventInfo.event.title}</i>
            </div>
        )
    }

    const events = {events: item_list.getAsEvents({start, end})}

    return (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            height="auto"
            // eventDisplay="list-item'"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            datesSet={handleDateSelect}
            weekends={true}
            events={events} // alternatively, use the `events` setting to fetch from a feed
            eventContent={renderEventContent} // custom render function
            eventClick={localOnSelectEvent}
            // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
        */
          />
    )
}
