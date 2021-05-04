import { ItemList } from 'orm'

class DropdownOptions extends ItemList {
    constructor(dropdown_name) {
        super(`admin_options__${dropdown_name}`)
        this.url = `admin/dropdown_options/${dropdown_name}`
    }

    getEntityKey() {
        return this.url
    }

}

export const adminDonorStates = new DropdownOptions('donor_states')
export const adminBeneficiaryStates = new DropdownOptions('beneficiary_states')
export const adminParcelStates = new DropdownOptions('parcel_states')
export const adminEmployeeRoles = new DropdownOptions('employee_roles')
export const adminAddressTypes = new DropdownOptions('address_types')
export const adminContactRoles = new DropdownOptions('contact_roles')
export const adminDriverStates = new DropdownOptions('driver_states')

