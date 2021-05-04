import React from 'react'
import { get, union } from 'lodash'
import {showSuccess, showError} from '../../../../actions/Error'
import { FormikAddressDropdownWithFormBasedAddNew } from '../../../../admin/components/addresses/form/AddressDropdown'
import { handleSubmitResult } from '../../../../actions/form'
import { validationSchema } from './AdminBeneficiaryForm'
import { adminBeneficiaryList, adminBeneficiaryAddressManager } from '../actions/admin_beneficiary'
import { useDispatch } from 'react-redux'

export function FormikBeneficiaryAddressDropdownWithFormBasedAddNew({beneficiary, name, label, options, formik_props}) {

    const dispatch = useDispatch()

    const onSave = (values, formik_funcs, onAdded) => {
        const on_ok = function(json) {
            dispatch(adminBeneficiaryList.invalidateObject(beneficiary.id))
            dispatch(adminBeneficiaryList.ensureObjectLoaded(beneficiary.id))
            showSuccess("Saved", "Address added to beneficiary")
            onAdded(json.id)
        }
        return dispatch(adminBeneficiaryAddressManager.addAddress({beneficiary_id: beneficiary.id, values})).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
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
