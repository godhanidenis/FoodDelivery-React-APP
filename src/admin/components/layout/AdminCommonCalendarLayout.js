import React, {useEffect, useState, useRef} from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const AdminCommonCalendarLayout = ({rows}) => {

    //const {id} = match.params

    const [selectedDay, setSelectedDay] = useState()

    useEffect(() => {
        setSelectedDay(new Date())
    }, [])

    const calendarRef = useRef(null)

    const handleDayClick = day => {
        setSelectedDay(day);
        let calendarApi = calendarRef.current.getApi()
        calendarApi.gotoDate(day)
    }

    const handleTodayClick = day => {
        setSelectedDay(day)
        let calendarApi = calendarRef.current.getApi()
        calendarApi.gotoDate(day)
    }

    return(
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin,interactionPlugin]}
          initialView="dayGridWeek"
          headerToolbar={{
              right:'title',
              center:'',
              right:'timeGridDay,timeGridWeek,dayGridMonth,prev,next'
          }}
          ref={calendarRef}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          height="auto"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={() => console.log('select')}
          dateClick={() => console.log('dateclick')}
      />
    )
}

export default AdminCommonCalendarLayout
