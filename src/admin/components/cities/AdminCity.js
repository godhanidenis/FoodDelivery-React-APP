/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminCityList } from './actions/admin_city'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminCommonFormLayout from '../layout/AdminCommonFormLayout'
import { FormikInputField } from 'components/form/InputField'
import AdminCityForm from './form/AdminCityForm'
import { validationSchema } from './form/AdminCityForm'

class AdminCity extends Component {

    componentDidMount() {
        const { dispatch, city_id } = this.props
        dispatch(adminCityList.ensureObjectLoaded(city_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, city_id } = this.props
        dispatch(adminCityList.ensureObjectLoaded(city_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, city_id } = this.props

        const on_ok = function(json) {
            dispatch(adminCityList.invalidateList())
            showSuccess("Saved", "City saved")

            if ( ! city_id ) {
                history.push(`/admin/city/${json.id}`)
            }
        }
        if ( city_id ) {
            values.id = city_id
            return dispatch(adminCityList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminCityList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    render() {
        const { initial_values, is_loading, is_busy, city, city_id } = this.props
        const that = this
        const title = `${get(city, "name", 'New city')}`

        return (
            <AdminCommonFormLayout breadcrumbs={[{name: 'admin_home'},

                                                 {name: 'cities',
                                                  label: 'Cities',
                                                  url: '/admin/cities'},

                                                 {name: 'city',
                                                  label: get(city, "name", 'New city'),
                                                  url: `/admin/city/${city_id}`
                                                 }
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title}
                                   initial_values={initial_values}
                                   validationSchema={validationSchema}
                                   onSave={this.onSave}>

              {
                  ({formik_props}) => <AdminCityForm formik_props={formik_props} />
              }
            </AdminCommonFormLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const city_id = get(props, ["match", "params", "city_id"], null)
    const city = adminCityList.getObject(city_id)

    return {
        city_id,
        city,
        is_loading: adminCityList.isLoading() || (city_id && !get(city, "id")),
        is_busy: adminCityList.getIsSavingObject(),
        initial_values: city
    }
}

export default connect(mapStateToProps)(AdminCity)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
