/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export default class CardParagraphSubHeading extends Component {

    render() {
        return (
            <div css={style}>
              {this.props.children}
            </div>
        )
        
    }

}

const style = css`
font-size: 16px;
color: #000000;
line-height: 1.13;
font-weight: 500;
margin-top: 0px;
margin-bottom: 10px;
`
