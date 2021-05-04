/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { BaseButton } from './BaseButton'

export const BlueLinkButton = ({ onClick, children, ...props }) => {
    return (
        <BaseButton variant="link" extra_css={style} auto_disable={false} onClick={onClick} {...props}>
          {children}
        </BaseButton>
    )
}

const style = css`
padding-left: 0px;
color: ${theme.colors.primary_dark};
font-weight: 500;
margin-top: 0px;
padding-top: 0px;
`
