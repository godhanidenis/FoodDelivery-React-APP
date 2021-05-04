/** @jsx jsx */
import { Component } from 'react'
import { FormikInputField } from './InputField'
import { jsx, css } from '@emotion/core'

export const FormikTextareaField = ({ ...props }) => {

    return <FormikInputField multiline={true} {...props} />
}

