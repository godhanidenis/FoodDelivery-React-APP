import React from 'react'
import { adminDriverAutoCompleteList } from '../actions/admin_driver'
import { FormikAutoCompleteDropdownWithFormBasedAddNew } from 'components/form/AutoCompleteDropdownWithFormBasedAddNew'
import { FormikAutoCompleteDropdown } from 'components/form/AutoCompleteDropdown'
import AdminDriverForm from './AdminDriverForm'
import { adminDriverList } from '../actions/admin_driver'
import {showSuccess, showError} from 'actions/Error'
import * as Yup from 'yup'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminDriverForm'
import { useDispatch } from 'react-redux'

export function FormikDriverAutoCompleteDropdown({name, label, formik_props, ...props}) {

    return <FormikAutoCompleteDropdown item_list={adminDriverAutoCompleteList}
                                       name={name}
                                       label={label}
                                       formik_props={formik_props}
    />
    
    // Bring this back when we support drivers on the fly, at the moment because they're user you have to create a user first.
    return <FormikAutoCompleteDropdownWithFormBasedAddNew item_list={adminDriverAutoCompleteList}
                                                          success_message="Driver added"
                                                          form_title="Add Driver"
                                                          name={name}
                                                          validationSchema={validationSchema}
                                                          initial_values={{}}
                                                          label={label}
                                                          renderForm={ ({formik_props}) =>
                                                                       <AdminDriverForm formik_props={formik_props} />
                                                                     }
                                                          formik_props={formik_props}
                                                          {...props} />

}
