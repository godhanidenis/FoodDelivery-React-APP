/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const NavBar = ({children, className}) => {

    return (
        <div css={style}>
          {children}
        </div>
    )

}

const style = css`
display: flex;
`

export const NavBarToggle = ({children, className}) => {

    return (
        <div>
          {children}
        </div>
    )

}

export const NavBarCollapse = ({children, className}) => {

    return (
        <div>
          {children}
        </div>
    )

}
