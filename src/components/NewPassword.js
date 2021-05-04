/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { Trans, Translation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import NewPasswordForm from './NewPasswordForm'
import {showSuccess, showError} from 'actions/Error'
import { setPassword, loggedInUser } from 'actions/auth'
import { default_theme as theme } from 'emotion/theme'
import logo from '../images/logo.png'

class Login extends Component {

    componentDidMount() {
        const { user, history, next } = this.props
        if (user.has_usable_password) {
            history.push(next || "/")
        }
    }
    
    onSave = (values) => {
        const { dispatch, history } = this.props
        const on_done = function() {
            showSuccess("Updated", "Password set")
            window.location = "/"
        }
        if (values.password !== values.confirm_password) {
            window.alert("Passwords do not match")
            return null
        } else {
            return dispatch(setPassword(values, on_done))
        }
    }

    render() {
        return (
            <div css={ main }>
              <div css={ container }>
                <div css={ header }>
                  <img src={ logo } alt="" css={ image } />
                  <p><Trans>You don't have a valid password, please choose one now</Trans>.</p>
                </div>
                <NewPasswordForm
                    onSave={ this.onSave }
                />
              </div>
            </div>
        )
    }
}
function mapStateToProps(state, props) {
    const user = loggedInUser()
    return {
        user
    }
}
export default withRouter(connect(mapStateToProps)(Login))

const main = css`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: ${theme.colors.gray2};
min-height: 100vh;
padding: 0 16px;
`

const container = css`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
max-width: 520px;
width: 100%;
background-color: ${theme.colors.white};
box-shadow: 10px 10px 30px 0px #888888;
`

const header = css`
padding-top: 30px;
width: 80%;
text-align: center;
p {
    padding-top: 20px;
}
`

const image = css`
width: 80%;
`
