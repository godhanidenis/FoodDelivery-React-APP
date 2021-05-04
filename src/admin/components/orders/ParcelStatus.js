// @ts-nocheck
/** @jsx jsx */
import React, { Component, useEffect } from 'react'
import { get } from 'lodash'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { useDispatch } from 'react-redux'
import { adminParcelStates } from 'admin/actions/admin_dropdown_options'
import { PARCEL_STATUS_COLOURS } from 'muiTheme'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  label: {
      padding: "3px",
      borderRadius: "2px",
  },
}))

export const ParcelStatus = ({ status, ...props }) => {
    const classes = useStyles()

    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminParcelStates.ensureObjectLoaded(status))
        }
        fetchStaticObjects()
    }, [])

    const status_obj = adminParcelStates.getObject(status)
    const label = get(status_obj, "name", "")
    const colour = get(PARCEL_STATUS_COLOURS, get(status_obj, "id"), "#ffffff")
    
    return (
        <span className={classes.label} style={{backgroundColor: colour}}>
          {label}
        </span>
    )

}
