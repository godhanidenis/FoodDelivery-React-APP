/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import BusyMask from '../../components/BusyMask'
import Loading from '../../components/Loading'
import { Formik, Form, Field } from 'formik'
import FormCard from '../../components/layout/FormCard'
import { Modal } from '../../components/layout/Modal'
import { Drawer, Grid, Typography, Divider } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(1),
      width: '100%',
    },
  },
  list: {
    width: 470,
  },
}))

const CommonInlineAddNewFormLayout = ({is_loading, title, initial_values, onSave, onCancel, validationSchema, children}) => {
    const classes = useStyles();
    title = title || "Add new"

    return (
        <Drawer anchor='right' open={true} onClose={onCancel}>
          <Typography variant="h5" style={{padding:16}}>{title}</Typography>
          <Divider />
          { is_loading && <Loading /> }
          { ! is_loading &&
            <Formik
              initialValues={initial_values}
              onSubmit={onSave}
              enableReinitialize={true}
              validationSchema={validationSchema}
            >
              {formik_props => {
                  const { values } = formik_props
                  return (
                      <Form>
                        <Grid
                          className={classes.list}
                          role="presentation"
                        >
                          <FormCard onCancel={onCancel} cardIsInDrawer>
                            { children({formik_props: formik_props}) }
                          </FormCard>
                        </Grid>
                      </Form>
                  )}
              }
            </Formik>
          }
        </Drawer>
    )

}

export default CommonInlineAddNewFormLayout
