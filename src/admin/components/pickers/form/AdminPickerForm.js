/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import AdminUserForm from 'admin/components/users/form/AdminUserForm'

export const validationSchema = Yup.object().shape({
    'email': Yup.string().required("Required"),
    'first_name': Yup.string().required("Required"),
})


class AdminPickerForm extends Component {

    render() {
        return <AdminUserForm {...this.props} />
    }

}

export default AdminPickerForm
