/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'

const STYLES = { "w3": css`width: 3px; min-width: 3px;`,
                 "w5": css`width: 5px; min-width: 5px;`,
                 "w10": css`width: 10px; min-width: 10px;`,
                 "w14": css`width: 14px; min-width: 14px;`,
                 "w15": css`width: 15px; min-width: 15px;`,
                 "w20": css`width: 20px; min-width: 20px;`,
                 "w30": css`width: 30px; min-width: 30px;`,
                 "w40": css`width: 40px; min-width: 40px;`,

                 "h3": css`height: 5px; min-height: 3px;`,
                 "h5": css`height: 5px; min-height: 5px;`,
                 "h10": css`height: 10px; min-height: 10px;`,
                 "h15": css`height: 15px; min-height: 15px;`,
                 "h20": css`height: 20px; min-height: 20px;`,
                 "h30": css`height: 30px; min-height: 30px;`,
                 "h40": css`height: 40px; min-height: 40px;`,
                 "h50": css`height: 50px; min-height: 50px;`,
                 "h80": css`height: 80px; min-height: 80px;`,
                 "h100": css`height: 100px; min-height: 100px;`
}

export const Separator = ({ variant, with_top_border, ...props }) => {

    return (
        <div css={[common_style, STYLES[variant],
                   (with_top_border===true && hr_style) || null]}>
        &nbsp;
        </div>
    )
}

const common_style = css`
line-height: 1em;
`

const hr_style = css`
width: 100%;
border-top: 1px solid #e8e8ed;
`
