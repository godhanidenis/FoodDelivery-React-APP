/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { jsx } from '@emotion/core'
import { head } from 'lodash'
import { sendTokenEmail, refreshLoggedInUserCookieFromUser } from 'actions/auth'
import { userList } from 'actions/user'
import { Container } from './layout/Container'
import { Row } from './layout/Row'
import { Col } from './layout/Col'
import AdminMainLayout from '../admin/components/layout/AdminMainLayout'
import ProfileForm from './ProfileForm'
import BusyMask from './BusyMask'
import { CardHeader } from './layout/CardHeader'
import Card from './layout/Card'
import { Separator } from './layout/Separator'
import { handleSubmitResult } from 'actions/form'
import {showSuccess, showError} from 'actions/Error'

class ProfileEdit extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(userList.ensureUserLoaded())
    }

    onSave = (values, formik_funcs) => {
        const { dispatch, history, user } = this.props
        let on_ok = function(json) {
            refreshLoggedInUserCookieFromUser(json)
            showSuccess("Saved", "Account updated")
            history.push("/profile")
        }

        return dispatch(userList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }

    onRequestToken = () => {
        const { dispatch, user } = this.props
        dispatch(sendTokenEmail(user))
    }

    onCancel = () => {
        const { history } = this.props
        history.push('/profile/')
    }

    render() {
        const { is_loading, user } = this.props
        return (
            <AdminMainLayout active_key="profile"
                             enable_breadlinks={true}
                             breadcrumbs={[{name: 'home'},
                                           {name: 'account', label: 'Account', url: '/profile'},
                                           {name: 'account_information', label: 'Edit account information', url: '/profile'}]}>
              { is_loading && <BusyMask /> }
              <CardHeader title="Edit account information" />
              <ProfileForm user={user} onSave={this.onSave} onCancel={this.onCancel} />
            </AdminMainLayout>
        )
    }
}
function mapStateToProps(state, props) {
    const user = userList.getUser()
    return {
        user,
        user,
        is_loading: userList.isLoading()
    }
}
export default withRouter(connect(mapStateToProps)(ProfileEdit))
