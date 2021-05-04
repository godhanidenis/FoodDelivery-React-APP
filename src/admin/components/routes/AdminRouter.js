import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'

import AdminReleaseNotes from '../configuration/AdminReleaseNotes'
import AdminUsers from '../users/AdminUsers'
import AdminDonors from '../donors/AdminDonors'
import AdminDonor from '../donors/AdminDonor'
import AdminParcels from '../orders/AdminParcels'
import AdminParcel from '../orders/AdminParcel'
import AdminDonorParcel from '../orders/AdminDonorParcel'
import AdminBeneficiaryParcel from '../orders/AdminBeneficiaryParcel'
import AdminBeneficiary from '../beneficiaries/AdminBeneficiary'
import AdminBeneficiaries from '../beneficiaries/AdminBeneficiaries'
import AdminCalendar from 'admin/views/AdminCalendar'
import AdminCity from '../cities/AdminCity'
import AdminCities from '../cities/AdminCities'
import AdminDriver from '../drivers/AdminDriver'
import AdminDrivers from '../drivers/AdminDrivers'
import AdminProduct from '../products/AdminProduct'
import AdminProducts from '../products/AdminProducts'
import AdminProductCategories from '../productCategories/AdminProductCategories'
import AdminProductCategory from '../productCategories/AdminProductCategory'
import AdminVehicle from '../vehicles/AdminVehicle'
import AdminVehicles from '../vehicles/AdminVehicles'
import AdminWarehouse from '../warehouses/AdminWarehouse'
import AdminWarehouses from '../warehouses/AdminWarehouses'
import AdminWarehouseProducts from '../inventory/AdminWarehouseProducts'
import AdminUser from '../users/AdminUser'
import AdminDashboard from '../dashboard/AdminDashboard'
import AdminBeneficiaryParcelReport from '../reports/AdminBeneficiaryParcelReport'
import { AdminBeneficiaryParcelTrackingReport } from '../reports/AdminBeneficiaryParcelTrackingReport'
import AdminBringgConfiguration from '../../../admin/components/integrations/bringg/AdminBringgConfiguration'
import AdminRoadMap from '../../../admin/components/configuration/AdminRoadMap'

import { isLoggedIn, loggedInUser } from '../../../actions/auth'

class AdminRouter extends Component {

    componentDidUpdate(prevProps) {
        const { is_logged_in, history, has_usable_password, is_superuser } = this.props
        if (!prevProps.is_logged_in && is_logged_in) {
            if (is_superuser) {
                history.push('/admin/dashboard')
            } else {
                history.push('/')
            }
        }
        if (prevProps.is_logged_in && !is_logged_in) {
            history.push('/')
        }
    }

    render() {
        const { is_logged_in, is_superuser } = this.props
        if ( ! is_logged_in ) {
            return (
                <div>
                  Not logged in
                </div>
            )
        }

        return (
            <div>
              <Switch>
                <Route path="/admin/users" exact={ true } component={ AdminUsers } />
                <Route path="/admin/user/:user_id" component={ AdminUser } />
                <Route path="/admin/user" exact={ true } component={ AdminUser } />

                <Route path="/admin/release_notes" exact={ true } component={ AdminReleaseNotes } />

                <Route path="/admin/donors" exact={ true } component={ AdminDonors } />
                <Route path="/admin/donor/:donor_id" exact={ true } component={ AdminDonor } />
                <Route path="/admin/donor" exact={ true } component={ AdminDonor } />

                <Route path="/admin/beneficiaries" exact={ true } component={ AdminBeneficiaries } />
                <Route path="/admin/beneficiary/:beneficiary_id" exact={ true } component={ AdminBeneficiary } />
                <Route path="/admin/beneficiary" exact={ true } component={ AdminBeneficiary } />

                <Route path="/admin/calendar" exact={ true } component={ AdminCalendar } />

                <Route path="/admin/parcels" exact={ true } component={ AdminParcels } />
                <Route path="/admin/parcel/:parcel_id" exact={ true } component={ AdminParcel } />
                <Route path="/admin/parcel" exact={ true } component={ AdminParcel } />

                <Route path="/admin/donor_pickup/:parcel_id" exact={ true } component={ AdminDonorParcel } />
                <Route path="/admin/donor_pickup" exact={ true } component={ AdminDonorParcel } />

                <Route path="/admin/beneficiary_dropoff/:parcel_id/tracking_report" exact={ true } component={ AdminBeneficiaryParcelTrackingReport } />
                <Route path="/admin/beneficiary_dropoff/:parcel_id" exact={ true } component={ AdminBeneficiaryParcel } />
                
                <Route path="/admin/beneficiary_dropoff" exact={ true } component={ AdminBeneficiaryParcel } />

                <Route path="/admin/drivers" exact={ true } component={ AdminDrivers } />
                <Route path="/admin/driver/:driver_id" exact={ true } component={ AdminDriver } />
                <Route path="/admin/driver" exact={ true } component={ AdminDriver } />

                <Route path="/admin/cities" exact={ true } component={ AdminCities } />
                <Route path="/admin/city/:city_id" exact={ true } component={ AdminCity } />
                <Route path="/admin/city" exact={ true } component={ AdminCity } />

                <Route path="/admin/products" exact={ true } component={ AdminProducts } />
                <Route path="/admin/product/:product_id" exact={ true } component={ AdminProduct } />
                <Route path="/admin/product" exact={ true } component={ AdminProduct } />

                <Route path="/admin/product_categories" exact={ true } component={ AdminProductCategories } />
                <Route path="/admin/product_category/:product_category_id" exact={ true } component={ AdminProductCategory } />
                <Route path="/admin/product_category" exact={ true } component={ AdminProductCategory } />

                <Route path="/admin/vehicles" exact={ true } component={ AdminVehicles } />
                <Route path="/admin/vehicle/:vehicle_id" exact={ true } component={ AdminVehicle } />
                <Route path="/admin/vehicle" exact={ true } component={ AdminVehicle } />

                <Route path="/admin/warehouses" exact={ true } component={ AdminWarehouses } />
                <Route path="/admin/warehouse/:warehouse_id" exact={ true } component={ AdminWarehouse } />
                <Route path="/admin/warehouse" exact={ true } component={ AdminWarehouse } />

                <Route path="/admin/inventory/list" exact={ true } component={ AdminWarehouseProducts } />

                <Route path="/admin/reports/beneficiary_parcels" exact={ true } component={ AdminBeneficiaryParcelReport } />

                <Route path="/admin/bringg_configuration" exact={ true } component={ AdminBringgConfiguration } />
                <Route path="/admin/roadmap" exact={ true } component={ AdminRoadMap } />


                <Route path="/admin" component={ AdminDashboard } />
              </Switch>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const is_logged_in = isLoggedIn()
    let has_usable_password = true
    let is_superuser = false
    if (is_logged_in) {
        const user = loggedInUser()
        has_usable_password = user && user['has_usable_password']
        is_superuser = user && user['is_superuser']
    }
    return {
        is_logged_in: is_logged_in,
        has_usable_password: has_usable_password,
        is_superuser: is_superuser
    }
}
export default withRouter(connect(mapStateToProps)(AdminRouter))
