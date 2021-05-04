/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { get, map } from 'lodash'
import { FormikDropdownField } from './Dropdown'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { provinceList } from '../../actions/province'

export const ProvinceSelectField = ({formik_props, country_id, ...props}) => {

    const dispatch = useDispatch()
    
    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
            dispatch(provinceList.filterOnCountry(country_id))
            dispatch(provinceList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [country_id])

    const province_options = provinceList.getAsOptions()
    
    return (
        <FormikDropdownField options={province_options}
                             formik_props={formik_props}
                             label="Region"
                             {...props}
        />
    )
}

