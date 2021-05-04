/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get } from 'lodash'
import { Trans, Translation } from 'react-i18next'
import { FormikDropdownField } from '../../../components/form/Dropdown'
import AdminCommonListLayout from '../layout/AdminCommonListLayout'
import Timestamp from '../../../components/Timestamp'
import { FormikInputField } from '../../../components/form/InputField'
import { adminProductList } from './actions/admin_product'
import { Separator } from '../../../components/layout/Separator'
import { ShortId } from '../../../components/ShortId'
import { Button } from '../../../components/layout/Button'
import { HierarchyCrumbs } from '../../../components/layout/HierarchyCrumbs'
import AdminParcelsTable from '../orders/AdminParcelsTable'
import { Grid, Paper, Hidden, Avatar } from '@material-ui/core'


class Products extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminProductList.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch, filter } = this.props
        dispatch(adminProductList.fetchListIfNeeded())
    }

    onEditProduct = (product_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/product/'+product_id
        })
    }

    onAddProduct = () => {
        const { history } = this.props
        history.push('/admin/product')
    }

    onUpdateListOrdering = (field) => {
        const { dispatch } = this.props
        dispatch(adminProductList.updateListOrdering(field))
      }
    render() {
        const { is_loading, products } = this.props
        const that = this

        const columns = [
            { field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime' />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at'),
            },
            { field: 'name', title: 'Name', sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'name' : '-name')},
            { field: 'product_category_crumbs',
              title: 'Category',
              render: (item) => <HierarchyCrumbs crumbs={item.product_category_crumbs} />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'product_category__name' : '-product_category__name')
            },
            { field: 'description', title: 'Description', sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'description' : '-description')}
        ]

        return (

            
            
                <AdminCommonListLayout active_key="products"
                                    breadcrumbs={[{name: 'admin_home'},
                                                    {name: 'products', label: "Products", url: '/products'}]}
                                    add_label="Add Product"
                                    onAddRow={that.onAddProduct}
                                    onEditRow={that.onEditProduct}
                                    is_loading={is_loading}
                                    columns={columns}
                                    item_list={adminProductList}
                                    showFilters={true}
                />



        )
    }
}

function mapStateToProps(state, props) {
    const products = adminProductList.getVisibleObjects()

    return {
        products,
        is_loading: adminProductList.isLoading(),
        filter: adminProductList.getFilter()
    }
}

export default connect(mapStateToProps)(Products)

const filter_row_style = css`
width: 100%;
display: flex;
justify-content: space-between;
`


const filter_style = css`
display: flex;
margin-right: 16px;
`
