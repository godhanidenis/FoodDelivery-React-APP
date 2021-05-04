/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { FormikDropdownField } from 'components/form/Dropdown'
import { FormikInputField } from 'components/form/InputField'
import { FormikTextareaField } from 'components/form/TextareaField'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { CountrySelectField } from 'components/form/CountrySelectField'
import { ProvinceSelectField } from 'components/form/ProvinceSelectField'
import { CitySelectField } from 'components/form/CitySelectField'
import Timestamp from 'components/Timestamp'
import { useDispatch } from 'react-redux'
import AdminAddressesForm from 'admin/components/addresses/form/AdminAddressesForm'
import AdminContactsForm from 'admin/components/contacts/form/AdminContactsForm'
import { FormikBringgStatus } from 'admin/components/integrations/bringg/BringgStatus'

const STATUS_OPTIONS = [ {value: 'active', label: 'Active'},
                         {value: 'inactive', label: 'Inactive'} ]

const AdminCommonCompanyForm = ({formik_props, renderExtraFieldsPosition1}) => {

    const dispatch = useDispatch()

    return (
        <div>
          <FormikInputField name="company.name"
                            type="text"
                            label="Name"
                            formik_props={formik_props}
          />

          { renderExtraFieldsPosition1 && renderExtraFieldsPosition1(formik_props) }

          <AdminAddressesForm formik_props={formik_props} name="company.addresses" />
          <AdminContactsForm formik_props={formik_props} name="company.contacts" />

          <FormikInputField name="company.website"
                            type="text"
                            label="Website"
                            formik_props={formik_props}
          />

          <FormikInputField name="company.delivery_instructions"
                            type="text"
                            label="Delivery instructions"
                            formik_props={formik_props}
          />

          <FormikTextareaField name="company.description"
                               label="Description"
                               formik_props={formik_props}
          />

          <FormikCheckboxField name="company.is_npo"
                               label="Is an NPO"
                               formik_props={formik_props}
          />

          { get(formik_props, ["values", "company", "is_npo"], false) &&
            <FormikInputField name="company.npo_number"
                              type="text"
                              label="NPO Number"
                              formik_props={formik_props}
            />
          }

          <FormikBringgStatus formik_props={formik_props} field_prefix='company' />

        </div>
    )

}

export default AdminCommonCompanyForm
