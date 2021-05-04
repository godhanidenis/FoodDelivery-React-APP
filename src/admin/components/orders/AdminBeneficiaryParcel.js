/** @jsx jsx */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../../emotion/theme'
import { Link } from 'react-router-dom'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminParcelList } from '../../../admin/components/orders/actions/admin_parcel'
import { adminParcelStates } from '../../../admin/actions/admin_dropdown_options'
import FormCard from '../../../components/layout/FormCard'
import { adminBeneficiaryList } from '../../../admin/components/beneficiaries/actions/admin_beneficiary'
import { getAddressOptions } from '../../../admin/components/layout/InlineAddress'
import { FormLabelValue } from '../../../components/form/FormLabelValue'
import { FormikBeneficiaryAddressDropdownWithFormBasedAddNew } from '../../../admin/components/beneficiaries/form/BeneficiaryAddressDropdown'
import { FormikDropdownField } from '../../../components/form/Dropdown'
import AssessmentIcon from '@material-ui/icons/Assessment'
import { FormikAddressDropdownWithFormBasedAddNew } from '../../../admin/components/addresses/form/AddressDropdown'
import { FormikBringgStatus } from '../../../admin/components/integrations/bringg/BringgStatus'
import { FormikWarehouseAutoCompleteDropdown } from '../../../admin/components/warehouses/form//WarehouseAutoCompleteDropdown'
import { FormikBeneficiaryAutoCompleteDropdown } from '../../../admin/components/beneficiaries/form/BeneficiaryAutoCompleteDropdown'
import { FormikDriverAutoCompleteDropdown } from '../../../admin/components/drivers/form/DriverAutoCompleteDropdown'
import { FormikPickerAutoCompleteDropdown } from '../../../admin/components/pickers/form//PickerAutoCompleteDropdown'
import { FormikDateTimePicker } from '../../../components/form/DatetimePicker'
import { FormikCheckboxField } from '../../../components/form/CheckboxField'
import { Separator } from '../../../components/layout/Separator'
import { Formik, Form, FieldArray, Field } from 'formik'
import Loading from '../../../components/Loading'
import { FormikInputField } from '../../../components/form/InputField'
import { FormikTextareaField } from '../../../components/form/TextareaField'
import AdminMainLayout from '../layout/AdminMainLayout'
import AdminBeneficiaryParcelProducts from './AdminBeneficiaryParcelProducts'
import BusyMask from '../../../components/BusyMask'
import Timestamp from '../../../components/Timestamp'
import { AdminParcelStateHistory } from './AdminParcelStateHistory'
import { AdminParcelPickerHistory } from './AdminParcelPickerHistory'
import { AdminParcelDriverHistory } from './AdminParcelDriverHistory'
import * as Yup from 'yup'
import {showSuccess, showError} from '../../../actions/Error'
import CardInfoText from '../../../components/layout/CardInfoText'
import { handleSubmitResult, shouldShowOnDemandSaveButton } from '../../../actions/form'
import { Select } from 'formik-material-ui'
import { makeStyles} from '@material-ui/core/styles'
import { Grid, Card, CardContent, Typography, Divider, Button } from '@material-ui/core'
import muiTheme from '../../../muiTheme'
import Alert from '@material-ui/lab/Alert'
import FileDropzone from '../layout/FileDropzone'
import MapContainer from '../../../components/map/MapContainer'
import { provinceList } from '../../../actions/province'

const yup_shape = {
    'to_company': Yup.string().required("Required")
}

const classes = makeStyles((muiTheme) => ({
  root: {
    display: 'flex',
  },
  card: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

const validationSchema = Yup.object().shape(yup_shape)

export default function AdminBeneficiaryParcel({match}) {

    const dispatch = useDispatch()
    const parcel_id = get(match, ["params", "parcel_id"], null)
    const parcel = adminParcelList.getObject(parcel_id)
    const depart_warehouse_name =  parcel.depart_warehouse_name
    const province_options = provinceList.getAsOptions()
    const is_loading = parcel_id && !get(parcel, "id")
    const is_busy =  adminParcelList.getIsSavingObject()
    const is_new = !parcel_id && true
    const initial_values =  Object.assign({status: 'pending'}, parcel)
    const parcel_state_options =  adminParcelStates.getAsOptions()
    const title = `Beneficiary Dropoff: ${get(parcel, ["short_ref"], 'New')}`
    const history = useHistory()

    const map_locations = [
        {
            company : {
                name: 'Primi Warehouse',
                address: "8 Dacres Ave, Goodwood, Cape Town, 7475"
            },
            location: {
                lat: -33.9293619,
                lng: 18.5505514
            },
        },
    ]

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminParcelList.ensureObjectLoaded(parcel_id))
            dispatch(adminParcelStates.fetchListIfNeeded())
            dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
            dispatch(provinceList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [parcel_id])

    const onSave = (values, formik_funcs) => {
        const on_ok = function(values) {
           
            dispatch(adminParcelList.invalidateList())
            showSuccess("Saved", "Dropoff saved")

            if ( ! parcel_id ) {
                history.push(`/admin/beneficiary_dropoff/${values.id}`)
            }
        }
        values.direction = 'beneficiary_dropoff'
        if ( parcel_id ) {
            values.id = parcel_id
            return dispatch(adminParcelList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminParcelList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    const renderGeneralForm = (formik_props) => {
        const beneficiary = adminBeneficiaryList.getForCompany({company_id: get(formik_props, ["values", "to_company"])})
        const dropoff_address_options = getAddressOptions(get(beneficiary, ["company", "addresses"]))

        return (
            <div>
              <FormikBeneficiaryAutoCompleteDropdown name="to_company"
                                                     label="Beneficiary"
                                                     formik_props={formik_props} />

              { get(beneficiary, "id") &&
                <>
                  <FormikBeneficiaryAddressDropdownWithFormBasedAddNew name="arrive_address"
                                                                       beneficiary={beneficiary}
                                                                       label="Dropoff Address"
                                                                       options={dropoff_address_options}
                                                                       formik_props={formik_props} />

                  <FormikWarehouseAutoCompleteDropdown name='depart_warehouse'
                                                       label="From warehouse"
                                                       formik_props={formik_props} />
                </>

              }

              
              { ! is_new &&
                <>

                  <FormikDateTimePicker name="arrive_at"
                                        label="Dropoff Date"
                                        formik_props={formik_props} />

                  <FormikTextareaField name="description"
                                       label="Description"
                                       formik_props={formik_props}
                  />
                </>
              }


            </div>
        )
    }


    const renderStateForm = (formik_props) => {
        return(
            <>
              <FormikDropdownField name="status"
                                   label="Status"
                                   validate_on_select={true}
                                   options={parcel_state_options}
                                   formik_props={formik_props} />
              { shouldShowOnDemandSaveButton(formik_props, ["status"]) && 
                <Button variant="contained" size="large" type="submit" color="primary">
                  SAVE
                </Button>
              }
            </>
        )
    }

    const renderDriverForm = (formik_props) => {
        return(
            <>
              <FormikDriverAutoCompleteDropdown name="driver"
                                                label="Driver"
                                                validate_on_select={true}
                                                formik_props={formik_props} />
              { shouldShowOnDemandSaveButton(formik_props, ["driver"]) && 
                <Button variant="contained" size="large" type="submit" color="primary">
                  SAVE
                </Button>
              }
            </>
        )
    }

    const renderPickerForm = (formik_props) => {
        return(
            <>
              <FormikPickerAutoCompleteDropdown name="picker"
                                                label="Picker"
                                                formik_props={formik_props} />
              { shouldShowOnDemandSaveButton(formik_props, ["picker"]) && 
                <Button variant="contained" size="large" type="submit" color="primary">
                  SAVE
                </Button>
              }
            </>
        )
    }

    const renderBringgForm = (formik_props) => {
        return (
            <>
              <FormikBringgStatus formik_props={formik_props} />
              { shouldShowOnDemandSaveButton(formik_props, ["bringg_ref"]) && 
                <Button variant="contained" size="large" type="submit" color="primary">
                  SAVE
                </Button>
              }
            </>
        )
    }

    return (
        <AdminMainLayout breadcrumbs={[{name: 'admin_home'},

                                       {name: 'parcels',
                                        label: 'Orders',
                                        url: '/admin/parcels'},

                                       {name: 'parcel',
                                        label: `Beneficiary Dropoff: ${get(parcel, ["short_ref"], 'New')}`,
                                        url: `/admin/beneficiary_dropoff/${parcel_id}`
                                       }
                                      ]}>
          <Formik
            initialValues={initial_values}
            onSubmit={onSave}
            enableReinitialize={true}
            validationSchema={validationSchema}
          >
            {formik_props => {
                const { values } = formik_props
                return (
                    <Form>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12} lg={12}>{ is_busy && <BusyMask /> }
                          { is_loading && <Loading /> }
                          <Typography variant="h6">
                            {title}
                            { parcel_id && 
                              <Link to={`/admin/beneficiary_dropoff/${parcel_id}/tracking_report`}>
                                <AssessmentIcon/>
                              </Link>
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={7} lg={8}>
                          { ! is_loading &&
                            <div>
                              <FormCard>
                                { renderGeneralForm(formik_props) }
                              </FormCard>
                            </div>
                          }

                          { ! is_new && 
                            
                            <>
                              <Card className={classes.card}>
                                <Typography variant="h6" style={{padding:"5px 10px"}}>Products</Typography>
                                <Divider />
                                <CardContent>
                                  <AdminBeneficiaryParcelProducts parcel_id={parcel_id} depart_warehouse_name = {depart_warehouse_name}/>
                                </CardContent>
                              </Card>

                              { false && 
                                <Card className={classes.card}>
                                  <Typography variant="h6"  style={{padding:"5px 10px"}}>Images</Typography>
                                  <Divider />
                                  <CardContent>
                                    <FileDropzone />
                                  </CardContent>
                                </Card>
                              }

                              { false && 
                                <Card className={classes.card}>
                                  <Typography variant="h6"  style={{padding:"5px 10px"}}>Activity</Typography>
                                  <Divider />
                                  <CardContent>
                                    <Alert severity="info">Order Activity will go here</Alert>
                                  </CardContent>
                                </Card>
                              } 
                            </>
                          }

                        </Grid>

                        { ! is_new && 
                          
                          <Grid item xs={12} md={5} lg={4}>
                            <Card>
                              <Typography variant="h6" style={{padding:"5px 10px"}}>Status</Typography>
                              <Divider />
                              <CardContent>
                                { renderStateForm(formik_props) }
                                <AdminParcelStateHistory parcel_id={parcel_id} />
                              </CardContent>
                            </Card>

                            { false && 
                              <Card>
                                <Typography variant="h6"  style={{padding:"5px 10px"}}>Picker</Typography>
                                <Divider />
                                <CardContent>
                                  { renderPickerForm(formik_props) }
                                  <AdminParcelPickerHistory parcel_id={parcel_id} />
                                </CardContent>
                              </Card>
                            }

                            <Card>
                              <Typography variant="h6"  style={{padding:"5px 10px"}}>Driver</Typography>
                              <Divider />
                              <CardContent>
                                { renderDriverForm(formik_props) }
                                <AdminParcelDriverHistory parcel_id={parcel_id} />
                              </CardContent>
                            </Card>

                            <Card>
                              <Typography variant="h6"  style={{padding:"5px 10px"}}>Bringg</Typography>
                              <Divider />
                              <CardContent>
                                { renderBringgForm(formik_props) }
                              </CardContent>
                            </Card>

                            { false && 
                              <Card className={classes.fixedHeight} >
                                <MapContainer
                                  locations={map_locations}
                                  width="auto"
                                  height="240px"
                                  zoom={14}
                                />
                              </Card>
                            }

                            { false && 
                              <Card className={classes.fixedHeight} >
                                <Typography variant="h6"  style={{padding:"5px 10px"}}>Nutrition Score</Typography>
                                <Divider />
                                <CardContent>
                                  <Alert>Nutrition Information and Pie Chart goes here</Alert>
                                </CardContent>
                              </Card>
                            }

                          </Grid>
                        }

                      </Grid>
                    </Form>
                )}}
          </Formik>

        </AdminMainLayout>
    )

}
