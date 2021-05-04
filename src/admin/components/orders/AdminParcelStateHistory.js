/** @jsx jsx */
import React, {useEffect} from "react"
import { jsx, css } from '@emotion/core'
import { adminParcelStatusHistoryList } from './actions/admin_parcel_status_history'
import AdminStateHistoryList from '../layout/AdminStateHistoryList'
import { useDispatch } from 'react-redux'

export const AdminParcelStateHistory = ({parcel_id}) => {

    const dispatch = useDispatch()
    const item_list = adminParcelStatusHistoryList

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(item_list.updateListFilter({parcel: parcel_id}))
        }
        fetchStaticObjects()
    }, [])
    
    return (
        <AdminStateHistoryList item_list={item_list}
                               active_key={'Parcel state history'} />
    )
}
