/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { Link } from 'react-router-dom'

class DashboardItem extends Component {

    renderContent() {
        const { text, stat, icon } = this.props
        return (
            <div>
              <div css={ icon_container }>
                <img src={ icon } alt="" css={ icon_css } />
              </div>
              <div css={ children_container }>
                <span css={ stat_container }>
                  { stat || 0 }
                </span>
                <span css={ text_container }>
                  { text }
                </span>
              </div>
            </div>
        )
    }
    
    render() {
        const { background_colour, onClickUrl, is_ready } = this.props
        return (
            <div css={ [item_container, css`background:${background_colour};`] }>
              { onClickUrl && 
                <Link to={onClickUrl} css={css`color: black`}>
                  { this.renderContent() }
                </Link>
              }
              { ! onClickUrl && is_ready && this.renderContent() }
            </div>
        )
    }
}
function mapStateToProps(state, props) {
const { background_colour, icon, stat, text } = props
    return {
        background_colour,
        icon,
        stat,
        text,
    }
}
export default connect(mapStateToProps)(DashboardItem)

const item_container = css`
display:flex;
flex-direction: row;
align-items: center;
margin: 20px;
padding: 20px;
border-radius: 10px;
width: 300px;
min-height: 144px;
`

const icon_container = css`
display:flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 10px;
width: 50%;
`

const children_container = css`
display:flex;
flex-direction: column;
align-items: flex-start;
justify-content: center;
padding: 10px;
width: 70%;
`

const icon_css = css`
max-height: 100%;
max-width: 100%;
`

const text_container = css`
font-size: 20px;
`

const stat_container = css`
vertical-align: middle;
font-size: 24px;
letter-spacing: 1.5;
font-weight: 600;
`
