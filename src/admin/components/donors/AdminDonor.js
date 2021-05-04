/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminDonorList } from './actions/admin_donor'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import { AdminDonorStateHistory } from './AdminDonorStateHistory'
import { FormikDonorAutoCompleteDropdown } from 'admin/components/donors/form/DonorAutoCompleteDropdown'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import AdminDonorForm from './form/AdminDonorForm'
import { validationSchema } from './form/AdminDonorForm'

class AdminDonor extends Component {

    componentDidMount() {
        const { dispatch, donor_id } = this.props
        dispatch(adminDonorList.ensureObjectLoaded(donor_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, donor_id } = this.props
        dispatch(adminDonorList.ensureObjectLoaded(donor_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, dispatch, donor_id } = this.props

        const on_ok = function(json) {
            dispatch(adminDonorList.invalidateList())
            showSuccess("Saved", "Donor saved")

            if ( ! donor_id ) {
                history.push(`/admin/donor/${json.id}`)
            }
        }
        if ( donor_id ) {
            values.id = donor_id
            return dispatch(adminDonorList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminDonorList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    render() {
        const { initial_values, is_loading, is_busy, donor, donor_id } = this.props
        const that = this
        const title = `${get(donor, ["company", "name"], 'New donor')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'donors',
                                                  label: 'Donors',
                                                  url: '/admin/donors'},

                                                 {name: 'donor',
                                                  label: get(donor, ["company", "name"], 'New donor'),
                                                  url: `/admin/donor/${donor_id}`
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
                        <AdminDonorForm formik_props={formik_props} />
                        <AdminDonorStateHistory donor_id={donor_id} />
                      </>
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const donor_id = get(props, ["match", "params", "donor_id"], null)
    const donor = adminDonorList.getObject(donor_id)

    return {
        donor_id,
        donor,
        is_loading: adminDonorList.isLoading() || (donor_id && !get(donor, "id")),
        is_busy: adminDonorList.getIsSavingObject(),
        initial_values: donor
    }
}

export default connect(mapStateToProps)(AdminDonor)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
