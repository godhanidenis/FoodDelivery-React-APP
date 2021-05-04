/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { FormikInputField } from '../../components/form/InputField'
import { useDispatch } from 'react-redux'
import { Button } from '../../components/layout/Button'
import { Formik, Form, FieldArray, Field } from 'formik'
import FormCard from 'components/layout/FormCard'
import {showSuccess, showError} from '../../actions/Error'
import { adminProductCategoryList } from './actions/admin_product_category'
import { handleSubmitResult } from '../../actions/form'
import CardParagraphHeading from '../../components/layout/CardParagraphHeading'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    'name': Yup.string().required("Required"),
})

const MultiProductSelectionInlineForm = ({product_category, parent_product_category, onSaved, onCancel}) => {

    const dispatch = useDispatch()
    const onSave = (values, formik_funcs) => {
        const on_ok = function(json) {
            dispatch(adminProductCategoryList.invalidateList())
            showSuccess("Saved", "Product category saved")
            onSaved(json)
        }
        values.parent = get(parent_product_category, "id")
        if ( product_category && product_category.id ) {
            values.id = product_category.id
            return dispatch(adminProductCategoryList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminProductCategoryList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    const initial_values = Object.assign({}, product_category)
    
    return (
        <Formik
          initialValues={initial_values}
          onSubmit={onSave}
          enableReinitialize={true}
          validationSchema={validationSchema}
        >
          {formik_props => {
              const { values } = formik_props
              return (
                  <Form>
                    <FormCard onCancel={onCancel}>
                      <CardParagraphHeading>
                        { parent_product_category && 
                          <span>New child of {parent_product_category.name}</span>
                        }
                        { !parent_product_category && 
                          <span>New top level product category</span>
                        }
                      </CardParagraphHeading>
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

export default MultiProductSelectionInlineForm
