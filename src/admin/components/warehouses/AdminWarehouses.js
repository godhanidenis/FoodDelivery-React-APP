/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get } from 'lodash'
import { Trans, Translation } from 'react-i18next'
import AdminCommonListLayout from '../layout/AdminCommonListLayout'
import Timestamp from 'components/Timestamp'
import { FormikInputField } from 'components/form/InputField'
import { adminWarehouseList } from './actions/admin_warehouse'
import { Separator } from 'components/layout/Separator'
import { ShortId } from 'components/ShortId'


class Warehouses extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminWarehouseList.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch, filter } = this.props
        dispatch(adminWarehouseList.fetchListIfNeeded())
    }

    onEditWarehouse = (warehouse_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/warehouse/'+warehouse_id
        })
    }

    onAddWarehouse = () => {
        const { history } = this.props
        history.push('/admin/warehouse')
    }

    onUpdateListOrdering = (field) => {
        const { dispatch } = this.props
        dispatch(adminWarehouseList.updateListOrdering(field))
      }

    render() {
        const { is_loading, warehouses } = this.props
        const that = this

        const columns = [
            { field: 'id', title: 'Id',
              render: (item) => <ShortId value={item.id} />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'id' : '-id'),
            },
            { field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime' />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at'),
            },
            { field: 'name', title: 'Name',
              render: (item) => get(item, ["name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'name' : '-name'),
            },
            { field: 'city', title: 'City',
             render: (item) => get(item, ["address", "city_name"]),
             sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'address__city__name' : '-address__city__name')
          },
        ]

        return (
            <AdminCommonListLayout active_key="warehouses"
                                   breadcrumbs={[{name: 'admin_home'},
                                                 {name: 'warehouses', label: "Warehouses", url: '/admin/warehouses'}]}
                                   add_label="Add Warehouse"
                                   onAddRow={that.onAddWarehouse}
                                   onEditRow={that.onEditWarehouse}
                                   is_loading={is_loading}
                                   columns={columns}
                                   item_list={adminWarehouseList}
            />
        )
    }
}

function mapStateToProps(state, props) {
    const warehouses = adminWarehouseList.getVisibleObjects()

    return {
        warehouses,
        is_loading: adminWarehouseList.isLoading(),
        filter: adminWarehouseList.getFilter(),
    }
}

export default connect(mapStateToProps)(Warehouses)

const filter_row_style = css`
width: 100%;
display: flex;
justify-content: space-between;
`


const filter_style = css`
display: flex;
margin-right: 16px;
`
