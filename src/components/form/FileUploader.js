/** @jsx jsx */
import {Component, useState} from 'react'
import {connect} from 'react-redux'
import DropzoneComponent from 'react-dropzone-component'
import ReactDOMServer from 'react-dom/server'
import { Link } from 'react-router-dom'
import { isEmpty, includes } from 'lodash'
import { jsx, css, Global } from '@emotion/core'
import { useField } from 'formik'
import FormError from './FormError'
import Loading from '../Loading'
import FormWarning from './FormWarning'
import { authToken } from '../../actions/auth'
import { default_theme as theme } from '../../emotion/theme'
import {showSuccess, showError} from '../../actions/Error'
import { Button } from './layout/Button'
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import loading_icon from '../../images/loading.gif'

import * as Sentry from '@sentry/browser'

export const FormikFileUploadField = ({ label, file_number, onFileUploaded, renderPlaceHolder, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    const { value } = field

    const { file_types, upload_relative_url, upload_params } = props
    
    const showSuccess = (status, data, evt) => {
        const { file_info } = data
        const { setFieldValue } = props.formik_props
        const { name } = field
        setFieldValue(name, file_info)
        if ( onFileUploaded ) {
            onFileUploaded(file_info)
        }
    }

    const onFailure = (ex) => {
        showError("Error", "Failed to upload file, please check it is a valid pdf", ex)
    }

    const request_headers = {'X-FOODSPACE-AUTHENTICATION-TOKEN': 'Token ' + authToken()}
    const upload_url = window.LOCAL_SETTINGS.API_BASE + upload_relative_url
    const args = {}
    
    const componentConfig = {
        showFiletypeIcon: true,
        postUrl: upload_url
    }

    let upload_msg

    if ( renderPlaceHolder ) {
        upload_msg = renderPlaceHolder()
    } else {
        if ( value && value.id ) {
            upload_msg = "Click or drag here to replace this file"
        } else {
            upload_msg = (
                <div css={upload_msg_style}>
                  <div css={upload_msg_style__icon}>
                  </div>
                  <div>Click or drag here to upload a file</div>
                </div>
            )
        }
    }

    const djsConfig = {
        params: upload_params,
        headers: request_headers,
        dictDefaultMessage: ReactDOMServer.renderToStaticMarkup(upload_msg),
        acceptedFiles: file_types,
        maxFiles: 1,
        timeout: 180000,
        previewTemplate: ReactDOMServer.renderToStaticMarkup(
            <div class="dz-preview dz-file-preview">
              <div class="dz-image"><img data-dz-thumbnail /></div>
              <div class="dz-details">
                <div class="dz-size"><span data-dz-size></span></div>
                <div class="dz-filename"><span data-dz-name></span></div>
              </div>
              <div class="dz-progress">
                <span class="dz-upload" data-dz-uploadprogress></span>
                <div class="dz-upload-spinner">
                  <img alt="loading" src={ loading_icon } css={ icon } />
                </div>
              </div>
              <div class="dz-error-message"><span data-dz-errormessage></span></div>
              <div class="dz-success-mark">
                <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1">
                  <title>Check</title>
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF"></path>
                  </g>
                </svg>
              </div>
              <div class="dz-error-mark">
                <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1">
                  <title>Error</title>
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
                      <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"></path>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
        )
    }

    const eventHandlers = {
        init: (dropzone) => { args.dropzone = dropzone },
        error: onFailure,
        success: showSuccess,
        complete: (f) => args.dropzone.removeFile(f)
    }

    return (
        <div css={container} className="file_uploader">
          <Global styles={global_styles} />
          <div css={dropzone_container}>
            <DropzoneComponent config={componentConfig}
                               eventHandlers={eventHandlers}
                               djsConfig={djsConfig}
            />
          </div>

          <FormError meta={meta} />
        </div>
    )

}

// //////////////////////////////////////////////////////////////////////

class FileUploader extends Component {
    
    render() {

        const { upload_url, showSuccess, onFailure, upload_params, request_headers, file_types, label, class_name } = this.props

        const componentConfig = {
            showFiletypeIcon: true,
            postUrl: upload_url
        }

        var djsConfig = {
            params: upload_params,
            headers: request_headers,
            dictDefaultMessage: label,
            acceptedFiles: file_types,
            timeout: 180000,
            previewTemplate: ReactDOMServer.renderToStaticMarkup(
                <div className="dz-preview dz-file-preview">
                  <div className="dz-progress">
                    <span className="dz-upload" data-dz-uploadprogress="true">
                      <div>
                        <div css={mask} id="mask" className="mask">
                        </div>
                        <div css={msg_container} id="msg_container" className="msg_container">
                          <div css={msg_style} id="msg" className="msg">
                            <Loading />
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
            )
        }

        const eventHandlers = {
            init: (dropzone) => { this.dropzone = dropzone },
            error: onFailure,
            success: showSuccess,
            complete: (f) => this.dropzone.removeFile(f)
        }

        return (
            <div css={ class_name === 'btn' ? dropzone_container : undefined } className={ class_name }>
              <DropzoneComponent
                  config={componentConfig}
                  eventHandlers={eventHandlers}
                  djsConfig={djsConfig}
              />
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    const { upload_relative_url, upload_params, showSuccess, onFailure, file_types, label, class_name } = props

    let request_headers = {}
    if (authToken()) {
        request_headers['X-FOODSPACE-AUTHENTICATION-TOKEN'] = 'Token ' + authToken()
    }

    const API_BASE = state.settings.configured && state.settings.API_BASE
    const upload_url = API_BASE + upload_relative_url

    return {
        upload_url,
        upload_params,
        request_headers,
        showSuccess,
        onFailure,
        file_types,
        label,
        class_name,
    }
}

export default connect(mapStateToProps)(FileUploader)

const global_styles = css`

.file_uploader .dropzone .dz-message {
  margin: 0px;
}

.file_uploader .filepicker.dropzone {
  min-height: 0px;
  border: 0px;
  padding: 0px;
}

.file_uploader .dropzone .dz-preview {
display: block;
margin: 0px;
width: 100%;
}


.file_uploader .dropzone .dz-preview .dz-details .dz-filename {
margin-top: 30px;
}

.file_uploader .dropzone .dz-preview .dz-details .dz-filename span {
background-color: transparent;
}

.file_uploader .dropzone .dz-preview .dz-image {
background: transparent;
}

.file_uploader .dropzone .dz-preview .dz-details .dz-size span {
background-color: transparent;
}

.file_uploader .dz-upload-spinner {
position: absolute;
top: -4px;
left: 43%;
}


`

const container = css`
width: 100%;
background-color: #f7f7f8;
height:100%;
`

const dropzone_container = css`
&:hover {
cursor: pointer;
}
height:100%;
`

const mask = css`
width: 100vw;
height: 100vw;
background-color: lightgrey;
height: 99%;
position: fixed;
top: 0px;
left: 0px;
opacity: 0.9;
z-index: 998;
`

const msg_container = css`
width: 100vw;
height: 100vw;
background-color: transparent;
height: 99%;
position: fixed;
top: 0px;
left: 0px;
z-index: 999;
text-align: center;
display: flex;
justify-content: center;

&:hover {
background-color: #f7f7f8;
}

`

const msg_style = css`
opacity: 1.0;
border-radius: 25px;
position: absolute;
padding: 20px;
margin-top: 40vh;
background-color: #f7f7f8;


`

const image_container = css`
width: 100%;
height: 100%;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 10px;
`

const image_src = css`
max-width: 80%;
max-height: 300px;
`

const upload_msg_style = css`
display: flex;
text-align: center;

`

const upload_msg_style__icon = css`
margin-right: 6px;
color: #b8b8bd;
`

const icon = css`
opacity: 1;
width: 15px;
`

