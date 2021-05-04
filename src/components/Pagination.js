/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import {range, size} from 'lodash'
import { jsx, css } from '@emotion/core'
import { Trans } from 'react-i18next'
import { catch_errors } from '../lib'
import { default_theme as theme } from 'emotion/theme'
import { updateListPagination, invalidateList, getPagination } from '../orm/orm_list_actions'
import { Col } from './layout/Col'
import { Button } from './layout/Button'

class Pagination extends Component {

    refresh = () => {
        const { item_list, dispatch } = this.props
        dispatch(item_list.invalidateList())
        dispatch(item_list.fetchListIfNeeded())
    }

    gotoPage(number) {
        const { dispatch, listKey, filters, onChange, item_list } = this.props
        dispatch(updateListPagination(listKey, {page: number}))
        dispatch(invalidateList(listKey))
        if ( item_list ) {
            dispatch(item_list.fetchListIfNeeded())
        }
        if (onChange) {
            onChange(number)
        }
    }

    renderButton({label, onClick, active, index, first_number_index, last_number_index, extra_css}) {
        return (
            <div css={[pagination_item,
                       (active && pagination_item__active) || pagination_item__inactive,
                       (index === first_number_index && pagination_left) || null,
                       (index === last_number_index && pagination_right) || null,
                       extra_css || null]}
                 key={index}
                 onClick={onClick}>
              {label}
            </div>
        )
    }

    renderPageNumber(number, index, range_args) {
        const {current_page, prev_page, next_page, num_pages } = this.props
        switch (number) {
            case current_page:
                return (
                    this.renderButton({label:number, onClick:() => this.gotoPage(number), active:true, index, ...range_args})
                )
            case 'first':
                return (
                    this.renderButton({label:1, onClick:() => this.gotoPage(1), active:false, index, ...range_args, extra_css: pagination_isolated})
                )
            case 'last':
                return (
                    this.renderButton({label:num_pages, onClick:() => this.gotoPage(num_pages), active:false, index, ...range_args, extra_css: pagination_isolated})
                )
            case 'prev':
                return (
                    this.renderButton({label:"Back",
                                       onClick:() => this.gotoPage(prev_page), active:false, index, ...range_args, extra_css: pagination_isolated})
                )
            case 'next':
                return (
                    this.renderButton({label:"Next",
                                       onClick:() => this.gotoPage(next_page), active:false, index, ...range_args, extra_css: pagination_isolated})
                )
            case 'splitter':
                return (
                    <div>
                      ...
                    </div>
                )
            default:
                return (
                    this.renderButton({label:number, onClick:() => this.gotoPage(number), active:false, index, ...range_args})
                )
        }
    }

    renderPageNumbers() {
        const { num_pages, current_page} = this.props
        
        const adjacents = 3

        let numbers = []

        // numbers.push('first')
        numbers.push('prev')
        
        if (num_pages < 7 + (adjacents * 2)) {
            numbers = numbers.concat(range(1, num_pages + 1))
        } else if (num_pages > 5 + (adjacents * 2)) {
            if (current_page < 1 + (adjacents * 2)) {
                // close to beginning; only hide later pages
                numbers = numbers.concat([...range(1, 4 + (adjacents * 2)), 'splitter', num_pages -1, num_pages])
            } else if ((num_pages - (adjacents * 2) > current_page) && (current_page > (adjacents * 2))) {
                // in middle; hide some front and some back
                numbers = numbers.concat([
                    1, 2, 'splitter',
                    ...range(current_page - adjacents, current_page + adjacents + 1),
                    'splitter',
                    num_pages])
            } else {
                // close to the end, hide early pages
                numbers = numbers.concat([1, 2, ...range(num_pages - (2+(adjacents * 2)), num_pages)], num_pages)
            }
        }
        numbers.push('next')
        // numbers.push('last')
        const first_number_index = 1
        const last_number_index = size(numbers)-2
        return numbers.map((number, index) => this.renderPageNumber(number, index, {first_number_index, last_number_index}))
    }

    render() {
        const {num_pages, item_list} = this.props

        return (
            <div css={pagination_container}>
              { item_list &&
                (
                    <div css={pagination_group}>
                      <div css={[pagination_item, refresh_button]} onClick={() => this.refresh()}>
                        <Trans>Refresh</Trans>
                      </div>
                    </div>
                )
              }
              {this.renderPageNumbers()}
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    const pagination = getPagination(props.listKey, state)
    const { item_list, listKey } = props

    return {
        listKey,
        item_list,
        min_page_num: 1,
        current_page: pagination.current_page || 1,
        num_pages: pagination.num_pages || 0,
        num_items: pagination.num_items || 0,
        first_item_index: pagination.first_item_index || 1,
        last_item_index: pagination.last_item_index || 1,
        next_page: pagination.next_page,
        prev_page: pagination.prev_page
    }
}

export default connect(catch_errors(mapStateToProps))(Pagination)

const pagination_container = css`
display: flex;
justify-content: left;
margin-top: 20px;
`



const refresh_button = css`
margin-right: 15p;
border-radius: 4px;
`

const pagination_group = css`
margin-right: 15px;
`

const pagination_isolated = css`
margin-right: 4px;
margin-left: 4px;
border-radius: 4px;
`

const pagination_left = css`
border-top-left-radius: 4px;
border-bottom-left-radius: 4px;
`

const pagination_right = css`
border-top-right-radius: 4px;
border-bottom-right-radius: 4px;
`

const pagination_item = css`
color: #000;
background-color: #ffffff;
border: 1px solid #d1d1d6;
line-height: 18px;
padding: 10px;
cursor: pointer;

&:first {
border-radius: 4px;
}

&:last {
border-radius: 4px;
}

&:hover {
background-color: #efeff4;
}

`


const pagination_item__inactive = css`

`

const pagination_item__active = css`
background-color: #efeff4;
`
