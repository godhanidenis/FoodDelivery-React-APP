// @ts-nocheck
/** @jsx jsx */
import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Link } from 'react-router-dom'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminParcelList } from './actions/admin_parcel'
import { adminParcelStates, adminDriverStates } from 'admin/actions/admin_dropdown_options'
import FormCard from 'components/layout/FormCard'
import { adminDonorList, adminDonorAddressManager } from 'admin/components/donors/actions/admin_donor'
import { getAddressOptions } from '../layout/InlineAddress'
import { FormLabelValue } from 'components/form/FormLabelValue'
import { FormikDonorAddressDropdownWithFormBasedAddNew } from 'admin/components/donors/form/DonorAddressDropdown'
import { FormikBringgStatus } from 'admin/components/integrations/bringg/BringgStatus'
import { FormikDropdownField } from 'components/form/Dropdown'
import { FormikDonorAutoCompleteDropdown } from 'admin/components/donors/form/DonorAutoCompleteDropdown'
import { FormikDriverAutoCompleteDropdown } from 'admin/components/drivers/form/DriverAutoCompleteDropdown'
import { FormikWarehouseAutoCompleteDropdown } from 'admin/components/warehouses/form/WarehouseAutoCompleteDropdown'
import { FormikDateTimePicker } from 'components/form/DatetimePicker'
import { CardHeader } from 'components/layout/CardHeader'
import { FormikCheckboxField } from 'components/form/CheckboxField'
import { Separator } from 'components/layout/Separator'
import { Formik, Form, FieldArray, Field } from 'formik'
import Loading from 'components/Loading'
import { FormikInputField } from 'components/form/InputField'
import { FormikTextareaField } from 'components/form/TextareaField'
import AdminMainLayout from '../layout/AdminMainLayout'
import AdminDonorParcelProducts from './AdminDonorParcelProducts'
import BusyMask from 'components/BusyMask'
import Timestamp from 'components/Timestamp'
import { AdminParcelStateHistory } from './AdminParcelStateHistory'
import { AdminParcelDriverHistory } from './AdminParcelDriverHistory'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import { BlueButton } from 'components/layout/BlueButton'
import CardInfoText from 'components/layout/CardInfoText'
import { handleSubmitResult, shouldShowOnDemandSaveButton } from 'actions/form'
import { Select } from 'formik-material-ui'
import { makeStyles} from '@material-ui/core/styles'
import { Grid, Card, CardContent, Typography, Divider, Button } from '@material-ui/core'
import muiTheme from 'muiTheme'
import Alert from '@material-ui/lab/Alert'
import FileDropzone from '../layout/FileDropzone'
import MapContainer from 'components/map/MapContainer'
import { provinceList } from 'actions/province'

const yup_shape = {
    'from_company': Yup.string().required("Required"),
    'arrive_warehouse': Yup.string().required("Required"),
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

export default function AdminDonorParcel({match}) {

    const dispatch = useDispatch()
    const parcel_id = get(match, ["params", "parcel_id"], null)
    const parcel = adminParcelList.getObject(parcel_id)
    const province_options = provinceList.getAsOptions()
    const is_loading = parcel_id && !get(parcel, "id")
    const is_busy =  adminParcelList.getIsSavingObject()

    const is_new = !parcel_id && true
    const initial_values =  Object.assign({status: 'pending'}, parcel)

    // // This code to be completed, it doens't work because we have a company_id, not a donor_id,
    // // needs to resolve to the donor but I want to think of a clean way to do that.
    // if ( get(parcel, ["from_company"]) ) {
    //     const donor = adminDonorList.getObject(parcel.from_company)
    //     if ( donor ) {
    //         initial_values.depart_address = get(adminDonorAddressManager.getDefaultAddress(donor), "id")
    //     }
    // }
    
    const parcel_state_options =  adminParcelStates.getAsOptions()
    const driver_status_options =  adminDriverStates.getAsOptions()
    const title = `Donor Pickup: ${get(parcel, ["short_ref"], 'New')}`
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
    const history = useHistory()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminParcelList.ensureObjectLoaded(parcel_id))
            dispatch(adminParcelStates.fetchListIfNeeded())
            dispatch(adminDriverStates.fetchListIfNeeded())
            dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
            dispatch(provinceList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [parcel_id])

    const onSave = (values, formik_funcs) => {
        const on_ok = function(json) {
            dispatch(adminParcelList.invalidateList())
            showSuccess("Saved", "Pickup saved")

            if ( ! parcel_id ) {
                history.push(`/admin/donor_pickup/${json.id}`)
            }
        }
        values.direction = 'donor_pickup'
        if ( parcel_id ) {
            values.id = parcel_id
            return dispatch(adminParcelList.saveObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        } else {
            return dispatch(adminParcelList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
        }
    }

    const renderGeneralForm = (formik_props) => {
        const donor = adminDonorList.getForCompany({company_id: get(formik_props, ["values", "from_company"])})
        const pickup_address_options = getAddressOptions(get(donor, ["company", "addresses"]))

        return (
            <div>

              <FormikDonorAutoCompleteDropdown name="from_company"
                                               label="Donor"
                                               formik_props={formik_props} />

              { get(donor, "id") &&
                <>
                  <FormikDonorAddressDropdownWithFormBasedAddNew name="depart_address"
                                                                 donor={donor}
                                                                 label="Pickup Address"
                                                                 options={pickup_address_options}
                                                                 formik_props={formik_props} />

                  <FormikWarehouseAutoCompleteDropdown name="arrive_warehouse"
                                                       label="To warehouse"
                                                       formik_props={formik_props} />
                </>
              }

              { ! is_new &&
                <>
                  <FormikDateTimePicker name="depart_at"
                                        label="Pickup Date"
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
                                                formik_props={formik_props} />
              <FormikDropdownField name="driver_status"
                                   label="Status"
                                   validate_on_select={true}
                                   options={driver_status_options}
                                   formik_props={formik_props} />
              { shouldShowOnDemandSaveButton(formik_props, ["driver", "driver_status"]) && 
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
                                        label: `Donor Pickup: ${get(parcel, ["short_ref"], 'New')}`,
                                        url: `/admin/donor_pickup/${parcel_id}`
                                       }
                                      ]}>
          {! is_loading &&
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
                           <Typography variant="h6">{title}</Typography>
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
                                   <AdminDonorParcelProducts parcel_id={parcel_id} />
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
          }


        </AdminMainLayout>
    )

}
