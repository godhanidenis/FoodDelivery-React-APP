/** @jsx jsx */
import { Component } from 'react';
import { connect } from 'react-redux'
import { jsx, css,  Global } from '@emotion/core'
import { get, map, has, isEmpty, keys as _keys } from 'lodash'
import WrappingBusyMask from './WrappingBusyMask'
import { Trans } from 'react-i18next'
import loading_icon from '../images/loading.gif'
import { default_theme as theme } from 'emotion/theme'
import { Table } from '@material-ui/core'
import Container from './layout/Container'
import Pagination from './Pagination'

class CommonTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            header_sizes: [],
            visible_rows: [],
            selected_row: null
        }
    }

    handleRowClick = (e, row_id) => {
        const { onRowClick } = this.props
        e.preventDefault()
        if (onRowClick) {
            onRowClick(row_id)
        }
    }

    refresh = () => {
        const { item_list, dispatch } = this.props
        dispatch(item_list.invalidateList())
        dispatch(item_list.fetchListIfNeeded())
    }

    renderCell(item, header_key, index, row_index, current_state) {
        const { headers, renderCell, getCellValue, editable } = this.props

        let rendered_result = undefined
        
        if ( renderCell ) {
            rendered_result = renderCell(header_key, item, headers[header_key].column_size || 1, row_index, index, current_state, editable)
        }
        if ( rendered_result === undefined ) {
            let cell_value = undefined
            if ( getCellValue ) {
                cell_value = getCellValue(header_key, item, index, row_index)
            }
            if ( cell_value === undefined ) {
                cell_value = item[header_key]
            }

            rendered_result = cell_value
        }

        const td_style = get(headers, [header_key, "td_style"],
                             css`vertical-align: middle;
                                 width: ${headers[header_key].td_width || "auto"};
`
                            )

        return (
            <td key={index} css={td_style}>
              {rendered_result}
            </td>
        )
    }

    renderRow = (item, row_index, is_editing) => {
        const { headers, onRowClick, custom_row_height } = this.props
        const keys = _keys(headers)
        let row_id = item.id

        const current_state = (has(this.state, row_id) && this.state[row_id]) || false

        return (
            <tr key={row_index} onClick={ (e) => this.handleRowClick(e, item.id) }>
              {map(keys, (header_key, index) => {
                  if (headers[header_key] === undefined) {
                      return null
                  }
                  return this.renderCell(item, header_key, index, row_index, current_state)
                  
              })}
            </tr>
        )
    }

    renderEmptyRow = () => {
        const { empty_message } = this.props
        return (
            <tr>
              <td colSpan="50">
                <em>{ empty_message }</em>
              </td>
            </tr>
        )
    }

    sortOnHeader = (key) => {
        //  Sorting disabled
        return
        
        // const { sortOnHeader, dispatch, item_list } = this.props
        // if ( sortOnHeader ) {
        //     sortOnHeader(key)
        // }
        // if ( ! item_list ) {
        //     return
        // }

        // const filter = item_list.getFilter()
        // if (key !== 'action' && key !== 'admin_email') {
        //     let sort_by = key
        //     if (has(filter, 'order_by') && filter.order_by === key) {
        //         sort_by = '-' + key
        //     }
        //     dispatch(item_list.updateListFilter({'order_by': sort_by}))
        // }
    }

    render() {
        const {
            headers,
            items,
            item_list,
            is_loading,
            rows_displayed,
            add_row,
            edit_row,
            enable_pagination,
            sub_header_message
        } = this.props

        const that = this
        const keys = _keys(headers)

        return (
            <WrappingBusyMask is_loading={is_loading && !isEmpty(items)}>
              <Global styles={global_styles} />
              <div>
                <Table bordered responsive css={table_style}>
                  <thead css={thead_style}>
                    <tr>
                      {keys && map(keys, (header_key, index) => {
                           return (
                               <th key={index}>
                                 <div onClick={ (e) => that.sortOnHeader(header_key) }
                                      css={css`/*cursor:pointer;*/`}>
                                   { headers[header_key].render ? headers[header_key].render(headers[header_key]) : headers[header_key].name }
                                 </div>
                               </th>
                           )
                      })}
                    </tr>
                  </thead>
                  <tbody css={tbody_style}>
                    { sub_header_message &&
                      <tr>
                        <td colspan="20">
                          <div css={sub_header_message_style}>{sub_header_message}</div>
                        </td>
                      </tr>
                    }
                    { !is_loading && (add_row === undefined || add_row === null) && isEmpty(items) &&
                      this.renderEmptyRow()
                    }

                    { add_row !== undefined && add_row !== null && 
                      this.renderRow(add_row, -1)
                    }
                    {map(items, (item, row_index) => {
                         const is_editing = edit_row && edit_row.id === item.id
                         return this.renderRow(item, row_index, is_editing)
                    })}
                    
                  </tbody>
                  
                </Table>
                { item_list && enable_pagination && 
                  <div css={pagination_container}>
                    <Pagination listKey={ item_list.listKey }
                                item_list={item_list}
                                filters={ item_list.getFilter() } />
                  </div>
                }

              </div>
            </WrappingBusyMask>
        )
    }
}

function mapStateToProps(state, props) {
    const { is_loading, enable_pagination } = props
    return {
        is_loading: is_loading || (props.item_list && props.item_list.isLoading()),
        enable_pagination: enable_pagination !== false
    }
}

export default connect(mapStateToProps)(CommonTable)

const global_styles = css`
.table thead {
background-color: ${theme.colors.page_background};
}

.table thead th {
font-weight: 500;
border-left: 0px;
border-right: 0px;
border-top: 0px;
border-bottom: 1px solid rgb(217,217,217)
}

.table-bordered td {
border-top: 1px solid rgb(217,217,217);
border-bottom: 1px solid rgb(217,217,217);
border-left: 0px;
border-right: 0px;

}

.table-responsive {
overflow-x: hidden;
}

`

const table_style = css`
border-radius: 4px;
margin-bottom: 0px;

`

const thead_style = css`
color: ${theme.colors.secondary};
`

const th = css`
display: flex;
`

const tr = css`
display: flex;
flex: 1;
border-bottom: 1px solid ${theme.colors.gray2};
padding-top: 10px;
padding-bottom: 10px;
padding-left: 5px;
padding-right: 5px;
`

const tbody_style = css`
border-left: 1px solid rgb(217,217,217);
border-right: 2px solid rgb(217,217,217);
border-bottom: 1px solid rgb(217,217,217);
`

const td = css`
display: flex;
flex-direction: column;
overflow: hidden;
`

const loading_container = css`
position: absolute; 
z-index:900; 
background-color: rgba(255, 255, 255, 0.8); 
width: 100%; 
height: 100%;
display: flex;
justify-content: center; 
align-items: center;
`

const loading = css`
width: 32px;
height: 32px;
`

const clickable_icon = css`
cursor: pointer;
`

const pagination_container = css`
`


const sub_header_message_style = css`
font-style: italic;
`
