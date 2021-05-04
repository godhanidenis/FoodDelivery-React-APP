/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { BaseButton } from './BaseButton'

export const Button = ({ onClick, color, variant, children, ...props }) => {

    //extra_css = extra_css || null

    return (
        <BaseButton onClick={onClick} color={props.color} variant={props.variant} {...props}>
          {children}
        </BaseButton>
    )

}

const style = css`
background-color: ${theme.colors.primary_blue};
border: 1px solid ${theme.colors.primary_blue};
font-weight: 500;


&:hover {
background-color: ${theme.colors.primary_blue};
}
`
