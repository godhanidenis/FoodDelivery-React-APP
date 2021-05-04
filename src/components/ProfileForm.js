/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { withRouter } from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import { Formik, Form, FieldArray, Field } from 'formik'
import { userList } from 'actions/user'
import { FormikInputField } from './form/InputField'
import { FormikDropdownField } from './form/Dropdown'
import BusyMask from './BusyMask'
import { countryList } from 'actions/country'
import { cityList } from 'actions/city'
import { Row } from './layout/Row'
import { Col } from './layout/Col'
import { Button } from './layout/Button'
import { default_theme as theme } from 'emotion/theme'
import * as Yup from 'yup'
import FieldInfoText from './layout/FieldInfoText'
import { FormLabelValue } from './form/FormLabelValue'
import { BlueButton } from './layout/BlueButton'
import { WhiteButton } from './layout/WhiteButton'
import { ButtonBar } from './layout/ButtonBar'
import { Separator } from './layout/Separator'
import { FormikGeneralFormErrors } from './form/GeneralFormErrors'
import { Trans, Translation } from 'react-i18next'
import { handleSubmitResult } from 'actions/form'

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email must be valid').required("Email is required").nullable()
})

class ProfileForm extends Component {

    render() {
        const { user, initial_values, onSave, onCancel, error } = this.props

        const that = this
        const left_width = 3
        const right_width = 6
        
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
                      <Translation>{ (t) => (
                          <Form>
                            <FormikGeneralFormErrors render={(msg) => <Row><Col>{msg}</Col></Row>} />
                            <FormikInputField
                              name="first_name"
                              type="text"
                              placeholder={t("First name")}
                            />
                            <FormikInputField
                              name="last_name"
                              type="text"
                              placeholder={t("Surname")}
                            />


                            <FormikInputField
                              name="email"
                              type="text"
                              placeholder={t("Contact email")}
                            />
                            
                            <FormikInputField
                              name="phone_number"
                              type="text"
                              placeholder={t("Contact phone")}
                            />

                            <FormikInputField
                              name="password"
                              type="password"
                              placeholder={t("Password (leave blank to keep your existing password")}
                            />
                            <Separator variant="h50"/>

                            
                            <ButtonBar>
                              <BlueButton type="submit"><Trans>Save</Trans></BlueButton>
                              <WhiteButton onClick={onCancel}><Trans>Cancel</Trans></WhiteButton>
                            </ButtonBar>
                          </Form>
                      )}</Translation>
                  )}
              }
            </Formik>
        )
    }
}

function mapStateToProps(state, props) {
    const { onSave, onCancel, user, renderAdditionalFields } = props

    const initial_values = Object.assign({email: ''}, user)
    return {
        onSave,
        onCancel,
        initial_values: initial_values
    }
}
export default withRouter(connect(mapStateToProps)(ProfileForm))
