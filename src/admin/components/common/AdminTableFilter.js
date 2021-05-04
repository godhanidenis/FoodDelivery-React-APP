// @ts-nocheck
import React, { Component } from "react";
import { connect } from "react-redux";
import { jsx, css } from "@emotion/core";
import { withRouter } from "react-router-dom";
import ReactTimeout from "react-timeout";
import { Separator } from "components/layout/Separator";
import { Row } from "components/layout/Row";
import { Col } from "components/layout/Col";
import { default_theme as theme } from "emotion/theme";
import { Button } from "components/layout/Button";
import { Formik, Form, FieldArray, Field } from "formik";
import { FormikInputField } from "../../../components/form/InputField";
import { FormikGeneralFormErrors } from "components/form/GeneralFormErrors";
import { handleSubmitResult } from "actions/form";
import FormikOnChange from "components/form/FormikAutoSave";

const SEARCH_DELAY_MILLISECONDS = 1000;

class AdminTableFilter extends Component {
  onFilterChanged = (filter_values, formik_props) => {
    const { updateOnChange } = this.props;
    updateOnChange(filter_values);
  };

  render() {
    const {
      handleSubmit,
      is_loading,
      label,
      updateOnChange,
      renderFilter,
      initial_values,
    } = this.props;
    const that = this;

    return (
      <div css={form_container}>
        <Formik
          initialValues={initial_values}
          onSubmit={this.onFilterChanged}
          enableReinitialize={true}
        >
          {(formik_props) => {
            const { values } = formik_props;
            return (
              <Form>
                <FormikOnChange
                  onChange={(values) =>
                    that.onFilterChanged(values, formik_props)
                  }
                />
                <FormikGeneralFormErrors
                  render={(msg) => (
                    <Row>
                      <Col>{msg}</Col>
                    </Row>
                  )}
                />

                <Row>
                  <div css={filter_row}>
                    {renderFilter && renderFilter(formik_props)}
                    {!renderFilter && (
                      <FormikInputField
                        name="any_field"
                        placeholder="Search"
                        show_search_icon={true}
                      />
                    )}

                    {!updateOnChange && (
                      <Col>
                        <Button type="submit">Apply</Button>
                      </Col>
                    )}
                  </div>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { onSubmit, label, updateOnChange, filter } = props;
  return {
    onSubmit,
    label,
    updateOnChange,
    initial_values: filter || {},
  };
}
export default withRouter(
  connect(mapStateToProps)(ReactTimeout(AdminTableFilter))
);

const form_container = css``;

const field_container = css``;

const filter_row = css`
  display: flex;
  align-items: center;
`;
