/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { map, size } from 'lodash'
import { default_theme as theme } from '../../emotion/theme'

export const ButtonBar = ({children, style_extra, item_style_extra, ...props }) => {
    return (
        <div css={[style, style_extra]}>
          { !children.length && <div css={item_style}>{children}</div> }
          { children.length > 1 && map(children, (child, index) => <div key={index} css={[item_style, item_style_extra || null]}>{child}</div>) }
        </div>
    )

}

const style = css`
display: flex;
align-items: center;
justify-content: flex-start;
`

const item_style = css`
margin-right: 20px;
`
