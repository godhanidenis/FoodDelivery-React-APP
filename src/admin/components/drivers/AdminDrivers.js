import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get } from 'lodash'
import { Trans, Translation } from 'react-i18next'
import { FormikDropdownField } from 'components/form/Dropdown'
import AdminCommonListLayout from '../layout/AdminCommonListLayout'
import Timestamp from 'components/Timestamp'
import { FormikInputField } from 'components/form/InputField'
import { adminDriverList } from './actions/admin_driver'
import { Separator } from 'components/layout/Separator'
import { ShortId } from 'components/ShortId'
import { Button } from 'components/layout/Button'
import { countryList } from 'actions/country'
import { provinceList } from 'actions/province'

class Drivers extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminDriverList.fetchListIfNeeded())
        dispatch(countryList.updatePaginationNumItemsPerPage(1000))
        dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch, filter } = this.props
        dispatch(adminDriverList.fetchListIfNeeded())
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
    }

    onCountryChanged = (country_id) => {
        const { dispatch } = this.props
        dispatch(provinceList.filterOnCountry(country_id))
    }

    onEditDriver = (driver_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/driver/'+driver_id
        })
    }

    onAddDriver = () => {
        const { history } = this.props
        window.alert("To add a driver, create a new user and assign them the Driver role")
    }

    onUpdateListOrdering = (field) => {
      const { dispatch } = this.props
      dispatch(adminDriverList.updateListOrdering(field))
    }

    renderFilter = (formik_props) => {
        const { country_options, province_options } = this.props
        return (
            <div>

              <FormikDropdownField name="country"
                                   formik_props={formik_props}
                                   options={country_options}
                                   on_change={this.onCountryChanged}
                                   empty_selection_label="Any country"
                                   placeholder="Country" />
              <Separator variant="w5" />
              <FormikDropdownField name="province"
                                   formik_props={formik_props}
                                   options={province_options}
                                   empty_selection_label="Any province"
                                   placeholder="Province" />

              <Separator variant="w10" />
            </div>
        )
    }

    render() {
        const { is_loading, drivers } = this.props
        const that = this

        const columns = [
            { field: 'First Name', title: ' First Name',
              render: (item) => get(item, ["first_name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'user__first_name' : '-user__first_name')
            },
            { field: 'Last Name', title: 'Last Name',
              render: (item) => get(item, ["last_name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'user__last_name' : '-user__last_name')
            },
            { field: 'City', title: 'City',
              render: (item) => get(item, ["operating_city_name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'operating_city__name' : '-operating_city__name')
            },
            { field: 'Vehicle', title: 'Vehicle',
              render: (item) => get(item, ["preferred_vehicle_name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'preferred_vehicle__name' : '-preferred_vehicle__name')
            },
            { field: 'Driver licence', title: 'Driver Licence',
              render: (item) => get(item, ["driver_licence"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'driver_licence' : '-driver_licence')
            },
            { field: 'Email', title: 'Email',
              render: (item) => get(item, ["user_email"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'user__email' : '-user__email')
            },
            {field: 'bringg_ref', title: 'Bringg Ref', sort: (direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'bringg_ref' : '-bringg_ref')},
            { field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime' />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at'),
            },
        ]

        return (
            <AdminCommonListLayout active_key="drivers"
                                   breadcrumbs={[{name: 'admin_home'},
                                                 {name: 'drivers', label: "Drivers", url: '/admin/drivers'}]}
                                   add_label="Add Driver"
                                   onAddRow={that.onAddDriver}
                                   onEditRow={that.onEditDriver}
                                   is_loading={is_loading}
                                   columns={columns}
                                   item_list={adminDriverList}
                                   renderAdditionalFilter={that.renderFilter}
            />
        )
    }
}

function mapStateToProps(state, props) {
    const drivers = adminDriverList.getVisibleObjects()
    const country_options = countryList.getAsOptions()
    const province_options = provinceList.getAsOptions()

    return {
        drivers,
        is_loading: adminDriverList.isLoading(),
        filter: adminDriverList.getFilter(),
        country_options,
        province_options
    }
}

export default connect(mapStateToProps)(Drivers)
