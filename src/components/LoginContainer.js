import React from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { FormikInputField } from './form/InputField'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import { Copyright }  from './Copyright'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Logo from './layout/Logo'
import { makeStyles } from '@material-ui/core/styles'
import loginBg from '../images/loginBg.jpg'
import { Formik, Form, FieldArray, Field } from 'formik'
import { useDispatch } from 'react-redux'
import { login } from 'actions/auth'
import * as Yup from 'yup'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(' + loginBg + ')',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        fontSize:24
    },
    //style for font size
    resize:{
      fontSize:30
    },
}))

export default function Login({renderForm, onSubmit, validationSchema}) {
    const classes = useStyles()

    return (

        <Formik
          initialValues={{}}
          onSubmit={onSubmit}
          enableReinitialize={true}
          validationSchema={validationSchema}
        >
          {formik_props => {
              const { values } = formik_props
              return (
                    <Grid container component="main" className={classes.root}>
                      <CssBaseline />
                      <Grid item xs={false} sm={4} md={7} className={classes.image} />
                      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <div className={classes.paper}>
                          <Logo style={{width: 240, marginBottom: 15 }} />
                          <LockOutlinedIcon style={{ fontSize: 40, marginBottom: 15 }} />
                          <Form className={classes.form}>
                            { renderForm({formik_props, classes}) }
                          </Form>
                          <Box mt={5}>
                            <Copyright />
                          </Box>
                        </div>
                      </Grid>
                    </Grid>

              )}
          }
        </Formik>
    )
}
