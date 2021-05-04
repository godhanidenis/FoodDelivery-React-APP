/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
// @ts-ignore
import { head, get, map, size, forEach } from 'lodash'
// @ts-ignore
import Timestamp from 'components/Timestamp'
// @ts-ignore
import {showSuccess, showError} from 'actions/Error'
import Alert from '@material-ui/lab/Alert'
import { adminBeneficiaryParcelProductList } from './actions/admin_beneficiary_parcel_product'
// @ts-ignore
import { adminWarehouseProductAutoCompleteList } from 'admin/components/inventory/actions/admin_warehouse_product'
// @ts-ignore
import { adminProductList } from 'admin/components/products/actions/admin_product'
import { CommonTable } from '../../../components/CommonTable'
import AdminBeneficiaryParcelProduct from './AdminBeneficiaryParcelProduct'

import { FormikWarehouseProductCart } from '../../../admin/components/products/form/WarehouseProductCart'
// @ts-ignore
import { HierarchyCrumbs } from 'components/layout/HierarchyCrumbs'
// @ts-ignore
import { ShortId } from 'components/ShortId'
import { Button } from '@material-ui/core'
// @ts-ignore
import { Modal } from 'components/layout/Modal'

class AdminBeneficiaryParcelProducts extends Component {

    constructor(props) {
        super(props)
        this.state = {editing_parcel_product_id: null,
                      adding_new_parcel_product: false}
    }

    componentDidMount() {
        const { dispatch, parcel_id, depart_warehouse_name, product_ids } = this.props
        if ( parcel_id ) {
            
            dispatch(adminBeneficiaryParcelProductList.updateListFilter({parcel: parcel_id, depart_warehouse_name: depart_warehouse_name}))
            dispatch(adminBeneficiaryParcelProductList.fetchListIfNeeded(depart_warehouse_name))
            dispatch(adminProductList.ensureObjectsLoaded(product_ids))
        }
    }

    componentDidUpdate() {
        // @ts-ignore
        const { dispatch, filter, parcel_id, depart_warehouse_name, parcel_products, product_ids, parcel_product_filter } = this.props
        if ( parcel_id ) {
            if ( parcel_id != parcel_product_filter.parcel ) {
                dispatch(adminBeneficiaryParcelProductList.updateListFilter({parcel: parcel_id, depart_warehouse_name: depart_warehouse_name }))
            }
            dispatch(adminBeneficiaryParcelProductList.fetchListIfNeeded())
            dispatch(adminProductList.ensureObjectsLoaded(product_ids))
        }
    }

    onEditParcelProduct = (parcel_product_id) => {
        this.setState({editing_parcel_product_id: parcel_product_id,
                       adding_new_parcel_product: false})
    }

    onAddParcelProduct = () => {
      const { dispatch, filter, parcel_id, depart_warehouse_name, parcel_products, product_ids, parcel_product_filter } = this.props
      
      dispatch(adminBeneficiaryParcelProductList.updateListFilter({parcel: parcel_id, depart_warehouse_name: depart_warehouse_name }))
        this.setState({adding_new_parcel_product: true,
                       editing_parcel_product_id: null})
    }

    onStopEditingParcelProduct = () => {
        const { dispatch } = this.props
        dispatch(adminBeneficiaryParcelProductList.invalidateList())
        this.setState({editing_parcel_product_id: null,
                       adding_new_parcel_product: false})
    }

    onStopAddingParcelProduct = () => {
        return this.onStopEditingParcelProduct()
    }

    renderEditParcelProduct(parcel_product_id) {
        const { parcel_id } = this.props
        const that = this
        return (
            <Modal onClose={that.onStopEditingParcelProduct}
                   fullWidth={true}
                   width='xl'
                   title=""
            >
              <AdminBeneficiaryParcelProduct parcel_id={parcel_id}
                                             parcel_product_id={parcel_product_id}
                                             onSaved={that.onStopEditingParcelProduct}
                                             onCancel={that.onStopEditingParcelProduct}
              />
            </Modal>
        )
    }

    saveWarehouseProductsToParcel = (cartItems) => {
        const { dispatch, parcel_id } = this.props
        const that = this

        // @ts-ignore
        const on_ok = function(json) {
            dispatch(adminBeneficiaryParcelProductList.invalidateList())
            dispatch(adminBeneficiaryParcelProductList.fetchListIfNeeded())
            dispatch(adminWarehouseProductAutoCompleteList.invalidateList())
            dispatch(adminWarehouseProductAutoCompleteList.fetchListIfNeeded())
            showSuccess("Saved", "Products updated")
            that.onStopAddingParcelProduct()
        }
             
        const values = map(cartItems, function(cartItem) { return ({parcel: parcel_id,
                                                                    from_warehouse_product: cartItem.warehouse_product.id,
                                                                    actual_quantity: cartItem.quantity})
                                                         })
        dispatch(adminBeneficiaryParcelProductList.saveNewObject(values))
            .then(function(res) {
                if ( res.errors ) {
                    showError(get(res, ["errors", "_error"], "Failed to save"))
                } else {
                    on_ok()
                }
            })
    }

    renderAddParcelProduct() {
        const { parcel_id, all_parcel_products } = this.props
        const that = this
        return (
            <Modal onClose={that.onStopAddingParcelProduct}
                   fullWidth={true}
                   width='xl'
                   title=""
            >
              <FormikWarehouseProductCart parcel_id={parcel_id}
                                          depart_warehouse_name = {this.props.depart_warehouse_name}
                                          initialCartItems={all_parcel_products}
                                          onSave={that.saveWarehouseProductsToParcel}
                                          onCancel={that.onStopAddingParcelProduct} />
            </Modal>
        )
    }

    onUpdateListOrdering = (field) => {
      const { dispatch } = this.props
      dispatch(adminBeneficiaryParcelProductList.updateListOrdering(field))
    }

    render() {
        const { is_loading, parcel_id, parcel_products } = this.props
        const { editing_parcel_product_id, adding_new_parcel_product } = this.state
        // @ts-ignore
        const that = this
        // @ts-ignore
        const initial_filter_values = {}

        const columns = [
            { field: 'product_category_crumbs', title: 'Category',
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'product__product_category__name' : '-product__product_category__name'),
              render: (item) => <HierarchyCrumbs crumbs={get(item, "product_category_crumbs", [])} />
            },
            { field: 'product_name', title: 'Product',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'product' : '-product')},
            { field: 'actual_quantity', title: 'Quantity',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'actual_quantity' : '-actual_quantity')},
            { field: 'total_weight_kg', title: 'Weight (kg)',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'total_weight_kg' : '-total_weight_kg')},
            { field: 'original_from_company_name', title: 'Donor' },
            { field: 'expiry_date', title: 'Expiry date',
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'expiry_date' : '-expiry_date'),
              render: (item) => <Timestamp value={item.expiry_date} format='date' />
            },
        ]

        return (
            <div>
              { ! parcel_id &&
                // @ts-ignore
                <>
                  <Alert severity="warning">Create order before adding products</Alert>
                </>
              }

              { parcel_id &&
                // @ts-ignore
                <>
                { editing_parcel_product_id && this.renderEditParcelProduct(editing_parcel_product_id) }
                { adding_new_parcel_product && this.renderAddParcelProduct() }
                { ! editing_parcel_product_id && !adding_new_parcel_product &&
                  <div>
                    <Button size="large"
                            variant="contained"
                            color="secondary"
                            onClick={ this.onAddParcelProduct }>
                      Add Products to this Order
                    </Button>
                  </div>
                }
                <CommonTable
                    // @ts-ignore
                    is_loading={ is_loading }
                    rows={ parcel_products }
                    columns={ columns }
                    item_list={adminBeneficiaryParcelProductList}
                    depart_warehouse_name = {this.props.depart_warehouse_name}
                    onEditRow={this.onEditParcelProduct}
                  />

                </>
              }
            </div>
        )
    }
}

// @ts-ignore
function mapStateToProps(state, props) {
    const parcel_id = props.parcel_id
    const depart_warehouse_name = props.depart_warehouse_name
    const parcel_products = adminBeneficiaryParcelProductList.getVisibleObjects()
    const product_ids = map(parcel_products, (parcel_product) => parcel_product.id)
    const all_parcel_products = {}
    forEach(adminBeneficiaryParcelProductList.getAllObjects(), (parcel_product) => 
            all_parcel_products[parcel_product.from_warehouse_product] = {warehouse_product: {id: parcel_product.from_warehouse_product},
                                                                          quantity: parcel_product.actual_quantity})

    return {
        parcel_id,
        is_loading: adminBeneficiaryParcelProductList.isLoading() || adminBeneficiaryParcelProductList.getIsSavingObject(),
        filter: adminBeneficiaryParcelProductList.getFilter(),
        all_parcel_products,
        parcel_products,
        product_ids,
        parcel_product_filter: adminBeneficiaryParcelProductList.getFilter()
    }
}

export default connect(mapStateToProps)(AdminBeneficiaryParcelProducts)

// @ts-ignore
const filter_row_style = css`
width: 100%;
display: flex;
justify-content: space-between;
`

const filter_style = css`
display: flex;
margin-right: 16px;
`
