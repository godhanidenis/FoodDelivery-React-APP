/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export default class CardInfoText extends Component {

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
color: #727272;
line-height: 1.31;
margin-top: 10px;
font-weight: 400;
`
