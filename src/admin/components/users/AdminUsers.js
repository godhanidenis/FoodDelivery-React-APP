// @ts-nocheck
/** @jsx jsx */
import React, { Component } from "react";
import { connect } from "react-redux";
import { jsx, css } from "@emotion/core";
import { head, get, join } from "lodash";
import { Trans, Translation } from "react-i18next";
import { FormikDropdownField } from "../../../components/form/Dropdown";
import AdminCommonListLayout from "../layout/AdminCommonListLayout";
import Timestamp from "../../../components/Timestamp";
import { FormikInputField } from "../../../components/form/InputField";
import { adminUserList } from "./actions/admin_user";
import { Separator } from "../../../components/layout/Separator";
import { ShortId } from "../../../components/ShortId";
import { Button } from "../../../components/layout/Button";
import { adminParcelList } from "../orders/actions/admin_parcel";
import AdminParcelsTable from "../orders/AdminParcelsTable";
import { Grid, Paper, Hidden, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CommonTable, CommonPaperTable } from "../../../components/CommonTable";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  blackChip: {
    color: "#ffffff",
    backgroundColor: "#000000",
    marginLeft: 10,
  },
}));

class Users extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(adminUserList.fetchListIfNeeded());
  }

  componentDidUpdate() {
    const { dispatch, filter } = this.props;
    dispatch(adminUserList.fetchListIfNeeded());
  }

  onEditUser = (user_id) => {
    const { history } = this.props;
    history.push({
      pathname: "/admin/user/" + user_id,
    });
  };

  onAddUser = () => {
    const { history } = this.props;
    history.push("/admin/user");
  };

  onUpdateListOrdering = (field) => {
    const { dispatch } = this.props;
    dispatch(adminUserList.updateListOrdering(field));
  };

  render() {
    const { is_loading, users } = this.props;
    const that = this;

    const columns = [
      {
        field: "id",
        title: "Id",
        render: (item) => <ShortId value={item.id} />,
        sort: (direction) =>
          this.onUpdateListOrdering(direction === "asc" ? "id" : "-id"),
      },
      {
        field: "created_at",
        title: "Created at",
        render: (item) => (
          <Timestamp value={item.created_at} format="datetime" />
        ),
        sort: (direction) =>
          this.onUpdateListOrdering(
            direction === "asc" ? "created_at" : "-created_at"
          ),
      },
      {
        field: "first_name",
        title: "First name",
        sort: (direction) => null,
      },
      {
        field: "last_name",
        title: "Last name",
        sort: (direction) => null,
      },
      {
        field: "email",
        title: "Email",
        render: (item) => get(item, ["email"]),
        sort: (direction) => null,
      },
      {
        field: "roles",
        title: "Roles",
        render: (item) => join(get(item, ["employee", "roles"], []), ", "),
        sort: (direction) => null,
      },
      {
        field: "City",
        title: "City",
        render: (item) => get(item, ["user_filter", "city_names"]),
      },
    ];

    return (
      <AdminCommonListLayout
        active_key="users"
        breadcrumbs={[
          { name: "admin_home" },
          { name: "users", label: "Users", url: "/users" },
        ]}
        add_label="Add User"
        onAddRow={that.onAddUser}
        onEditRow={that.onEditUser}
        is_loading={is_loading}
        columns={columns}
        item_list={adminUserList}
        renderAdditionalFilter={that.renderFilter}
        showFilters={true}
        //  showViewSelect={showViewSelect}
      />
    );
  }
}

function mapStateToProps(state, props) {
  const users = adminUserList.getVisibleObjects();
  // const classes = useStyles()
  return {
    users,
    is_loading: adminUserList.isLoading(),
    filter: adminUserList.getFilter(),
  };
}

export default connect(mapStateToProps)(Users);

const filter_row_style = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const filter_style = css`
  display: flex;
  margin-right: 16px;
`;
