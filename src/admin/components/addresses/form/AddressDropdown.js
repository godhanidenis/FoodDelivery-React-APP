import React from 'react'
import { get, union } from 'lodash'
import { adminDonorAutoCompleteList } from 'admin/components/donors/actions/admin_donor'
import { FormikAutoCompleteDropdownWithFormBasedAddNew } from 'components/form/AutoCompleteDropdownWithFormBasedAddNew'
import { FormikDropdownField } from 'components/form/Dropdown'
import CommonInlineAddNewFormLayout from 'components/layout/CommonInlineAddNewFormLayout'
import {showSuccess, showError} from 'actions/Error'
import AdminAddressForm from './AdminAddressForm'
import * as Yup from 'yup'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminAddressForm'
import { useDispatch } from 'react-redux'

const ADD_NEW_VALUE = '__add_new__'

export function FormikAddressDropdownWithFormBasedAddNew({name, label, options, onSave, formik_props}) {

    options = union(options, [{value: ADD_NEW_VALUE, label: '+ New Address'}])
    const [adding_new, setAddNew] = React.useState(false)

    const localOnChange = (value) => {
        if ( value === ADD_NEW_VALUE ) {
            setAddNew(true)
        } else {
            formik_props.setFieldValue(name, value)
        }
    }

    const localOnSave = (values, formik_funcs) => {
        onSave(values, formik_funcs, onAdded)
    }

    const onAdded = (value) => {
        localOnChange(value)
        setAddNew(false)
    }

    const onAddNewCancelled = () => {
        setAddNew(false)
        formik_props.setFieldValue(name, null)
    }

    const renderAddNew = () => {
        return (
            <CommonInlineAddNewFormLayout
              is_loading={false}
              title={"Add Address"}
              initial_values={{}}
              validationSchema={validationSchema}
              onCancel={onAddNewCancelled}
              onSave={localOnSave}
            >
              {
                  ({formik_props}) => <AdminAddressForm formik_props={formik_props} />
              }
            </CommonInlineAddNewFormLayout>
        )
    }

    return (
        <>

          { adding_new && renderAddNew() }
          <FormikDropdownField name={name}
                               label={label}
                               options={options}
                               on_change={localOnChange}
                               formik_props={formik_props} />
        </>
    )
}
