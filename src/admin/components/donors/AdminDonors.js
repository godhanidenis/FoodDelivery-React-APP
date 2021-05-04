// @ts-nocheck
/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get ,sortBy } from 'lodash'
import { Trans, Translation } from 'react-i18next'
import { FormikDropdownField } from '../../../components/form/Dropdown'
import AdminCommonListLayout from '../layout/AdminCommonListLayout'
import Timestamp from '../../../components/Timestamp'
import { FormikInputField } from '../../../components/form/InputField'
import { adminDonorList } from './actions/admin_donor'
import { Separator } from 'components/layout/Separator'
import { ShortId } from 'components/ShortId'
import { Button } from 'components/layout/Button'
import { countryList } from 'actions/country'
import { provinceList } from 'actions/province'
import { handleSubmitResult } from 'actions/form'
import { Grid, Paper, Hidden,Avatar } from '@material-ui/core'
import AdminParcelsTable from '../orders/AdminParcelsTable'
import { adminParcelList } from '../orders/actions/admin_parcel'
class Donors extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminDonorList.fetchListIfNeeded())
        dispatch(countryList.updatePaginationNumItemsPerPage(1000))
        dispatch(provinceList.updatePaginationNumItemsPerPage(1000))
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
    }

    componentDidUpdate() {
        const { dispatch, filter } = this.props
        dispatch(adminDonorList.fetchListIfNeeded())
        dispatch(countryList.fetchListIfNeeded())
        dispatch(provinceList.fetchListIfNeeded())
    }

    onCountryChanged = (country_id) => {
        const { dispatch } = this.props
        dispatch(provinceList.filterOnCountry(country_id))
    }

    onUpdateListOrdering = (field) => {
        const { dispatch } = this.props
        dispatch(adminDonorList.updateListOrdering(field))

    }

    onEditDonor = (donor_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/donor/'+donor_id
        })
    }

    onAddDonor = () => {
        const { history } = this.props
        history.push('/admin/donor')
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
        const { is_loading, donors } = this.props
        const that = this

        const columns = [
            { field: 'id', title: 'Id',
              render: (item) => <ShortId value={item.id} />,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'id' : '-id'),
            },
            { field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime'/>,
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'created_at' : '-created_at')
            },
            { field: 'name', title: 'Name',
              render: (item) => get(item, ["company", "name"]),
              sort: (direction) => this.onUpdateListOrdering(direction === 'asc' ? 'company__name' : '-company__name')
            },
            { field: 'parent', title: 'Parent',
              render: (item) => get(item, ["company", "parent_name"]),
              sort:(direction) => this.onUpdateListOrdering(direction === 'asc' ? 'company__parent__name' : '-company__parent__name')
            },
            { field: 'company.city_name',
              title: 'City',
              sort:(direction) => this.onUpdateListOrdering(direction === 'asc' ? 'company__addresses__city__name' : '-company__addresses__city__name')
            },
            { field: 'email',
              title: 'Email',
              render: (item) => get(item, ["company", "primary_contact_email"]),
              sort:(direction) =>  this.onUpdateListOrdering(direction === 'asc' ? 'company__contacts__email' : '-company__contacts__email'),
            },
        ]

        return (
            <>
                <AdminCommonListLayout active_key="donors"
                                    breadcrumbs={[{name: 'admin_home'},
                                                    {name: 'donors', label: "Donors", url: '/donors'}]}
                                    add_label="Add Donor"
                                    onAddRow={that.onAddDonor}
                                    
                                    onEditRow={that.onEditDonor}
                                    is_loading={is_loading}
                                    columns={columns}
                                    item_list={adminDonorList}
                                    renderAdditionalFilter={that.renderFilter}
                                    handleRequestSort={columns}
                >

                </AdminCommonListLayout>
                <Separator variant="h15" />
                <Paper>
                    <AdminParcelsTable parcelItemList={adminParcelList}  />
                </Paper>
           </>
        )
    }
}

function mapStateToProps(state, props) {
    const donors = adminDonorList.getVisibleObjects()
    const country_options = countryList.getAsOptions()
    const province_options = provinceList.getAsOptions()

    return {
        donors,
        is_loading: adminDonorList.isLoading(),
        filter: adminDonorList.getFilter(),
        country_options,
        province_options
    }
}

export default connect(mapStateToProps)(Donors)

const filter_row_style = css`
width: 100%;
display: flex;
justify-content: space-between;
`


const filter_style = css`
display: flex;
margin-right: 16px;
`
