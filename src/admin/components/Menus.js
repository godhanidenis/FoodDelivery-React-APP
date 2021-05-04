
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import MaterialUICollapseMenu from 'material-ui-collapse-menu'
import { userList } from '../../actions/user'
import { filter, keys, includes } from 'lodash'

const ALL_MENU_ITEMS = {
    dashboard: {
        "id": 1,
        "title": "",
        "items": [
            {
                "id": "dashboard",
                "icon": "dashboard",
                "name": "Dashboard",
                "link": "/admin"
            }
        ]
    },
    orders: {
        "id": 2,
        "title": "",
        "items": [
            {
                "id": "orders",
                "icon": "shopping_cart",
                "name": "Orders",
                "subitems": [
                    {
                        "id": "orders_pickups",
                        "icon": "",
                        "name": "Donor pickups",
                        "link": "/admin/parcels?direction=donor_pickup"
                    },
                    {
                        "id": "orders_dropoffs",
                        "icon": "",
                        "name": "Beneficiary dropoffs",
                        "link": "/admin/parcels?direction=beneficiary_dropoff"
                    },
                    {
                        "id": "orders_calendar",
                        "icon": "",
                        "name": "Calendar",
                        "link": "/admin/calendar"
                    },
                    {
                        "id": "drivers",
                        "icon": "",
                        "name": "Drivers",
                        "link": "/admin/drivers"
                    },
                    {
                        "id": "vehicles",
                        "icon": "",
                        "name": "Vehicles",
                        "link": "/admin/vehicles"
                    },

                ]
            }
        ]
    },
    reports: {
        "id": 'reports',
        "title": "",
        "items": [
            {
                "id": "reports",
                "icon": "report",
                "name": "Reports",
                "subitems": [
                    {
                        "id": "parcels",
                        "icon": "",
                        "name": "Beneficiary Orders",
                        "link": "/admin/reports/beneficiary_parcels"
                    }
                ]
            }
        ]
    },
    inventory: { "id": 3,
                 "title": "",
                 "items": [
                     {
                         "id": "inventory",
                         "icon": "assignment",
                         "name": "Inventory",
                         "subitems": [
                             {
                                 "id": "inventory_list",
                                 "icon": "",
                                 "name": "List",
                                 "link": "/admin/inventory/list"
                             },
                             {
                                 "id": "inventory_donations",
                                 "icon": "",
                                 "name": "Donations",
                                 "link": "/admin/inventory/donations"
                             },
                             {
                                 "id": "inventory_purchased",
                                 "icon": "",
                                 "name": "Purchased",
                                 "link": "/admin/inventory/purchased"
                             },
                             {
                                 "id": "products_list",
                                 "icon": "",
                                 "name": "Products",
                                 "link": "/admin/products"
                             },
                             {
                                 "id": "product_categories_list",
                                 "icon": "",
                                 "name": "Product Categories",
                                 "link": "/admin/product_categories"
                             },
                             {
                                 "id": "warehouses_list",
                                 "icon": "",
                                 "name": "Warehouses",
                                 "link": "/admin/warehouses"
                             },
                         ]
                     }
                 ]
               },
    donors: {
        "id": 4,
        "title": "",
        "items": [
            {
                "id": "donors",
                "icon": "storefront",
                "name": "Donors",
                "subitems": [
                    {
                        "id": "donors_list",
                        "icon": "",
                        "name": "List",
                        "link": "/admin/donors"
                    },
                    {
                        "id": "donors_donations",
                        "icon": "",
                        "name": "Donations",
                        "link": "/admin/donors/donations"
                    },
                    {
                        "id": "donors_report",
                        "icon": "",
                        "name": "Report",
                        "link": "/admin/donors/report"
                    },
                ]
            }
        ]
    },
    beneficiaries:  {
        "id": 5,
        "title": "",
        "items": [
            {
                "id": "beneficiaries",
                "icon": "person_pin_circle",
                "name": "Beneficiaries",
                "subitems": [
                    {
                        "id": "beneficiaries_list",
                        "icon": "",
                        "name": "List",
                        "link": "/admin/beneficiaries"
                    },
                    {
                        "id": "beneficiaries_list",
                        "icon": "",
                        "name": "Report",
                        "link": "/admin/beneficiaries/report"
                    },
                    {
                        "id": "orders_deliveries",
                        "icon": "",
                        "name": "Deliveries",
                        "link": "/admin/parcels?task=delivery"
                    },
                ]
            }
        ]
    },
    user: {
        "id": 6,
        "title": "",
        "items": [
            {
                "id": "users",
                "icon": "person",
                "name": "Users",
                "subitems": [
                    {
                        "id": "users_list",
                        "icon": "",
                        "name": "List",
                        "link": "/admin/users"
                    },
                    {
                        "id": "users_roles",
                        "icon": "",
                        "name": "Roles",
                        "link": "/admin/users/roles"
                    },
                    {
                        "id": "users_permissions",
                        "icon": "",
                        "name": "Permissions",
                        "link": "/admin/users/permissions"
                    },
                ]
            }
        ]
    },
    configuration: {
        "id": 7,
        "title": "",
        "items": [
            {
                "id": "dashboard",
                "icon": "settings",
                "name": "Configuration",
                "subitems": [
                    {
                        "id": "release_notes",
                        "icon": "",
                        "name": "Release notes",
                        "link": "/admin/release_notes"
                    },
                    {
                        "id": "editable_emails",
                        "icon": "",
                        "name": "Email Editor",
                        "link": "/admin/editable_emails"
                    },
                    {
                        "id": "bringg",
                        "icon": "",
                        "name": "Bringg",
                        "link": "/admin/bringg_configuration"
                    },
                    {
                        "id": "cities",
                        "icon": "",
                        "name": "Cities",
                        "link": "/admin/cities"
                    },
                ]
            }
        ]
    }
}

export const MainMenu = () => {

    const dispatch = useDispatch()
    const logged_in_user = userList.getUser()
    const can_edit_users = logged_in_user.is_superuser

    let allowed_menu_keys
    debugger
    if ( logged_in_user.is_superuser ) {
        allowed_menu_keys = ["dashboard", "orders", "reports", "inventory", "donors", "beneficiaries", "users", "configuration"]
    } else {
        allowed_menu_keys = ["dashboard", "orders", "reports", "inventory", "donors", "beneficiaries", "configuration"]
    }
    const menu_items = filter(keys(ALL_MENU_ITEMS), (menu_key) => includes(allowed_menu_keys, menu_key))
    
    return (
        <MaterialUICollapseMenu items={menu_items} />
    )
}
