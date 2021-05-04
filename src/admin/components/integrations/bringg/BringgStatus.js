import React from 'react'
import Timestamp from 'components/Timestamp'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash'
import { FormikInputField } from 'components/form/InputField'
import { Error } from 'components/layout/Error'
import bringg_logo from 'images/bringg_logo.svg'

const useStyles = makeStyles((theme) => ({
    content: {
        border: "1px solid #ededed",
        padding: "5px",
        marginTop: "20px",
        marginBottom: "20px",
    },
    logo: {
        width: "100px",
    },
    sync_datetime: {
        display: "flex",
        fontSize: "14px"
    }
}))

export function FormikBringgStatus({formik_props, field_prefix}) {
    const classes = useStyles()
    let values = get(formik_props, "values")
    if ( field_prefix ) {
        values = get(values, field_prefix)
    }
    const bringg_updated_at = get(values, "bringg_updated_at")
    const bringg_last_status = get(values, "bringg_last_status")
    let field_name = "bringg_ref"
    if ( field_prefix ) {
        field_name = field_prefix + "." + field_name
    }

    const bringg_ref = get(formik_props, ["values", field_name])

    return (
        <div className={classes.content}>
          <img src={bringg_logo} className={classes.logo} />

          <div>{bringg_ref ? `Bringg Ref ${bringg_ref}` : "Bringg ref not set yet" }</div>
          { false && 
            <FormikInputField name={field_name}
                              label="Bringg ref"
                              formik_props={formik_props}
                              touch_on_edit={true}
            />
          }

          <div className={classes.sync_datetime}>
            Last successful sync to Bringg &nbsp;<Timestamp format="from_now" value={bringg_updated_at} /> &nbsp;(<Timestamp value={bringg_updated_at} />)
          </div>
          { bringg_last_status &&
            <Error>
              Last Bringg Sync Message: {bringg_last_status}
            </Error>
          }
        </div>
    )
}
