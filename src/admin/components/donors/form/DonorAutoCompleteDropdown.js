import React from 'react'
import { adminDonorAutoCompleteList } from '../actions/admin_donor'
import { FormikAutoCompleteDropdownWithFormBasedAddNew } from 'components/form/AutoCompleteDropdownWithFormBasedAddNew'
import AdminDonorForm from './AdminDonorForm'
import { adminDonorList } from '../actions/admin_donor'
import {showSuccess, showError} from 'actions/Error'
import * as Yup from 'yup'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminDonorForm'
import { useDispatch } from 'react-redux'

export function FormikDonorAutoCompleteDropdown({name, label, formik_props, ...props}) {

    return <FormikAutoCompleteDropdownWithFormBasedAddNew item_list={adminDonorAutoCompleteList}
                                                          success_message="Donor added"
                                                          form_title="Add Donor"
                                                          name={name}
                                                          validationSchema={validationSchema}
                                                          initial_values={{}}
                                                          label={label}
                                                          getSavedObjectId={(value) => value.company.id}
                                                          renderForm={ ({formik_props}) =>
                                                                       <AdminDonorForm formik_props={formik_props} />
                                                                     }
                                                          formik_props={formik_props}
                                                          {...props} />
}
