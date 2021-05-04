/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const GrayLinkButton = ({ onClick, children, ...props }) => {

    return (
        <div css={style} onClick={onClick}>
          {children}
        </div>
    )

}

const style = css`
cursor: pointer;
padding-left: 0px;
color: #b8b8bd;

&:hover {
text-decoration: underline;
}
`
