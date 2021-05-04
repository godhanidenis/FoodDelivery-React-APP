// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { FormikCheckboxField } from "components/form/CheckboxField";
import { adminFirstNameList } from "../../../admin/components/firstnames/actions/admin_firstname";
import { map, filter } from "lodash";

export default function CitiesFilter({ formik_props }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    async function fetchStaticObjects() {
      dispatch(adminFirstNameList.updatePaginationNumItemsPerPage(1000));
      dispatch(adminFirstNameList.fetchListIfNeeded());
    }
    fetchStaticObjects();
  }, []);
  
  const firstnames = adminFirstNameList.getAsOptions();
  console.log("firstname", firstnames)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <FormGroup list style={{ paddingLeft: 10 }}>
        {map(firstnames, (firstname) => (
          <FormControlLabel
            control={
              <FormikCheckboxField
                name={`Names.${firstname.value}`}
                formik_props={formik_props}
                color="primary"
              />
            }
            label={firstname.label}
          />
        ))}
      </FormGroup>
    </div>
  );
}
