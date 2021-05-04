/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export default class CardH2Text extends Component {

    render() {
        return (
            <div css={style}>
              {this.props.children}
            </div>
        )
        
    }

}

const style = css`
font-size: 18px;
color: #000000;
line-height: 18px;
font-weight: 500;
`
