/** @jsx jsx */
import { Component } from 'react';
import { jsx, css, Global } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import LoadingOverlay from 'react-loading-overlay'
import Loading from './Loading'
import { Trans } from 'react-i18next'

class WrappingBusyMask extends Component {

    render() {
        const { children, is_loading } = this.props
        return (
            <LoadingOverlay
                active={is_loading}
                spinner
                text={<Trans>Please wait a moment...</Trans>}
            >
              <Global styles={global_styles} />
              { ! is_loading && children }
            </LoadingOverlay>
        )
    }
}
export default WrappingBusyMask

const global_styles = css`

._loading_overlay_content {
  color: #000;
}

._loading_overlay_overlay {
  background-color: ${theme.colors.very_light_grey};
}

._loading_overlay_spinner {
  border-radius: 4px;
  background-color: #000;
}
`
