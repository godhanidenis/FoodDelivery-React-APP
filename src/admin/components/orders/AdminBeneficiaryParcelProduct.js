/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Link } from 'react-router-dom'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminBeneficiaryParcelProductList } from './actions/admin_beneficiary_parcel_product'
import { adminParcelList } from './actions/admin_parcel'
import FormCard from 'components/layout/FormCard'
import { FormLabelValue } from 'components/form/FormLabelValue'
import { FormikDropdownField } from 'components/form/Dropdown'
import { FormikWarehouseProductAutoCompleteDropdown } from 'admin/components/products/form/WarehouseProductAutoCompleteDropdown'
import { adminWarehouseProductAutoCompleteList } from 'admin/components/inventory/actions/admin_warehouse_product'
import { FormikDonorAutoCompleteDropdown } from 'admin/components/donors/form/DonorAutoCompleteDropdown'
import { FormikDateTimePicker } from 'components/form/DatetimePicker'
import { CardHeader } from 'components/layout/CardHeader'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, FieldArray, Field } from 'formik'
import Loading from 'components/Loading'
import { FormikInputField } from 'components/form/InputField'
import { FormikTextareaField } from 'components/form/TextareaField'
import AdminMainLayout from '../layout/AdminMainLayout'
import BusyMask from 'components/BusyMask'
import Timestamp from 'components/Timestamp'
import Card from 'components/layout/Card'
import { Row } from 'components/layout/Row'
import { Col } from 'components/layout/Col'
import { Container } from 'components/layout/Container'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { adminBeneficiaryList } from 'admin/components/beneficiaries/actions/admin_beneficiary'
import CardInfoText from 'components/layout/CardInfoText'
import { handleSubmitResult } from 'actions/form'
import { Select } from 'formik-material-ui'

const yup_shape = {
    'from_warehouse_product': Yup.string().required("Required"),
    'actual_quantity': Yup.number().required("Required"),
}

const validationSchema = Yup.object().shape(yup_shape)

class AdminParcelProduct extends Component {

    componentDidMount() {
        const { dispatch, parcel_product_id, parcel_id } = this.props
        dispatch(adminBeneficiaryParcelProductList.ensureObjectLoaded(parcel_product_id))
        dispatch(adminParcelList.ensureObjectLoaded(parcel_id))
    }

    componentDidUpdate(prev_props) {
        const { dispatch, parcel_product_id, parcel_id } = this.props
        dispatch(adminBeneficiaryParcelProductList.ensureObjectLoaded(parcel_product_id))
        dispatch(adminParcelList.ensureObjectLoaded(parcel_id))
    }

    onSave = (values, formik_funcs) => {
        const { history, onSubmit, dispatch, parcel_id, parcel_product_id, onSaved } = this.props

        const on_ok = function(json) {
            dispatch(adminBeneficiaryParcelProductList.invalidateList())
            dispatch(adminWarehouseProductAutoCompleteList.invalidateObject(get(values, "from_warehouse_product")))
            dispatch(adminWarehouseProductAutoCompleteList.invalidateObject(get(values, "from_warehouse_product")))
            dispatch(adminWarehouseProductAutoCompleteList.ensureObjectLoaded(get(values, "from_warehouse_product")))
            
            showSuccess("Saved", "Product saved")
            
            if ( onSaved ) {
                onSaved(json)
            } else if ( ! parcel_product_id ) {
                history.push(`/admin/parcel/${parcel_id}/product/${json.id}`)
            }
        }
        values.parcel = parcel_id
        if ( parcel_product_id ) {
            values.id = parcel_product_id
            return dispatch(adminBeneficiaryParcelProductList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminBeneficiaryParcelProductList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    renderForm(formik_props, is_new) {
        const { parcel } = this.props
        return (
            <div>

              <FormikWarehouseProductAutoCompleteDropdown name="from_warehouse_product"
                                                          can_edit={false}
                                                          label="Product"
                                                          formik_props={formik_props} />

              <FormikInputField name="actual_quantity"
                                label="Quantity"
                                formik_props={formik_props} />

              <FormikInputField name="total_weight_kg"
                                label="Weight (kg). Leave blank to auto calculate"
                                formik_props={formik_props} />

            </div>
        )
    }

    render() {
        const { initial_values, is_loading, is_busy, parcel_product, parcel_id, parcel_product_id, onCancel } = this.props
        const that = this
        const title = `${get(parcel_product, ["product_name"], 'Add product to order')}`
        const is_new = !parcel_product.from_warehouse_product
        
        return (
            <div>
                { ! is_loading &&

                  <Formik
                      initialValues={initial_values}
                      onSubmit={that.onSave}
                      enableReinitialize={true}
                      validationSchema={validationSchema}
                      >
                    {formik_props => {
                         const { values } = formik_props
                         return (
                             <Form>
                               <FormCard onCancel={onCancel}>
                                 <CardHeader title={title} />
                                 { that.renderForm(formik_props, is_new) }
                               </FormCard>
                             </Form>
                         )}
                    }
                  </Formik>
                }
            </div>
        )
    }

}

function mapStateToProps(state, props) {
    const parcel_id = props.parcel_id
    const parcel_product_id = props.parcel_product_id
    const parcel_product = adminBeneficiaryParcelProductList.getObject(parcel_product_id)
    const parcel = adminParcelList.getObject(parcel_id)
    return {
        parcel_product_id,
        parcel_id,
        parcel,
        parcel_product,
        is_loading: adminBeneficiaryParcelProductList.isLoading() || (parcel_product_id && !get(parcel_product, "id")),
        is_busy: adminBeneficiaryParcelProductList.getIsSavingObject(),
        initial_values: Object.assign({}, parcel_product)
    }
}

export default connect(mapStateToProps)(AdminParcelProduct)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
