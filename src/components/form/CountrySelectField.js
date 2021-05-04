/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { get, map } from 'lodash'
import { FormikDropdownField } from './Dropdown'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { countryList } from '../../actions/country'

export const CountrySelectField = ({formik_props, ...props}) => {

    const dispatch = useDispatch()
    
    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(countryList.updatePaginationNumItemsPerPage(1000))
            dispatch(countryList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])

    const country_options = countryList.getAsOptions()
    
    return (
        <FormikDropdownField options={country_options}
                             formik_props={formik_props}
                             label="Country"
                             {...props}
        />
    )
}

