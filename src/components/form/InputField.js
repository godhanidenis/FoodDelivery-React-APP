/** @jsx jsx */
import { Component } from 'react'
import { get } from 'lodash'
import { jsx, css } from '@emotion/core'
import { useField } from 'formik'
import { default_theme as theme } from '../../emotion/theme'
import FormError from './FormError'
import FormWarning from './FormWarning'
import { TextField } from 'formik-material-ui'
import { Formik, Form, FieldArray, Field } from 'formik'
import { unpackFormikPropsForField } from '../../actions/form'

export const FormikInputField = ({ label, type, name, formik_props, touch_on_edit, ...props }) => {

    const { errors, touched } = unpackFormikPropsForField({formik_props, name})
 
    const setTouched = () => {
        formik_props.setFieldTouched(name)
    }
    
    return (
        <Field component={TextField}
               name={name}
               type={type || "text"}
               label={label}
               id={name}
               helperText={touched ? errors : ""}
               error={touched && Boolean(errors)}
               onInput={setTouched}
               margin="normal"
               variant="outlined"
               fullWidth
               {...props}
        />
    )
}

