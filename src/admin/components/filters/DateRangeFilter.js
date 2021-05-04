import React from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import { FormikRadioGroupField } from "components/form/RadioGroupField";
import { FormikDateTimePicker } from "components/form/DatetimePicker";
import { WeekPicker } from "components/form/WeekPicker";
import { MonthPicker } from "components/form/MonthPicker";
import { map } from "lodash";

export default function DateRangeFilter({ formik_props }) {
  const [value, setValue] = React.useState("all_time");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const getAllTimeOption = () => {
    return {
      label: "All Time",
      value: "all_time",
      children: null,
    };
  };

  const getSingleTimeOption = () => {
    return {
      label: "Select a date",
      value: "single_date",
      children: [
        FormikDateTimePicker({
          label: "Select a date",
          name: "single_date",
          formik_props,
          include_time: false,
        }),
      ],
    };
  };

  const getDateRangeOption = () => {
    return {
      label: "Date Range",
      value: "date_range",
      children: [
        FormikDateTimePicker({
          label: "Start Date",
          name: "from_date",
          formik_props,
          include_time: false,
        }),
        FormikDateTimePicker({
          label: "End Date",
          name: "to_date",
          formik_props,
          include_time: false,
        }),
      ],
    };
  };

  const options = [
    getAllTimeOption(),
    getSingleTimeOption(),
    getDateRangeOption(),
  ];

  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Date Filter</FormLabel>

        <FormikRadioGroupField
          aria-label="date-range"
          name="date_range_filter_type"
          options={options}
          formik_props={formik_props}
          value={value}
        />
      </FormControl>
    </div>
  );
}
