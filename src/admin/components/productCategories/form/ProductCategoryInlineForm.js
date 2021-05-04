/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { useDispatch } from 'react-redux'
import { FormikInputField } from 'components/form/InputField'
import { Button } from 'components/layout/Button'
import { Formik, Form, FieldArray, Field } from 'formik'
import FormCard from 'components/layout/FormCard'
import {showSuccess, showError} from 'actions/Error'
import { adminProductCategoryList } from '../actions/admin_product_category'
import { handleSubmitResult } from 'actions/form'
import CardParagraphHeading from 'components/layout/CardParagraphHeading'
import { ProductCategorySelectField } from './ProductCategorySelectField'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    'name': Yup.string().required("Required"),
})

const ProductCategoryInlineForm = ({product_category, parent_product_category, onSaved, onCancel}) => {

    const dispatch = useDispatch()
    const onSave = (values, formik_funcs) => {
        values.parent = values.product_category;
        
        console.log("OnSave : ", values);
        console.log(formik_funcs);
        const on_ok = function(json) {
            dispatch(adminProductCategoryList.invalidateList())
            showSuccess("Saved", "Product category saved")
            onSaved(json)
        }
        if ( ! values.parent && parent_product_category ) {
            values.parent = get(parent_product_category, "id")
        }
        if ( product_category && product_category.id ) {
            values.id = product_category.id
            return dispatch(adminProductCategoryList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminProductCategoryList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    const initial_values = Object.assign({}, product_category)
    console.log('initial_values', initial_values);

    initial_values.product_category = '';
    console.log('initial_values_product_category', initial_values);

    return (
        <Formik
          initialValues={initial_values}
          onSubmit={onSave}
          enableReinitialize={true}
          validationSchema={validationSchema}
        >
          {formik_props => {
              const { values } = formik_props
              console.log('formik_props', formik_props)
              console.log('values', values)
              return (
                  <Form>
                    <FormCard onCancel={onCancel} elevation={0} variant="outlined">
                      <CardParagraphHeading>
                        { parent_product_category &&
                          <span>New Child of {parent_product_category.name}</span>
                        }
                        { !parent_product_category &&
                          <span>New Top Level Product Category</span>
                        }
                      </CardParagraphHeading>

                      <ProductCategorySelectField name="product_category"
                                          can_add={true}
                                          can_edit={true}
                                          formik_props={formik_props}
                                          empty_label="Select a category"
                
                      />

                      <FormikInputField name="name"
                                        type="text"
                                        label="Name"
                                        formik_props={formik_props}
                      />
                    </FormCard>
                  </Form>
              )}
          }
        </Formik>
    )

}

export default ProductCategoryInlineForm
