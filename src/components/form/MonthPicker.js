import React, {useEffect, useState} from 'react'
import "date-fns"
import Grid from "@material-ui/core/Grid"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers"

export const MonthPicker = ({ label, name, formik_props, format, ...props }) => {

  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <DatePicker
          variant="inline"
          openTo="year"
          views={["year", "month"]}
          label="Year and Month"
          helperText="Start from year selection"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  )

}
