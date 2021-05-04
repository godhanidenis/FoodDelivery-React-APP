/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { FormikDropdownField } from '../../components/form/Dropdown'
import { FormikInputField } from '../../components/form/InputField'
import { FormikTextareaField } from '../../components/form/TextareaField'
import { FormikCheckboxField } from '../../components/form/CheckboxField'
import { CountrySelectField } from '../../components/form/CountrySelectField'
import { ProvinceSelectField } from '../../components/form/ProvinceSelectField'
import { CitySelectField } from '../../components/form/CitySelectField'
import { useDispatch } from 'react-redux'

const AdminWarehouseForm = ({formik_props, renderExtraFieldsPosition1}) => {

    const dispatch = useDispatch()

    return (
        <div>


          <CountrySelectField name="warehouse_address.country"
                              label="Country"
                              formik_props={formik_props}
          />
          
          <ProvinceSelectField name="warehouse_address.province"
                               label="Province/Region"
                               formik_props={formik_props}
                               country_id={get(formik_props, ["values", "warehouse_address", "country"], null)}
          />

          <CitySelectField name="warehouse_address.city"
                           label="City"
                           formik_props={formik_props}
                           country_id={get(formik_props, ["values", "warehouse_address", "country"], null)}
          />
          
          <FormikInputField name= "warehouse_address.street1"
                            label="Street 1"
                            formik_props={formik_props}
                            type="text"
          />
           <FormikInputField name= "warehouse_address.street2"
                            label="Street 2"
                            formik_props={formik_props}
                            type="text"
          />



          
          { get(formik_props, ["values", "warehouse", ], false) }
          
          
        </div>
    )

}

export default AdminWarehouseForm


