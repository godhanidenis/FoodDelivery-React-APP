import React from 'react'
import { FormControlLabel, Radio } from '@material-ui/core'
import { Field } from 'formik'
import { RadioGroup } from 'formik-material-ui'
import { get, map } from 'lodash'

export const FormikRadioGroupField = ({ label, type, name, options, formik_props, ...props }) => {

    const { isSubmitting, values } = formik_props
    const selected_option = get(values, name)
    
    return (
        <Field component={RadioGroup} name={name}>

          { map(options, ({label, value, children}) =>
                <>
                  <FormControlLabel value={value}
                                    control={<Radio disabled={isSubmitting} />}
                                    label={label}
                                    disabled={isSubmitting}
                  />
                  { selected_option == value && children }
                </>
               )
          }
        </Field>
    )
}
