import React from 'react'
import { FormikAutoCompleteDropdownWithFormBasedAddNew } from 'components/form/AutoCompleteDropdownWithFormBasedAddNew'
import AdminVehicleForm from './AdminVehicleForm'
import { adminVehicleList } from '../actions/admin_vehicle'
import { adminVehicleAutoCompleteList } from '../actions/admin_vehicle'
import {showSuccess, showError} from 'actions/Error'
import * as Yup from 'yup'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminVehicleForm'
import { useDispatch } from 'react-redux'

export function FormikVehicleAutoCompleteDropdown({name, label, formik_props, ...props}) {

    return <FormikAutoCompleteDropdownWithFormBasedAddNew item_list={adminVehicleAutoCompleteList}
                                                          success_message="Vehicle added"
                                                          form_title="Add Vehicle"
                                                          name={name}
                                                          validationSchema={validationSchema}
                                                          initial_values={{}}
                                                          label={label}
                                                          renderForm={ ({formik_props}) =>
                                                                       <AdminVehicleForm formik_props={formik_props} />
                                                                     }
                                                          formik_props={formik_props}
                                                          {...props} />
}
