/** @jsx jsx */
import React, {useEffect} from "react"
import { jsx, css } from '@emotion/core'
import { adminBeneficiaryStatusHistoryList } from './actions/admin_beneficiary_status_history'
import AdminStateHistoryList from '../layout/AdminStateHistoryList'
import { useDispatch } from 'react-redux'

export const AdminBeneficiaryStateHistory = ({beneficiary_id}) => {

    const dispatch = useDispatch()
    const item_list = adminBeneficiaryStatusHistoryList

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(item_list.updateListFilter({beneficiary: beneficiary_id}))
        }
        fetchStaticObjects()
    }, [])

    return (
        <AdminStateHistoryList item_list={item_list}
                               active_key={'Beneficiary state history'} />
    )
}
