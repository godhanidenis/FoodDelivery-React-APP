/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css, Global } from '@emotion/core'
import { head } from 'lodash'
import Container from './layout/Container'
import Row from './layout/Row'
import Col from './layout/Col'
import MenuTop from './MenuTop'
import { isLoggedIn, loggedInUser } from 'actions/auth'
import Breadcrumbs from './layout/Breadcrumbs'
import BreadLinks from './layout/BreadLinks'
import { Separator } from './layout/Separator'
import ConfirmationModal from './ConfirmationModal'
import NewPassword from './NewPassword'
import { default_theme as theme } from 'emotion/theme'

class MainLayout extends Component {

    render() {
        const { title, children, breadcrumbs, active_key, disable_action_notifications, disable_auto_set_password, enable_breadlinks } = this.props
        const { is_logged_in, is_prod, has_usable_password, user } = this.props

        if ( is_logged_in && user.id && ! has_usable_password && disable_auto_set_password !== true ) {
            return <NewPassword />
        }
        
        return (
            <div css={main}>
              <MenuTop active_key={active_key} />
              <ConfirmationModal />
              { false && <Breadcrumbs crumbs={breadcrumbs}/> }

              <BreadLinks enable_breadlinks={enable_breadlinks} />
              
              { title && 
                <div css={ header }>
                  <h1 css={ css`margin-top:5px;` }>{ title }</h1>
                </div>
              }
              <div css={chidren_container}>
                { children }
              </div>
              <Separator variant="h100" />
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    const { title, layout, children, disable_action_notifications, disable_auto_set_password } = props
    const user = loggedInUser()
    let has_usable_password = true
    const is_logged_in = isLoggedIn()
    if (is_logged_in) {
        has_usable_password = user && user.has_usable_password
    }
    
    return {
        title,
        children,
        disable_action_notifications,
        disable_auto_set_password,
        user,
        is_logged_in,
        has_usable_password
    }
}
export default connect(mapStateToProps)(MainLayout)

const chidren_container = css`
padding-left: 15px;
padding-right: 15px;
`

const main = css`
`

const header = css`
display: flex;
flex-direction: row;
width: 100%;
height: 100px;
justify-content: space-between;
align-items: center;
color: ${theme.colors.secondary};
padding: 10px;
`
