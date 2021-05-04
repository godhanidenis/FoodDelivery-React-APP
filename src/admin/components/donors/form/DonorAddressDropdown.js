import React from 'react'
import { get, union } from 'lodash'
import {showSuccess, showError} from 'actions/Error'
import { FormikAddressDropdownWithFormBasedAddNew } from 'admin/components/addresses/form/AddressDropdown'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminDonorForm'
import { adminDonorList, adminDonorAddressManager } from '../actions/admin_donor'
import { useDispatch } from 'react-redux'

export function FormikDonorAddressDropdownWithFormBasedAddNew({donor, name, label, options, formik_props}) {

    const dispatch = useDispatch()

    const onSave = (values, formik_funcs, onAdded) => {

        const on_ok = function(json) {
            dispatch(adminDonorList.invalidateObject(donor.id))
            dispatch(adminDonorList.ensureObjectLoaded(donor.id))
            showSuccess("Saved", "Address added to Donor")
            onAdded(json.id)
        }
        return dispatch(adminDonorAddressManager.addAddress({donor_id: donor.id, values})).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }

    return (
        <FormikAddressDropdownWithFormBasedAddNew name={name}
                                                  label={label}
                                                  options={options}
                                                  onSave={onSave}
                                                  formik_props={formik_props}
        />
    )

}
