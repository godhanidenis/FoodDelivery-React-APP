/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { FormikDropdownField } from 'components/form/Dropdown'
import { FormikInputField } from 'components/form/InputField'
import { FormikTextareaField } from 'components/form/TextareaField'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { useDispatch } from 'react-redux'
import { countryList } from 'actions/country'
import { provinceList } from 'actions/province'
import { useEffect } from 'react'
import { CommonTable } from 'components/CommonTable'
import AdminMainLayout from './AdminMainLayout'
import AdminTableFilter from 'admin/components/common/AdminTableFilter'
import { Separator } from 'components/layout/Separator'
import { Button } from 'components/layout/Button'
import BusyMask from '../../../components/BusyMask'
import Loading from '../../../components/Loading'
import { Formik, Form, FieldArray, Field } from 'formik'
import FormCard from '../../../components/layout/FormCard'
import Typography from '@material-ui/core/Typography'

const AdminCommonFormLayout = ({breadcrumbs, is_busy, is_loading, title, initial_values, onSave, validationSchema, save_label, children}) => {

    return (
        <AdminMainLayout breadcrumbs={breadcrumbs}>
          { is_busy && <BusyMask /> }
          { is_loading && <Loading /> }

          <Typography variant="h5" style={{textTransform: 'capitalize'}}>{title}</Typography>

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
                        <FormCard save_label={save_label}>
                          { children({formik_props: formik_props}) }
                        </FormCard>
                      </Form>
                  )}
              }
            </Formik>
          }
        </AdminMainLayout>
    )
}

export default AdminCommonFormLayout
