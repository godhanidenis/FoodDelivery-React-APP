
/** @jsx jsx */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { jsx, css } from "@emotion/core";
import { head, get, filter } from "lodash";
import Timestamp from "../../../components/Timestamp";
import { adminParcelList } from "./actions/admin_parcel";

import { CommonTable, CommonPaperTable } from "../../../components/CommonTable";
import { ParcelStatus } from "./ParcelStatus";
import { ShortId } from "../../../components/ShortId";
import Hidden from "@material-ui/core/Hidden";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import ForwardIcon from "@material-ui/icons/Forward";
import { StatusIndicator } from "../../../components/layout/StatusIndicator";

export default function AdminParcelsTable({
  parcelItemList,
  showFilters = true,
  showViewSelect = false,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  parcelItemList = parcelItemList || adminParcelList;
  const parcels = parcelItemList.getVisibleObjects();

  let customer_variation = "Customer";

  let warehouse_column_prefix = "";
  const parcel_filter = parcelItemList.getFilter();
  const is_loading = parcelItemList.isLoading();

  useEffect(() => {
    async function fetchStaticObjects() {
      dispatch(parcelItemList.fetchListIfNeeded());
    }
    fetchStaticObjects();
  }, []);

  const columnsDesktop = [
    {
      field: "direction",
      title: "",
      render: (item) => (
        <div>
          {item.direction === "donor_pickup" && (
            <>
              <ForwardIcon />
              <HomeWorkIcon />
            </>
          )}
          {item.direction === "beneficiary_dropoff" && (
            <>
              <HomeWorkIcon />
              <ForwardIcon />
            </>
          )}
        </div>
      ),
      sort: (direction) =>
        onUpdateListOrdering(direction === "asc" ? "direction" : "-direction"),
    },
    {
      field: "company",
      title: customer_variation,
      render: (item) => (
        <div>
          {item.direction === "donor_pickup" && item.from_company_name}
          {item.direction === "beneficiary_dropoff" && item.to_company_name}
        </div>
      ),
      sort: (direction) => {
        if (parcel_filter.direction === "beneficiary_dropoff") {
          onUpdateListOrdering(
            direction === "asc" ? "to_company__name" : "-to_company__name"
          );
        } else {
          onUpdateListOrdering(
            direction === "asc" ? "from_company__name" : "-from_company__name"
          );
        }
      },
    },
    {
      field: "created_at",
      title: "Scheduled",
      render: (item) => (
        <div>
          {item.direction === "donor_pickup" && (
            <Timestamp value={item.depart_at} />
          )}
          {item.direction === "beneficiary_dropoff" && (
            <Timestamp value={item.arrive_at} />
          )}
        </div>
      ),
      sort: (direction) =>
        onUpdateListOrdering(
          direction === "asc" ? "scheduled_at" : "-scheduled_at"
        ),
    },
    {
      field: "total_weight_kg",
      title: "Weight (kg)",
      render: (item) =>
        get(item, ["total_weight_kg"]) > 0
          ? get(item, ["total_weight_kg"])
          : "",
    },
    { field: "driver_name", title: "Driver" },
    {
      field: "bringg_ref",
      title: "Bringg",
      render: (item) => (
        // @ts-ignore
        <>
          {item.bringg_ref && <StatusIndicator status="success" />}
          {!item.bringg_ref && <StatusIndicator status="error" />}
        </>
      ),
    },

    {
      field: "status",
      title: "Status",
      render: (item) => <ParcelStatus status={item.status} />,
      sort: (direction) =>
        onUpdateListOrdering(direction === "asc" ? "status" : "-status"),
    },
  ];

  const columnsMobile = [
    {
      field: "created",
      title: "Created",
      render: (item) => <ShortId value={item.created} />,
    },
    { field: "name", title: customer_variation },
  ];

  const onEditParcel = (parcel_id) => {
    const parcel = head(filter(parcels, (parcel) => parcel.id === parcel_id));

    if (parcel.direction === "donor_pickup") {
      history.push({ pathname: "/admin/donor_pickup/" + parcel_id });
    } else if (parcel.direction === "beneficiary_dropoff") {
      history.push({ pathname: "/admin/beneficiary_dropoff/" + parcel_id });
    } else {
      history.push({ pathname: "/admin/parcel/" + parcel_id });
    }
  };

  const onUpdateListOrdering = (field) => {
    dispatch(parcelItemList.updateListOrdering(field));
  };

  return (
    <>
      <Hidden smDown>
        <CommonTable
          is_loading={is_loading}
          rows={parcels}
          columns={columnsDesktop}
          item_list={parcelItemList}
          onEditRow={onEditParcel}
          showViewSelect={showViewSelect}
        />
      </Hidden>
      <Hidden mdUp>
        <CommonTable
          is_loading={is_loading}
          rows={parcels}
          columns={columnsMobile}
          item_list={parcelItemList}
          onEditRow={onEditParcel}
          showViewSelect={showViewSelect}
        />
      </Hidden>
    </>
  );
}
