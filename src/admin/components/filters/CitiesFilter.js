import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { FormikCheckboxField } from "../../../components/form/CheckboxField";
import { adminCityList } from "../../../admin/components/cities/actions/admin_city";
import { map, filter } from "lodash";

export default function CitiesFilter({ formik_props }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    async function fetchStaticObjects() {
      dispatch(adminCityList.updatePaginationNumItemsPerPage(1000));
      dispatch(adminCityList.fetchListIfNeeded());
    }
    fetchStaticObjects();
  }, []);
  const cities = adminCityList.getAsOptions();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <FormGroup list style={{ paddingLeft: 10 }}>
        {map(cities, (city) => (
          <FormControlLabel
            control={
              <FormikCheckboxField
                name={`cities.${city.value}`}
                formik_props={formik_props}
                color="primary"
              />
            }
            label={city.label}
          />
        ))}
      </FormGroup>
    </div>
  );
}
