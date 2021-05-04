/** @jsx jsx */
import { Component } from 'react';
import { jsx, css } from '@emotion/core'
import { size, map } from 'lodash'
import { Trans, Translation } from 'react-i18next'
import { default_theme as theme } from '../../emotion/theme'
import { Error } from '../layout/Error'

class FormError extends Component {
    render() {

        const { meta } = this.props

        if ( !meta || !meta.error || !meta.touched ) {
            return null
        }
        
        return (
            <Error><Trans>{meta.error}</Trans></Error>
        )
    }
}
export default FormError

const error_class = css`
  color: ${theme.colors.error}
}
`
