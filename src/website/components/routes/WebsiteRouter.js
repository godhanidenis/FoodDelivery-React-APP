import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'

import Slider from 'website/components/widgets/Slider'

import { isLoggedIn, loggedInUser } from 'actions/auth'

class WebsiteRouter extends Component {

    componentDidUpdate(prevProps) {
        const { is_logged_in, history, has_usable_password, is_superuser } = this.props
        if (!prevProps.is_logged_in && is_logged_in) {
            if (is_superuser) {
                history.push('/website')
            } else {
                history.push('/')
            }
        }
        if (prevProps.is_logged_in && !is_logged_in) {
            history.push('/')
        }
    }

    render() {
        const { is_logged_in, is_superuser } = this.props
        if ( ! is_logged_in ) {
            return (
              <div>
                <Switch>
                  <Route path="/website/slider" component={ Slider } />
                  <Route path="/website" component={ Slider } />
                </Switch>
              </div>
            )
        }

        return (
            <div>
              <Switch>
                <Route path="/website/slider" component={ Slider } />
                <Route path="/website" component={ Slider } />
              </Switch>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const is_logged_in = isLoggedIn()
    let has_usable_password = true
    let is_superuser = false
    if (is_logged_in) {
        const user = loggedInUser()
        has_usable_password = user && user['has_usable_password']
        is_superuser = user && user['is_superuser']
    }
    return {
        is_logged_in: is_logged_in,
        has_usable_password: has_usable_password,
        is_superuser: is_superuser
    }
}
export default withRouter(connect(mapStateToProps)(WebsiteRouter))
