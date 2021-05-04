import { ItemList } from 'orm'
import { map, filter, values } from 'lodash'
import moment from 'moment'

class CalendarList extends ItemList {
    getEntityKey() {
        return "admin/calendar"
    }

    getAsEvents({start, end}) {
        return filter(values(this.getAllObjects()), (event) => moment(event.start) >= start && moment(event.start) <= end)
    }
}

export const adminCalendarList = new CalendarList("admin_calendar__default")

export const onEventUpdated = () => {
    return (dispatch, getState) => {
        dispatch(adminCalendarList.invalidateList())
        dispatch(adminCalendarList.invalidateAllObjects())
    }
}
