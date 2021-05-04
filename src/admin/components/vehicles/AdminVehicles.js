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
import { adminVehicleList } from './actions/admin_vehicle'
import { Separator } from 'components/layout/Separator'
import { ShortId } from 'components/ShortId'
import { Button } from 'components/layout/Button'
import { countryList } from 'actions/country'
import { provinceList } from 'actions/province'

class Vehicles extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminVehicleList.fetchListIfNeeded())
        dispatch(countryList.updatePaginationNumItemsPerPage(1000))
        dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch, filter } = this.props
        dispatch(adminVehicleList.fetchListIfNeeded())
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
    }

    onCountryChanged = (country_id) => {
        const { dispatch } = this.props
        dispatch(provinceList.filterOnCountry(country_id))
    }

    onEditVehicle = (vehicle_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/vehicle/'+vehicle_id
        })
    }

    onAddVehicle = () => {
        const { history } = this.props
        history.push('/admin/vehicle')
    }

    onUpdateListOrdering = (field) => {
        const { dispatch } = this.props
        dispatch(adminVehicleList.updateListOrdering(field))
      }

    renderFilter = (formik_props) => {
        const { country_options, province_options } = this.props
        return (
            <div css={filter_style}>

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
        const { is_loading, vehicles } = this.props
        const that = this

        const columns = [
            { field: 'id', title: 'Id',
              render: (item) => <ShortId value={item.id} />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'id' : '-id'),
            },
            /*{ field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime' />
            },*/
            {field: 'name', title: 'Name',sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'name' : '-name'), },
            {field: 'model', title: 'Model',sort: (direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'model' : '-model')},
            {field: 'registration_number', title: 'Registration number',sort: (direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'registration_number' : '-registration_number')},
            {field: 'registration_expiration_date', title: 'Registration Exp',sort: (direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'registration_expiration_date' : '-registration_expiration_date')},
            {field: 'City', title: 'City',
              render: (item) => get(item, ["operating_city_name"]),
              sort: (direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'operating_city__name' : '-operating_city__name')
            },
            {field: 'bringg_ref', title: 'Bringg Ref', sort: (direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'bringg_ref' : '-bringg_ref')},
        ]

        return (
            <AdminCommonListLayout active_key="vehicles"
                                   breadcrumbs={[{name: 'admin_home'},
                                                 {name: 'vehicles', label: "Vehicles", url: '/admin/vehicles'}]}
                                   add_label="Add Vehicle"
                                   onAddRow={that.onAddVehicle}
                                   onEditRow={that.onEditVehicle}
                                   is_loading={is_loading}
                                   columns={columns}
                                   item_list={adminVehicleList}
                                   renderAdditionalFilter={that.renderFilter}
            />
        )
    }
}

function mapStateToProps(state, props) {
    const vehicles = adminVehicleList.getVisibleObjects()
    const country_options = countryList.getAsOptions()
    const province_options = provinceList.getAsOptions()

    return {
        vehicles,
        is_loading: adminVehicleList.isLoading(),
        filter: adminVehicleList.getFilter(),
        country_options,
        province_options
    }
}

export default connect(mapStateToProps)(Vehicles)

const filter_row_style = css`
width: 100%;
display: flex;
justify-content: space-between;
`


const filter_style = css`
display: flex;
margin-right: 16px;
`
