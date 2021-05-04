import React from 'react'
import { adminBeneficiaryAutoCompleteList } from '../actions/admin_beneficiary'
import { FormikAutoCompleteDropdownWithFormBasedAddNew } from 'components/form/AutoCompleteDropdownWithFormBasedAddNew'
import AdminBeneficiaryForm from './AdminBeneficiaryForm'
import { adminBeneficiaryList } from '../actions/admin_beneficiary'
import {showSuccess, showError} from 'actions/Error'
import * as Yup from 'yup'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminBeneficiaryForm'
import { useDispatch } from 'react-redux'

export function FormikBeneficiaryAutoCompleteDropdown({name, label, formik_props, ...props}) {

    return <FormikAutoCompleteDropdownWithFormBasedAddNew item_list={adminBeneficiaryAutoCompleteList}
                                                          success_message="Beneficiary added"
                                                          form_title="Add Beneficiary"
                                                          name={name}
                                                          validationSchema={validationSchema}
                                                          initial_values={{}}
                                                          label={label}
                                                          getSavedObjectId={(value) => value.company.id}
                                                          renderForm={ ({formik_props}) =>
                                                                       <AdminBeneficiaryForm formik_props={formik_props} />
                                                                     }
                                                          formik_props={formik_props}
                                                          {...props} />
}
