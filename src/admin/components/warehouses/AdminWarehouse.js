/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminWarehouseList } from './actions/admin_warehouse'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { FormikInputField } from 'components/form/InputField'
import AdminWarehouseForm from './form/AdminWarehouseForm'
import { validationSchema } from './form/AdminWarehouseForm'

class AdminWarehouse extends Component {

    componentDidMount() {
        const { dispatch, warehouse_id } = this.props
        dispatch(adminWarehouseList.ensureObjectLoaded(warehouse_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, warehouse_id } = this.props
        dispatch(adminWarehouseList.ensureObjectLoaded(warehouse_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, warehouse_id } = this.props

        const on_ok = function(json) {
            dispatch(adminWarehouseList.invalidateList())
            showSuccess("Saved", "Warehouse saved")

            if ( ! warehouse_id ) {
                history.push(`/admin/warehouse/${json.id}`)
            }
        }
        if ( warehouse_id ) {
            values.id = warehouse_id
            return dispatch(adminWarehouseList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminWarehouseList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    renderForm(formik_props) {
        return (
            <div>

              <FormikInputField name="name"
                                label="Name"
                                formik_props={formik_props}
              />
              <AdminWarehouseForm formik_props={formik_props}
                                      renderExtraFieldsPosition1={this.renderExtraFields}
              />

            </div>
        )
    }

    render() {
        const { initial_values, is_loading, is_busy, warehouse, warehouse_id } = this.props
        const that = this
        const title = `${get(warehouse, ["company", "name"], 'New warehouse')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'warehouses',
                                                  label: 'Warehouses',
                                                  url: '/admin/warehouses'},

                                                 {name: 'warehouse',
                                                  label: get(warehouse, ["company", "name"], 'New warehouse'),
                                                  url: `/admin/warehouse/${warehouse_id}`
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
                        <AdminWarehouseForm formik_props={formik_props} />
                      </>
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const warehouse_id = get(props, ["match", "params", "warehouse_id"], null)
    const warehouse = adminWarehouseList.getObject(warehouse_id)

    return {
        warehouse_id,
        warehouse,
        is_loading: adminWarehouseList.isLoading() || (warehouse_id && !get(warehouse, "id")),
        is_busy: adminWarehouseList.getIsSavingObject(),
        initial_values: warehouse
    }
}

export default connect(mapStateToProps)(AdminWarehouse)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
