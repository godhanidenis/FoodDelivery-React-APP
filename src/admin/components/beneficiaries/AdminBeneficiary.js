/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminBeneficiaryList } from './actions/admin_beneficiary'
import { Formik, Form, FieldArray, Field } from 'formik'
import Loading from 'components/Loading'
import { FormikDropdownField } from 'components/form/Dropdown'
import { FormikBeneficiaryAutoCompleteDropdown } from './form/BeneficiaryAutoCompleteDropdown'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { AdminBeneficiaryStateHistory } from './AdminBeneficiaryStateHistory'
import { showSuccess, showError } from 'actions/Error'
import { Select } from 'formik-material-ui'
import { adminBeneficiaryStates } from 'admin/actions/admin_dropdown_options'
import AdminBeneficiaryForm from './form/AdminBeneficiaryForm'
import { validationSchema } from './form/AdminBeneficiaryForm'
import { handleSubmitResult } from 'actions/form'

class AdminBeneficiary extends Component {

    componentDidMount() {
        const { dispatch, beneficiary_id } = this.props
        dispatch(adminBeneficiaryList.ensureObjectLoaded(beneficiary_id))
        dispatch(adminBeneficiaryStates.fetchListIfNeeded())
    }

    componentDidUpdate(prev_props) {
        const { dispatch, beneficiary_id } = this.props
        dispatch(adminBeneficiaryList.ensureObjectLoaded(beneficiary_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, beneficiary_id } = this.props

        const on_ok = function(json) {
            dispatch(adminBeneficiaryList.invalidateList())
            showSuccess("Saved", "Beneficiary saved")

            if (! beneficiary_id) {
                history.push(`/admin/beneficiary/${json.id}`)
            }
        }
        if ( beneficiary_id ) {
            values.id = beneficiary_id
            return dispatch(adminBeneficiaryList.saveObject(values)).then((res) => handleSubmitResult({ res, formik_funcs, on_ok }))
        } else {
            return dispatch(adminBeneficiaryList.saveNewObject(values)).then((res) => handleSubmitResult({ res, formik_funcs, on_ok }))
        }
    }

    getCellValue = (header_key, item, index) => {
        switch (header_key) {
            default:
                return undefined
        }
    }

    render() {
        const { initial_values, is_loading, is_busy, beneficiary, beneficiary_id } = this.props
        const that = this
        const title = `${get(beneficiary, ["company", "name"], 'New beneficiary')}`

        return (

            <AdminCommonFormLayout breadcrumbs={[{ name: 'admin_home' },
                                                 {
                                                     name: 'beneficiaries',
                                                     label: 'Beneficiaries',
                                                     url: '/admin/beneficiaries'
                                                 },
                                                 {
                                                     name: 'beneficiary',
                                                     label: get(beneficiary, ["company", "name"], 'New Beneficiary'),
                                                     url: `/admin/beneficiary/${beneficiary_id}`
                                                 }
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title}
                                   initial_values={initial_values}
                                   validationSchema={validationSchema}
                                   onSave={this.onSave}>

              {
                  ({formik_props}) =>
                      <>
                        <AdminBeneficiaryForm formik_props={formik_props} />
                        <AdminBeneficiaryStateHistory beneficiary_id={beneficiary_id} />
                      </>
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const beneficiary_id = get(props, ["match", "params", "beneficiary_id"], null)
    const beneficiary = adminBeneficiaryList.getObject(beneficiary_id)

    return {
        beneficiary_id,
        beneficiary,
        is_loading: adminBeneficiaryList.isLoading() || (beneficiary_id && !get(beneficiary, "id")),
        is_busy: adminBeneficiaryList.getIsSavingObject(),
        initial_values: beneficiary,
        beneficiary_state_options: adminBeneficiaryStates.getAsOptions()
    }
}

export default connect(mapStateToProps)(AdminBeneficiary)
