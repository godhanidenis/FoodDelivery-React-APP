/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get, map } from 'lodash'
import Timestamp from 'components/Timestamp'
import Alert from '@material-ui/lab/Alert'
import { adminDonorParcelProductList } from './actions/admin_donor_parcel_product'
import { adminProductList } from 'admin/components/products/actions/admin_product'
import { CommonTable } from 'components/CommonTable'
import AdminDonorParcelProduct from './AdminDonorParcelProduct'
import { HierarchyCrumbs } from 'components/layout/HierarchyCrumbs'
import { ShortId } from 'components/ShortId'
import { Button } from '@material-ui/core'
import { Modal } from 'components/layout/Modal'
const NEW_PARCEL_PRODUCT_ID = '__new__'

class AdminDonorParcelProducts extends Component {

    constructor(props) {
        super(props)
        this.state = {editing_parcel_product_id: null}
    }

    componentDidMount() {
        const { dispatch, parcel_id, product_ids } = this.props
        if ( parcel_id ) {
            dispatch(adminDonorParcelProductList.updateListFilter({parcel: parcel_id}))
            dispatch(adminDonorParcelProductList.fetchListIfNeeded())
            dispatch(adminProductList.ensureObjectsLoaded(product_ids))
        }
    }

    componentDidUpdate() {
        const { dispatch, filter, parcel_id, parcel_products, product_ids, parcel_product_filter } = this.props
        if ( parcel_id ) {
            if ( parcel_id != parcel_product_filter.parcel ) {
                dispatch(adminDonorParcelProductList.updateListFilter({parcel: parcel_id}))
            }
            dispatch(adminDonorParcelProductList.fetchListIfNeeded())
            dispatch(adminProductList.ensureObjectsLoaded(product_ids))
        }
    }

    onEditParcelProduct = (parcel_product_id) => {
        this.setState({editing_parcel_product_id: parcel_product_id})
    }

    onAddParcelProduct = () => {
        this.setState({editing_parcel_product_id: NEW_PARCEL_PRODUCT_ID})
    }

    onStopEditingParcelProduct = () => {
        const { dispatch } = this.props
        dispatch(adminDonorParcelProductList.invalidateList())
        this.setState({editing_parcel_product_id: null})
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
              <AdminDonorParcelProduct parcel_id={parcel_id}
                                       parcel_product_id={parcel_product_id === NEW_PARCEL_PRODUCT_ID ? null : parcel_product_id}
                                       onSaved={that.onStopEditingParcelProduct}
                                       onCancel={that.onStopEditingParcelProduct}
              />
            </Modal>
        )
    }

    onUpdateListOrdering = (field) => {
      const { dispatch } = this.props
      dispatch(adminDonorParcelProductList.updateListOrdering(field))
    }

    render() {
        const { is_loading, parcel_id, parcel_products } = this.props
        const { editing_parcel_product_id } = this.state
        const that = this
        const initial_filter_values = {}

        const columns = [
            { field: 'product_category_crumbs', title: 'Category',
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'product__product_category__name' : '-product__product_category__name'),
              render: (item) => <HierarchyCrumbs crumbs={get(item, "product_category_crumbs", [])} />
            },
            { field: 'product_name', title: 'Product',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'product' : '-product')},
            { field: 'provisional_quantity', title: 'Provisional Quantity',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'provisional_quantity' : '-provisional_quantity')},
            { field: 'actual_quantity', title: 'Actual Quantity',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'actual_quantity' : '-actual_quantity')},
            { field: 'total_weight_kg', title: 'Weight (kg)',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'total_weight_kg' : '-total_weight_kg')},
            { field: 'expiry_date', title: 'Expiry date',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'expiry_date' : '-expiry_date'),
              render: (item) => <Timestamp value={item.expiry_date} format='date' />
            },
        ]

        return (
            <div>
              { ! parcel_id &&
                <>
                  <Alert severity="warning">Create order before adding products</Alert>
                </>
              }

              { parcel_id &&
                <>
                  <CommonTable
                    is_loading={ is_loading }
                    rows={ parcel_products }
                    columns={ columns }
                    item_list={adminDonorParcelProductList}
                    onEditRow={this.onEditParcelProduct}
                  />
                  { editing_parcel_product_id && this.renderEditParcelProduct(editing_parcel_product_id) }
                  { ! editing_parcel_product_id &&
                    <div>
                      <Button size="large"
                              variant="contained"
                              color="primary"
                              onClick={ this.onAddParcelProduct }>
                        Add Product to this Order
                      </Button>
                    </div>
                  }
                </>
              }
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    const parcel_id = props.parcel_id
    const parcel_products = adminDonorParcelProductList.getVisibleObjects()
    const product_ids = map(parcel_products, (parcel_product) => parcel_product.id)

    return {
        parcel_id,
        is_loading: adminDonorParcelProductList.isLoading(),
        filter: adminDonorParcelProductList.getFilter(),
        parcel_products,
        product_ids,
        parcel_product_filter: adminDonorParcelProductList.getFilter()
    }
}

export default connect(mapStateToProps)(AdminDonorParcelProducts)

const filter_row_style = css`
width: 100%;
display: flex;
justify-content: space-between;
`


const filter_style = css`
display: flex;
margin-right: 16px;
`
