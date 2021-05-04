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
import { FormikInputField } from 'components/form/InputField'
import { FormikDateTimePicker } from 'components/form/DatetimePicker'
import { FormikTextareaField } from 'components/form/TextareaField'
import { CitySelectField } from 'components/form/CitySelectField'
import { FormikBringgStatus } from 'admin/components/integrations/bringg/BringgStatus'
import Timestamp from 'components/Timestamp'

export const validationSchema = Yup.object().shape({
    'name': Yup.string().required("Required")
})

class AdminVehicleForm extends Component {

    render() {
        const { formik_props } = this.props

        return (
            <>
              <FormikInputField name="name"
                                type="text"
                                label="Name"
                                formik_props={formik_props}
              />
              <FormikInputField name="model"
                                type="text"
                                label="Model"
                                formik_props={formik_props}
              />
              <FormikTextareaField name="description"
                                   type="text"
                                   label="description"
                                   formik_props={formik_props}
              />
              <FormikInputField name="registration_number"
                                type="text"
                                label="Registration number"
                                formik_props={formik_props}
              />
              <FormikDateTimePicker name="registration_expiration_date"
                                    label="Registration expiration date"
                                    formik_props={formik_props}
              />
              <FormikInputField name="capacity_kg"
                                type="text"
                                label="Capacity (kg)"
                                formik_props={formik_props}
              />
              <CitySelectField name="operating_city"
                               label="Operating city"
                               formik_props={formik_props}
              />
              <FormikInputField name="owning_company"
                                type="text"
                                label="Owning company"
                                formik_props={formik_props}
              />

              <FormikBringgStatus formik_props={formik_props} />

            </>
        )
    }

}

export default AdminVehicleForm
