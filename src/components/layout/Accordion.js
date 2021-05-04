/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export const Accordion = ({children}) => {

    return (
        <div css={style}>
          {children}
        </div>
    )

}

const style = css`
`

export const AccordionToggle = ({children}) => {

    return (
        <div>
          {children}
        </div>
    )

}


export const AccordionCollapse = ({children}) => {

    return (
        <div>
          {children}
        </div>
    )
}