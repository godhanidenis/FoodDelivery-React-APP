/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { get, map } from 'lodash'
import { useDispatch } from 'react-redux'
import { useField } from 'formik'
import { useEffect } from 'react'
import { Modal } from 'components/layout/Modal'
import { adminProductCategoryList } from '../actions/admin_product_category'
import ProductCategoryInlineForm from './ProductCategoryInlineForm'
import TabularTree from 'components/form/TabularTree'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { HierarchyCrumbs } from 'components/layout/HierarchyCrumbs'
import { makeStyles} from '@material-ui/core/styles'
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles((muiTheme) => ({
    modalContainer: {
        margin: "10px"
    }
}))


export const ProductCategorySelectField = ({label, empty_label, can_add, can_edit, formik_props, ...props}) => {
    const [field, meta] = useField(props)
    const classes = useStyles()
    const dispatch = useDispatch()
    const [productCategorySelectorOpen, setProductCategorySelectorOpen] = useState(false)
    const [adding_child_of_product_category, setAddingChildOfProductCategory] = useState(false)
    const [editing_product_category, setEditingProductCategory] = useState(null)
    const is_loading = adminProductCategoryList.isLoading()
    const touched = get(meta, "touched")
    const errors = get(meta, "error")
    const name = field.name
    const value = get(formik_props.values, name)

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminProductCategoryList.updatePaginationNumItemsPerPage(1000))
            dispatch(adminProductCategoryList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])

    const product_categories_as_tree = adminProductCategoryList.getVisibleObjectsAsTree()

    const onSelectItem = (product_category) => {
        formik_props.setFieldValue(field.name, get(product_category, "id"))
        setProductCategorySelectorOpen(false)
    }

    const selected_product_category = adminProductCategoryList.getObject(get(formik_props, ["values", field.name], null))

    const onQuickAddTreeItem = ({parent_item}) => {
        setAddingChildOfProductCategory(parent_item)
    }

    const onDoneQuickAddTreeItem = () => {
        setAddingChildOfProductCategory(false)
        dispatch(adminProductCategoryList.invalidateList())
        dispatch(adminProductCategoryList.fetchListIfNeeded())
    }

    const onQuickEditTreeItem = ({item}) => {
        setEditingProductCategory(item)
    }

    const onDoneQuickEditTreeItem = () => {
        setEditingProductCategory(null)
        dispatch(adminProductCategoryList.invalidateList())
        dispatch(adminProductCategoryList.fetchListIfNeeded())
    }

    const renderQuickAddTreeItemForm = () => {
        return (
            <Modal onClose={onDoneQuickAddTreeItem}
                   title="Add a new category"
            >
              <ProductCategoryInlineForm product_category={null}
                                         parent_product_category={adding_child_of_product_category}
                                         onSaved={onDoneQuickAddTreeItem}
                                         onCancel={onDoneQuickAddTreeItem}
              />
            </Modal>
        )
    }

    const renderQuickEditTreeItemForm = () => {
        return (
            <Modal onClose={onDoneQuickEditTreeItem}
                   title="Edit this category"
            >
              <ProductCategoryInlineForm product_category={editing_product_category}
                                         onSaved={onDoneQuickEditTreeItem}
                                         onCancel={onDoneQuickEditTreeItem}
              />
            </Modal>
        )
    }

    const renderClosed = () => {
        const crumbs = get(selected_product_category, "crumbs")
        return (
            <Button variant="contained"
                    onClick={() => setProductCategorySelectorOpen(true)}>
              <HierarchyCrumbs crumbs={crumbs} empty_label={empty_label || <FilterListIcon />} />
            </Button>
            // <TextField value={<HierarchyCrumbs crumbs={get(selected_product_category, "crumbs")} />}
            //            name={name}
            //            label={label || "Select product category"}
            //            id={name}
            //            helperText={touched ? get(formik_props, ["errors", name]) : ""}
            //            error={touched && Boolean(get(formik_props, ["errors", name]))}
            //            margin="normal"
            //            variant="outlined"
            //            fullWidth
            //            loading={is_loading}
            //            onFocus={() => setProductCategorySelectorOpen(true)}
            //            {...props}
            // />
        )
    }

    const renderOpen = () => {
        return (
            <Modal onClose={() => setProductCategorySelectorOpen(false)}
                   fullWidth={true}
                   maxWidth='lg'
                   title="Filter by Product Categories"
            >
              <div style={{marginRight:65, marginTop:-50, marginBottom: 10}}>
                <Grid container justify="flex-end">
                  <Button variant="contained" color="primary">Apply</Button>
                </Grid>
              </div>
              { false &&
                <div style={{paddingLeft: 10, paddingRight: 10}}>
                  <TextField name={"search"} placeholder="Search for a product category..." fullWidth variant="outlined" />
                </div>
              }
              <div className={classes.modalContainer}>
                <TabularTree root_nodes={product_categories_as_tree}
                             onSelectItem={onSelectItem}
                             onAddItem={can_add && onQuickAddTreeItem}
                             onEditItem={can_edit && onQuickEditTreeItem}
                             label_field_name = "name"
                />
              </div>
            </Modal>
        )
    }

    return (
        <div>
          { ! productCategorySelectorOpen && renderClosed() }
          { productCategorySelectorOpen && renderOpen() }
          { adding_child_of_product_category !== false && renderQuickAddTreeItemForm() }
          { editing_product_category && renderQuickEditTreeItemForm() }

        </div>
    )
}
