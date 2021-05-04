/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminVehicleList } from './actions/admin_vehicle'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { validationSchema } from './form/AdminVehicleForm'
import AdminVehicleForm from './form/AdminVehicleForm'

class AdminVehicle extends Component {

    componentDidMount() {
        const { dispatch, vehicle_id } = this.props
        dispatch(adminVehicleList.ensureObjectLoaded(vehicle_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, vehicle_id } = this.props
        dispatch(adminVehicleList.ensureObjectLoaded(vehicle_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, vehicle_id } = this.props

        const on_ok = function(json) {
            dispatch(adminVehicleList.invalidateList())
            showSuccess("Saved", "Vehicle saved")

            if ( ! vehicle_id ) {
                history.push(`/admin/vehicle/${json.id}`)
            }
        }
        if ( vehicle_id ) {
            values.id = vehicle_id
            return dispatch(adminVehicleList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminVehicleList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    render() {
        const { initial_values, is_loading, is_busy, vehicle, vehicle_id } = this.props
        const that = this
        const title = `${get(vehicle, ["name"], 'New vehicle')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'vehicles',
                                                  label: 'Vehicles',
                                                  url: '/admin/vehicles'},

                                                 {name: 'vehicle',
                                                  label: get(vehicle, ["name"], 'New vehicle'),
                                                  url: `/admin/vehicle/${vehicle_id}`
                                                 }
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title}
                                   initial_values={initial_values}
                                   validationSchema={validationSchema}
                                   onSave={this.onSave}>

              {
                  ({formik_props}) => <AdminVehicleForm formik_props={formik_props} />
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const vehicle_id = get(props, ["match", "params", "vehicle_id"], null)
    const vehicle = adminVehicleList.getObject(vehicle_id)

    return {
        vehicle_id,
        vehicle,
        is_loading: adminVehicleList.isLoading() || (vehicle_id && !get(vehicle, "id")),
        is_busy: adminVehicleList.getIsSavingObject(),
        initial_values: vehicle
    }
}

export default connect(mapStateToProps)(AdminVehicle)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
