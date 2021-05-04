/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminDriverList } from './actions/admin_driver'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { FormikVehicleAutoCompleteDropdown } from 'admin/components/vehicles/form/VehicleAutoCompleteDropdown'
import { FormikInputField } from 'components/form/InputField'
import AdminDriverForm, {validationSchema} from './form/AdminDriverForm'

class AdminDriver extends Component {

    componentDidMount() {
        const { dispatch, driver_id } = this.props
        dispatch(adminDriverList.ensureObjectLoaded(driver_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, driver_id } = this.props
        dispatch(adminDriverList.ensureObjectLoaded(driver_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, driver_id } = this.props

        const on_ok = function(json) {
            dispatch(adminDriverList.invalidateList())
            showSuccess("Saved", "Driver saved")

            if ( ! driver_id ) {
                history.push(`/admin/driver/${json.id}`)
            }
        }
        if ( driver_id ) {
            values.id = driver_id
            return dispatch(adminDriverList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminDriverList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    render() {
        const { initial_values, is_loading, is_busy, driver, driver_id } = this.props
        const that = this
        const title = `${get(driver, ["user", "first_name"], 'New driver')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'drivers',
                                                  label: 'Drivers',
                                                  url: '/admin/drivers'},

                                                 {name: 'driver',
                                                  label: get(driver, ["user", "first_name"], 'New driver'),
                                                  url: `/admin/driver/${driver_id}`
                                                 }
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title}
                                   initial_values={initial_values}
                                   validationSchema={validationSchema}
                                   onSave={this.onSave}>

              {
                  ({formik_props}) => <AdminDriverForm formik_props={formik_props} />
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const driver_id = get(props, ["match", "params", "driver_id"], null)
    const driver = adminDriverList.getObject(driver_id)

    return {
        driver_id,
        driver,
        is_loading: adminDriverList.isLoading() || (driver_id && !get(driver, "id")),
        is_busy: adminDriverList.getIsSavingObject(),
        initial_values: driver
    }
}

export default connect(mapStateToProps)(AdminDriver)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
