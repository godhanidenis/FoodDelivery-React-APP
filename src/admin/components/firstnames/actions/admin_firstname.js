// @ts-nocheck
import { ItemList } from "orm";
import { map } from "lodash";

class FirstNameList extends ItemList {
  getEntityKey() {
    return "admin/users";
  }
}

export const adminFirstNameList = new FirstNameList("admin_users__default");
export const adminFirstNameAutoCompleteList = new FirstNameList(
  "admin_users_auto_complete__default"
);
