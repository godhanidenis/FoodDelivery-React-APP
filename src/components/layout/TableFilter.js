/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { withRouter } from 'react-router-dom'
import ReactTimeout from 'react-timeout'
import { Separator } from '../../components/layout/Separator'
import Row from './Row'
import Col from './Col'
import { default_theme as theme } from '../../emotion/theme'
import { Button } from './Button'

const SEARCH_DELAY_MILLISECONDS = 1000

class TableFilter extends Component {

    onFilterChanged = (e) => {
        const { updateOnChange, clearTimeout, setTimeout } = this.props
        const filter_values = {'any_field': e.target.value}

        if ( this.filter_timeout_id ) {
            clearTimeout(this.filter_timeout_id)
            this.filter_timeout_id = null
        }
        if ( updateOnChange ) {
            this.filter_timeout_id = setTimeout(function() {
                updateOnChange(filter_values)
            }, SEARCH_DELAY_MILLISECONDS)
        }
    }
    
    render() {
        const { label, updateOnChange, placeholder } = this.props

        return (
            <div css={filter_box_style}>
              <input className="form-control"
                     autoComplete="off"
                     type="text"
                     placeholder={ placeholder }
                     onChange={ this.onFilterChanged }
              />
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    const { label, updateOnChange } = props
    return {
        label,
        updateOnChange
    }
}
export default connect(mapStateToProps)(ReactTimeout(TableFilter))

const form_container = css`
`

const field_container = css`
`

const filter_row = css`
display: flex;
align-items: center;
`

const filter_box_style = css`
position: relative;

input {
  text-indent: 20px;
}
`

const search_icon_style = css`
position: absolute;
top: 12px;
left: 7px;
color: #b8b8bd;
`

