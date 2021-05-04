import { ItemList } from "orm";
import { onEventUpdated } from "admin/actions/admin_calendar";
// import { EnhancedFilter } from '../../admin/actions/enhanced_filter'
import { EnhancedFilter } from "../../../../admin/actions/enhanced_filter";

class ParcelList extends ItemList {
  getEntityKey() {
    return "admin/parcel";
  }

  saveObject(props) {
    return super.saveObject(props);
  }

  saveNewObject(props) {
    return super.saveNewObject(props);
  }

  getEnhancedFilter() {
    if (!this.enhanced_filter) {
      this.enhanced_filter = new EnhancedFilter(this);
    }
    return this.enhanced_filter;
  }
}

export const adminParcelList = new ParcelList("admin_parcel__default");
export const adminParcelListForDashboard = new ParcelList(
  "admin_parcel_for_dashboard__default"
);
