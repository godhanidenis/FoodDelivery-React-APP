/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const InputWithButton = ({ input, button, ...props }) => {

    return (
        <div css={container}>
          {input}
          <div css={button_style}>
            {button}
          </div>
        </div>
    )

}

const container = css`
display: flex;

`

const button_style = css`
margin-left: 2px;
`
