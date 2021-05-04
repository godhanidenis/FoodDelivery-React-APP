/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminProductCategoryList } from './actions/admin_product_category'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { FormikInputField } from 'components/form/InputField'

const yup_shape = {
    'name': Yup.string().required("Required"),
}

const validationSchema = Yup.object().shape(yup_shape)

class AdminProductCategory extends Component {

    componentDidMount() {
        const { dispatch, product_category_id } = this.props
        dispatch(adminProductCategoryList.ensureObjectLoaded(product_category_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, product_category_id } = this.props
        dispatch(adminProductCategoryList.ensureObjectLoaded(product_category_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, product_category_id } = this.props

        const on_ok = function(json) {
            dispatch(adminProductCategoryList.invalidateList())
            showSuccess("Saved", "ProductCategory saved")

            if ( ! product_category_id ) {
                history.push(`/admin/product_category/${json.id}`)
            }
        }
        if ( product_category_id ) {
            values.id = product_category_id
            return dispatch(adminProductCategoryList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminProductCategoryList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
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

            </div>
        )
    }

    render() {
        const { initial_values, is_loading, is_busy, product_category, product_category_id } = this.props
        const that = this
        const title = `${get(product_category, ["company", "name"], 'New product category')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'product_categoriess',
                                                  label: 'ProductCategoriess',
                                                  url: '/admin/product_categories'},

                                                 {name: 'product_category',
                                                  label: get(product_category, ["company", "name"], 'New product category'),
                                                  url: `/admin/product_category/${product_category_id}`
                                                 }
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title}
                                   initial_values={initial_values}
                                   validationSchema={validationSchema}
                                   onSave={this.onSave}>

              {
                  ({formik_props}) => that.renderForm(formik_props)
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const product_category_id = get(props, ["match", "params", "product_category_id"], null)
    const product_category = adminProductCategoryList.getObject(product_category_id)

    return {
        product_category_id,
        product_category,
        is_loading: adminProductCategoryList.isLoading() || (product_category_id && !get(product_category, "id")),
        is_busy: adminProductCategoryList.getIsSavingObject(),
        initial_values: product_category
    }
}

export default connect(mapStateToProps)(AdminProductCategory)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
