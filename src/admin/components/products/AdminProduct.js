/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminProductList } from './actions/admin_product'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { FormikInputField } from 'components/form/InputField'
import AdminProductForm from './form/AdminProductForm'
import { validationSchema } from './form/AdminProductForm'

class AdminProduct extends Component {

    componentDidMount() {
        const { dispatch, product_id } = this.props
        dispatch(adminProductList.ensureObjectLoaded(product_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, product_id } = this.props
        dispatch(adminProductList.ensureObjectLoaded(product_id))
    }

    onSave = (values, formik_funcs) => {
        console.log(values);
        const { history, onSubmit, dispatch, product_id } = this.props

        const on_ok = function(json) {
            dispatch(adminProductList.invalidateList())
            showSuccess("Saved", "Product saved")

            if ( ! product_id ) {
                history.push(`/admin/product/${json.id}`)
            }
        }
        if ( product_id ) {
            values.id = product_id
            return dispatch(adminProductList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminProductList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    render() {
        const { initial_values, is_loading, is_busy, product, product_id } = this.props
        console.log("Product Initial value", initial_values)
        const that = this
        const title = `${get(product, ["company", "name"], 'New product')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'products',
                                                  label: 'Products',
                                                  url: '/admin/products'},

                                                 {name: 'product',
                                                  label: get(product, ["company", "name"], 'New product'),
                                                  url: `/admin/product/${product_id}`
                                                 }
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title}
                                   initial_values={initial_values}
                                   validationSchema={validationSchema}
                                   onSave={this.onSave}>

              {
                  ({formik_props}) => <AdminProductForm formik_props={formik_props} />
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const product_id = get(props, ["match", "params", "product_id"], null)
    const product = adminProductList.getObject(product_id)

    return {
        product_id,
        product,
        is_loading: adminProductList.isLoading() || (product_id && !get(product, "id")),
        is_busy: adminProductList.getIsSavingObject(),
        initial_values: product
    }
}

export default connect(mapStateToProps)(AdminProduct)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
