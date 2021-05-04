// @ts-nocheck
/** @jsx jsx */
import 'react'
import { useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { get, split } from 'lodash'
import { useDispatch } from 'react-redux'
import { withStyles, Typography } from "@material-ui/core"
import { FormikDropdownField } from 'components/form/Dropdown'
import { FormikInputField } from 'components/form/InputField'
import { FormikTextareaField } from 'components/form/TextareaField'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { adminContactRoles } from 'admin/actions/admin_dropdown_options'

const AdminContactForm = ({classes, formik_props, field_prefix}) => {

    const values = get(formik_props, ["values", split(field_prefix, ".")])
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminContactRoles.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])

    const contact_role_options = adminContactRoles.getAsOptions()

    return (
        <div>
          <Typography variant="h6">Add Contact</Typography>
          <FormikDropdownField name={`${field_prefix}.role`}
                               formik_props={formik_props}
                               options={contact_role_options}
                               placeholder="Type" />

          <FormikInputField name={`${field_prefix}.first_name`}
                            type="text"
                            label="First name"
                            formik_props={formik_props}
          />

          <FormikInputField name={`${field_prefix}.last_name`}
                            type="text"
                            label="Last name"
                            formik_props={formik_props}
          />

          <FormikInputField name={`${field_prefix}.email`}
                            label="Email"
                            formik_props={formik_props}
          />

          <FormikInputField name={`${field_prefix}.Phone`}
                            type="text"
                            label="Phone"
                            formik_props={formik_props}
          />

          <FormikInputField name={`${field_prefix}.mobile`}
                            type="text"
                            label="Mobile"
                            formik_props={formik_props}
          />

          <FormikTextareaField name={`${field_prefix}.notes`}
                               label="Notes"
                               formik_props={formik_props}
          />


        </div>
    )

}

export default AdminContactForm
