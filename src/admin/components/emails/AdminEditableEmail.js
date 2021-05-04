/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { head, get, map, keys, split, size } from 'lodash'
import { adminEditableEmailList } from './actions/admin_editable_email'
import { LanguageFlag } from '../../components/LanguageFlag'
import { Separator } from '../../components/layout/Separator'
import { Formik, Form, FieldArray, Field } from 'formik'
import Loading from '../../components/Loading'
import { FormikTextarea } from '../../components/form/TextareaField'
import { FormikInputField } from '../../components/form/InputField'
import AdminMainLayout from '../layout/AdminMainLayout'
import BusyMask from '../../components/BusyMask'
import Timestamp from '../../components/Timestamp'
import Card from '../../components/layout/Card'
import { Col, Row, Container, Navbar, Nav } from 'react-bootstrap'
import { Form as BootstrapForm } from 'react-bootstrap'
import * as Yup from 'yup'
import {showSuccess, showError} from '../../actions/Error'
import { BlueButton } from '../../components/layout/BlueButton'
import CardInfoText from '../../components/layout/CardInfoText'
import { handleSubmitResult } from '../../actions/form'
import { FormikGeneralFormErrors } from '../../components/form/GeneralFormErrors'
import { globalSettingsList } from '../../actions/settings'
import { Error } from '../../components/layout/Error'

const validationSchema = Yup.object().shape({
    'subject': Yup.string().required("Required"),
    'html_content': Yup.string().required("Required"),
    'text_content': Yup.string().required("Required")
})

class AdminEditableEmail extends Component {

    componentDidMount() {
        const { dispatch, editable_email_id } = this.props
        dispatch(adminEditableEmailList.ensureObjectLoaded(editable_email_id))
        dispatch(globalSettingsList.ensureGlobalSettingsLoaded())
    }

    componentDidUpdate(prev_props) {
        const { dispatch, editable_email_id } = this.props
        dispatch(adminEditableEmailList.ensureObjectLoaded(editable_email_id))
    }

    onSave = (values, formik_funcs) => {
        const { dispatch, editable_email_id } = this.props

        const on_ok = function(json) {
            dispatch(adminEditableEmailList.invalidateList())
            showSuccess("Saved", "Email saved")
        }
        if ( editable_email_id ) {
            values.id = editable_email_id
            return dispatch(adminEditableEmailList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminEditableEmailList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    onPreview = () => {
        const { editable_email_id } = this.props
        window.open(`/admin/editable_email/${editable_email_id}/preview`, "_blank")
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    renderLegacyDetails() {
        const { editable_email } = this.props
        return (
            <Card title="Legacy values">
              <Separator variant="h10" />
              <div>Subject</div>
              <div css={legacy_text_style}>{editable_email.legacy_subject}</div>
              <Separator variant="h20" />
              <div>Html Content</div>
              <div css={legacy_text_style}>{editable_email.legacy_html_content}</div>
              <Separator variant="h20" />
              <div>Html Content</div>
              <div css={legacy_text_style}>{editable_email.legacy_text_content}</div>
            </Card>
        )
    }

    renderParameterTips() {
        return (
            <Card title="Parameter tips">
              <Separator variant="h10" />
              <div>Time: {"{{parameter|date:'H:i'}}"}
                <CardInfoText>10:30</CardInfoText>
              </div>
              <hr/>
              <div>Date: {"{{parameter|date:'Y-m-d'}}"}
                <CardInfoText>2020-06-10</CardInfoText>
              </div>
              <hr/>
              <div>Date (alternative): {"{{parameter|date:'d-M-Y'}}"}
                <CardInfoText>10 June 2020</CardInfoText>
              </div>
              <div>Date + Time: {"{{parameter|date:'d-M-Y H:i'}}"}
                <CardInfoText>10 June 2020 10:30</CardInfoText>
              </div>
              <hr/>
              <div>Currency: {"€{{parameter|floatformat:2}}"}
                <CardInfoText>€1.23</CardInfoText>
              </div>
              <hr/>
              <div>Condition: {"{% if include_payment_link %}Please click {{include_payment_link}}{% endif %}"}
                <CardInfoText>If include_payment_link is true, then: Please click http://click.me</CardInfoText>
                <CardInfoText>If include_payment_link is false, then: (displays nothing)</CardInfoText>
                <CardInfoText>(more conditions are possible, see <a target="_blank" href="https://docs.djangoproject.com/en/3.0/ref/templates/language/?">django docs</a>)</CardInfoText>
              </div>
              <hr/>
            </Card>
        )
    }

    renderAvailableParameters() {
        const { editable_email } = this.props
        const available_parameters_list = split(editable_email.available_parameters, ",")
        const static_parameter_list = split(editable_email.static_parameters, ",")

        return (
            <Card title="Available parameters">

              { size(available_parameters_list) === 0 &&
                <div>
                  No parameters are available for this email.
                </div>
              }
              { size(available_parameters_list) > 0 &&
                <div>
                  <CardInfoText>
                    To use a parameter, put it anywhere in the email between two curly braces, for example:
                    <hr/>
                    Dear {"{{customer.user.first_name}}"},
                    <hr/>

                  </CardInfoText>

                  { map(available_parameters_list, function(parameter, index) { if ( parameter ) { return <div key={index}>{`{{${parameter}}}`}</div> } })}
                  { map(static_parameter_list, function(parameter, index) { if ( parameter ) { return <div key={index}>{`{{${parameter}}}`}</div> } })}
                </div>
              }
            </Card>
        )
    }

    renderForm(formik_props) {
        const { can_edit } = this.props
        return (
            <div>
              <Row>
                <Col>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Subject</BootstrapForm.Label>
                    <FormikTextarea name="subject" rows={2} placeholder="subject" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Html Content</BootstrapForm.Label>
                    <FormikTextarea name="html_content" place_holder="Html Content" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Text Content</BootstrapForm.Label>
                    <FormikTextarea name="text_content" place_holder="Text Content" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Header name</BootstrapForm.Label>
                    <CardInfoText>
                      After processing, becomes the header_name parameter in the header editable email.
                    </CardInfoText>
                    <FormikTextarea name="param_header_name" rows={5} place_holder="Header name" />
                  </BootstrapForm.Group>

                </Col>
              </Row>
              <Row>
                <Col>
                  { can_edit &&
                    <BlueButton type="submit">Save</BlueButton>
                  }
                  { ! can_edit &&
                    <Error>Editing custom emails is disabled</Error>
                  }
                </Col>
                <Col>
                  <BlueButton variant="secondary" onClick={this.onPreview} auto_disable={false}>
                    Preview
                  </BlueButton>
                </Col>
              </Row>
            </div>
        )
    }

    render() {
        const { initial_values, is_loading, is_busy, editable_email, editable_email_id } = this.props
        const that = this
        const title = `${get(editable_email, ["description"])} - ${get(editable_email, ["language_code"])}`

        return (
            <AdminMainLayout breadcrumbs={[{name: 'admin_home'},

                                           {name: 'editable_emails',
                                            label: 'Editable Emails',
                                            url: '/admin/editable_emails'},

                                           {name: 'editable_email',
                                            label: (
                                                <div css={breadcrumb_item}>
                                                  {get(editable_email, ["name"], '')}
                                                  <Separator variant="h10" />
                                                  <LanguageFlag language_code={editable_email.language_code} />
                                                </div>
                                            ),
                                            url: `/admin/editable_email/${editable_email_id}`
                                           }
            ]}>
            <Container fluid>
            { is_busy && <BusyMask /> }
            { is_loading && <Loading /> }
            <h1>{title}</h1>
            <Separator variant="h30" />

            { editable_email && editable_email.id &&

              <Formik
                  initialValues={initial_values}
                  onSubmit={this.onSave}
                  enableReinitialize={true}
                  validationSchema={validationSchema}
              >
                {formik_props => {
                     const { values } = formik_props
                     return (
                         <Form>
                           <FormikGeneralFormErrors render={(msg) => <Row><Col>{msg}</Col></Row>} />
                           <Row>
                             <Col>
                               <Card>
                                 { is_loading && <Loading /> }
                                 { that.renderForm(formik_props) }
                               </Card>
                             </Col>
                             <Col>
                               { ! is_loading && that.renderAvailableParameters() }
                               { this.renderParameterTips() }
                             </Col>
                           </Row>
                           <Row>
                             <Col>
                               { that.renderLegacyDetails() }
                             </Col>
                           </Row>
                         </Form>
                     )}
                }
              </Formik>
            }
              </Container>
            </AdminMainLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const editable_email_id = get(props, ["match", "params", "editable_email_id"], null)
    const editable_email = adminEditableEmailList.getObject(editable_email_id)
    return {
        editable_email_id,
        editable_email,
        is_loading: adminEditableEmailList.isLoading(),
        is_busy: adminEditableEmailList.getIsSavingObject(),
        initial_values: editable_email,
        can_edit: globalSettingsList.getSetting('can_edit_editable_emails')
    }
}

export default connect(mapStateToProps)(AdminEditableEmail)

const breadcrumb_item = css`
display: flex;
align-items: center;
`

const legacy_text_style = css`
font-family: mono-space;
font-size: 14px;
`
