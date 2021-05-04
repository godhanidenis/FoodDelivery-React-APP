/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const FormLabel = ({ children, ...props }) => {

    return (
        <div css={label_style}>
          {children}
        </div>
    )

}

const label_style = css`
margin-bottom: 10px;
`
