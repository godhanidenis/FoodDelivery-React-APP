/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { BaseButton } from './BaseButton'

export const WhiteButton = ({ onClick, extra_css, children, ...props }) => {
    return <BaseButton variant="light" extra_css={[style, extra_css]}  onClick={onClick} {...props}>
             {children}
           </BaseButton>
}

const style = css`
background-color: #fff;
border: 1px solid #d1d1d6;
cursor: pointer;
font-size: 16px;
color: #000;

&:hover {
background-color: #fff;
}
`
