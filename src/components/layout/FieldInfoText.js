/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

export default class FieldInfoText extends Component {

    render() {
        return (
            <div css={style}>
              {this.props.children}
            </div>
        )
        
    }

}

const style = css`
font-size: 14px;
color: ${theme.colors.dark_grey};
line-height: 21px;
`
