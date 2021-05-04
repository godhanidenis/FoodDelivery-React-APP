// @ts-nocheck
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { jsx, css } from "@emotion/core";
import { head, get, filter, size } from "lodash";
import { Link } from "react-router-dom";
import { Modal } from "components/layout/Modal";
import { Trans, Translation } from "react-i18next";
import { FormikDropdownField } from "components/form/Dropdown";
import Timestamp from "components/Timestamp";
import { FormikInputField } from "components/form/InputField";
import TableFilter from "components/layout/TableFilter";
import { adminParcelList } from "./actions/admin_parcel";
import AdminMainLayout from "../layout/AdminMainLayout";
import AdminTableFilter from "admin/components/common/AdminTableFilter";
import AdminParcelsTable from "./AdminParcelsTable";
import { ParcelStatus } from "./ParcelStatus";
import { Separator } from "../../../components/layout/Separator";
import { ShortId } from "components/ShortId";
import { DatePicker } from "components/form/DatetimePicker";
import ListDescriptionTableField from "../layout/ListDescriptionTableField";
import { provinceList } from "../../../actions/province";
import { cityList } from "../../../actions/city";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Hidden, Button, Avatar } from "@material-ui/core";
import OrderStatusWidgets from "../../../admin/components/orders/widgets/OrderStatusWidgets";
import { Route } from "react-router-dom";

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

const DIRECTION_OPTIONS = [
  { label: "Any", value: "any" },
  { label: "Donor pickups", value: "donor_pickup" },
  { label: "Beneficiary dropoffs", value: "beneficiary_dropoff" },
];

export default function AdminParcels({ data, parcelItemList }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  parcelItemList = parcelItemList || adminParcelList;

  const parcels = parcelItemList.getVisibleObjects();
  const url_filter = new window.URLSearchParams(window.location.search);

  const item_list = parcelItemList;
  const active_filter = item_list.getFilter() || {};

  let customer_variation = "Customer";
  let warehouse_column_prefix = "";

  if (active_filter.direction == "donor_pickup") {
    customer_variation = "Donor";
    warehouse_column_prefix = "To ";
  } else if (active_filter.direction == "beneficiary_dropoff") {
    customer_variation = "Beneficiary";
    warehouse_column_prefix = "From ";
  }

  const parcel_filter = parcelItemList.getFilter();

  const is_loading = parcelItemList.isLoading();

  useEffect(() => {
    async function fetchStaticObjects() {
      dispatch(parcelItemList.fetchListIfNeeded());
      dispatch(cityList.updatePaginationNumItemsPerPage(1000));
      dispatch(provinceList.updatePaginationNumItemsPerPage(1000));
      dispatch(cityList.fetchListIfNeeded());
      dispatch(provinceList.fetchListIfNeeded());
    }
    fetchStaticObjects();
  }, []);

  const updateFilter = () => {
    const new_filter = {};
    if (active_filter.direction !== url_filter.get("direction")) {
      new_filter.direction = url_filter.get("direction");
    }
    if (size(new_filter) > 0) {
      dispatch(item_list.updateListFilter(new_filter));
      dispatch(item_list.fetchListIfNeeded(new_filter));
    }
  };
  useEffect(() => {
    updateFilter();
  }, [url_filter]);

  const onProvinceChanged = (province_id) => {
    dispatch(cityList.filterOnProvince(province_id));
  };

  const onEditParcel = (parcel_id) => {
    const parcel = head(filter(parcels, (parcel) => parcel.id === parcel.id));
    if (parcel.direction === "donor_pickup") {
      history.push({ pathname: "/admin/donor_pickup/" + parcel_id });
    } else if (parcel.direction === "beneficiary_dropoff") {
      history.push({ pathname: "/admin/beneficiary_dropoff/" + parcel_id });
    } else {
      history.push({ pathname: "/admin/parcel/" + parcel_id });
    }
  };

  const onAddDonorPickup = () => {
    history.push("/admin/donor_pickup");
  };

  const onUpdateListOrdering = (field) => {
    dispatch(parcelItemList.updateListOrdering(field));
  };

  const onAddBeneficiaryDropoff = () => {
    history.push("/admin/beneficiary_dropoff");
  };

  return (
    <AdminMainLayout
      active_key="parcels"
      breadcrumbs={[
        { name: "admin_home" },
        { name: "parcels", label: "Orders", url: "/parcels" },
      ]}
    >
      <OrderStatusWidgets />

      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={6}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={onAddDonorPickup}
            >
              New Donor Pickup
            </Button>

            <Button
              size="large"
              style={{ marginLeft: 10 }}
              variant="contained"
              color="primary"
              onClick={onAddBeneficiaryDropoff}
            >
              New Beneficiary Dropoff
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Route
              render={({ history }) => (
                <Button
                  size="large"
                  fullWidth
                  onClick={() => {
                    history.push("?direction=donor_pickup");
                  }}
                >
                  Donor Pickups Today
                  <Avatar className={classes.blackChip}>--</Avatar>
                </Button>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Route
              render={({ history }) => (
                <Button
                  size="large"
                  fullWidth
                  onClick={() => {
                    history.push("?direction=beneficiary_dropoff");
                  }}
                >
                  Beneficiary Dropoffs Today
                  <Avatar className={classes.blackChip}>--</Avatar>
                </Button>
              )}
            />
          </Grid>
        </Grid>
      </div>

      <Separator variant="h15" />
      <Paper>
        <AdminParcelsTable parcelItemList={adminParcelList} />
      </Paper>
    </AdminMainLayout>
  );
}
