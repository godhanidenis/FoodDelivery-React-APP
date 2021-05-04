import React, { Component, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'

const useStyles = makeStyles((theme) => ({
    success: {
        color: "green"
    },
    error: {
        color: "red"
    },
}))

export const StatusIndicator = ({ status, ...props }) => {
    const classes = useStyles()
    return (
        <FiberManualRecordIcon className={classes[status]} />
    )

}
