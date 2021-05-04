import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { FormikInputField } from './form/InputField'
import {showSuccess, showError} from 'actions/Error'
import LoginContainer from './LoginContainer'
import { useHistory } from 'react-router-dom'
import Logo from './layout/Logo'
import { Formik, Form, FieldArray, Field } from 'formik'
import { useDispatch } from 'react-redux'
import { userList } from 'actions/user'
import { login } from 'actions/auth'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    'email': Yup.string().required()
})

export default function ForgotPassword() {
    const dispatch = useDispatch()
    const history = useHistory()

    const onSendForgotPassword = (values) => {
        return dispatch(userList.forgotPassword({email:values.email})).then( () => {
            showSuccess("Password email sent")
            history.push("/")
        })
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className={classes.submit}
              >
                Send reminder
              </Button>
            </>
        )
    }

    return (
        <LoginContainer renderForm={renderForm}
                        validationSchema={validationSchema}
                        onSubmit={onSendForgotPassword} />
    )
}
