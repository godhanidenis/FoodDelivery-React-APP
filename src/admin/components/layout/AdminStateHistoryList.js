/** @jsx jsx */
import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get } from 'lodash'
import { CommonTable } from '../../../components/CommonTable'
import Timestamp from '../../../components/Timestamp'
import Hidden from '@material-ui/core/Hidden'
import { BlueButton } from '../../../components/layout/BlueButton'
import { Modal } from '../../../components/layout/Modal'

class AdminStateHistoryList extends Component {

    constructor(props) {
        super(props)
        this.state = {show: false}
    }

    componentDidMount() {
        const { dispatch, item_list } = this.props
        dispatch(item_list.invalidateList())
        dispatch(item_list.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch, item_list } = this.props
        const { show } = this.state
        if ( show ) {
            dispatch(item_list.fetchListIfNeeded())
        }
    }

    onShow = () => {
        this.setState({show: true})
    }

    onHide = () => {
        this.setState({show: false})
    }

    render() {
        const { item_list, is_loading, headers, columns, items, active_key } = this.props
        const { show } = this.state
        const that = this

        const default_columns = [
            { field: 'created_at',
              title: 'Changed at',
              render: (item) => <Timestamp value={item.created_at} format='datetime' />
            },
            { field: 'new_status_name', title: 'Status'},
            { field: 'changed_by_user_display_name', title: 'User'},
        ]

        return (
            <>
              { ! show &&
                <BlueButton onClick={that.onShow}>
                  History
                </BlueButton>
              }
              { show &&
                <Modal onClose={that.onHide}
                       title="History"
                >
                  <CommonTable
                    is_loading={ is_loading }
                    rows={items}
                    columns={ columns || default_columns }
                    item_list={item_list}
                    canDelete={false}
                  />
                </Modal>
              }
            </>
        )
    }
}

function mapStateToProps(state, props) {
    const { item_list } = props
    const items = item_list.getVisibleObjects()

    return {
        items,
        is_loading: item_list.isLoading()
    }
}


export default connect(mapStateToProps)(AdminStateHistoryList)

const filter_row_style = css`
width: 100%;
display: flex;
justify-content: space-between;
`


const filter_style = css`
display: flex;
margin-right: 16px;
`
