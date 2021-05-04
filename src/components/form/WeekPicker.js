import React, {useEffect, useState} from 'react'
import clsx from "clsx"
import { makeStyles } from '@material-ui/styles'
import { MuiPickersUtilsProvider, DatePicker, DatePickerToolbar } from "@material-ui/pickers"
import { IconButton, withStyles } from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import moment from "moment"

const useStyles = makeStyles((theme) => ({
  dayWrapper: {
    position: "relative"
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: "0 2px",
    color: "inherit"
  },
  customDayHighlight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "2px",
    right: "2px",
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: "50%"
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled
  },
  highlightNonCurrentMonthDay: {
    color: "#676767"
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  endHighlight: {
    extend: "highlight",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%"
  },
  firstHighlight: {
    extend: "highlight",
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%"
  },
  weekNumber: {
    position: "absolute",
    fontSize: "0.7em",
    color: "#000",
    opacity: 0.3,
    top: 7,
    left: -12,
    padding: 4,
    width: 15,
    height: 15,
    textAlign: "center"
  },
  weekNumberHighlight: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    opacity: 1,
    color: "#fff"
  },
  firstDayOfWeek: {
    // marginLeft: 15
  }
}))

export const WeekPicker = ({ label, name, formik_props, include_time, format, ...props }) => {

  const classes = useStyles()
  const [selectedDate,setSelectedDate] = useState(new Date())

  useEffect(() => {
    
  }, [selectedDate])

  const handleWeekChange = date => {
    setSelectedDate(date.startOf("isoWeek"))
  }

  const formatWeekSelectLabel = (date, invalidLabel) => {
    return date && date.isValid()
      ? `Week of ${date.startOf("isoWeek").format("MMM DD")}`
      : invalidLabel
  }

  const renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {

    let selectedDateClone = selectedDate.clone();

    const start = selectedDateClone.startOf("week").toDate();
    const end = selectedDateClone.endOf("week").toDate();

    const dayIsBetween = date.isBetween(start, end, null, []);
    const isFirstDay = date.isSame(start, "day");
    const isLastDay = date.isSame(end, "day");

    const isFirstDayOfWeek = date.isoWeekday() === 1;
    const isWeekActive = date.isoWeek() === selectedDate.isoWeek();

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
      [classes.firstDayOfWeek]: isFirstDayOfWeek
    })

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween
    })

    const weekNumberClassName = clsx({
      [classes.weekNumber]: true,
      [classes.weekNumberHighlight]: isWeekActive
    })

    return (
      <div className={classes.dayWrapper}>
        {isFirstDayOfWeek && (
          <div className={weekNumberClassName}>{date.isoWeek()}</div>
        )}
        <div className={wrapperClassName}>
          <IconButton className={dayClassName}>
            <span>{date.format("DD")} </span>
          </IconButton>
        </div>
      </div>
    )
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
        label="Week picker"
        value={selectedDate}
        onChange={handleWeekChange}
        renderDay={renderWrappedWeekDay}
        labelFunc={formatWeekSelectLabel}
      />
    </MuiPickersUtilsProvider>
  )
}
