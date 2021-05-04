import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clone, get } from 'lodash'
import { adminWarehouseProductList } from './actions/admin_warehouse_product'
import { Formik, Form, FieldArray, Field } from 'formik'
import { FormikProductAutoCompleteDropdown } from 'admin/components/products/form/ProductAutoCompleteDropdown'
import { FormikWarehouseAutoCompleteDropdown } from 'admin/components/warehouses/form/WarehouseAutoCompleteDropdown'
import { FormikDateTimePicker } from 'components/form/DatetimePicker'
import {showSuccess, showError} from 'actions/Error'
import FormCard from 'components/layout/FormCard'
import { handleSubmitResult } from 'actions/form'
import { FormikInputField } from 'components/form/InputField'
import { FormikTextareaField } from 'components/form/TextareaField'
import { CardHeader } from 'components/layout/CardHeader'
import * as Yup from 'yup'

const validationSchemaForNewInstance = Yup.object().shape({
    warehouse: Yup.string().required("Required"),
    product: Yup.string().required("Required"),
    quantity: Yup.number().required("Required"),
    reason_for_change: Yup.string().required("Required")
})

const validationSchemaForExistingInstance = Yup.object().shape({
    quantity: Yup.number().required("Required"),
    reason_for_change: Yup.string().required("Required")
})

export const AdminWarehouseProductForm = ({onCancel, onSaved, warehouse_product}) => {

    const dispatch = useDispatch()
    const initial_values = warehouse_product || {}
    const is_new = ! get(warehouse_product, "id")

    const onSave = (values, formik_funcs) => {

        const on_ok = function(json) {
            dispatch(adminWarehouseProductList.invalidateList())
            showSuccess("Saved", "Product updated in warehouse")
            onSaved()
        }

        if ( warehouse_product ) {
            values.id = warehouse_product.id
            return dispatch(adminWarehouseProductList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminWarehouseProductList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    const renderFormFields = (formik_props) => {
        return (
            <div>

              { ! is_new &&
                <>
                  <div>
                    Warehouse: {warehouse_product.warehouse_name}
                  </div>
                  <div>
                    Product: {warehouse_product.product_name}
                  </div>
                </>
              }
              { is_new &&
                <>
                  <FormikWarehouseAutoCompleteDropdown name="warehouse"
                                                       label="Warehouse"
                                                       formik_props={formik_props} />
                  
                  <FormikProductAutoCompleteDropdown name="product"
                                                     label="Product"
                                                     formik_props={formik_props} />
                </>
              }

              <FormikInputField name="quantity"
                                label="Quantity"
                                formik_props={formik_props} />

              <FormikDateTimePicker label='Expiry date (optional)'
                                    name='expiry_date'
                                    formik_props={formik_props}
                                    include_time={false} />
              
              <FormikInputField name="total_weight_kg"
                                label="Weight (kg). Leave blank to auto calculate"
                                formik_props={formik_props} />

              <FormikTextareaField name="reason_for_change"
                                   label="Please give a reason for this manual change to inventory"
                                   formik_props={formik_props} />
              
            </div>
        )
    }

    return (
        <div>
          <Formik initialValues={initial_values}
                  onSubmit={onSave}
                  enableReinitialize={true}
                  validationSchema={is_new ? validationSchemaForNewInstance : validationSchemaForExistingInstance}
          >
            {formik_props => {
                const { values } = formik_props
                return (
                    <Form>
                      <FormCard onCancel={onCancel}>
                        { renderFormFields(formik_props) }
                      </FormCard>
                    </Form>
                )}
            }
          </Formik>
        </div>
    )

}
