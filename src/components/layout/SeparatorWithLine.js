/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { Separator } from './Separator'

export const SeparatorWithLine = ({ ...props }) => {

    return (
        <div>
          <Separator variant="h30" />
          <Separator variant="h40" with_top_border={true} />
        </div>
    )
}
