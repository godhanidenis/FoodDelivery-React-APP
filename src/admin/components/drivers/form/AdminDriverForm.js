/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import Timestamp from 'components/Timestamp'
import AdminCommonUserForm from 'admin/components/users/form/AdminCommonUserForm'
import { FormikVehicleAutoCompleteDropdown } from 'admin/components/vehicles/form/VehicleAutoCompleteDropdown'
import { FormikInputField } from 'components/form/InputField'
import { FormikBringgStatus } from 'admin/components/integrations/bringg/BringgStatus'
import { CitySelectField } from 'components/form/CitySelectField'

export const validationSchema = Yup.object().shape({
})

class AdminDriverForm extends Component {

    render() {
        const { formik_props } = this.props

        return (
            <>
              <FormikInputField name="driver_licence"
                                label="Drivers licence"
                                formik_props={formik_props}
              />
              
              <CitySelectField name="operating_city"
                               label="Operating city"
                               formik_props={formik_props}
              />

              <FormikVehicleAutoCompleteDropdown name="preferred_vehicle"
                                                 label="Vehicle"
                                                 formik_props={formik_props}
              />


              <FormikBringgStatus formik_props={formik_props} />

            </>
        )
    }

}

export default AdminDriverForm
