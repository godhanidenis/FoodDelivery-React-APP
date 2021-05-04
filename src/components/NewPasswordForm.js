/** @jsx jsx */
import { Component } from 'react';
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { FormikInputField } from './form/InputField'
import { Button } from './layout/Button'
import { Formik, Form, FieldArray, Field } from 'formik'
import FormCard from './layout/FormCard'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    'password': Yup.string().required("Required"),
    'confirm_password': Yup.string().required("Required")
})

class NewPasswordForm extends Component {

    render() {
        const { onSave } = this.props

        return (
            <Formik
              initialValues={{}}
              onSubmit={onSave}
              enableReinitialize={true}
              validationSchema={validationSchema}
            >
              {formik_props => {
                  const { values } = formik_props
                  return (
                      <Form>
                        <FormCard>
                          <FormikInputField name="password"
                                            type="password"
                                            label="Password"
                                            formik_props={formik_props}
                          />
                          <FormikInputField name="confirm_password"
                                            type="password"
                                            label="Confirm password"
                                            formik_props={formik_props}
                          />
                        </FormCard>
                      </Form>
                  )
              }}
            </Formik>
        )
    }
}
export default NewPasswordForm

