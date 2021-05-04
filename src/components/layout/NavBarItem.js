/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const NavBarItem = (children, className) => {

    return (
        <div css={style}>
          {children}
        </div>
    )

}

const style = css`
display: flex;
`
