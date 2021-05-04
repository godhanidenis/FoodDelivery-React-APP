// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Chip,
  Paper,
  Popover,
  Typography,
  Divider,
  Grid,
} from "@material-ui/core";
import moment from "moment";
import CitiesFilter from "./CitiesFilter";
import NameFilter from "./NameFilter";
import WarehouseFilter from './WarehouseFilter'
import ProductFilter from './ProductFilter'
import DateRangeFilter from "./DateRangeFilter";
import AccordionCommon from "../layout/AccordionCommon";
import { Formik, Form, Field } from "formik";
import { union, size, map, includes, forEach, get } from "lodash";
import Loading from "components/Loading";
import { adminCityList } from "admin/components/cities/actions/admin_city";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  filterButtonDivider: {
    margin: "0 10px",
  },
  popOverButtons: {
    margin: 7,
  },
  popOver: {
    width: 400,
  },
}));

const FilterButton = withStyles((theme) => ({
  root: {
    backgroundColor: "#fdfacd",
    "&:hover": {
      backgroundColor: "#fffaaa",
    },
  },
}))(Button);

const FilterButtonPlus = withStyles((theme) => ({
  root: {
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#efefef",
    },
  },
}))(Button);

export default function PopupFilter({ enhanced_filter, enabled_filters }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [filterVisible, setFilterVisible] = useState(false);
  const anchorRef = useRef(null);

  const initial_values = enhanced_filter.getInitialValues();
  const filter_as_objects = enhanced_filter.getFilterAsObjects();
  const num_filters = enhanced_filter.getNumFilters();

  const onShow = (event) => {
    setFilterVisible(true);
  };

  const onClose = () => {
    setFilterVisible(false);
  };

  const onUpdateFilter = (values, formik_funcs) => {
    dispatch(enhanced_filter.updateFilter(values));
    formik_funcs.setSubmitting(false);
    onClose();
  };

  const onClearFilters = (formik_props) => {
    onUpdateFilter({}, formik_props);
  };

  const renderFilterCount = () => {
    return (
      <FilterButton
        ref={anchorRef}
        variant="outlined"
        className={classes.filterButton}
        style={{ margin: 10 }}
        onClick={onShow}
      >
        FILTERS
        {num_filters > 0 && (
          <>
            <Divider
              orientation="vertical"
              className={classes.filterButtonDivider}
              flexItem
            />
            <Typography>{num_filters}</Typography>
          </>
        )}
      </FilterButton>
    );
  };

  const renderFilters = (formik_props) => {
    return map(enabled_filters, ({ name, title }) => {
      const rendered = { id: name };

      if (name === "cities") {
        rendered.title = "Cities";
        rendered.component = (
          <CitiesFilter key={name} formik_props={formik_props} />
        );
      } else if (name === "date_range") {
        rendered.title = "Date Range";
        rendered.component = (
          <DateRangeFilter key={name} formik_props={formik_props} />
        );
      } else if (name === "firstname") {
        rendered.title = "First Name";
        rendered.component = (
          <NameFilter key={name} formik_props={formik_props} />
        );
        
      } else if (name === "warehouse") {
        rendered.title = "Warehouse";
        rendered.component = (
          <WarehouseFilter key={name} formik_props={formik_props} />
        );
      }
      else if (name === "product") {
        rendered.title = "Product";
        rendered.component = (
          <ProductFilter key={name} formik_props={formik_props} />
        );
      }
      else {
        console.error("Unknown filter", name);
      }
      return rendered;
    });
  };

  if (!initial_values) {
    return <Loading />;
  }

  return (
    <>
      <Formik
        initialValues={initial_values}
        onSubmit={onUpdateFilter}
        enableReinitialize={true}
        validationSchema={null}
      >
        {(formik_props) => {
          const { values } = formik_props;
          return (
            <div className={classes.root}>
              {renderFilterCount()}
              <Popover
                open={filterVisible}
                anchorEl={anchorRef.current}
                onClose={onClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                PaperProps={{
                  style: { width: 350 },
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Form>
                  <Grid container>
                    <Grid item xs={5}>
                      <Button
                        className={classes.popOverButtons}
                        onClick={onClose}
                        size="small"
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={7} justify="flex-end">
                      <Button
                        className={classes.popOverButtons}
                        onClick={() => onClearFilters(formik_props)}
                        size="small"
                      >
                        CLEAR FILTERs
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.popOverButtons}
                        type="submit"
                        size="small"
                        color="primary"
                      >
                        Apply
                      </Button>
                    </Grid>
                  </Grid>
                  <AccordionCommon accordions={renderFilters(formik_props)} />
                </Form>
              </Popover>
            </div>
          );
        }}
      </Formik>
    </>
  );
}
