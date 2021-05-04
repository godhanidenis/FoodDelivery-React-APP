/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { jsx, css } from '@emotion/core'
import { adminParcelList } from './actions/admin_parcel'

class AdminParcel extends Component {

    componentDidMount() {
        const { history, dispatch, parcel_id, parcel } = this.props
        dispatch(adminParcelList.ensureObjectLoaded(parcel_id))
        this.tryRedirect()
    }

    componentDidUpdate(prev_props) {
        const { dispatch, parcel_id } = this.props
        dispatch(adminParcelList.ensureObjectLoaded(parcel_id))
        this.tryRedirect()
    }

    tryRedirect() {
        const { history, parcel } = this.props
        if ( parcel.direction === 'donor_pickup' ) {
            history.push({pathname: '/admin/donor_pickup/'+parcel.id})
        } else if ( parcel.direction === 'beneficiary_dropoff' ) {
            history.push({pathname: '/admin/beneficiary_dropoff/'+parcel.id})
        } else if ( parcel ) {
            console.error("Unknown parcel type: " + parcel.direction)
        }
    }

    render() {
        return <div>Redirecting...</div>
    }

}

function mapStateToProps(state, props) {
    const parcel_id = get(props, ["match", "params", "parcel_id"], null)
    const parcel = adminParcelList.getObject(parcel_id)

    return {
        parcel_id,
        parcel,
        is_loading: adminParcelList.isLoading() || (parcel_id && !get(parcel, "id")),
        is_busy: adminParcelList.getIsSavingObject()
    }
}

export default connect(mapStateToProps)(AdminParcel)

const breadcrumb_item = css`
display: flex;
align-items: center;
`
