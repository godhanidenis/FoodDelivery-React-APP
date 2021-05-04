/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const Error = ({ children, ...props }) => {

    return (
        <div css={error_class}>{children}</div>
    )

}

const error_class = css`
  color: ${theme.colors.error}
}
`
