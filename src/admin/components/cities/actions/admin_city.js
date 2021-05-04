import { ItemList } from "orm";
import { map } from "lodash";

class CityList extends ItemList {
  getEntityKey() {
    return "admin/city";
  }
}

export const adminCityList = new CityList("admin_city__default");
export const adminCityAutoCompleteList = new CityList(
  "admin_city_auto_complete__default"
);
