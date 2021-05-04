// @ts-nocheck
/** @jsx jsx */ 
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminUserList } from './actions/admin_user'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { FormikInputField } from 'components/form/InputField'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { FormikMultiSelectDropdownField } from 'components/form/Dropdown'
import AdminUserForm from './form/AdminUserForm'

const yup_shape = {
    'email': Yup.string().required("Required")
}

const validationSchema = Yup.object().shape(yup_shape)

class AdminUser extends Component {

    componentDidMount() {
        const { dispatch, user_id } = this.props
        dispatch(adminUserList.ensureObjectLoaded(user_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, user_id } = this.props
        dispatch(adminUserList.ensureObjectLoaded(user_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, dispatch, user_id } = this.props

        const on_ok = function(json) {
            dispatch(adminUserList.invalidateList())
            showSuccess("Saved", "User saved")

            if ( ! user_id ) {
                history.push(`/admin/user/${json.id}`)
            }
        }
        if ( user_id ) {
            values.id = user_id
            return dispatch(adminUserList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminUserList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    render() {
        const { initial_values, is_loading, is_busy, user, user_id } = this.props
        const that = this
        const title = `${get(user, ["display_name"], 'New user')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'users',
                                                  label: 'Users',
                                                  url: '/admin/users'},

                                                 {name: 'user',
                                                  label: get(user, ["display_name"], 'New user'),
                                                  url: `/admin/user/${user_id}`
                                                 }
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title}
                                   initial_values={initial_values}
                                   validationSchema={validationSchema}
                                   onSave={this.onSave}>

              {
                  ({formik_props}) =>
                     
                      <>
                        <AdminUserForm formik_props={formik_props} />
                      </>
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const user_id = get(props, ["match", "params", "user_id"], null)
    const user = adminUserList.getObject(user_id)
    const initial_values = Object.assign({}, {employee:{roles: []},
                                              user_filter:{cities: [], user: user_id}
                                             }, user)

    return {
        user_id,
        user,
        is_loading: adminUserList.isLoading() || (user_id && !get(user, "id")),
        is_busy: adminUserList.getIsSavingObject(),
        initial_values: initial_values,
    }
}

export default connect(mapStateToProps)(AdminUser)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
