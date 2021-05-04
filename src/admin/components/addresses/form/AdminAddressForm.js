/** @jsx jsx */
import 'react'
import React, { useEffect, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { get, split } from 'lodash'
import { useDispatch } from 'react-redux'
import Title from 'components/layout/Title'
import { withStyles } from "@material-ui/core"
import Button from '@material-ui/core/Button'
import { FormikDropdownField } from 'components/form/Dropdown'
import { FormikInputField } from 'components/form/InputField'
import { FormikTextareaField } from 'components/form/TextareaField'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { CountrySelectField } from 'components/form/CountrySelectField'
import { ProvinceSelectField } from 'components/form/ProvinceSelectField'
import { CitySelectField } from 'components/form/CitySelectField'
import { adminAddressTypes } from 'admin/actions/admin_dropdown_options'
import { AddressAutoComplete } from 'components/map/AddressAutoComplete'
import { countryList } from 'actions/country'
import { provinceList } from 'actions/province'
import { cityList } from 'actions/city'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
    // street1: Yup.string().required("Required")
})

const styles = () => ({
    container: {
        width: "100%"
    },
    auto_complete_container: {
        width: "100%"
    },
    input_field: {
        width: "100%"
    }
})

const AdminAddressForm = ({classes, formik_props, field_prefix}) => {

    const values = get(formik_props, ["values", split(field_prefix, ".")])
    const dispatch = useDispatch()
    const [showDetailedFields, setShowDetailedFields] = useState(false)
    const [showAutoComplete, setShowAutoComplete] = useState(false)

    if ( field_prefix ) {
        field_prefix = field_prefix + "."
    } else {
        field_prefix = ""
    }

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminAddressTypes.fetchListIfNeeded())
            dispatch(countryList.fetchListIfNeeded())
            dispatch(provinceList.fetchListIfNeeded())
            dispatch(cityList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])

    const address_type_options = adminAddressTypes.getAsOptions()

    const renderMapAutoComplete = (formik_props, formatted_address) => {

        const current_formatted_address = get(formik_props, ["values", "formatted_address"], '')

        const onChanged = ({formatted_address, latitude, longitude, street1, street2, province_name,
                            city_name, country_name, postal_code}) => {

                                formik_props.setFieldValue(`${field_prefix}formatted_address`, formatted_address)
                                formik_props.setFieldValue(`${field_prefix}street1`, street1)
                                formik_props.setFieldValue(`${field_prefix}street2`, street2)
                                formik_props.setFieldValue(`${field_prefix}country`, countryList.getOptionValueForLabel(country_name))
                                formik_props.setFieldValue(`${field_prefix}city`, cityList.getOptionValueForLabel(city_name))
                                formik_props.setFieldValue(`${field_prefix}province`, provinceList.getOptionValueForLabel(province_name))
                                formik_props.setFieldValue(`${field_prefix}postal_code`, postal_code)
                                formik_props.setFieldValue(`${field_prefix}latitude`, latitude)
                                formik_props.setFieldValue(`${field_prefix}longitude`, longitude)
                                setShowAutoComplete(false)
        }
        return (
            <>
              <AddressAutoComplete formatted_address={current_formatted_address} onChanged={onChanged}/>
              <div className={classes.auto_complete_container}>
                <Button onClick={() => setShowAutoComplete(false)}>
                  Cancel
                </Button>
              </div>
            </>
        )
    }

    return (
        <div className={classes.container}>
          <FormikDropdownField name={`${field_prefix}address_type`}
                               formik_props={formik_props}
                               options={address_type_options}
                               placeholder="Type" />

          <FormikCheckboxField name={`${field_prefix}is_default`}
                               label="Is default"
                               formik_props={formik_props}
          />

          { showAutoComplete && renderMapAutoComplete(formik_props) }

          { ! showAutoComplete &&

            <>

              <div>
                <Button onClick={() => setShowAutoComplete(true)}>
                  Search Google for full address
                </Button>
              </div>

              <FormikInputField className={classes.input_field}
                                name={`${field_prefix}formatted_address`}
                                type="text"
                                formik_props={formik_props}
              />

              { ! showDetailedFields &&
                <div>
                  <Button onClick={() => setShowDetailedFields(true)}>
                    Show detailed address fields
                  </Button>
                </div>
              }

              { showDetailedFields &&

                <>
                  <div>
                    <Button onClick={() => setShowDetailedFields(false)}>
                      Hide detailed address fields
                    </Button>
                  </div>

                  <FormikInputField name={`${field_prefix}street1`}
                                    type="text"
                                    label="Street1"
                                    formik_props={formik_props}
                  />

                  <FormikInputField name={`${field_prefix}street2`}
                                    type="text"
                                    label="Street2"
                                    formik_props={formik_props}
                  />

                  <CountrySelectField name={`${field_prefix}country`}
                                      label="Country"
                                      formik_props={formik_props}
                  />

                  <ProvinceSelectField name={`${field_prefix}province`}
                                       label="Province/Region"
                                       formik_props={formik_props}
                                       country_id={get(values, ["country"], null)}
                  />

                  <CitySelectField name={`${field_prefix}city`}
                                   label="City"
                                   formik_props={formik_props}
                                   country_id={get(values, ["country"], null)}
                  />
                  <FormikInputField name={`${field_prefix}postal_code`}
                                    type="text"
                                    label="Postal code"
                                    formik_props={formik_props}
                  />

                  <FormikTextareaField name={`${field_prefix}notes`}
                                       label="Notes"
                                       formik_props={formik_props}
                  />
                  <FormikInputField name={`${field_prefix}latitude`}
                                    type="text"
                                    label="Latitude"
                                    formik_props={formik_props}
                  />
                  <FormikInputField name={`${field_prefix}longitude`}
                                    type="text"
                                    label="Longitude"
                                    formik_props={formik_props}
                  />
                </>
              }
            </>
          }

        </div>
    )

}

export default withStyles(styles)(AdminAddressForm)
