/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const Nav = ({children}) => {

    return (
        <div css={style}>
          {children}
        </div>
    )

}

const style = css`
`

export const NavItem = ({children}) => {

    return (
        <div css={item_style}>
          {children}
        </div>
    )

}

const item_style = css`
`
