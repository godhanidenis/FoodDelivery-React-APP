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
import { adminEditableEmailCustomParameterList } from './actions/admin_editable_email_custom_parameter'
import Card from 'components/layout/Card'
import { CommonTable } from 'components/CommonTable'
import { Button, Container } from 'react-bootstrap'
import { InlineIcon } from 'components/layout/InlineIcon'
import { LanguageFlag } from 'components/LanguageFlag'
import AdminTableHeader from 'admin/components/common/AdminTableHeader'
import AdminTableFilter from 'admin/components/common/AdminTableFilter'

class AdminEditableEmailCustomParameters extends Component {

    componentDidMount() {
        const { dispatch, customer_id } = this.props
        dispatch(adminEditableEmailCustomParameterList.fetchListIfNeeded())
    }

    componentDidUpdate(prev_props) {
        const { dispatch } = this.props
        dispatch(adminEditableEmailCustomParameterList.fetchListIfNeeded())
    }

    renderCell = (header_key, item, column_size, row_index, index, current_state, editable) => {
        switch( header_key ) {
            case 'action':
                return (
                    <Link to={`/admin/editable_email_custom_parameter/${item.id}`}>
                      <InlineIcon icon_name="edit" />
                    </Link>
                )
            default:
                return undefined;
        }
    }

    onAdd = () => {
        const { history } = this.props
        history.push('/admin/editable_email_custom_parameter/')
    }

    filterEditableEmailCustomParameters = (filter_values) => {
        const { dispatch } = this.props
        dispatch(adminEditableEmailCustomParameterList.updateListFilter(filter_values))
    }

    render() {
        const { is_loading, headers, params } = this.props
        return (
            <AdminMainLayout breadcrumbs={[{name: 'admin_home'},
                                           {name: 'editable_email', label: 'Editable Emails', url: '/admin/editable_emails'},
                                          {name: 'editable_email_custom_parameters', label: 'Editable Email Custom Parameters', url: '/admin/editable_email_custom_parameters'}]}>
              <Container fluid>
                <AdminTableHeader title="Editable Email Custom Parameters">
                  <div css={ css`width:100%;`}>
                    <AdminTableFilter
                        updateOnChange={ this.filterEditableEmailCustomParameters }
                        form="ADMIN_EDITABLE_EMAILS_EDITABLE_PARAMETERS_FILTER_FORM"
                    />
                  </div>
                  <div css={ header }>
                    <Button variant="outline-primary" onClick={ this.onAdd }>
                      Add Parameter
                    </Button>
                  </div>
                </AdminTableHeader>
                <CommonTable
                    is_loading={ is_loading }
                    empty_message={`There are no parameters.`}
                    headers={ headers }
                    items={ params }
                    item_list={adminEditableEmailCustomParameterList}
                    renderCell={ this.renderCell }
                    getCellValue={ this.getCellValue }
                    sortOnHeader={ this.sortOnHeader }
                />
              </Container>
            </AdminMainLayout>
        )
    }

}

function mapStateToProps(state, props) {
    const params = adminEditableEmailCustomParameterList.getVisibleObjects()
    return {
        params,
        is_loading: adminEditableEmailCustomParameterList.isLoading(),
        headers: {
            name: { name: 'Name' },
            description: { name: 'Description' },
            tag: { name: 'tag' },
            action: { name: '' }
        }
    }
}

export default connect(mapStateToProps)(AdminEditableEmailCustomParameters)

const description_style = css`
font-size: 14px;
overflow: hidden;
max-width: 500px;
text-overflow: ellipsis;
`

const header = css`
display: flex;
justify-content: flex-end;
width: 100%;
`
