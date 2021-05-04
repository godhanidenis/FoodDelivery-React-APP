/** @jsx jsx */
import 'react'
import { useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { makeStyles } from '@material-ui/core/styles'
import { Field, useField, FieldArray } from 'formik'
import { map, get, size, split } from 'lodash'
import AdminAddressForm from './AdminAddressForm'
import { Separator } from 'components/layout/Separator'
import { Button, Typography } from '@material-ui/core'
import { GrayLinkButton } from 'components/layout/GrayLinkButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined'

const useStyles = makeStyles((theme) => ({
    form_container: {
        width: "100%"
    }
}))

const AdminAddressesForm = ({formik_props, name}) => {

    const classes = useStyles()
    const values = get(formik_props, "values")
    if ( get(values, name) === undefined ) {
        formik_props.setFieldValue(name, [])
    }

    const onAddAddress = (arrayHelpers) => {
        arrayHelpers.insert(size(get(values, name)), {})
    }

    const onRemoveAddress = (index, arrayHelpers) => {
        arrayHelpers.remove(index)
    }

    return (
        <div style={{padding: 10, border: "1px solid #cccccc", borderRadius: 4, marginTop: 10}}>
          <FieldArray
              name={name}
              render={arrayHelpers => (
                  <div>
                    {map(get(values, name, []), function(address, index) {
                        return (
                            <div key={index} css={address_row}>

                              <div className={classes.form_container}>
                                <Typography variant="h6">{address.id ? "Edit Address" : "Add Address"}</Typography>
                                <AdminAddressForm formik_props={formik_props} field_prefix={`${name}.${index}`} />
                              </div>
                              <div css={icon_container}>
                                <Separator variant="w10" />
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => onRemoveAddress(index, arrayHelpers)}
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
                      onClick={() => onAddAddress(arrayHelpers)}
                    >
                      Address
                    </Button>
                  </div>
              )}
            />
        </div>
    )

}

export default AdminAddressesForm

const address_row = css`
margin-bottom: 10px;
align-items: baseline;
display: flex;
`

const icon_container = css`
display: flex;
height: 100%;
`
