/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { get, map, includes, split, filter } from 'lodash'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import MenuItem from '@material-ui/core/MenuItem'
import { Select } from 'formik-material-ui'
import Checkbox from '@material-ui/core/Checkbox'
import { unpackFormikPropsForField } from 'actions/form'

export const FormikDropdownField = ({label, name, options, on_change, validate_on_select, placeholder, formik_props}) => {
    
    const { errors, touched } = unpackFormikPropsForField({formik_props, name})

    const localOnChange = (evt, new_value) => {
        const v = get(new_value, ["props", "value"])
        formik_props.setFieldValue(name, v)
        formik_props.setFieldTouched(name)
        if ( on_change ) {
            on_change(v)
        }
    }

    const localOnSelect = (evt, new_value) => {
        if ( validate_on_select !== true ) {
            return
        }
        localOnChange(evt, new_value)
    }

    return (
        <Field
          component={TextField}
          name={name}
          select={true}
          label={label}
          id={name}
          onChange={localOnChange}
          onSelect={localOnSelect}
          helperText={touched ? errors : ""}
          error={touched && Boolean(errors)}
          margin="normal"
          variant="outlined"
          fullWidth
          placeholder={placeholder}
        >
          {map(options, (option) => (
              <MenuItem key={option.value} value={option.value || null}>
                {option.label}
              </MenuItem>
          ))}
        </Field>
    )
}


export const FormikMultiSelectDropdownField = ({label, name, options, on_change, placeholder, formik_props, ...props}) => {
    const { touched } = formik_props
    const selected_options = get(get(formik_props, "values", {}), name, [])

    const renderValue = (selected_values) => {
        const selected_options = filter(options, (option) => includes(selected_values, option.value))
        const selected_labels = map(selected_options, (option) => option.label)
        return selected_labels.join(', ')
    }
    
    return (
        <Field
          component={Select}
          name={name}
          label={label}
          id={name}
          renderValue={renderValue}
          multiple
          helperText={touched ? get(formik_props, ["errors", name]) : ""}
          error={touched && Boolean(get(formik_props, ["errors", name]))}
          margin="normal"
          variant="outlined"
          fullWidth
          {...props}
        >
          {map(options, (option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={includes(selected_options, option.value)} />
                {option.label}
              </MenuItem>
          ))}
        </Field>
    )
}
