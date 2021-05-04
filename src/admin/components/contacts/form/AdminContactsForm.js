// @ts-nocheck
/** @jsx jsx */
import 'react'
import { useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { Field, useField, FieldArray } from 'formik'
import { map, get, size, split } from 'lodash'
import AdminContactForm from './AdminContactForm'
import { Separator } from 'components/layout/Separator'
import Button from '@material-ui/core/Button'
import { GrayLinkButton } from 'components/layout/GrayLinkButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined'

const AdminContactsForm = ({formik_props, name}) => {

    const values = get(formik_props, "values")
    if ( get(values, name) === undefined ) {
        formik_props.setFieldValue(name, [])
    }

    const onAddContact = (arrayHelpers) => {
        arrayHelpers.insert(size(get(values, name)), {})
    }

    const onRemoveContact = (index, arrayHelpers) => {
        arrayHelpers.remove(index)
    }

    return (
        <div>
          <FieldArray
              name={name}
              render={arrayHelpers => (
                  <div style={{padding: 10, border: "1px solid #cccccc", borderRadius: 4, marginTop: 10}}>
                    {map(get(values, name, []), function(contact, index) {
                        return (
                            <div key={index} css={contact_row}>
                              <div>
                                <AdminContactForm formik_props={formik_props} field_prefix={`${name}.${index}`} />
                              </div>
                              <div css={icon_container}>
                                <Separator variant="w10" />
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => onRemoveContact(index, arrayHelpers)}
                                  style={{marginTop: 30}}
                                >
                                Remove
                              </Button>
                              </div>
                            </div>
                        )
                    }
                        )}
                      <Button
                        variant="contained"
                        color="default"
                        startIcon={<AddCircleOutlineOutlinedIcon />}
                        onClick={() => onAddContact(arrayHelpers)}
                      >
                      Contact
                    </Button>
                  </div>
              )}
            />
        </div>
    )

}

export default AdminContactsForm

const contact_row = css`
margin-bottom: 10px;
align-items: baseline;
display: flex;
`

const icon_container = css`
display: flex;
height: 100%;
`
