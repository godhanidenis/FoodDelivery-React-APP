/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { FormikInputField } from 'components/form/InputField'
import { CitySelectField } from 'components/form/CitySelectField'

const AdminCommonUserForm = ({formik_props}) => {

    return (
        <div>
          <FormikInputField name="user.first_name"
                            label="First name"
                            formik_props={formik_props}
          />

          <FormikInputField name="user.last_name"
                            label="Last name"
                            formik_props={formik_props}
          />

          <FormikInputField name="user.email"
                            type="email"
                            label="Email"
                            formik_props={formik_props}
          />

          <FormikInputField name="user.phone_number"
                            label="Phone number"
                            formik_props={formik_props}
          />

          <CitySelectField name="user.city"
                           label="City"
                           formik_props={formik_props}
          />


        </div>
    )

}

export default AdminCommonUserForm
