import React from 'react'
import { adminWarehouseAutoCompleteList } from '../actions/admin_warehouse'
import { FormikAutoCompleteDropdownWithFormBasedAddNew } from 'components/form/AutoCompleteDropdownWithFormBasedAddNew'
import AdminWarehouseForm from './AdminWarehouseForm'
import { adminWarehouseList } from '../actions/admin_warehouse'
import {showSuccess, showError} from 'actions/Error'
import * as Yup from 'yup'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminWarehouseForm'
import { useDispatch } from 'react-redux'

export function FormikWarehouseAutoCompleteDropdown({name, label, formik_props, ...props}) {

    return <FormikAutoCompleteDropdownWithFormBasedAddNew item_list={adminWarehouseAutoCompleteList}
                                                          success_message="Warehouse added"
                                                          form_title="Add Warehouse"
                                                          name={name}
                                                          validationSchema={validationSchema}
                                                          initial_values={{}}
                                                          label={label}
                                                          renderForm={ ({formik_props}) =>
                                                                       <AdminWarehouseForm formik_props={formik_props} />
                                                                     }
                                                          formik_props={formik_props}
                                                          {...props} />
}
