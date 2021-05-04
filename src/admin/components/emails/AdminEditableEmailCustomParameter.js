/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { head, get, map, keys, split, size } from 'lodash'
import { adminEditableEmailCustomParameterList } from './actions/admin_editable_email_custom_parameter'
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
    'name': Yup.string().required("Required"),
    'tag': Yup.string().required("Required"),
    'html_content': Yup.string(),
    'text_content': Yup.string()
})

class AdminEditableEmailCustomParameter extends Component {

    componentDidMount() {
        const { dispatch, editable_email_custom_parameter_id } = this.props
        dispatch(adminEditableEmailCustomParameterList.ensureObjectLoaded(editable_email_custom_parameter_id))
        dispatch(globalSettingsList.ensureGlobalSettingsLoaded())
    }

    componentDidUpdate(prev_props) {
        const { dispatch, editable_email_custom_parameter_id } = this.props
        dispatch(adminEditableEmailCustomParameterList.ensureObjectLoaded(editable_email_custom_parameter_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, dispatch, editable_email_custom_parameter_id } = this.props

        const on_ok = function(json) {
            dispatch(adminEditableEmailCustomParameterList.invalidateList())
            if ( ! editable_email_custom_parameter_id ) {
                history.push(`/admin/editable_email_custom_parameter/${json.id}/`)
            }
            showSuccess("Saved", "Parameter saved")
        }
        if ( editable_email_custom_parameter_id ) {
            values.id = editable_email_custom_parameter_id
            return dispatch(adminEditableEmailCustomParameterList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminEditableEmailCustomParameterList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    renderParameterTips() {
        return (
            <Card title="Parameter tips">
              <Separator variant="h10" />
              The tag field is a regular expression. Each occurance of the tag will be replaced by either the "html content" or "text content" fields.
              <br/>
              <hr/>

              <div css={example_header}>Example 1: Token replacement</div>
              <Row>
                <Col md="3">
                  Tag
                </Col>
                <Col>
                  <pre css={pre_style}>{"__WHITESPACE__"}</pre>
                </Col>
              </Row>


              <Row>
                <Col md="3">
                  Html content
                </Col>
                <Col>
                  <pre css={pre_style}>{"<br/>"}</pre>
                </Col>
              </Row>

              <Row>
                <Col md="3">
                  Then input...
                </Col>
                <Col>
                  <pre css={pre_style}>{"Line 1 __WHITESPACE__ Line 2"}</pre>
                </Col>
              </Row>

              <Row>
                <Col md="3">
                  becomes...
                </Col>
                <Col>
                  <pre css={pre_style}>{"Line 1 <br/> Line 2"}</pre>
                </Col>
              </Row>

              <hr/>

              <div css={example_header}>Example 2: Custom paragraph tag</div>
              <Row>
                <Col md="3">
                  Tag
                </Col>
                <Col>
                  <pre css={pre_style}>{"<xoip-p>(?P<content>.*?)</xoip-p> "}</pre>
                </Col>
              </Row>


              <Row>
                <Col md="3">
                  Html content
                </Col>
                <Col>
                  <pre css={pre_style}>{"<p margin='0'>\\g<content></p>"}</pre>
                </Col>
              </Row>

              <Row>
                <Col md="3">
                  Then input...
                </Col>
                <Col>
                  <pre css={pre_style}>{"This is a <xoip-p>Paragraph</xoip-p>"}</pre>
                </Col>
              </Row>

              <Row>
                <Col md="3">
                  becomes...
                </Col>
                <Col>
                  <pre css={pre_style}>{"This is a <p margin='0'>Paragraph</p>"}</pre>
                </Col>
              </Row>

              <hr/>

              <div css={example_header}>Example 3: Tokenised replacement</div>
              <Row>
                <Col md="3">
                  Tag
                </Col>
                <Col>
                  <pre css={pre_style}>{"XOIP-LINK: LABEL=(?P<label>.*?) LINK=(?P<link>.*?) END"}</pre>
                </Col>
              </Row>


              <Row>
                <Col md="3">
                  Html content
                </Col>
                <Col>
                  <pre css={pre_style}>{"<a href='\g<link>'>\g<label></a>"}</pre>
                </Col>
              </Row>

              <Row>
                <Col md="3">
                  Then input...
                </Col>
                <Col>
                  <pre css={pre_style}>{"blahblah XOIP-LINK: LABEL=my label LINK=app.xoip.com END blahblah"}</pre>
                </Col>
              </Row>

              <Row>
                <Col md="3">
                  becomes...
                </Col>
                <Col>
                  <pre css={pre_style}>{"blahblah <a href='app.xoip.com'>my label</a> blahblah"}</pre>
                </Col>
              </Row>

              <hr/>

              <div css={example_header}>Additional hints</div>
              <Row>
                <Col>
                  <a target="_blank" href="https://regex101.com/">Interactive regex tester</a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <a target="_blank" href="https://docs.python.org/3/howto/regex.html">Python3 regex doc</a>
                </Col>
              </Row>
              <Row>
                <Col md="3">
                  New line in text content
                </Col>
                <Col>
                  <pre>{"\\n"}</pre>
                </Col>
              </Row>
              <Row>
                <Col md="3">
                  A{"(?P<content>.*?)"}Z
                </Col>
                <Col>
                  <pre>Find anything between A and Z, store in variable "content", and replace for {"\g<content>"}</pre>
                  (The ? after .* means don't be greedy)
                </Col>
              </Row>
              <hr/>


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
                    <BootstrapForm.Label>Name</BootstrapForm.Label>
                    <FormikInputField name="name" placeholder="Name" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Description</BootstrapForm.Label>
                    <FormikTextarea name="description" rows={2} place_holder="Description" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group>
                    <BootstrapForm.Label>tag</BootstrapForm.Label>
                    <FormikTextarea name="tag" rows={4} place_holder="Tag" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Html Content</BootstrapForm.Label>
                    <FormikTextarea name="html_content" rows={4} place_holder="Html Content" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Text Content</BootstrapForm.Label>
                    <FormikTextarea name="text_content" rows={4} place_holder="Text Content" />
                  </BootstrapForm.Group>

                </Col>
              </Row>
              <Row>
                <Col>
                  { can_edit &&
                    <BlueButton type="submit">Save</BlueButton>
                  }
                  { ! can_edit &&
                    <Error>Editing custom parameters is disabled</Error>
                  }
                </Col>
              </Row>
            </div>
        )
    }

    render() {
        const { initial_values, is_loading, is_busy, editable_email_custom_parameter, editable_email_custom_parameter_id } = this.props
        const that = this
        const title = `${get(editable_email_custom_parameter, ["name"])}`

        return (
            <AdminMainLayout breadcrumbs={[{name: 'admin_home'},

                                           {name: 'editable_emails',
                                            label: 'Editable Emails',
                                            url: '/admin/editable_emails'},

                                           {name: 'editable_email_custom_parameters',
                                            label: 'Editable Email Custom Parameters',
                                            url: '/admin/editable_email_custom_parameters'},

                                           {name: 'editable_email_custom_parameter',
                                            label: (
                                                <div css={breadcrumb_item}>
                                                  {get(editable_email_custom_parameter, ["name"], '')}
                                                  <Separator variant="h10" />
                                                </div>
                                            ),
                                            url: `/admin/editable_email_custom_parameter/${editable_email_custom_parameter_id}`
                                           }
                                          ]}>
              <Container fluid>
                { is_busy && <BusyMask /> }
                { is_loading && <Loading /> }
                <h1>{title}</h1>
                <Separator variant="h30" />

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
                                { this.renderParameterTips() }
                              </Col>
                            </Row>
                          </Form>
                      )}
                  }
                </Formik>
              </Container>
            </AdminMainLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const editable_email_custom_parameter_id = get(props, ["match", "params", "editable_email_custom_parameter_id"], null)
    const editable_email_custom_parameter = adminEditableEmailCustomParameterList.getObject(editable_email_custom_parameter_id)
    return {
        editable_email_custom_parameter_id,
        editable_email_custom_parameter,
        is_loading: adminEditableEmailCustomParameterList.isLoading(),
        is_busy: adminEditableEmailCustomParameterList.getIsSavingObject(),
        initial_values: editable_email_custom_parameter,
        can_edit: globalSettingsList.getSetting('can_edit_editable_emails')
    }
}

export default connect(mapStateToProps)(AdminEditableEmailCustomParameter)

const breadcrumb_item = css`
display: flex;
align-items: center;
`

const legacy_text_style = css`
font-family: mono-space;
font-size: 14px;
`

const example_header = css`
font-weight: bold;
`

const pre_style = css`
margin: 0px;
padding: 0px;
border: 1px solid #ededed;
`
