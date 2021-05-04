/** @jsx jsx */
import React, {useEffect} from "react"
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import { adminWarehouseProductHistoryList } from './actions/admin_warehouse_product_history'
import { CommonTable } from 'components/CommonTable'
import AdminStateHistoryList from '../layout/AdminStateHistoryList'
import Timestamp from 'components/Timestamp'
import BusyMask from 'components/BusyMask'
import { useDispatch } from 'react-redux'
import { Modal } from 'components/layout/Modal'

export const AdminWarehouseProductHistoryList = ({warehouse_product, onClose}) => {

    const dispatch = useDispatch()
    const item_list = adminWarehouseProductHistoryList
    const warehouse_product_id = get(warehouse_product, "id", null)
    const is_loading = item_list.isLoading || !item_list.isReady()
    const items = item_list.getVisibleObjects()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(item_list.updateListFilter({warehouse_product: warehouse_product_id}))
            dispatch(item_list.fetchListIfNeeded())
        }
        if (warehouse_product_id) {
            fetchStaticObjects()
        }
    }, [warehouse_product_id])

    const columns = [
        { field: 'created_at',
          title: 'Changed at',
          render: (item) => <Timestamp value={item.created_at} format='datetime' />
        },
        { field: 'description', title: 'Reason for change'},
        { field: 'changed_by_user_display_name', title: 'User'},
        { field: 'quantity', title: 'Quantity'},
        { field: 'expiry_date', title: 'Expiry date', render: (item) => <Timestamp value={item.expiry_date} format='datetime' />},
        { field: 'total_weight_kg', title: 'Total weight kg'}
    ]

    if ( warehouse_product_id && (item_list.isLoading() || !item_list.isReady()) ) {
        return <BusyMask />
    }
    
    return (
        <Modal onClose={onClose}
               title={`History for ${get(warehouse_product, "product_name")} at ${get(warehouse_product, "warehouse_name")}`}
               fullWidth={true}
               maxWidth='xl'
        >
          <CommonTable
            is_loading={ is_loading }
            rows={items}
            columns={ columns } 
            item_list={item_list}
            canDelete={false}
          />
        </Modal>
    )
}
