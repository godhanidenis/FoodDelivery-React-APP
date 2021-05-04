// @ts-nocheck
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { map, get, size, includes } from "lodash";
import { FormikInputField } from "../components/form/InputField";
import { Formik, Form, Field } from "formik";
import { Button } from "../components/layout/Button";
import FormikOnChange from "../components/form/FormikAutoSave";
import {
  Grid,
  Switch,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Toolbar,
  Typography,
  Paper,
  lighten,
  makeStyles,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useDispatch } from "react-redux";
import {
  updateListPagination,
  invalidateList,
  getPagination,
} from "../orm/orm_list_actions";
import { handleSubmitResult } from "actions/form";
import { fetchListIfNeeded } from "../orm/http_adapter";
import Skeleton from "react-loading-skeleton";
import SyncIcon from "@material-ui/icons/Sync";
import SelectView from "../admin/components/common/views/SelectView";
import FilterChips from "../admin/components/filters/FilterChips";
import PopupFilter from "../admin/components/filters/PopupFilter.js";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  filterRow: {
    margin: "10px 15px",
  },
}));

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  filterButton: {
    margin: "15px 0 15px 15px",
    marginTop: "10px",
  },
  filter_row: {
    display: "flex",
  },
  selectView: {
    marginTop: 10,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  actionBar: {
    display: "flex",
  },
  action: {
    cursor: "pointer",
  },
}));

const Filter = ({
  enhanced_filter,
  initial_filter_values,
  render_additional_filter,
}) => {
  const dispatch = useDispatch();

  const onFilter = (values, formik_funcs) => {
    dispatch(enhanced_filter.setAnyFieldFilter(values.any_field));
    formik_funcs.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initial_filter_values || {}}
      onSubmit={onFilter}
      enableReinitialize={true}
      validationSchema={null}
    >
      {(formik_props) => {
        const { values } = formik_props;
        return (
          <Form>
            <FormikOnChange
              onChange={(values) => onFilter(values, formik_props)}
            />
            <div>
              <FormikInputField
                key="any_field"
                name="any_field"
                label="Search"
                formik_props={formik_props}
              />
              {render_additional_filter &&
                render_additional_filter(formik_props)}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const EnhancedTableToolbar = ({
  enhanced_filter,
  canDelete,
  initial_filter_values,
  canFilter,
  render_additional_filter,
}) => {
  const classes = useToolbarStyles();
  return (
    <>
      {canFilter !== false && (
        <div className={classes.filterRow}>
          <Filter
            enhanced_filter={enhanced_filter}
            initial_filter_values={initial_filter_values}
          />
        </div>
      )}
    </>
  );
};

export function CommonTable({
  columns,
  rows,
  onSelectRow,
  canDelete,
  onEditRow,
  item_list,
  depart_warehouse_name,
  initial_filter_values,
  showFilters = true,
  render_additional_filter,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [filterFieldArray, setFilterFieldArray] = React.useState([]);
  if (item_list.listKey == "admin_parcel_for_dashboard__default"){
    showFilters = !showFilters
  }

  const enhanced_filter =
    showFilters && item_list.getEnhancedFilter && item_list.getEnhancedFilter();
  //const item_list_key = enhanced_filter.item_list.listKey;
  const item_list_key = item_list.listKey;
 

  useEffect(() => {
    if (item_list_key == "admin_parcel_for_dashboard__default"){
      setFilterFieldArray([{ name: "cities" }, { name: "date_range" }]);
    }
    if (item_list_key === "admin_parcel__default") {
      setFilterFieldArray([{ name: "cities" }, { name: "date_range" }]);
    }
    if (item_list_key === "admin_user__default") {
      setFilterFieldArray([{ name: "firstname" }, { name: "cities" }]);
    }
    
    if (item_list_key === "admin_donor__default") {
      setFilterFieldArray([{ name: "Name" }, { name: "cities" }]);
    }
    if (item_list_key === "admin_products__default") {
      setFilterFieldArray([{ name: "Name" }, { name: "cities" }]);
    }
    if (item_list_key === "admin_dashboard__default") {
      setFilterFieldArray([{ name: "Name" }, { name: "date_range" }]);
    }
    if (item_list_key === "admin_beneficiary__default") {
      setFilterFieldArray([{ name: "cities" }, { name: "beneficiary" }]);
    }
    if (item_list_key === "admin_warehouse_product__default"){
      setFilterFieldArray([{ name: "WareHouse"}, {name : "Product"}]);
    }
    
    
    
  }, [item_list_key]);

  const actions = [];
  if (item_list && canDelete !== false) {
    actions.push({
      icon: <DeleteIcon style={{ color: red[300], marginLeft: 10 }} />,
      tooltip: "Delete",
      onClick: (rowData) => {
        onDelete(rowData);
      },
    });
  }
  if (onEditRow) {
    actions.push({
      icon: <EditIcon color="primary" />,
      tooltip: "Edit",
      onClick: (rowData) => {
        onEdit(rowData);
      },
    });
  }
  if (onSelectRow) {
    actions.push({
      icon: <CheckBoxOutlineBlankIcon color="primary" />,
      tooltip: "Select",
      onClick: (rowData) => {
        onSelectRow(rowData);
      },
    });
  }

  const handleSort = (column) => {
    if (!column.sort) {
      return;
    }
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column.field);
    column.sort(order);
    dispatch(item_list.invalidateList());
    dispatch(item_list.fetchListIfNeeded());
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onEdit = (rowData) => {
    if (onEditRow) {
      onEditRow(rowData.id);
    }
  };

  const onDelete = (rowData) => {
    if (!window.confirm("Are you sure you want to delete this row?")) {
      return;
    }
    dispatch(item_list.deleteObject(rowData.id));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    } else {
      setSelected([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    dispatch(updateListPagination(item_list.listKey, { page: newPage + 1 }));
    dispatch(item_list.invalidateList());
    dispatch(item_list.fetchListIfNeeded());
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      updateListPagination(item_list.listKey, {
        items_per_page: parseInt(event.target.value, 10),
        page: 1,
      })
    );
    dispatch(item_list.invalidateList());
    dispatch(item_list.fetchListIfNeeded());
  };

  const onRefresh = () => {
    dispatch(item_list.invalidateList());
    dispatch(item_list.fetchListIfNeeded());
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const renderFilter = () => {
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item className={classes.filterButton}>
            <div className={classes.filter_row}>
              <PopupFilter
                enhanced_filter={enhanced_filter}
                className={classes.filterButton}
                enabled_filters={filterFieldArray}
              />
              <FilterChips enhanced_filter={enhanced_filter} />
            </div>
          </Grid>

          <Grid item className={classes.root}>
            <EnhancedTableToolbar
              enhanced_filter={enhanced_filter}
              numSelected={selected.length}
              canDelete={canDelete !== false}
              item_list={item_list}
              initial_filter_values={initial_filter_values}
              canFilter={true}
              render_additional_filter={render_additional_filter}
            />
          </Grid>
          <Grid item className={classes.selectView}>
            <SelectView />
          </Grid>
        </Grid>
      </div>
    );
  };
  // console.log(item_list.getEnhancedFilter(),"admin user")
  return (
    <>
      {showFilters && enhanced_filter && renderFilter()}
      <div className={classes.root}>
        <TableContainer className={classes.paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {map(columns, (column) => {
                  const can_sort =
                    column.sort !== null && column.sort !== undefined;
                  return (
                    <TableCell
                      key={`heading_${column.field}`}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      onClick={() => handleSort(column)}
                    >
                      {can_sort && (
                        <TableSortLabel
                          active={orderBy === column.field}
                          hideSortIcon={!column.sort}
                          direction={order}
                        >
                          {column.title}
                        </TableSortLabel>
                      )}
                      {!column.sort && <span>{column.title}</span>}
                    </TableCell>
                  );
                })}
                {size(actions) > 0 && <TableCell key={`heading_actions`} />}
              </TableRow>
            </TableHead>
            <TableBody>
              {map(rows, (row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {map(columns, (column, index) => {
                      let value = null;
                      if (column.render) {
                        value = column.render(row);
                      } else {
                        value = get(row, column.field);
                      }
                      return (
                        <TableCell key={index} scope="row">
                          {value}
                        </TableCell>
                      );
                    })}

                    {size(actions) > 0 && (
                      <TableCell className={classes.actionBar} align="right">
                        {map(actions, (action, index) => {
                          return (
                            <div
                              key={index}
                              className={classes.action}
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon}
                            </div>
                          );
                        })}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {size(rows) === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No rows</TableCell>
                </TableRow>
              )}
              {/* emptyRows > 0 && ( */
              /*     <TableRow style={{ height: 53 * emptyRows }}> */
              /*       <TableCell colSpan={6}> */
              /*         No rows */
              /*       </TableCell> */
              /*     </TableRow> */
              /* ) */}
            </TableBody>
          </Table>
        </TableContainer>

        <div>
          <Button onClick={onRefresh}>
            <SyncIcon />
          </Button>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={get(item_list.getPagination(), "num_items", 0)}
            rowsPerPage={get(item_list.getPagination(), "items_per_page", 10)}
            page={get(item_list.getPagination(), "current_page", 1) - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
}

export const CommonPaperTable = (props) => (
  <Paper>
    <CommonTable {...props} />
  </Paper>
);
