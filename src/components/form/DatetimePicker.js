/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import React from 'react'
import { get, isEmpty } from 'lodash'
import { Formik, Field } from 'formik'
import moment from 'moment'
import { DateTimePicker } from 'formik-material-ui-pickers'
import { DatePicker } from 'formik-material-ui-pickers'
import { makeStyles } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { fieldToTextField } from 'formik-material-ui'
import ClearIcon from '@material-ui/icons/Clear'

const useStyles = makeStyles((theme) => ({
  clearIcon: {
    cursor: "pointer",
  },
}))


export const FormikDateTimePicker = ({ label, name, formik_props, include_time, format, ...props }) => {
    const touched = get(formik_props, ["touched", name])

    format = format || (include_time !== false ? "dd MMM yyyy hh:mm a" : "dd MMM yyyy")

    return (
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Field component={createPicker({include_time: include_time!==false})}
                   label={label}
                   format={format}
                   error={touched && Boolean(get(formik_props, ["errors", name]))}
                   helperText={touched ? get(formik_props, ["errors", name]) : ""}
                   name={name}
                   {...props} />
          </MuiPickersUtilsProvider>
        </div>
    )
}

const createPicker = ({include_time}) => {
    if ( include_time ) {
        return WrappedDateTimePicker
    } else {
        return WrappedDatePicker
    }
}

const WrappedDateTimePicker = (props) => {
    const classes = useStyles()
    
    const { name } = props.field
    const { form } = props
    const { values } = form
    
    const onClear = () => {
        form.setFieldValue(name, null)
    }

    const value = get(values, name)
    const is_empty = !value
    
    if ( value === undefined ) {
        form.setFieldValue(name, null)
    }
    
    return (
        <div>
          <DateTimePicker {...props} />
          { ! is_empty &&
            <ClearIcon onClick={onClear} css={classes.clearIcon} />
          }
        </div>
    )
}

const WrappedDatePicker = (props) => {
    const classes = useStyles()
    const { name } = props.field
    const { form } = props
    const { values } = form
    
    const onClear = () => {
        form.setFieldValue(name, null)
    }

    const value = get(values, name)
    const is_empty = !value

    if ( value === undefined ) {
        form.setFieldValue(name, null)
    }
    
    return (
        <div>
          <DatePicker {...props} />
          { ! is_empty &&
            <ClearIcon onClick={onClear} css={classes.clearIcon} />
          }
        </div>
    )
}

