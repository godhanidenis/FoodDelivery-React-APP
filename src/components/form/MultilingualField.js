/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { useField } from 'formik'
import { map } from 'lodash'
import { default_theme as theme } from '../../emotion/theme'
import FormError from './FormError'
import FormWarning from './FormWarning'
import { FormikTextarea } from './TextareaField'
import { LANGUAGES } from '../../actions/language'

export const MultilingualField = ({ name, label, render_component, ...props }) => {

    return (

        <div>
          { map(LANGUAGES, ({language_code, language_name}, index) => {
              return (
                  <div key={index}>
                    {label}
                    { render_component( {name:`${name}_${language_code}`} ) }
                  </div>
              )
          })}
        </div>
        
    )
}
