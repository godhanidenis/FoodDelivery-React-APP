import React from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { FormikInputField } from './form/InputField'
import { Link } from 'react-router-dom'
import LoginContainer from './LoginContainer'
import { Formik, Form, FieldArray, Field } from 'formik'
import { useDispatch } from 'react-redux'
import { login } from 'actions/auth'
import Grid from '@material-ui/core/Grid'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    'email': Yup.string().required(),
    'password': Yup.string().required(),
})

export default function Login() {
    const dispatch = useDispatch()

    const onLogin = (values) => {
        return dispatch(login(values.email, values.password))
    }

    const renderForm = ({formik_props, classes}) => {
        return (
            <>
              <FormikInputField name="email"
                                type="email"
                                label="Email Address"
                                autoFocus
                                autoComplete="email"
                                formik_props={formik_props}
                                inputProps={{style: {fontSize: 24, margin: 5 }}}
                                InputLabelProps={{style: {fontSize: 16}}}
              />
              <FormikInputField name="password"
                                type="password"
                                label="Password or One Time Pin"
                                autoComplete="current-password"
                                formik_props={formik_props}
                                inputProps={{style: {fontSize: 24, margin: 5}}}
                                InputLabelProps={{style: {fontSize: 16}}}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className={classes.submit}
              >
                Sign In
              </Button>
              
              <Grid container>
                <Grid item xs>
                  <Link to="/profile/forgot_password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </>
        )
    }
    
    return (
        <LoginContainer renderForm={renderForm}
                        validationSchema={validationSchema}
                        onSubmit={onLogin} />
    )
}
