/** @jsx jsx */
import React, {useEffect} from "react"
import { jsx, css } from '@emotion/core'
import { adminDonorStatusHistoryList } from './actions/admin_donor_status_history'
import AdminStateHistoryList from '../layout/AdminStateHistoryList'
import { useDispatch } from 'react-redux'

export const AdminDonorStateHistory = ({donor_id}) => {

    const dispatch = useDispatch()
    const item_list = adminDonorStatusHistoryList

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(item_list.updateListFilter({donor: donor_id}))
        }
        fetchStaticObjects()
    }, [])

    return (
        <AdminStateHistoryList item_list={item_list}
                               active_key={'Donor state history'} />
    )
}
