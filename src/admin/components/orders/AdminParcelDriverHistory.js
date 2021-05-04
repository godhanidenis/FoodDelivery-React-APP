/** @jsx jsx */
import React, {useEffect} from "react"
import { jsx, css } from '@emotion/core'
import { adminParcelDriverHistoryList } from './actions/admin_parcel_driver_history'
import AdminStateHistoryList from '../layout/AdminStateHistoryList'
import Timestamp from '../../../components/Timestamp'
import { useDispatch } from 'react-redux'

export const AdminParcelDriverHistory = ({parcel_id}) => {

    const dispatch = useDispatch()
    const item_list = adminParcelDriverHistoryList

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(item_list.updateListFilter({parcel: parcel_id}))
        }
        fetchStaticObjects()
    }, [])

    const columns = [
        { field: 'created_at',
          title: 'Changed at',
          render: (item) => <Timestamp value={item.created_at} format='datetime' />
        },
        { field: 'new_driver_display_name', title: 'Driver'},
        { field: 'changed_by_user_display_name', title: 'User'},
    ]

    return (

        <AdminStateHistoryList item_list={item_list}
                               columns={columns}
                               active_key={'Parcel driver history'} />
    )
}
