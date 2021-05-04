import { onGeneralServerError, onSubmissionError } from './Error'
import { filter, intersection, get, size, map, keys } from 'lodash'

const dummy_formik_funcs = {setFieldError: null, setSubmitting: null, setFieldTouched: null}

export const unpackFormikPropsForField = ({formik_props, name}) => {
    return {
        errors: get(formik_props.errors, name),
        touched: get(formik_props.touched, name),
    }
}

export const handleSubmitResult = ({res, formik_funcs, on_ok}) => {

    const is_form = formik_funcs && true
    formik_funcs = formik_funcs || dummy_formik_funcs
    const {setFieldError, setSubmitting, setFieldTouched} = formik_funcs

    if ( res.errors ) {
        if ( res.errors._error ) {
            onGeneralServerError(res)
        } else {
            if ( is_form ) {
                onSubmissionError(res)
            } else {
                onGeneralServerError(res)
            }
        }

        if ( setFieldError ) {
            map(keys(res.errors), function(field_name) {
                if ( field_name === "_error" ) {
                    setFieldTouched("non_field_errors", true, false)
                    setFieldError("non_field_errors", res.errors[field_name])
                } else {
                    const msg = res.errors[field_name]
                    if ( msg.non_field_errors ) {
                        setFieldTouched("non_field_errors", true, false)
                        setFieldError("non_field_errors", msg.non_field_errors[0])
                    } else {
                        setFieldError(field_name, msg)
                    }
                }
            })
        }
    } else {
        on_ok(res)
    }

    if (setSubmitting ) {
        setSubmitting(false)
    }
}

export const haveAnyOfTheseFieldsChanged = (formik_props, field_names) => {
    const touched_field_names = filter(keys(get(formik_props, "touched", {})), (x) => formik_props.touched[x] === true)
    const matching_touched = intersection(field_names, touched_field_names)
    return size(matching_touched) > 0
}

export const shouldShowOnDemandSaveButton = (formik_props, field_names) => {
    if ( ! haveAnyOfTheseFieldsChanged(formik_props, field_names) ) {
        return false
    }
    if ( formik_props.isSubmitting ) {
        return false
    }
    return true
}

