import { ItemList } from 'orm'

class VehicleList extends ItemList {
    getEntityKey() {
        return "admin/vehicle"
    }
}

export const adminVehicleList = new VehicleList("admin_vehicle__default")
export const adminVehicleAutoCompleteList = new VehicleList("admin_vehicle_auto_complete__default")
