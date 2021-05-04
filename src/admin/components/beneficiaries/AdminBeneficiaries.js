
/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { get } from 'lodash'
import AdminCommonListLayout from '../../../admin/components/layout/AdminCommonListLayout'
import { FormikDropdownField } from '../../../components/form/Dropdown'
import { FormikInputField } from '../../../components/form/InputField'
import { adminBeneficiaryList } from './actions/admin_beneficiary'
import { Separator } from '../../../components/layout/Separator'
import { countryList } from '../../../actions/country'
import { provinceList } from '../../../actions/province'
import { statusList } from '../../../actions/status'
import {Hidden, Paper} from '@material-ui/core'
import AdminBeneficiary from './AdminBeneficiary'
import AdminParcelsTable from '../orders/AdminParcelsTable'
import { adminParcelList } from '../orders/actions/admin_parcel'

class Beneficiaries extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminBeneficiaryList.fetchListIfNeeded())
        dispatch(countryList.updatePaginationNumItemsPerPage(1000))
        dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
        dispatch(statusList.updatePaginationNumItemsPerPage(1000))
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
        dispatch(statusList.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch } = this.props
        dispatch(adminBeneficiaryList.fetchListIfNeeded())
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
        dispatch(statusList.fetchListIfNeeded())

    }

    onUpdateListOrdering = (field) => {
      const { dispatch } = this.props
      dispatch(adminBeneficiaryList.updateListOrdering(field))
  }


    onCountryChanged = (country_id) => {
        const { dispatch } = this.props
        dispatch(provinceList.filterOnCountry(country_id))
    }

    onEditBeneficiary = (beneficiary_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/beneficiary/'+beneficiary_id
        })
    }

    onAddBeneficiary = () => {
        const { history } = this.props
        history.push('/admin/beneficiary')
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

              <FormikInputField name="any_field"
                                formik_props={formik_props}
                                show_search_icon={true}
                                placeholder="Any field" />

              <Separator variant="w5" />
            </div>
        )
    }


    render() {
        const { is_loading } = this.props
        const that = this

        const columnsDesktop = [

            { field: 'name',
              title: 'Beneficiary',
              render: (item) => get(item, ["company", "name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'company__name' : '-company__name'),

            },
            { field: 'company.city_name',
              title: 'City',
              sort:(direction) => this.onUpdateListOrdering(direction === 'asc' ? 'company__addresses__city__name' : '-company__addresses__city__name')
            },

            { field: 'status',
              title: 'Status',
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'status' : '-status')
            },
            { field: 'last_delivery',
              title: 'Last Delivery',
              render: (item) => get(item, ["company", "last_delivery"]),
              sort: null
              // sort: (direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'company__last_delivery' : '-company__last_delivery'),
            },
            { field: 'parent',
              title: 'Parent',
              render: (item) => get(item, ["company", "parent_name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'company__parent__name' : '-company__parent__name'),
            },
            { field: 'total_meals',
              title: 'Total Meals',
              render: (item) => get(item, ["company", "total_meals"]),
              sort: null
              // sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'company__parent__total_meals' : '-company__parent__total_meals'),
            },
            
        ]

        const columnsMobile = [
          { field: 'name', title: 'Beneficiary',
            render: (item) => get(item, ["company", "name"])
          }
        ]

        return (
            <>
            <Hidden smDown>
              <AdminCommonListLayout active_key="beneficiaries"
                                   breadcrumbs={[{name: 'home'},
                                                 {name: 'beneficiaries', label: "Beneficiaries", url: '/beneficiaries'}]}
                                   add_label="Add Beneficiary"
                                   onAddRow={that.onAddBeneficiary}
                                   onEditRow={that.onEditBeneficiary}
                                   is_loading={is_loading}
                                   columns={columnsDesktop}
                                   item_list={adminBeneficiaryList}
                                   renderAdditionalFilter={that.renderFilter}
            />
          </Hidden>

          <Hidden mdUp>
            <AdminCommonListLayout active_key="beneficiaries"
                                 breadcrumbs={[{name: 'home'},
                                               {name: 'beneficiaries', label: "Beneficiaries", url: '/beneficiaries'}]}
                                 add_label="Add Beneficiary"
                                 onAddRow={that.onAddBeneficiary}
                                 onEditRow={that.onEditBeneficiary}
                                 is_loading={is_loading}
                                 columns={columnsMobile}
                                 item_list={adminBeneficiaryList}
                                 renderAdditionalFilter={that.renderFilter}
          />
        </Hidden>
        </>
        )
    }
}

function mapStateToProps() {
    const beneficiaries = adminBeneficiaryList.getVisibleObjects()
    const country_options = countryList.getAsOptions()
    const province_options = provinceList.getAsOptions()

    return {
        beneficiaries,
        is_loading: adminBeneficiaryList.isLoading(),
        filter: adminBeneficiaryList.getFilter(),
        country_options,
        province_options
    }
}


export default connect(mapStateToProps)(Beneficiaries)



const filter_style = css`
display: flex;
margin-right: 16px;
`
