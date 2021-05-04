// @ts-nocheck
// @ts-ignore
import React, {useState, useEffect, useRef} from 'react'
// @ts-ignore
import { get, map, join, reverse, size, clone, filter, head } from 'lodash'
import { useDispatch } from 'react-redux'
// @ts-ignore
import { adminWarehouseProductAutoCompleteList } from 'admin/components/inventory/actions/admin_warehouse_product'
// @ts-ignore
import AdminProductForm from './AdminProductForm'
// @ts-ignore
import {showSuccess, showError} from 'actions/Error'
import TextField from '@material-ui/core/TextField'
// @ts-ignore
import { ShortId } from 'components/ShortId'
// @ts-ignore
import * as Yup from 'yup'
// @ts-ignore
import { Formik, Form, FieldArray, Field } from 'formik'
// @ts-ignore
import { Timestamp } from 'components/Timestamp'
// @ts-ignore
import { CommonTable } from 'components/CommonTable'
// @ts-ignore
import { handleSubmitResult } from 'actions/form'
// @ts-ignore
import { validationSchema } from './AdminProductForm'
import Grid from '@material-ui/core/Grid'
// @ts-ignore
import { Modal } from 'components/layout/Modal'
import { makeStyles} from '@material-ui/core/styles'
// @ts-ignore
import muiTheme from 'muiTheme'
// @ts-ignore
import FormikOnChange from 'components/form/FormikAutoSave'
// @ts-ignore
import { FormikGeneralFormErrors } from 'components/form/GeneralFormErrors'
import { FormikInputField } from '../../../../components/form/InputField'
// @ts-ignore
import { ProductCategorySelectField } from 'admin/components/productCategories/form/ProductCategorySelectField'
// @ts-ignore
import { HierarchyCrumbs } from 'components/layout/HierarchyCrumbs'
// @ts-ignore
import Button from '@material-ui/core/Button'
// @ts-ignore
import CommonInlineAddNewFormLayout from 'components/layout/CommonInlineAddNewFormLayout'
// @ts-ignore
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'
// @ts-ignore
import Badge from '@material-ui/core/Badge'
// @ts-ignore
import Cart from 'admin/components/orders/Cart.js'
// @ts-ignore
import Popover from '@material-ui/core/Popover'

// @ts-ignore
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
        width: "100%"
    },
    filterRowItem: {
        marginRight: "10px",
        width: "100%"
    }
}))

// @ts-ignore
export function FormikWarehouseProductCart({parcel_id, depart_warehouse_name,initialCartItems, onSave, onCancel, ...props}) {
    // @ts-ignore
    const [cartVisible, setCartVisible] = React.useState(false)
    const [editingWarehouseProduct, setEditingWarehouseProduct] = React.useState(null)
    const [cartItems, setCartItems] = React.useState(initialCartItems)
    const [currentQuantityValue, setCurrentQuantityValue] = React.useState(0)
    const classes = useStyles()
    const dispatch = useDispatch()
    const is_loading = adminWarehouseProductAutoCompleteList.isLoading()
    // @ts-ignore
    const cartPopoverAnchorRef = useRef(null)
    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminWarehouseProductAutoCompleteList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])
    
    useEffect(() => {
      if(depart_warehouse_name){
        let initial_search_field = {
          any_field:depart_warehouse_name,
        }
        dispatch(adminWarehouseProductAutoCompleteList.updateListFilter(initial_search_field))
        dispatch(adminWarehouseProductAutoCompleteList.fetchListIfNeeded())
      }
    },[depart_warehouse_name])

    const warehouse_products = adminWarehouseProductAutoCompleteList.getVisibleObjects()

    const columns = [

        { field: 'product_category', title: 'Category',
          render: (item) => <HierarchyCrumbs crumbs={get(item, "product_category_crumbs", [])} />
        },
        { field: 'product_name', title: 'Product'},
        { field: 'warehouse_name', title: 'Warehouse'},
        { field: 'from_company_name', title: 'Donor', sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'from_company_name' : '-from_company_name'),},
        { field: 'expiry_date', title: 'Expiry date',
          render: (item) => <Timestamp value={get(item, "expiry_date")} format='date' />,
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'expiry_date' : '-expiry_date'),
        },
        { field: 'quantity', title: 'Qty available',
          sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'quantity' : '-quantity'),
        },
        { field: 'select_quantity', title: '',
          render: (item) => renderQuantityInput(item)
        }

        //{ field: 'created_at', title: 'Added at',
        //render: (item) => <Timestamp value={get(item, "expiry_date")} format='datetime' />,
        //sort: (direction) => onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at'),
        //},
    ]
    
    const onUpdateListOrdering = (field) => {
        dispatch(adminWarehouseProductAutoCompleteList.updateListOrdering(field))
    }
    
    const startEditingWarehouseProduct = (warehouse_product) => {
        const quantity = getCartItemQuantity(warehouse_product)
        setEditingWarehouseProduct(warehouse_product)
        setCurrentQuantityValue(quantity)
    }

    const stopEditingWarehouseProduct = () => {
        setEditingWarehouseProduct(null)
    }

    const renderQuantityInput = (warehouse_product) => {
        const is_editing = get(editingWarehouseProduct, "id") == get(warehouse_product, "id")
        const quantity = getCartItemQuantity(warehouse_product)
        
        const setValue = (e) => {
            setCurrentQuantityValue(e.target.value)
        }
        
        return (
            <>
              { is_editing &&
                <>
                  <TextField value={currentQuantityValue} margin="dense" variant="outlined" autoFocus={true}
                             onBlur={() => updateCartItem({warehouse_product, quantity:currentQuantityValue})}
                             onChange={setValue}
                  />
                </>
              }
              { ! is_editing &&
                <TextField value={quantity} margin="dense" variant="outlined"
                           onFocus={() => startEditingWarehouseProduct(warehouse_product)} />
              }
            </>
        )
    }

    const handleSave = () => {
        onSave(cartItems)
    }
    
    const updateCartItem = ({warehouse_product, quantity}) => {
        const newCartItems = clone(cartItems)
        newCartItems[warehouse_product.id] = {warehouse_product: warehouse_product, quantity: quantity}
        setCartItems(newCartItems)
        stopEditingWarehouseProduct()
    }

    const getCartItemQuantity = (warehouse_product) => {
        return get(cartItems, [warehouse_product.id, "quantity"])
    }

    // @ts-ignore
    const onFilterChanged = (values, formik_props) => {
        dispatch(adminWarehouseProductAutoCompleteList.updateListFilter(values))
        dispatch(adminWarehouseProductAutoCompleteList.fetchListIfNeeded())
    }

    // @ts-ignore
    const showCart = (event) => {
        setCartVisible(true)
    }

    // @ts-ignore
    const closeCart = () => {
        setCartVisible(false)
    }

    const renderCartAnchorAndPopop = () => {
        return null
        // disabled until implementation
        
        // return (
        //     <>
        //       <Button onClick={showCart} ref={cartPopoverAnchorRef}>
        //         <Badge badgeContent={4} color="secondary">
        //           <ShoppingCartOutlinedIcon fontSize="large" />
        //         </Badge>
        //       </Button>
        //       <Popover
        //         open={cartVisible}
        //         anchorEl={cartPopoverAnchorRef.current}
        //         onClose={closeCart}
        //         anchorOrigin={{
        //             vertical: 'bottom',
        //             horizontal: 'center',
        //         }}
        //         transformOrigin={{
        //             vertical: 'top',
        //             horizontal: 'center',
        //         }}
        //       >
        //         <Cart items={cartItems} />
        //       </Popover>
        //     </>
        // )
    }

    const renderAddItemToInventoryAction = () => {
        return null

        // disabled pending sahplat182
        
        // return (
        //     <Button
        //       variant="contained"
        //       color="primary"
        //       size="large"
        //       style={{marginLeft: 10, marginRight: 10}}
        //     >
        //       Add Product to Inventory
        //     </Button>
        // )
    }
    
    const renderFilter = () => {
        return (
            <Formik initialValues={{}}
                    onSubmit={onFilterChanged}
                    enableReinitialize={true}
            >
              {formik_props => {
                  // @ts-ignore
                  const { values } = formik_props
                  return (
                      <Form>
                        <FormikOnChange onChange={(values) => onFilterChanged(values, formik_props)} />
                        <FormikGeneralFormErrors render={(msg) => msg} />
                        <Grid
                          container
                          justify="flex-start"
                          alignItems="flex-start"
                          direction="row"
                        >
                          <ProductCategorySelectField name="product_category"
                                                      can_add={false}
                                                      can_edit={false}
                                                      formik_props={formik_props} />

                          { renderAddItemToInventoryAction() }
                          { renderCartAnchorAndPopop() }
                          
                        </Grid>
                        <Grid
                          container
                          justify="flex-start"
                          alignItems="flex-start"
                          direction="row"
                        >
                          < FormikInputField name="any_field"
                                            placeholder="Search product"
                                            formik_props={formik_props}
                                            show_search_icon={true}
                          />
                        </Grid>
                      </Form>
                  )
              }}
            </Formik>
        )
    }
    return (
        <Modal onClose={onCancel}
               onSave={handleSave}
               fullScreen
               title="Select products from inventory"
        >

          <div className={classes.treeContainer}>
            { renderFilter() }
            <CommonTable is_loading={ is_loading }
                         rows={warehouse_products}
                         canDelete={false}
                         columns={columns}
                         showFilters = {false}
                         item_list={adminWarehouseProductAutoCompleteList}
            />

          </div>
        </Modal>
    )

}
