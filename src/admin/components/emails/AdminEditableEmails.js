/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get } from 'lodash'
import { Link } from 'react-router-dom'
import AdminMainLayout from '../layout/AdminMainLayout'
import AdminUserForm from 'admin/components/users/form/AdminUserForm'
import BusyMask from 'components/BusyMask'
import Timestamp from 'components/Timestamp'
import { adminEditableEmailList } from './actions/admin_editable_email'
import Card from 'components/layout/Card'
import { CommonTable } from 'components/CommonTable'
import { Button, Container } from 'react-bootstrap'
import { InlineIcon } from 'components/layout/InlineIcon'
import { LanguageFlag } from 'components/LanguageFlag'
import AdminTableHeader from 'admin/components/common/AdminTableHeader'
import AdminTableFilter from 'admin/components/common/AdminTableFilter'
import AdminCommonListLayout from 'admin/components/layout/AdminCommonListLayout'


class AdminEditableEmails extends Component {

    componentDidMount() {
        const { dispatch, customer_id } = this.props
        dispatch(adminEditableEmailList.fetchListIfNeeded())
    }

    componentDidUpdate(prev_props) {
        const { dispatch } = this.props
        dispatch(adminEditableEmailList.fetchListIfNeeded())
    }

    renderCell = (header_key, item, column_size, row_index, index, current_state, editable) => {
        switch( header_key ) {
            case 'description':
                return (
                    <div css={description_style}>
                      {item.description}
                      {item.legacy_description &&
                       <div css={legacy_row}>
                         (Was: {item.legacy_description})
                       </div>
                      }
                    </div>
                )
            default:
                return undefined;
        }
    }

    filterEditableEmails = (filter_values) => {
        const { dispatch } = this.props
        dispatch(adminEditableEmailList.updateListFilter(filter_values))
    }

    render() {
        const { is_loading, headers, editable_emails } = this.props

        const columns = [
            { field: 'name', title: 'Name',
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'name' : '-name'),
            },
        ]
        
        return (
            <AdminCommonListLayout active_key="emails"
                                   breadcrumbs={[{name: 'admin_home'},
                                                 {name: 'email', label: "Emails", url: '/editable_emails'}]}
                                   onEditRow={this.onEditEditableEmail}
                                   is_loading={is_loading}
                                   columns={columns}
                                   item_list={adminEditableEmailList}
            />
        )
    }

}

function mapStateToProps(state, props) {
    const editable_emails = adminEditableEmailList.getVisibleObjects()
    return {
        editable_emails,
        is_loading: adminEditableEmailList.isLoading(),
    }
}

export default connect(mapStateToProps)(AdminEditableEmails)

const description_style = css`
font-size: 14px;
overflow: hidden;
max-width: 500px;
text-overflow: ellipsis;
`

const legacy_row = css`
font-size: 12px;
overflow: hidden;
max-width: 500px;
text-overflow: ellipsis;
`
