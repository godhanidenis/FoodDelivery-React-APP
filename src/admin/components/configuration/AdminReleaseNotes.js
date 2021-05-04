/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx } from '@emotion/core'
import { head, get } from 'lodash'
import { Link } from 'react-router-dom'
import AdminCommonListLayout from '../layout/AdminCommonListLayout'
import BusyMask from 'components/BusyMask'
import Timestamp from 'components/Timestamp'
import { adminReleaseNoteList } from './actions/admin_release_note'
import Card from 'components/layout/Card'

class AdminReleaseNotes extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminReleaseNoteList.fetchListIfNeeded())
    }

    componentDidUpdate(prev_props) {
        const { dispatch } = this.props
        dispatch(adminReleaseNoteList.fetchListIfNeeded())
    }

    getCellValue = (header_key, item, index) => {
        const { customer_id } = this.props
        switch( header_key ) {
            case 'created_at':
                return <Timestamp value={item.created_at} format="datetime" />
            default:
                return undefined
        }
    }

    onUpdateListOrdering = (field) => {
        const { dispatch } = this.props
        dispatch(adminReleaseNoteList.updateListOrdering(field))

    }

    render() {
        const { is_loading, emails, headers } = this.props

        const columns = [
            { field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime'/>,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at')
            },
            { field: 'issue_number', title: 'Issue',
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'issue_number' : '-issue_number')
            },
            { field: 'header', title: 'Title',
              sort:(direction) => this.onUpdateListOrdering(direction === 'asc' ? 'header' : '-header')
            },
            { field: 'content',
              title: 'Notes',
              sort:(direction) => this.onUpdateListOrdering(direction === 'asc' ? 'notes' : '-notes')
            },
        ]

        return (

            <AdminCommonListLayout active_key="release_notes"
                                   breadcrumbs={[{name: 'admin_home'},
                                                 {name: 'release_notes', label: "Release notes", url: '/admin/release_notes'}]}
                                   is_loading={is_loading}
                                   canDelete={false}
                                   columns={columns}
                                   item_list={adminReleaseNoteList}
                                   handleRequestSort={columns}
            >

            </AdminCommonListLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const emails = adminReleaseNoteList.getVisibleObjects()
    return {
        is_loading: adminReleaseNoteList.isLoading(),
        emails,
        headers: {
            created_at: {name: 'Date'},
            issue_number: {name: 'Issue'},
            header: {name: 'Title'},
            content: {name: 'Notes'}
        }
    }
}

export default connect(mapStateToProps)(AdminReleaseNotes)
