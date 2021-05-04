/** @jsx jsx */
import "react";
import { jsx, css } from "@emotion/core";
import { get } from "lodash";
import { FormikDropdownField } from "components/form/Dropdown";
import { FormikInputField } from "components/form/InputField";
import { FormikTextareaField } from "components/form/TextareaField";
import { FormikCheckboxField } from "components/form/CheckboxField";
import { useDispatch } from "react-redux";
import { countryList } from "actions/country";
import { provinceList } from "actions/province";
import { useEffect } from "react";
import { CommonPaperTable } from "../../../components/CommonTable";
import AdminMainLayout from "admin/components/layout/AdminMainLayout";
import AdminTableFilter from "admin/components/common/AdminTableFilter";
import { Separator } from "components/layout/Separator";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const AdminCommonListLayout = ({
  active_key,
  add_label,
  showFilters,
  showViewSelect = false,
  canDelete,
  onAddRow,
  renderAdditionalFilter,
  onEditRow,
  is_loading,
  breadcrumbs,
  columns,
  item_list,
}) => {
  const rows = item_list.getVisibleObjects();

  const onFilterChanged = (filter_values) => {
    const { dispatch, transactionList } = this.props;
    dispatch(item_list.updateListFilter(filter_values));
  };

  const renderFilter = (formik_props) => {
    return null;
    // return (
    //   <div css={filter_style}>

    //     {renderAdditionalFilter && renderAdditionalFilter(formik_props)}

    //     <FormikInputField name="any_field"
    //       formik_props={formik_props}
    //       show_search_icon={true}
    //       placeholder="Any field" />

    //     <Separator variant="w5" />
    //   </div>
    // )
  };

  return (
    <AdminMainLayout active_key={active_key} breadcrumbs={breadcrumbs}>
      <div css={filter_row_style}>
        <Grid container justify="flex-start">
          {add_label && (
            <Button
              style={{
                marginBottom: 12,
                //backgroundColor: "#4caf50",
                padding: "5px 25px",
                fontSize: "15px",
                color: "white",
              }}
              variant="contained"
              color="primary"
              onClick={onAddRow}
            >
              {add_label}
            </Button>
          )}
        </Grid>
        <div>
          <AdminTableFilter
            label=""
            placeholder="Search"
            renderFilter={renderFilter}
            updateOnChange={onFilterChanged}
          />
        </div>
      </div>

      <CommonPaperTable
        is_loading={is_loading}
        rows={rows}
        columns={columns}
        item_list={item_list}
        onEditRow={onEditRow}
        canDelete={canDelete}
        render_additional_filter={renderAdditionalFilter}
        showFilters={showFilters}
        showViewSelect={showViewSelect}
      />
    </AdminMainLayout>
  );
};

export default AdminCommonListLayout;

const filter_row_style = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const filter_style = css`
  display: flex;
  margin-right: 16px;
`;
