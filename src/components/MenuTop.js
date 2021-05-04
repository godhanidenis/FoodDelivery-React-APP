/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { jsx, css, Global } from '@emotion/core'
import { Link } from 'react-router-dom'
import { clearAuthentication, loggedInUser } from 'actions/auth'
import { default_theme as theme } from 'emotion/theme'
import dashboard_light from '../images/dashboard_light.png'
import content_light from '../images/content_light.png'
import profile_light from '../images/profile_light.png'
import transactions_light from '../images/transactions_light.png'
import subscriptions_light from '../images/subscriptions_light.png'
import logo from '../images/logo.png'
import { Container } from './layout/Container'
import { Row } from './layout/Row'
import { Col } from './layout/Col'
import { NavBar, NavBarCollapse, NavBarToggle } from './layout/NavBar'
import { Nav } from './layout/Nav'
import { NavDropdown } from './layout/NavDropdown'
import { Trans } from 'react-i18next'
import profile_pic from '../images/profile_pic.svg'
import { userList } from 'actions/user'
import { globalSettingsList } from 'actions/settings'


class MenuTop extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(userList.ensureUserLoaded())
        dispatch(globalSettingsList.ensureGlobalSettingsLoaded())
    }

    onLogout = () => {
        const { dispatch, history } = this.props
        dispatch(clearAuthentication()).then(() => history.push("/"))
        
    }

    renderSupportPopup() {
        const { helpdesk_email, helpdesk_phone } = this.props
        return (
            <div css={[popup_menu_style, support_container_style]}>
              <div css={support_menu__section}>
                <div css={support_menu__name_style}>
                  <Trans>Support</Trans>
                </div>
              </div>
              <div css={support_menu__section}>
                <div css={support_menu__heading}>
                  <Trans>Email</Trans>
                </div>
                <div css={[support_menu__value]}>
                  <a css={support_menu__link} href={`mailto:${helpdesk_email}`}>{helpdesk_email}</a>
                </div>
              </div>
              <div css={support_menu__section}>
                <div css={support_menu__heading}>
                  <Trans>Call</Trans>
                </div>
                <div css={support_menu__value}>
                  {helpdesk_phone}
                </div>
              </div>
            </div>
        )
    }
    
    renderProfileMenu() {
        const { is_ready, user } = this.props
        if ( ! is_ready ) {
            return null
        }
        return (
            <div css={popup_menu_style}>
              <div css={profile_menu_top_style}>
                <div css={profile_menu__name_style}>
                  {user.display_name}
                </div>
                <div css={profile_menu__info_style}>
                  {user.email}
                </div>
                {user.company && 
                 <div css={profile_menu__info_style}>
                   {get(user, ["company", "name"])}
                 </div>
                }
              </div>
              <hr/>
              <div css={profile_menu_bottom_style}>
                <div css={profile_menu__item}>
                  <Link to="/profile">
                    <Trans>Account</Trans>
                  </Link>
                </div>
                { false &&
                  <div css={profile_menu__item}>
                    <Link to="/subscriptions" onClick={() => window.alert('coming soon')}>
                      <Trans><Trans>Subscriptions</Trans></Trans>
                    </Link>
                  </div>
                }
                <div css={profile_menu__item}>
                  <Link to="/invoices">
                    <Trans>Invoices</Trans>
                  </Link>
                </div>
                <div css={profile_menu__item}>
                  <Link to="/transactions">
                    <Trans>Credit history</Trans>
                  </Link>
                </div>
                <div css={profile_menu__item}>
                  <Link to="" onClick={ this.onLogout}>
                    <Trans>Log out</Trans>
                  </Link>
                </div>
              </div>
            </div>
        )
    }
    
    render() {
        const { email, is_logged_in, user } = this.props
        const active_key = this.props.active_key || "home"

        return (
            <Container fluid css={container} className="menutop_container">
              <Global styles={global_styles} />
              <Row className="main_row">
                <Col>
                  <NavBar expand="lg">
                    <div css={brand}><img src={ logo } alt="" /></div>
                    <NavBarToggle />
                    <NavBarCollapse css={navbar_collapse}>
                      <Nav className="mr-auto left_menu custom_menu" activeKey={active_key}>

                        <Nav.Item>
                          <Link to="/home" className={(active_key==="home" && "active") || "inactive"} >
                            <Trans>Messages</Trans>
                          </Link>
                        </Nav.Item>
                        
                        { is_logged_in && user.has_voice_subscription && 
                          <Nav.Item>
                            <Link to="/voice" className={(active_key==="voice" && "active") || "inactive"}>
                              <Trans>Voice</Trans>
                            </Link>
                          </Nav.Item>
                        }
                        { is_logged_in && user.has_fax_out_subscription &&
                          <Nav.Item>
                            <Link to="/send_a_fax" className={(active_key==="fax" && "active") || "inactive"}>
                              <Trans>Fax</Trans>
                            </Link>
                          </Nav.Item>
                        }
                      </Nav>

                      <Nav className="ml-auto right_menu custom_menu" activeKey={active_key}>
                        { ! is_logged_in && (
                              <Nav.Item>
                                <Link to="/" className="inactive">
                                  <Trans>Login</Trans>
                                </Link>
                              </Nav.Item>
                        )}

                        { is_logged_in && (
                            [
                                <NavDropdown css={profile_dropdown_toggle} title={ <div>Support</div> }
                                             eventKey="support">
                                    { this.renderSupportPopup() }
                                </NavDropdown>,

                                <NavDropdown css={profile_dropdown_toggle} title={ <div>Profile</div>}
                                             eventKey="user">
                                  { this.renderProfileMenu() }
                                </NavDropdown>
                            ]
                        )}
                      </Nav>
                    </NavBarCollapse>
                  </NavBar>
                  
                </Col>
              </Row>
            </Container>
        )
    }

}

function mapStateToProps(state, props) {
    const user = loggedInUser()
    globalSettingsList.ensureGlobalSettingsLoaded()
    return {
        email: user && user.email,
        is_logged_in: user && user.id,
        is_ready: userList.isReady() && !userList.isLoading(),
        user: userList.getUser(),
        helpdesk_email: globalSettingsList.getSetting("helpdesk_email"),
        helpdesk_phone: globalSettingsList.getSetting("helpdesk_phone")
    }
}
export default connect(mapStateToProps)(MenuTop)

const global_styles = css`
.menutop_container .main_row {
    height: 46px;
    padding-top: 5px;
}

.menutop_container .navbar {
    padding-top: 12px;
    font-weight: 500;
}

.menutop_container .navbar-brand {
    padding-top: 0px;
}

.menutop_container .navbar.navbar-light {
    min-height: 28px;
    padding: 0px;
}
.menutop_container .navbar {
    margin-top: 4px;
    height: 28px;
}


.menutop_container .navbar-brand {
    padding-top: 7px;
}

.menutop_container .navbar-light .navbar-nav.left_menu a {
    color: rgba(0, 0, 0, 1);
    /*height: 57px;*/
    height: 25px;
    padding-bottom: 11px;
    padding-left: 4px;
    padding-right: 4px;
  }

.menutop_container .navbar-light .navbar-nav.left_menu .nav-item:hover {
    border-radius: 4px;
    background-color: #e0ecfa;
    box-shadow: 0 0 0px 6px #e0ecfa;
}
  
.menutop_container .navbar-light .navbar-nav.custom_menu a:hover {
    text-decoration: none;
}

.menutop_container .navbar-light .navbar-nav.right_menu {
    align-items: center;
}

.menutop_container .navbar-light .navbar-nav.custom_menu a {
    color: rgba(0, 0, 0, 1);
}

.menutop_container .nav-item {
    margin-left: 23px;
    /*align-items: center;*/
    /*display: flex;*/
    line-height: 1.4;
}

.menutop_container .navbar-nav {
    height: 22px;
}

.dropdown-menu {
    padding: 10px; 
}
.dropdown-item {
    margin-bottom: 2px;
    padding: 6px 0;
    height: 30px !important;
border-radius: 4px;
}
    
.menutop_container .navbar .active {
    border-bottom: 3px solid #4178be;
    font-weight: 500;
    color: ${theme.colors.primary_blue} !important;
}

.menutop_container .navbar-brand {
    min-height: 0px;
}
`

const container = css`
background-color: rgb(102,102,102);
padding-left: 30px;
position: sticky;
top: 0px;
z-index: 10;
border-bottom: 1px solid #E5E5EA;
box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);
`

const brand = css`
  min-height: 0px;
`

const navbar_collapse = css`
min-height: 38px;
font-weight: 500;
`

const menu_icon_style = css`
color: ${theme.colors.middle_grey};
font-size: 30px;
`

const profile_dropdown_toggle = css`
margin-left: 16px !important;

a::after {
  display: none; /* hide the toggle carat */
}

&:hover {
font-weight: 400;
}

`

const popup_menu_style = css`
padding-top: 16px;
padding-bottom: 19px;
min-width: 243px;
padding-right: 20px;
position:absolute;
right: 115px;
top: -10px;
background: #fff;
border-radius: 4px;
box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
border: solid 1px rgba(0, 0, 0, 0.15);
font-weight: 400;
`


const profile_menu_top_style = css`
padding-left: 25px;
`

const profile_menu_bottom_style = css`
padding-left: 25px;
`

const profile_menu__name_style = css`
color: ${theme.colors.menu_black};
font-size: 16px;
`

const profile_menu__info_style = css`
color: ${theme.colors.dark_grey};
font-size: 14px;
font-weight: 400;
`

const profile_menu__item = css`
color: ${theme.colors.black};
font-size: 16px;
margin-top: 14px;
a:hover {
  color: ${theme.colors.primary} !important;
}
`

const support_menu__name_style = css`
color: ${theme.colors.menu_black};
font-size: 16px;
`

const support_container_style = css`
padding-left: 25px;
padding-right: 25px;
padding-top: 25px;
padding-bottom: 0px;
`

const support_menu__section = css`
margin-bottom: 20px;

`

const support_menu__heading = css`
font-size: 14px;
color: ${theme.colors.dark_grey};
font-weight: 500;
`

const support_menu__value = css`
font-weight: 500;
font-size: 16px;
`

const support_menu__link = css`
color: ${theme.colors.primary} !important;
`
