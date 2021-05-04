/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import { FormikBeneficiaryAutoCompleteDropdown } from './BeneficiaryAutoCompleteDropdown'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonCompanyForm from 'admin/components/companies/form/AdminCommonCompanyForm'

export const validationSchema = Yup.object().shape({
    'company': Yup.object().shape({
        'name': Yup.string().required("Required")
    })
})

class AdminBeneficiaryForm extends Component {

    renderExtraFields(formik_props) {
        return (
            <FormikBeneficiaryAutoCompleteDropdown name="company.parent"
                                                   label="Parent company"
                                                   formik_props={formik_props} />
        )
    }

    render() {
        const { formik_props } = this.props

        return (
            <AdminCommonCompanyForm formik_props={formik_props}
                                    renderExtraFieldsPosition1={this.renderExtraFields}
            />
        )
    }

}

export default AdminBeneficiaryForm
