// @ts-nocheck
/** @jsx jsx */
import React, { Component } from "react";
import { connect } from "react-redux";
import { jsx, css } from "@emotion/core";
import { default_theme as theme } from "emotion/theme";
import { forEach, head, get, map, keys, split, size } from "lodash";
import { Separator } from "components/layout/Separator";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { showSuccess, showError } from "actions/Error";
import { handleSubmitResult } from "actions/form";
import { ProvinceSelectField } from "components/form/ProvinceSelectField";
import { FormikInputField } from "components/form/InputField";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  province: Yup.string().required("Required"),
});

class AdminCityForm extends Component {
  render() {
    const { formik_props } = this.props;

    return (
      <>
        <FormikInputField
          name="name"
          label="Name"
          formik_props={formik_props}
        />

        <ProvinceSelectField
          name="province"
          label="Province"
          formik_props={formik_props}
        />

        <FormikInputField
          name="bringg_team_ref"
          label="Bringg team ref"
          formik_props={formik_props}
        />
      </>
    );
  }
}

export default AdminCityForm;
