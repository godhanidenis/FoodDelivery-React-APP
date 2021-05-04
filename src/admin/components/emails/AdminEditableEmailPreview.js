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
import WrappingBusyMask from '../../components/WrappingBusyMask'

class AdminEditableEmail extends Component {

    componentDidMount() {
        const { dispatch, editable_email_id } = this.props
        dispatch(adminEditableEmailList.ensureObjectLoaded(editable_email_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, editable_email_id } = this.props
        dispatch(adminEditableEmailList.ensureObjectLoaded(editable_email_id))
    }

    onRefresh = () => {
        const { dispatch, editable_email_id } = this.props
        dispatch(adminEditableEmailList.invalidateObject(editable_email_id))
        dispatch(adminEditableEmailList.ensureObjectLoaded(editable_email_id))
    }

    renderHtmlPreviewMarkup() {
        const { editable_email } = this.props
        return { __html: editable_email.preview_info.html_content }
    }

    render() {
        const { is_loading, is_ready, editable_email } = this.props
        const that = this
        const title = `${get(editable_email, ["description"])} - ${get(editable_email, ["language_code"])}`

        return (
            <Container fluid>
              { is_loading && <Loading /> }
              <h1>Preview : {title}</h1>

              <WrappingBusyMask is_loading={is_loading || !is_ready}>
                { editable_email && editable_email.id && 
                  <div>
                    <div css={[preview_style]}>
                      {editable_email.preview_info.subject}
                    </div>
                    <Separator variant="h30" />

                    <div css={[preview_style, html_preview_style]} dangerouslySetInnerHTML={this.renderHtmlPreviewMarkup()} />
                    <Separator variant="h30" />

                    <div css={[preview_style, text_preview_style]}>
                      <pre>{editable_email.preview_info.text_content}</pre>
                    </div>
                  </div>
                }

                <Separator variant="h30" />
                <hr/>
                <BlueButton variant="secondary" onClick={window.close}>Close</BlueButton>
                <BlueButton variant="primary" onClick={this.onRefresh}>Refresh</BlueButton>
              </WrappingBusyMask>
            </Container>
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
        is_ready: adminEditableEmailList.isReady()
    }
}

export default connect(mapStateToProps)(AdminEditableEmail)

const preview_style = css`
margin: 20px;
border: 5px solid #000;
`

const html_preview_style = css`

`

const text_preview_style = css`

`
