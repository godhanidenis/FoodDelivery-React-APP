/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { FormikInputField } from 'components/form/InputField'
import { ProductCategorySelectField } from 'admin/components/productCategories/form/ProductCategorySelectField'

export const validationSchema = Yup.object().shape({
    'name': Yup.string().required("Required"),
})

class AdminProductForm extends Component {

    render() {
        const { formik_props } = this.props
        return (
            <div>
              <ProductCategorySelectField name="product_category"
                                          can_add={true}
                                          can_edit={true}
                                          formik_props={formik_props}
                                          empty_label="Select a category"
                
              />
              
              <FormikInputField name="name"
                                label="Name"
                                formik_props={formik_props}
              />

              <FormikInputField name="barcode"
                                label="Barcode"
                                formik_props={formik_props}
              />

              <FormikInputField name="weight_kg"
                                label="Weight (kg)"
                                formik_props={formik_props}
              />

              <FormikInputField name="description"
                                label="Description"
                                formik_props={formik_props}
              />


            </div>
        )
    }

}

export default AdminProductForm
