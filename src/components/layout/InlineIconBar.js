/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { map } from 'lodash'
import { default_theme as theme } from '../../emotion/theme'

export const InlineIconBar = ({children, ...props }) => {

    return (
        <div css={style}>
          { !children.length && <div css={item_style}>{children}</div> } 
          { children.length > 1 && map(children, function(child, index) {
                if ( ! child ) {
                    return null
                }
                return (
                    <div key={index} css={item_style}>{child}</div>
                )}
          )}
        </div>
    )

}

const style = css`
display: flex;
align-items: center;
justify-content: flex-end;
`

const item_style = css`
margin-right: 10px;
`
