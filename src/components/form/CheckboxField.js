/** @jsx jsx */
import { Component } from 'react'
import { CheckboxWithLabel } from 'formik-material-ui'
import { FormikInputField } from './InputField'
import { jsx, css } from '@emotion/core'

export const FormikCheckboxField = ({ label, name, formik_props, ...props }) => {
    return <FormikInputField type="checkbox"
                             component={CheckboxWithLabel}
                             Label={{label: label}}
                             name={name}
                             formik_props={formik_props}
                             {...props}
           />
}
