/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { connect } from 'react-redux'
import { Separator } from './Separator'

export class LabelValue extends Component {

    render() {

        const label = this.props.children[0]
        const value = this.props.children.slice(1)
        
        return (
            <div>
              <div css={label_style}>{label}</div>
              <div css={value_style}>{value}</div>
              <Separator variant="h20" />
            </div>
        )
        
    }

}

const label_style = css`
font-size: 14px;
color: ${theme.colors.dark_grey};
`

const value_style = css`
`
