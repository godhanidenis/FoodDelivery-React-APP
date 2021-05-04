import React from 'react'
import { useDispatch } from 'react-redux'
import {showSuccess, showError} from '../../actions/Error'
import { handleSubmitResult } from '../../actions/form'
import CommonInlineAddNewFormLayout from '../layout/CommonInlineAddNewFormLayout'
import { FormikAutoCompleteDropdown } from './AutoCompleteDropdown'

export function FormikAutoCompleteDropdownWithFormBasedAddNew({item_list, success_message, form_title, validationSchema,
                                                               label, name, initial_values,
                                                               onChange, formik_props, renderForm, getSavedObjectId}) {
    const dispatch = useDispatch()
    
    const onSave = (values, formik_funcs, onAdded) => {
        const on_ok = function(json) {
            dispatch(item_list.invalidateList())
            showSuccess("Saved", success_message || "New item Saved")
            const id = getSavedObjectId ? getSavedObjectId(json) : json.id
            onAdded(id)
        }
        return dispatch(item_list.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }
    
    const renderAddNew = ({onAdded, onAddNewCancelled}) => {
        return (
            <CommonInlineAddNewFormLayout
              is_loading={false}
              title={form_title || "Add"}
              initial_values={initial_values}
              validationSchema={validationSchema}
              onCancel={onAddNewCancelled}
              onSave={(values, formik_funcs) => onSave(values, formik_funcs, onAdded)}
            >
              {
                  ({formik_props}) => renderForm({formik_props})
              }
            </CommonInlineAddNewFormLayout>
        )
    }
    
    return <FormikAutoCompleteDropdown item_list={item_list}
                                       name={name}
                                       label={label}
                                       renderAddNew={renderAddNew}
                                       formik_props={formik_props}
                                       onChange={onChange}
           />
}


