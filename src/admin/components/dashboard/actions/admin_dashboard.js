// @ts-nocheck
import { ItemList } from "orm";
import { map, keys, sortBy } from "lodash";
import { EnhancedFilter } from "admin/actions/enhanced_filter";

const GLOBAL_DASHBOARD_DATA_ID = "global";

class AdminDashboardList extends ItemList {
  getEntityKey() {
    return "admin/dashboard";
  }

  loadData() {
    return this.fetchListIfNeeded();
  }

  getData() {
    return this.getObject(GLOBAL_DASHBOARD_DATA_ID);
  }

  getEnhancedFilter() {
    if (!this.enhanced_filter) {
      this.enhanced_filter = new EnhancedFilter(this);
    }
    return this.enhanced_filter;
  }
}

export const adminDashboardList = new AdminDashboardList(
  "admin_dashboard__default"
);

export const unpackCityData = (totals_by_city) => {
  const rows = sortBy(
    map(keys(totals_by_city), (city_name) => {
      return { name: city_name, value: totals_by_city[city_name] };
    }),
    "name"
  );
  return rows;
};
