/** @jsx jsx */
import { Component } from 'react';
import { jsx } from '@emotion/core'

class FormWarning extends Component {
    render() {

        const { meta } = this.props

        if ( !meta || !meta.warning ) {
            return null
        }
        
        return (
            <div>{meta.warning}</div>
        )
    }
}
export default FormWarning
