/** @jsx jsx */
// @ts-ignore
import React, { Component, useState } from 'react'
// @ts-ignore
import { jsx, css } from '@emotion/core'
import { withStyles } from '@material-ui/core/styles'
// @ts-ignore
import { default_theme as theme } from '../../emotion/theme'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flexGrow: 1,
    },
})

function FullScreenAppBar({title, onClose, onSave}) {
    return(
        // @ts-ignore
        <>
          <AppBar className={styles.
// @ts-ignore
          appBar} style={{background: '#efefef', color: '#000000'}}>
            <Toolbar>

              <Grid container justify="flex-start">
                <Typography variant="h6" className={styles.
// @ts-ignore
                title}>
                  {title}
                </Typography>
              </Grid>
              <Grid container justify="flex-end">
                <Button onClick={onClose} variant="contained" style={{marginRight:15}}>Cancel</Button>
                <Button autoFocus onClick={onSave} variant="contained" color="secondary">Save & Close</Button>
              </Grid>
            </Toolbar>
          </AppBar>
          <div style={{height:80}}></div>
        </>
    )
}

// @ts-ignore
const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
          <Typography variant="h6">{children}</Typography>
          {onClose ? (
              <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
          ) : null}
        </MuiDialogTitle>
    )
})

export const Modal = ({children, title, fullScreen=false, onClose, onSave, ...props}) => {

    const showAppBar = fullScreen === true
    
    return (
        <Dialog open={true}
                onClose={onClose}
                fullScreen={fullScreen}
                aria-labelledby="customized-dialog-title"
                {...props}
        >
          { showAppBar && FullScreenAppBar({title, onClose, onSave}) }
          { ! fullScreen && 
            <DialogTitle id="customized-dialog-title" onClose={onClose}>
              {title}
            </DialogTitle>
          }
          <div>
            { showAppBar && <div style={{height:80}}></div> }
            {children}
          </div>
        </Dialog>
    )

}
