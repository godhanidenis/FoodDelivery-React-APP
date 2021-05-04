import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Switch } from 'react-router-dom'
import AuthRouter from './AuthRouter'
import { updateSettings, isConfigured } from '../actions/settings'
import { userList } from '../actions/user'
import 'react-notifications/lib/notifications.css'
import {NotificationContainer} from 'react-notifications'

class MainRouter extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(updateSettings(window.LOCAL_SETTINGS))
    }

    componentDidUpdate() {
        const { dispatch } = this.props
        dispatch(userList.ensureUserLoaded())
    }

    render() {
        return (
            <div>
              <NotificationContainer />
              <AuthRouter />
            </div>
        )
    }
}
function mapStateToProps(state) {
    
    const is_configured = isConfigured(state)
    return {
        is_configured
    }
}
export default connect(mapStateToProps)(MainRouter)
