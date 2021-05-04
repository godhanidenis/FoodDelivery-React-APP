import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import { head, get, filter } from 'lodash'
import { Link } from 'react-router-dom'
import { Modal } from 'components/layout/Modal'
import { Trans, Translation } from 'react-i18next'
import { FormikDropdownField } from 'components/form/Dropdown'
import Timestamp from 'components/Timestamp'
import TableFilter from 'components/layout/TableFilter'
import { adminWarehouseProductList } from './actions/admin_warehouse_product'
import { adminWarehouseProductTotalQuantityList } from './actions/admin_warehouse_product_total_quantity'
import { adminWarehouseProductHistoryList } from './actions/admin_warehouse_product_history'
import { CommonTable } from 'components/CommonTable'
import AdminMainLayout from '../layout/AdminMainLayout'
import { HierarchyCrumbs } from 'components/layout/HierarchyCrumbs'
import { Separator } from 'components/layout/Separator'
import { ShortId } from 'components/ShortId'
import { DatePicker } from 'components/form/DatetimePicker'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import { AdminWarehouseProductForm } from './AdminWarehouseProductForm'
import { AdminWarehouseProductHistoryList } from './AdminWarehouseProductHistoryList'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    product_modal: {
        minWidth: "50%"
    },
    negative_quantity: {
        color: "red"
    }
    
}))

const NEW_PRODUCT_TOKEN = "__new__"

export default function AdminWarehouseProducts() {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const [editingWarehouseProductId, setEditingWarehouseProductId] = useState(null)
    const [showingHistoryForWarehouseProduct, setShowHistoryForWarehouseProduct] = useState(null)
    const warehouse_products = adminWarehouseProductList.getVisibleObjects()
    const warehouse_products_total_quantity = adminWarehouseProductTotalQuantityList.getVisibleObjects()
    
    const warehouse_product_filter = adminWarehouseProductList.getFilter()
    const is_loading = adminWarehouseProductList.isLoading() && ! adminWarehouseProductList.isReady()
    const initial_filter_values = {}
    const [showProductTotal,setshowProductTotal] = useState(false)

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminWarehouseProductList.updateListFilter(initial_filter_values))
            dispatch(adminWarehouseProductList.fetchListIfNeeded())
            dispatch(adminWarehouseProductTotalQuantityList.updateListFilter(initial_filter_values))
            dispatch(adminWarehouseProductTotalQuantityList.fetchListIfNeeded())

        }
        fetchStaticObjects()
    }, [])

    const columnsDesktop = [
        { field: 'warehouse_name',
          title: 'Warehouse',
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'warehouse__name' : '-warehouse__name'),
        },
        { field: 'product_category_crumbs',
          title: 'Category',
          render: (item) => <HierarchyCrumbs crumbs={get(item, "product_category_crumbs", [])} />
        },
        { field: 'product_name',
          title: 'Product',
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'product__name' : '-product__name'),
        },
        { field: 'quantity',
          title: "Quantity",
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'quantity' : '-quantity'),
          render: (item) => (
              <>
              {item.quantity < 0 && <div className={classes.negative_quantity}>{item.quantity}</div>}
              {item.quantity >= 0 && <div >{item.quantity}</div>}
              </>
          )
        },
        { field: 'expiry_date',
          title: "Expiry date",
          render: (item) => <Timestamp value={item.expiry_date} format='datetime' />,
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'expiry_date' : '-expiry_date'),
        },
        { field: 'total_weight_kg',
          title: "Weight (kg)",
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'total_weight_kg' : '-total_weight_kg'),
        },
        { field: 'from_company_name',
          title: 'Donor',
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'from_parcel_products__parcel__from_company__name' : '-from_parcel_products__parcel__from_company__name'),
        },
        { field: 'created_at',
          title: 'Added at',
          render: (item) => <Timestamp value={item.created_at} format='datetime' />,
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'donation__arrive_at' : '-donation__arrive_at'),
        },
        { field: 'history', title: 'History',
          render: function(item) {
              if ( get(showingHistoryForWarehouseProduct, "id") === item.id ) {
                  return <AdminWarehouseProductHistoryList onClose={onHideWarehouseProductHistory}
                                                           warehouse_product={showingHistoryForWarehouseProduct} />
              } else {
                  return (
                      <Button onClick={() => onShowWarehouseProductHistory(item)}>
                        History
                      </Button>
                  )
              }
          }
        },
    ]


    const columnsDesktopProductTotals = [
        { field: 'product_category_crumbs',
          title: 'Category',
          render: (item) => <HierarchyCrumbs crumbs={get(item, "product_category_crumbs", [])} />
        },
        { field: 'name',
          title: 'Product',
        },
        { field: 'total_quantity',
          title: "Total Quantity",
        }
    ]
    

    const handleChangeProductTotal = (event) => {
      setshowProductTotal(event.target.checked);
    };

    const columnsMobile2 = columnsDesktopProductTotals

    const columnsMobile = columnsDesktop

    const onAddWarehouseProduct = () => {
        setEditingWarehouseProductId(NEW_PRODUCT_TOKEN)
    }

    const onEditWarehouseProduct = (warehouse_product_id) => {
        setEditingWarehouseProductId(warehouse_product_id)
    }

    const onStopEditingWarehouseProduct = () => {
        setEditingWarehouseProductId(null)
    }

    const onSavedWarehouseProduct = () => {
        dispatch(adminWarehouseProductList.invalidateList())
        dispatch(adminWarehouseProductList.fetchListIfNeeded())
        onStopEditingWarehouseProduct()
    }

    const onShowWarehouseProductHistory = (warehouse_product) => {
        setShowHistoryForWarehouseProduct(warehouse_product)
    }

    const onHideWarehouseProductHistory = () => {
        setShowHistoryForWarehouseProduct(null)
    }
    
    const onUpdateListOrdering = (field) => {
        dispatch(adminWarehouseProductList.updateListOrdering(field))
    }

    const renderEditProductForm = (warehouse_product_id) => {
        const is_new = warehouse_product_id === NEW_PRODUCT_TOKEN
        const warehouse_product = is_new ? null : adminWarehouseProductList.getObject(warehouse_product_id)
        return (
            <Modal onClose={onStopEditingWarehouseProduct}
                   className={classes.product_modal}
                   fullWidth={true}
                   maxWidth='md'
                   title={is_new ? "Add product to warehouse" : warehouse_product.product_name}
            >
              <AdminWarehouseProductForm onCancel={onStopEditingWarehouseProduct}
                                         onSaved={onSavedWarehouseProduct}
                                         warehouse_product={is_new ? null : warehouse_product}
              />
            </Modal>
        )
    }

    return (
        <AdminMainLayout active_key="warehouse_products"
                         breadcrumbs={[{name: 'admin_home'},
                                       {name: 'warehouse_products', label: "Inventory", url: '/inventory'}]}>

          <div className={classes.root}>
            <Grid container spacing={1}>

            </Grid>
          </div>

          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} lg={3}>
                <Button size="large" variant="containedew" color="primary" fullWidth onClick={ onAddWarehouseProduct }>Add new product to inventory</Button>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
          <FormControlLabel
            control={
                 <Switch
              checked={showProductTotal}
              onChange={handleChangeProductTotal}
              name="productTotal"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          }
          label="Show Product Total"
        />
              </Grid>
            </Grid>
          </div>



          { showProductTotal == false &&

          <>
            <Hidden smDown>
              <CommonTable
                is_loading={ is_loading }
                rows={ warehouse_products }
                columns={ columnsDesktop }
                item_list={adminWarehouseProductList}
                onEditRow={onEditWarehouseProduct}
                canDelete={false}
              />
            </Hidden>
            <Hidden mdUp>
              <CommonTable
                is_loading={ is_loading }
                rows={ warehouse_products }
                columns={ columnsDesktop }
                item_list={adminWarehouseProductList}
                onEditRow={onEditWarehouseProduct}
              />
            </Hidden>
          </>

        }

        { showProductTotal == true &&
          <>
            <Hidden smDown>
              <CommonTable
                is_loading={ is_loading }
                rows={ warehouse_products_total_quantity }
                columns={ columnsDesktopProductTotals }
                item_list={adminWarehouseProductTotalQuantityList}
                canDelete={false}
              />
            </Hidden>
            <Hidden mdUp>
              <CommonTable
                is_loading={ is_loading }
                rows={ warehouse_products_total_quantity }
                columns={ columnsDesktopProductTotals }
                item_list={adminWarehouseProductTotalQuantityList}
                canDelete={false}
              />
            </Hidden>
          </>
         }

          { editingWarehouseProductId !== null && renderEditProductForm(editingWarehouseProductId) }
          
        </AdminMainLayout>
    )
}
