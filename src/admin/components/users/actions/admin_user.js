// @ts-nocheck
import { ItemList } from "orm";
import { map } from "lodash";
import { EnhancedFilter } from "../../../../admin/actions/enhanced_filter";

class UserList extends ItemList {
  getEntityKey() {
    return "admin/user";
  }

  getAsOptions() {
    const items = this.getVisibleObjects();
    return map(items, (item) => {
      return {
        label: item.display_name,
        value: item.id,
      };
    });
  }
  getEnhancedFilter() {
    if (!this.enhanced_filter) {
      this.enhanced_filter = new EnhancedFilter(this);
    }
    return this.enhanced_filter;
  }
}

export const adminUserList = new UserList("admin_user__default");
export const adminPickerAutoCompleteList = new UserList(
  "admin_picker_user__default"
);
