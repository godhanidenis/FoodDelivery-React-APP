import React, {useState, useEffect} from 'react'
import { get, map, join, reverse, size, clone } from 'lodash'
import { useDispatch } from 'react-redux'
import { adminWarehouseProductAutoCompleteList } from '../../../../admin/components/inventory/actions/admin_warehouse_product'
import AdminProductForm from './AdminProductForm'
import {showSuccess, showError} from '../../../../actions/Error'
import { ShortId } from 'components/ShortId'
import * as Yup from 'yup'
import { Formik, Form, FieldArray, Field } from 'formik'
import { Timestamp } from '../../../../components/Timestamp'
import { CommonTable } from '../../../../components/CommonTable'
import { handleSubmitResult } from '../../../../actions/form'
import { validationSchema } from './AdminProductForm'
import TextField from '@material-ui/core/TextField'
import { Modal } from '../../../../components/layout/Modal'
import { makeStyles} from '@material-ui/core/styles'
import muiTheme from 'muiTheme'
import FormikOnChange from '../../../../components/form/FormikAutoSave'
import { FormikGeneralFormErrors } from '../../../../components/form/GeneralFormErrors'
import { FormikInputField } from '../../../../components/form/InputField'
import { ProductCategorySelectField } from '../../../../admin/components/productCategories/form/ProductCategorySelectField'
import { HierarchyCrumbs } from '../../../../components/layout/HierarchyCrumbs'
import Button from '@material-ui/core/Button'
import CommonInlineAddNewFormLayout from '../../../../components/layout/CommonInlineAddNewFormLayout'

const useStyles = makeStyles((muiTheme) => ({
    treeContainer: {
        margin: "10px"
    },
    infoRow: {
        display: "flex"
    },
    filterRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    filterRowItem: {
        marginRight: "10px",
        width: "100%"
    }
}))

export function FormikWarehouseProductAutoCompleteDropdown({name, label, formik_props, can_edit=true, ...props}) {

    const [open, setOpen] = useState(false)
    const [adding_new, setAddNew] = useState(false)
    const classes = useStyles()
    const dispatch = useDispatch()
    const { field, meta } = formik_props
    const touched = get(meta, "touched")
    const errors = get(meta, "error")
    const value = get(formik_props.values, name)
    const is_loading = adminWarehouseProductAutoCompleteList.isLoading()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminWarehouseProductAutoCompleteList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])
    
    const products = adminWarehouseProductAutoCompleteList.getVisibleObjects()

    const onUpdateListOrdering = (field) => {
      dispatch(adminWarehouseProductAutoCompleteList.updateListOrdering(field))
    }

    const columns = [
        { field: 'warehouse_name', title: 'Warehouse'},
        { field: 'product_name', title: 'Product'},
        { field: 'from_company_name', title: 'Donor'},
        { field: 'quantity', title: 'Quantity available',
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'quantity' : '-quantity'),
        },
        { field: 'product_category', title: 'Categories',
          render: (item) => <HierarchyCrumbs crumbs={get(item, "product_category_crumbs", [])} />
        },
        { field: 'expiry_date', title: 'Expiry date',
          render: (item) => <Timestamp value={get(item, "expiry_date")} format='date' />,
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'expiry_date' : '-expiry_date'),
        },
        { field: 'created_at', title: 'Added at',
          render: (item) => <Timestamp value={get(item, "expiry_date")} format='datetime' />,
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at'),
        },
    ]
    
    const onClose = () => {
        setOpen(false)
    }

    const onOpen = () => {
        setOpen(true)
    }

    const onSelectItem = ({id}) => {
        formik_props.setFieldValue(name, id)
        onClose()
    }

    const onFilterChanged = (values, formik_props) => {
        dispatch(adminWarehouseProductAutoCompleteList.updateListFilter(values))
        dispatch(adminWarehouseProductAutoCompleteList.fetchListIfNeeded())
    }

    const renderFilter = () => {
        return (
            <Formik initialValues={{}}
                    onSubmit={onFilterChanged}
                    enableReinitialize={true}
              >
                {formik_props => {
                    const { values } = formik_props
                    return (
                        <Form>
                          <FormikOnChange onChange={(values) => onFilterChanged(values, formik_props)} />
                          <FormikGeneralFormErrors render={(msg) => msg} />
                          <div className={classes.filterRow}>
                            <div className={classes.filterRowItem}>
                              <ProductCategorySelectField name="product_category"
                                                          can_add={false}
                                                          can_edit={false}
                                                          formik_props={formik_props} />
                            </div>
                            <div className={classes.filterRowItem}>
                              <FormikInputField name="any_field"
                                                placeholder="Search product"
                                                formik_props={formik_props}
                                                show_search_icon={true}
                              />
                            </div>

                            <div className={classes.filterRowItem}>
                              <Button variant="contained"
                                      onClick={() => setAddNew(true)}
                              >
                                Add new product
                              </Button>
                            </div>
                            

                          </div>
                        </Form>
                    )
                }}
            </Formik>
        )        
    }

    const onSaveNewProduct = (values, formik_funcs) => {
        const on_ok = function(json) {
            dispatch(adminWarehouseProductAutoCompleteList.invalidateList())
            dispatch(adminWarehouseProductAutoCompleteList.fetchListIfNeeded())
            showSuccess("Saved", "New product Saved")
            const product_id = json.id
            setAddNew(false)
            onSelectItem({id:product_id})
        }
        return dispatch(adminWarehouseProductAutoCompleteList.saveNewObject(values))
            .then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }
    
    const renderAddNewProduct = () => {
        return (
            <CommonInlineAddNewFormLayout
              is_loading={false}
              title={"Add Warehouse Product"}
              initial_values={{}}
              validationSchema={validationSchema}
              onCancel={() => setAddNew(false)}
              onSave={(values, formik_funcs) => onSaveNewProduct(values, formik_funcs)}
            >
              {
                  ({formik_props}) => <AdminProductForm formik_props={formik_props} />
              }
            </CommonInlineAddNewFormLayout>
        )
    }
    
    const renderTreeSelector = () => {
        return (
            <Modal onClose={onClose}
                   fullWidth={true}
                   maxWidth='xl'
                   title="Select a product from inventory"
            >
              <div className={classes.treeContainer}>
                { renderFilter() }

                { adding_new && renderAddNewProduct() }
                <CommonTable is_loading={ is_loading }
                             rows={ products }
                             canDelete={false}
                             columns={columns}
                             onSelectRow={(item) => onSelectItem({id:item.id})}
                             item_list={adminWarehouseProductAutoCompleteList}
                />
                
              </div>
            </Modal>
        )
    }

    const renderClosedContent = () => {
        const selected_warehouse_product = value && adminWarehouseProductAutoCompleteList.getObject(value)
        const crumbs = get(selected_warehouse_product, "product_category_crumbs", "")
        const product_name = get(selected_warehouse_product, "product_name", "")

        return (
            <>
              <HierarchyCrumbs crumbs={crumbs} empty_label={""} extra_crumb={product_name} />
              <div className={classes.infoRow}>
                Available: {selected_warehouse_product.quantity}
              </div>
              <div className={classes.infoRow}>
                Expiry date: <Timestamp value={selected_warehouse_product.expiry_date} format="date" />
              </div>
            </>
        )
    }

    const renderClosed = () => {

        const selected_warehouse_product = value && adminWarehouseProductAutoCompleteList.getObject(value)
        const crumbs = get(selected_warehouse_product, "product_category_crumbs", "")
        const product_name = get(selected_warehouse_product, "product_name", "")
        
        return (
            <>
              { ! can_edit && renderClosedContent() }
              
              { can_edit && 
                <Button variant="contained"
                        onClick={onOpen}>

                  { selected_warehouse_product &&
                    <>
                      { renderClosedContent() }
                    </>
                  }
                  { !selected_warehouse_product &&
                    "Select Product"
                  }
                </Button>
              }
            </>
            
        )
    }
    
    return (
        <div>
          { open && renderTreeSelector() }
          { ! open && renderClosed() }
        </div>
    )
    
}
