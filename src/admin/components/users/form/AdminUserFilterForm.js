/** @jsx jsx */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Formik, Form, Field } from 'formik'
import { FormikMultiSelectDropdownField } from 'components/form/Dropdown'
import { cityList } from 'actions/city'

export const AdminUserFilterForm = ({field_name_prefix, formik_props}) => {

    const dispatch = useDispatch()
    
    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(cityList.updatePaginationNumItemsPerPage(1000))
            dispatch(cityList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])

    const city_options = cityList.getAsOptions()
    
    return (
        <div>
          
          <FormikMultiSelectDropdownField name={`${field_name_prefix}.cities`}
                                          label="Cities"
                                          options={city_options}
                                          formik_props={formik_props}
          />

        </div>
    )

}
