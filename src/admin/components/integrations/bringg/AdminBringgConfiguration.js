/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { forEach, head, get, map, keys, split, size } from 'lodash'
import { adminBringgConfiguration } from './actions/admin_bringg_configuration'
import { adminBringgHistory } from './actions/admin_bringg_history'
import Timestamp from 'components/Timestamp'
import { CommonTable } from 'components/CommonTable'
import { Separator } from 'components/layout/Separator'
import CardH2Text from 'components/layout/CardH2Text'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {showSuccess, showError} from 'actions/Error'
import AdminMainLayout from 'admin/components/layout/AdminMainLayout'


class AdminBringgConfiguration extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminBringgConfiguration.ensureConfigLoaded())
        dispatch(adminBringgHistory.fetchListIfNeeded())
    }

    componentDidUpdate(prev_props) {
        const { dispatch } = this.props
        dispatch(adminBringgConfiguration.ensureConfigLoaded())
        dispatch(adminBringgHistory.fetchListIfNeeded())
    }

    getCellValue = (header_key, item, index) => {
        switch( header_key ) {
            default:
                return undefined
        }
    }

    renderHistory() {
        const { history_items, is_loading } = this.props

        const columns = [
            { field: 'description', title: 'Description',
              render: (item) => item.description,
            },
            { field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime' />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at'),
            },

        ]

        return (
            <div>
              <hr/>
              <CardH2Text>Bringg Change History</CardH2Text>
              <CommonTable
                is_loading={ is_loading }
                rows={history_items}
                columns={columns}
                item_list={adminBringgHistory}
              />
            </div>
        )
    }

    renderUrls() {
        const { configuration } = this.props
        return (
            <div>
              Required webhook urls:

              <p>
                These urls must be configured in the bringg app, eg on the page &nbsp;
                <a target="_blank" href="https://app.bringg.com/#/merchant/webhooks/">https://app.bringg.com/#/merchant/webhooks/</a>
              </p>

              <ul css={webhook_list_style}>
                {map(get(configuration, 'webhook_urls', []), (url) => (
                    <li>
                      <pre>{url}</pre>
                    </li>
                ))}
              </ul>

            </div>
        )
    }

    render() {
        const { initial_values, is_loading, is_busy } = this.props
        const that = this
        const title = 'Bringg configuration'

        return (
            <AdminMainLayout breadcrumbs={[{name: 'admin_home'},
                                                 {name: 'bringg',
                                                  label: 'Bringg',
                                                  url: '/admin/bringg_configuration'},
                                                ]}
                                   is_busy={is_busy}
                                   is_loading={is_loading}
                                   title={title} >

              { this.renderUrls() }
              { this.renderHistory() }
            </AdminMainLayout>
        )
    }

}

function mapStateToProps(state, props) {
    return {
        is_loading: adminBringgConfiguration.isLoading() || adminBringgHistory.isLoading(),
        is_busy: adminBringgConfiguration.getIsSavingObject(),
        configuration: adminBringgConfiguration.getConfiguration(),
        history_items: adminBringgHistory.getVisibleObjects(),
    }
}

export default connect(mapStateToProps)(AdminBringgConfiguration)

const breadcrumb_item = css`
display: flex;
align-items: center;
`

const webhook_list_style = css`
font-size: 12px;
`
