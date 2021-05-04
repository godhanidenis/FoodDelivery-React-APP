/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export default class CardParagraphHeading extends Component {

    render() {
        const { variant } = this.props
        return (
            <div css={[style, (variant === "no_top_margin" && no_top_margin_style) || null]}>
              {this.props.children}
            </div>
        )
        
    }

}

const style = css`
font-size: 18px;
color: #000000;
line-height: 1;
font-weight: 500;
margin-top: 10px;
margin-bottom: 15px;
`

const no_top_margin_style = css`
margin-top: 0px;
`
