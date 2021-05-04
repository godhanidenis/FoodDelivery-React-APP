/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import FormCard from 'components/layout/FormCard'
import { adminReport } from './actions/admin_report'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import { Button } from 'components/layout/Button'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { handleSubmitResult } from 'actions/form'
import AdminMainLayout from '../layout/AdminMainLayout'
import { FormikDateTimePicker } from 'components/form/DatetimePicker'
import { FormikInputField } from 'components/form/InputField'
import { FormikDropdownField } from 'components/form/Dropdown'
import Typography from '@material-ui/core/Typography'

export const validationSchema = Yup.object().shape({
    // from: Yup.string().required("Required"),
    // to: Yup.string().required("Required")
})

class AdminBeneficiaryParcelReport extends Component {

    onGenerateDateRangeBeneficiaryParcelReport = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, warehouse_id } = this.props

        const on_ok = function(json) {
            showSuccess("Complete", "Report generated")
        }
        return dispatch(adminReport.generateDateRangeBeneficiaryParcelReport(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }

    onGenerateWeeklyBeneficiaryParcelReport = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, warehouse_id } = this.props

        const on_ok = function(json) {
            showSuccess("Complete", "Report generated")
        }
        return dispatch(adminReport.generateWeeklyBeneficiaryParcelReport(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }

    onGenerateMonthlyBeneficiaryParcelReport = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, warehouse_id } = this.props

        const on_ok = function(json) {
            showSuccess("Complete", "Report generated")
        }
        return dispatch(adminReport.generateMonthlyBeneficiaryParcelReport(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }

    renderDateRangeBeneficiaryParcelReport() {
        return (
            <Formik initialValues={{type: 'date_range'}}
                    onSubmit={this.onGenerateDateRangeBeneficiaryParcelReport}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
            >
              {formik_props =>
               <Form>
                 <FormCard save_label="Generate">
                   <Typography variant="h5" >Date range report</Typography>

                   <FormikDateTimePicker name="arrive_at_from"
                                         label="From"
                                         include_time={false}
                                         formik_props={formik_props}
                   />
                   <FormikDateTimePicker name="arrive_at_to"
                                         label="To"
                                         include_time={false}
                                         formik_props={formik_props}
                   />

                 </FormCard>
               </Form>
              }
            </Formik>
        )
    }

    renderMonthlyBeneficiaryParcelReport() {
        return (
            <Formik initialValues={{type:'monthly'}}
                    onSubmit={this.onGenerateMonthlyBeneficiaryParcelReport}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
            >
              {formik_props =>
               <Form>
                 <FormCard save_label="Generate">
                   <Typography variant="h5" >Monthly report</Typography>

                   <FormikDateTimePicker name="arrive_at_any_date_in_month"
                                         label="Select any date in the reporting month"
                                         include_time={false}
                                         formik_props={formik_props}
                   />
                 </FormCard>
               </Form>
              }
            </Formik>
        )
    }

    renderWeeklyBeneficiaryParcelReport() {
        return (
            <Formik initialValues={{type:'weekly'}}
                    onSubmit={this.onGenerateWeeklyBeneficiaryParcelReport}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
            >
              {formik_props =>
               <Form>
                 <FormCard save_label="Generate">
                   <Typography variant="h5" >Weekly report</Typography>

                   <FormikDateTimePicker name="arrive_at_any_date_in_week"
                                         label="Select any date in the reporting week"
                                         include_time={false}
                                         formik_props={formik_props}
                   />
                 </FormCard>
               </Form>
              }
            </Formik>
        )
    }

    render() {
        const { initial_values, is_loading, is_busy } = this.props
        const that = this

        return (
            <AdminMainLayout breadcrumbs={[{name: 'admin_home'},
                                           {name: 'parcel report',
                                            label: 'Monthly Order Report',
                                            url: '/admin/reports/monthly_parcel'},

                                          ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title="Beneficiary Order Reports"
            >
              { this.renderWeeklyBeneficiaryParcelReport() }
              { this.renderMonthlyBeneficiaryParcelReport() }
              { this.renderDateRangeBeneficiaryParcelReport() }
            </AdminMainLayout>
        )
    }

}

function mapStateToProps(state, props) {
    return {
        initial_values: {}
    }
}

export default connect(mapStateToProps)(AdminBeneficiaryParcelReport)
