/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { get, map } from 'lodash'
import { FormikDropdownField } from './Dropdown'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { cityList } from '../../actions/city'

export const CitySelectField = ({formik_props, country_id, ...props}) => {

    const dispatch = useDispatch()
    
    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(cityList.updatePaginationNumItemsPerPage(1000))
            dispatch(cityList.filterOnCountry(country_id))
            dispatch(cityList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [country_id])

    const city_options = cityList.getAsOptions()
    
    return (
        <FormikDropdownField options={city_options}
                             formik_props={formik_props}
                             label="City"
                             {...props}
        />
    )
}

