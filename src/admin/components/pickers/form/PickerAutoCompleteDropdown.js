import React, {useEffect} from 'react'
import { FormikAutoCompleteDropdownWithFormBasedAddNew } from 'components/form/AutoCompleteDropdownWithFormBasedAddNew'
import AdminPickerForm from './AdminPickerForm'
import { adminPickerAutoCompleteList } from 'admin/components/users/actions/admin_user'
import {showSuccess, showError} from 'actions/Error'
import * as Yup from 'yup'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminPickerForm'
import { useDispatch } from 'react-redux'
import AdminUserForm from 'admin/components/users/form/AdminUserForm'

export function FormikPickerAutoCompleteDropdown({name, label, formik_props, ...props}) {

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(adminPickerAutoCompleteList.updateListFilter({role:'picker'}))
    }, [])

    return <FormikAutoCompleteDropdownWithFormBasedAddNew item_list={adminPickerAutoCompleteList}
                                                          success_message="Picker added"
                                                          form_title="Add Picker"
                                                          name={name}
                                                          validationSchema={validationSchema}
                                                          initial_values={Object.assign({}, {employee:{roles: []}})}
                                                          label={label}
                                                          renderForm={ ({formik_props}) =>
                                                                       <AdminUserForm formik_props={formik_props} />
                                                                     }
                                                          formik_props={formik_props}
                                                          {...props} />
}
