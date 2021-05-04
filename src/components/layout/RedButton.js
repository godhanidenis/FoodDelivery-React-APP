/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { BaseButton } from './BaseButton'

export const RedButton = ({ onClick, extra_css, children, ...props }) => {

    extra_css = extra_css || null

    return (
        <BaseButton variant="warning" extra_css={[style, extra_css]} onClick={onClick} {...props}>
          {children}
        </BaseButton>
    )

}

const style = css`
background-color: ${theme.colors.primary_red};
border: 1px solid ${theme.colors.primary_red};
font-weight: 500;
color: #fff;

&:hover {
background-color: ${theme.colors.primary_red};
color: #fff;
}
`

