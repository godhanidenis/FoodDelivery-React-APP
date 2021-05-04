
/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get } from 'lodash'
import { Trans, Translation } from 'react-i18next'
import { FormikDropdownField } from 'components/form/Dropdown'
import AdminCommonListLayout from '../layout/AdminCommonListLayout'
import Timestamp from 'components/Timestamp'
import { FormikInputField } from 'components/form/InputField'
import { adminCityList } from './actions/admin_city'
import { Separator } from 'components/layout/Separator'
import { ShortId } from 'components/ShortId'
import { Button } from 'components/layout/Button'
import { provinceList } from 'actions/province'

class Cities extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminCityList.fetchListIfNeeded())
        dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
        dispatch(provinceList.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch, filter } = this.props
        dispatch(adminCityList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
    }

    onEditCity = (city_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/city/'+city_id
        })
    }

    onAddCity = () => {
        const { history } = this.props
        history.push('/admin/city')
    }

    onUpdateListOrdering = (field) => {
      const { dispatch } = this.props
      dispatch(adminCityList.updateListOrdering(field))
    }

    render() {
        const { is_loading, cities } = this.props
        const that = this

        const columns = [
            { field: 'Name', title: ' Name',
              render: (item) => get(item, "name"),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'name' : '-name')
            },
            { field: 'Province', title: 'Province',
              render: (item) => get(item, ["province_name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'province__name' : '-province__name')
            },
            { field: 'Bringg Team Ref', title: 'Bringg Team Ref',
              render: (item) => get(item, ["bringg_team_ref"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'bringg_team_ref' : '-bringg_team_ref')
            }
        ]

        return (
            <AdminCommonListLayout active_key="cities"
                                   breadcrumbs={[{name: 'admin_home'},
                                                 {name: 'cities', label: "Cities", url: '/admin/cities'}]}
                                   add_label="Add City"
                                   onAddRow={that.onAddCity}
                                   onEditRow={that.onEditCity}
                                   is_loading={is_loading}
                                   columns={columns}
                                   item_list={adminCityList}
            />
        )
    }
}

function mapStateToProps(state, props) {
    const cities = adminCityList.getVisibleObjects()

    return {
        cities,
        is_loading: adminCityList.isLoading(),
        filter: adminCityList.getFilter()
    }
}

export default connect(mapStateToProps)(Cities)
