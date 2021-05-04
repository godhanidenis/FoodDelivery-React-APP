/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { Separator } from './Separator'
import { BlueLinkButton } from './BlueLinkButton'
import { withRouter } from 'react-router-dom'

class BreadLinks extends Component {

    render() {
        const { history } = this.props
        
        // default is to hide
        const enable_breadlinks = this.props.enable_breadlinks === true

        if (! enable_breadlinks ) {
            return (
                <Separator variant="h50" />
            )
        }
        
        return (
            <div css={container}>
              <BlueLinkButton onClick={history.goBack}>
                Back
              </BlueLinkButton>
            </div>
        )
    }
}

export default withRouter(BreadLinks)

const container = css`
padding-left: 30px;
height: 30px;
margin-top: 12px;
margin-bottom: 8px;
`
