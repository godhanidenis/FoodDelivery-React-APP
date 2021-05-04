/** @jsx jsx */
import { Component } from 'react'
import { jsx, css, Global } from '@emotion/core'
import { useField } from 'formik'
import { get, startsWith, trimStart } from 'lodash'
import { default_theme as theme } from '../../emotion/theme'
import FormError from './FormError'
import FormWarning from './FormWarning'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import * as Yup from 'yup'
import PhoneNumber from 'awesome-phonenumber'

Yup.addMethod(Yup.string, "phoneNumber", function(args) {
    const message =  get(args, "message", "Invalid phone number")
    return this.test("phoneNumber", message, function(value) {
        if ( ! value ) {
            return true
        }
        value = "+" + trimStart(value, "0")
        var pn = new PhoneNumber( value, '' )
        const result = pn.isValid()
        return result
    })
})

export const FormikPhoneNumberInputField = ({ formik_props, onChange, placeholder, ...props }) => {
    const [field, meta] = useField(props)

    const localOnChange = (value) => {

        value = trimStart(value)
        if ( startsWith(value, "310") ) {
            value = "31" + trimStart(value, "310")
        }
        
        formik_props.setFieldValue(field.name, value)
        if ( onChange ) {
            onChange(value)
        }
    }

    let value = field.value
    if ( startsWith(value, "00") ) {
        value = "+" + trimStart(value, "0")
    }
    
    return (
        <div css={container}>
          <Global styles={global_styles} />
          <PhoneInput
            country={'nl'}
            preferredCountries={['nl']}
            value={value}
            placeholder={placeholder}
            onChange={localOnChange}
          />
          <FormError meta={meta} />
          <FormWarning meta={meta} />
        </div>
    )
}

const global_styles = css`
.react-tel-input input.form-control {
  font-size: 16px;
}
`

const container = css`
`
