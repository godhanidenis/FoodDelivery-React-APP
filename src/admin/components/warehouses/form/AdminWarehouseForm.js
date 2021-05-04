/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { FormikInputField } from 'components/form/InputField'
import AdminAddressForm from 'admin/components/addresses/form/AdminAddressForm'

export const validationSchema = Yup.object().shape({
    'name': Yup.string().required("Required"),
})

class AdminWarehouseForm extends Component {

    render() {
        const { formik_props } = this.props
        return (
            <div>
              <FormikInputField name="name"
                                label="Name"
                                formik_props={formik_props}
              />

              <AdminAddressForm field_prefix="address"
                                formik_props={formik_props}
              />

            </div>
        )
    }

}

export default AdminWarehouseForm
