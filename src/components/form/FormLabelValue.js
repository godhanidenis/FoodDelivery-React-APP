/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { connect } from 'react-redux'
import moment from 'moment'
import { Separator } from '../layout/Separator'

export class FormLabelValue extends Component {

    render() {

        const { spacing } = this.props
        const label = this.props.children[0]
        const value = this.props.children.slice(1)
        
        return (
            <div>
              <div>{label}</div>
              {value}
              { spacing && <Separator variant={spacing} /> }
            </div>
        )
        
    }

}
