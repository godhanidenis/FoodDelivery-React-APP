import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import FormCard from '../../../components/layout/FormCard'
import { adminReport } from './actions/admin_report'
import { Separator } from '../../../components/layout/Separator'
import { Formik, Form, Field } from 'formik'
import { Button } from '../../../components/layout/Button'
import Timestamp from '../../../components/Timestamp'
import { Link } from 'react-router-dom'
import { adminBeneficiaryParcelProductReportList } from '../../../admin/components/orders/actions/admin_beneficiary_parcel_product'
import { adminProductList } from '../../../admin/components/products/actions/admin_product'
import { HierarchyCrumbs } from '../../../components/layout/HierarchyCrumbs'
import Loading from '../../../components/Loading'
import { adminParcelList } from '../../../admin/components/orders/actions/admin_parcel'
import * as Yup from 'yup'
import {showSuccess, showError} from '../../../actions/Error'
import { handleSubmitResult } from '../../../actions/form'
import AdminMainLayout from '../layout/AdminMainLayout'
import { FormikDateTimePicker } from '../../../components/form/DatetimePicker'
import { FormikInputField } from '../../../components/form/InputField'
import { FormikDropdownField } from '../../../components/form/Dropdown'
import Typography from '@material-ui/core/Typography'
import {Paper, Table, TableHead, TableBody, TableRow, withStyles, Grid, IconButton} from '@material-ui/core'
import MuiTableCell from "@material-ui/core/TableCell"
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import { GeneratePDF } from './GeneratePDF'
import { PDFDownloadLink } from '@react-pdf/renderer'

const TableCell0 = withStyles({
  root: {
    borderBottom: "none"
  }
})(MuiTableCell)

const TableCell = withStyles({
  root: {
  }
})(MuiTableCell)

export const AdminBeneficiaryParcelTrackingReport = ({match}) => {

    const dispatch = useDispatch()
    const parcel_id = get(match, ["params", "parcel_id"], null)
    const to_company_name = get(match, ["to_company_name"], null)
    const parcel = adminParcelList.getObject(parcel_id)
    const is_loading = adminParcelList.isLoading()
    const parcel_products = adminBeneficiaryParcelProductReportList.getVisibleObjects()
    const product_ids = map(parcel_products, (parcel_product) => parcel_product.id)
    const cols = ["Donated by", "Product", "Expiry Date", "Qty", "Arrived WH"]
    const beneficiary = get(parcel, ["to_company_name"])
    const from_warehouse = get(parcel, ["depart_warehouse_name"])
    const depart_warehouse = get(parcel, "departed_at")
    const delivered = get(parcel, "arrive_at")
    const delivery_driver = get(parcel, ["driver_name"])
    const received_by = get(parcel, ["received_by"])

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminParcelList.ensureObjectLoaded(parcel_id))
            dispatch(adminBeneficiaryParcelProductReportList.updatePaginationNumItemsPerPage(1000))
            dispatch(adminBeneficiaryParcelProductReportList.updateListFilter({parcel: parcel_id}))
            dispatch(adminBeneficiaryParcelProductReportList.fetchListIfNeeded())
            // @ts-ignore
            dispatch(adminProductList.ensureObjectsLoaded(product_ids))
        }
        fetchStaticObjects()
    }, [parcel_id])

    const renderTitle = () => {
        return (
            <>
            <Table size="small">
              <TableRow>
                <TableCell0 width={200} variant="head" style={{fontSize: 18}}>Beneficiary:</TableCell0>
                <TableCell0 style={{fontSize: 18}}>{ beneficiary }</TableCell0>
              </TableRow>
              <TableRow>
                <TableCell0 width={200} variant="head" style={{fontSize: 18}}>Order ID:</TableCell0>
                <TableCell0 style={{fontSize: 18}}>{ parcel_id }</TableCell0>
              </TableRow>
              <TableRow>
                <TableCell0 variant="head" style={{fontSize: 18}}>From warehouse:</TableCell0>
                <TableCell0 style={{fontSize: 18}}>{ from_warehouse }</TableCell0>
              </TableRow>
              <TableRow>
                <TableCell0 variant="head" style={{fontSize: 18}}>Depart warehouse:</TableCell0>
                <TableCell0 style={{fontSize: 18}}><Timestamp format="date" use_span={true} value={ depart_warehouse } /></TableCell0>
              </TableRow>
              <TableRow>
                <TableCell0 variant="head" style={{fontSize: 18}}>Delivered:</TableCell0>
                <TableCell0 style={{fontSize: 18}}><Timestamp format="date" use_span={true} value={ delivered } /></TableCell0>
              </TableRow>
              <TableRow>
                <TableCell0 variant="head" style={{fontSize: 18}}>Delivery driver:</TableCell0>
                <TableCell0 style={{fontSize: 18}}>{ delivery_driver }</TableCell0>
              </TableRow>
            </Table>

            <Typography variant="h6" style={{padding: '7px 15px', background: '#dddddd', marginTop: 15}}>Products</Typography>
            </>
        )
    }

    const renderCols = (cols) => {
      return (
        <>
        {cols.map((col) => (
          <TableCell style={{backgroundColor: '#efefef'}}>{col}</TableCell>
        ))}
        </>
      )
    }

    const renderParcelProduct = (parcel_product) => {
        return (
           <TableRow>{}
            <TableCell>{get(parcel_product, "original_from_company_name")}</TableCell>
            <TableCell><Link to={`/admin/donor_pickup/${get(parcel_product, ["original_parcel", "id"])}/`}>{get(parcel_product, "product_name")}</Link></TableCell>
            <TableCell>{get(parcel_product, "actual_quantity")}</TableCell>
            <TableCell><Timestamp format="date" use_span={true} value={get(parcel_product, "expiry_date")} /></TableCell>
            <TableCell><Timestamp format="date" use_span={true} value={get(parcel_product, "original_parcel", "arrive_at")} /></TableCell>
           </TableRow>
        )
    }

    const DownloadPdf = () => {
      const titleData = [
        { name: "Beneficiary", value: beneficiary },
        { name: "Order ID", value: parcel_id },
        { name: "From warehouse", value: from_warehouse },
        { name: "Depart warehouse", value: depart_warehouse },
        { name: "Delivered", value: delivered },
      ]
      return(
          <PDFDownloadLink document={<GeneratePDF data={parcel_products} titleData={titleData} />} fileName="tracking-report.pdf">
            {({ loading }) => (loading ? 'loading...' : <PictureAsPdfIcon fontSize="large" color="error"/>)}
          </PDFDownloadLink>
      )
    }

    const renderProducts = () => {
        return (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {renderCols(cols)}
                </TableRow>
              </TableHead>
              <TableBody>
                {map(parcel_products, (parcel_product) => renderParcelProduct(parcel_product))}
              </TableBody>
            </Table>
        )
    }

    return (
        <AdminMainLayout breadcrumbs={[{name: 'admin_home'},

                                       {name: 'parcels',
                                        label: 'Orders',
                                        url: '/admin/parcels'},

                                       {name: 'tracking_reports',
                                        label: 'Tracking Reports',
                                        url: `/admin/beneficiacy_dropoff/${parcel_id}/tracking_reports`},

                                        {name: 'parcel',
                                         label: `Beneficiary Dropoff: ${get(parcel, ["short_ref"], 'New')}`,
                                         url: `/admin/beneficiary_dropoff/${parcel_id}`
                                        },


                                      ]}
                         title={"Beneficiary Tracking Report"}
        >
          { is_loading && <Loading /> }
          <Grid container justify="flex-end" style={{marginTop: -40}}>
            <DownloadPdf />
          </Grid>
          <Paper variant="outlined" style={{paddingTop: 15}}>
            <Paper variant="outlined" square style={{border: 'none'}}>{ renderTitle() }</Paper>
            { renderProducts() }
          </Paper>

        </AdminMainLayout>
    )

}
