/** @jsx jsx */
import { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useFormikContext } from 'formik'
import * as React from 'react'
import { FormikProps, FormikState } from 'formik'

const DEFAULT_DELAY_MS = 500

// export const createDebouncedSave = ({save_func}) => {
//     return useCallback(debounce(save_func, DEFAULT_DELAY_MS), [])
// }

const FormikOnChange = ({ delay_ms, onChange }) => {
    const formik_props = useFormikContext()
    const { values } = formik_props
    
    const isFirstRun = useRef(true)
    delay_ms = delay_ms || DEFAULT_DELAY_MS
    const debouncedOnChange = useCallback(debounce(onChange, delay_ms), [])

    useDeepCompareEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }
        if (delay_ms > 0) {
            debouncedOnChange(values)
        } else {
            onChange(values)
        }
    }, [values])

    return null
}

export default FormikOnChange


