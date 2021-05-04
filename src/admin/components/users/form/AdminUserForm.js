/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { FormikInputField } from 'components/form/InputField'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { FormikMultiSelectDropdownField } from 'components/form/Dropdown'
import { adminEmployeeRoles } from 'admin/actions/admin_dropdown_options'
import { FormikBringgStatus } from 'admin/components/integrations/bringg/BringgStatus'
import { AdminUserFilterForm } from './AdminUserFilterForm'
import Timestamp from 'components/Timestamp'

export const validationSchema = Yup.object().shape({
    'email': Yup.string().required("Required"),
    'first_name': Yup.string().required("Required"),
})

class AdminUserForm extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminEmployeeRoles.fetchListIfNeeded())
    }

    render() {
        const { formik_props } = this.props
        const { employee_role_options } = this.props
        return (
            <div>
              <FormikInputField name="first_name"
                                type="text"
                                label="First name"
                                formik_props={formik_props}
              />
              <FormikInputField name="last_name"
                                type="text"
                                label="Last name"
                                formik_props={formik_props}
              />
              <FormikInputField name="email"
                                type="text"
                                label="Email"
                                formik_props={formik_props}
              />
              
              <AdminUserFilterForm formik_props={formik_props}
                                   field_name_prefix="user_filter"
              />
              
              { get(formik_props, ["values", "employee"]) && 
                <FormikMultiSelectDropdownField name="employee.roles"
                                                label="Roles"
                                                options={employee_role_options}
                                                formik_props={formik_props}
                />
              }
              
              <FormikCheckboxField name="is_active"
                                   label="Can login"
                                   formik_props={formik_props}
              />
              <FormikCheckboxField name="is_staff"
                                   label="Is staff"
                                   formik_props={formik_props}
              />
              <FormikCheckboxField name="is_superuser"
                                   label="Is admin"
                                   formik_props={formik_props}
              />

            </div>
        )
    }

}

function mapStateToProps(state, props) {
    return {
        employee_role_options: adminEmployeeRoles.getAsOptions()
    }
}

export default connect(mapStateToProps)(AdminUserForm)
