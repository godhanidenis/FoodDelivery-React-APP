/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { Separator } from './Separator'

export default class Card extends Component {

    render() {

        const { title, mini_title, variant, with_padding_below, with_thick_padding_above } = this.props
        const variant_style = variants[variant]
        
        return (
            <div css={[variant_style,
                       with_thick_padding_above ? thick_padding_above_style : null]}>
              { title && 
                <h1>{title}</h1>
              }
              { mini_title && 
                <h5>{mini_title}</h5>
              }
              <div css={card}>
                {this.props.children}
              </div>

              { with_padding_below !== false &&
                <Separator variant="h30" />
              }
            </div>
        )
        
    }

}

const variants = {

    white: css`
border: 1px solid ${theme.colors.card_border};
border-radius: 4px;
background-color: ${theme.colors.card_background};
padding-left: 20px;
padding-top: 20px;
margin-top: 15px;
    `,

    white_wide_padding: css`
border: 1px solid ${theme.colors.card_border};
border-radius: 4px;
background-color: ${theme.colors.card_background};
padding-top: 20px;
margin-top: 15px;
padding-left: 30px;
padding-right: 30px;
    `,

    empty_wide_padding: css`
      margin-top: 15px;
    `
    
}

const thick_padding_above_style = css`
padding-top: 33px;
`

const card = css`
padding-bottom: 20px;
padding-left: 0px;
padding-right: 20px;
`
