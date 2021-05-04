/** @jsx jsx */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { withRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'
import { Trans, Translation } from 'react-i18next'
import { includes } from 'lodash'
import WrappingBusyMask from './WrappingBusyMask'
import NewPassword from './NewPassword'
import Login from './Login'
import AdminRouter from '../admin/components/routes/AdminRouter'
import WebsiteRouter from '../website/components/routes/WebsiteRouter'
import Home from './Home'
import ProfileEdit from './ProfileEdit'
import ForgotPassword from './ForgotPassword'
import { Button } from './layout/Button'
import { Col } from './layout/Col'
import { Link } from 'react-router-dom'
import { isLoggedIn, loggedInUser } from 'actions/auth'
import { globalSettingsList } from 'actions/settings'
import NonProdHeading from './NonProdHeading'


class AuthRouter extends Component {

    componentDidMount() {
        const { dispatch, is_logged_in } = this.props
        if ( is_logged_in ) {
            dispatch(globalSettingsList.ensureGlobalSettingsLoaded())
        }
        this.checkRouting()
    }

    componentDidUpdate(prevProps) {
        const { is_logged_in, history, is_staff, is_superuser } = this.props
        if (prevProps.is_logged_in && !is_logged_in) {
            history.push('/')
        } else if ( (is_staff || is_superuser) && window.location.pathname === "/" ) {
            history.push('/admin/dashboard')
        }
        this.checkRouting()
    }

    checkRouting() {
        const { history, is_superuser } = this.props
        if ( is_superuser && ! window.location.pathname.startsWith("/website") && ! window.location.pathname.startsWith("/admin") && ! window.location.pathname.startsWith("/profile") ) {
            history.push('/admin/dashboard')
        }
    }

    render() {
        const { is_logged_in, is_prod, user, has_usable_password } = this.props
        if ( ! is_logged_in ) {
            return (
                <div>
                  { ! is_prod && <NonProdHeading /> }
                  <Switch>
                    <Route path="/profile/forgot_password" exact={ true } component={ ForgotPassword } />
                    <Route path="/website" exact={ false } component={ WebsiteRouter } />
                    <Route path="/" render={() => <Login />} />
                  </Switch>
                </div>
            )
        }

        if ( is_logged_in && user.id && ! has_usable_password  ) {
            return <NewPassword />
        }

        return (
            <div>
              { ! is_prod && <NonProdHeading /> }
              <Switch>
                <Route path="/website" exact={ false } component={ WebsiteRouter } />
                <Route path="/admin" exact={ false } component={ AdminRouter } />
                <Route path="/profile" exact={ true } component={ ProfileEdit } />
                <Route path="/home" component={ Home } />
                <Route path="/" exact={true} component={ Home } />
                <Route path="/" component={ Home } />
              </Switch>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const is_logged_in = isLoggedIn()
    let is_staff = false
    let is_superuser = false
    const user = loggedInUser()
    if (is_logged_in) {
        is_staff = user && user.is_staff
        is_superuser = user && user.is_superuser
    }
    const is_prod = !includes(window.location.host, "localhost") && !includes(window.location.host, "staging")
    const has_usable_password = is_logged_in && user && user.has_usable_password
    return {
        user,
        is_logged_in,
        is_staff,
        is_superuser,
        is_prod,
        has_usable_password
    }
}

export default withRouter(connect(mapStateToProps)(AuthRouter))
