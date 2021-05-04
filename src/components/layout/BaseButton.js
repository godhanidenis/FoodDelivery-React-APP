/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { Button } from '@material-ui/core'
import { getGlobalHttpCounter } from '../../orm/http_adapter'

export const BaseButton = ({ onClick, variant, extra_css, children, auto_disable, ...props }) => {

    const [clicked_against_http_timer, setClickedAgainstHttpTimer ] = useState(0)

    extra_css = extra_css || null
    variant = variant || "default"

    const disabled = auto_disable === true && (clicked_against_http_timer !== 0 && getGlobalHttpCounter() === clicked_against_http_timer)

    const localOnClick = (evt) => {
        if ( disabled ) {
            evt.preventDefault()
            return false
        }
        setClickedAgainstHttpTimer(getGlobalHttpCounter())
        if ( onClick ) {
            evt.preventDefault()
            onClick()
        } else {
            return true
        }
    }

    return (
        <Button
                color={props.color} 
                variant={props.variant}
                onClick={localOnClick}
                {...props}>
          {children}
        </Button>
    )

}

const style = css`
`

const disabled_style = css`
  cursor: default;
  background-color: ${theme.colors.primary_dark};

`
