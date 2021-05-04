import { map, get, isString } from 'lodash'
import {NotificationManager} from 'react-notifications'
import * as Sentry from '@sentry/browser'

export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE'

export function onGeneralServerError(error) {
    showError("Error", get(error, ["errors", "_error"], "Internal error"))
    Sentry.captureException(error)
}

export function onSubmissionError(error) {
    const general_error = get(error, ["errors", "_error"])
    if ( general_error ) {
        onGeneralServerError(error)
        Sentry.captureException(error)
    } else {
        showError("Save failed", "Check the form for errors")
        // onDone(res)
    }
}

export function setErrorMessage(error) {
    return {
        type: SET_ERROR_MESSAGE,
        error_message: error
    }
}

export function clearErrorMessage() {
    return setErrorMessage(null)
}

export function getSubmissionErrors(json) {
    const submission_errors = {}
    if ( isString(json) ) {
        console.error(json)
        return {'_error': 'Internal error'}
    }
    map(json, (error, field_name) => {
        if (field_name !== 'non_field_errors') {
            submission_errors[field_name] = error
        } else {
            submission_errors['_error'] = error
        }
    })
    return submission_errors
}

export function showSuccess(msg, sub_msg) {
    if ( msg ) {
        NotificationManager.success(sub_msg || "", msg)
    }
}

export function showError(msg, sub_msg, ex) {
    if ( msg ) {
        NotificationManager.error(sub_msg || "", msg)
    }
    if ( ex ) {
        Sentry.captureException(ex)
    }
}

