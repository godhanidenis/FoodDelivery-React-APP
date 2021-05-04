/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { ErrorMessage } from 'formik'

export const FormikGeneralFormErrors = ({ name, render, ...props }) => {

    name = name || "non_field_errors"

    render = render || function(msg) { return  msg }
    return (
        <ErrorMessage name={name} render={msg => render(<div css={error_class}>{msg}</div>)} />
    )

}

const error_class = css`
  color: ${theme.colors.error}
}
`
