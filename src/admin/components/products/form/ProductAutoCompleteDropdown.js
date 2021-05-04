import React, {useState, useEffect} from 'react'
import { get, map, join, reverse, size, clone } from 'lodash'
import { useDispatch } from 'react-redux'
import { adminProductAutoCompleteList } from '../actions/admin_product'
import AdminProductForm from './AdminProductForm'
import {showSuccess, showError} from 'actions/Error'
import { ShortId } from 'components/ShortId'
import * as Yup from 'yup'
import { Formik, Form, FieldArray, Field } from 'formik'
import { CommonTable } from 'components/CommonTable'
import { handleSubmitResult } from 'actions/form'
import { validationSchema } from './AdminProductForm'
import TextField from '@material-ui/core/TextField'
import { Modal } from 'components/layout/Modal'
import { makeStyles} from '@material-ui/core/styles'
import muiTheme from 'muiTheme'
import FormikOnChange from 'components/form/FormikAutoSave'
import { FormikGeneralFormErrors } from '../../../../components/form/GeneralFormErrors'
import { FormikInputField } from '../../../../components/form/InputField'
import { ProductCategorySelectField } from 'admin/components/productCategories/form/ProductCategorySelectField'
import { HierarchyCrumbs } from 'components/layout/HierarchyCrumbs'
import Button from '@material-ui/core/Button'
import CommonInlineAddNewFormLayout from 'components/layout/CommonInlineAddNewFormLayout'

const useStyles = makeStyles((muiTheme) => ({
    treeContainer: {
        margin: "10px"
    },
    crumbRow: {
        display: "flex"
    },
    filterRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    filterRowItem: {
        marginRight: "10px",
        width: "100%"
    }
}))

export function FormikProductAutoCompleteDropdown({name, label, formik_props, ...props}) {

    const [open, setOpen] = useState(false)
    const [adding_new, setAddNew] = useState(false)
    const classes = useStyles()
    const dispatch = useDispatch()
    const { field, meta } = formik_props
    const touched = get(meta, "touched")
    const errors = get(meta, "error")
    const value = get(formik_props.values, name)
    const is_loading = adminProductAutoCompleteList.isLoading()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminProductAutoCompleteList.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])
    
    const products = adminProductAutoCompleteList.getVisibleObjects()

    const columns = [
        { field: 'id', title: 'Id',
          render: (item) => <ShortId value={item.id} />,
        },
        { field: 'category', title: 'Categories',
          render: (item) => <HierarchyCrumbs crumbs={get(item, "product_category_crumbs", [])} />
        },
        { field: 'name', title: 'Name'},
    ]
    
    const onClose = () => {
        setOpen(false)
    }

    const onOpen = () => {
        setOpen(true)
    }

    const onSelectItem = ({id}) => {
        formik_props.setFieldValue(name, id)
        onClose()
    }

    const onFilterChanged = (values, formik_props) => {
        dispatch(adminProductAutoCompleteList.updateListFilter(values))
        dispatch(adminProductAutoCompleteList.fetchListIfNeeded())
    }

    const renderFilter = () => {
        return (
            <Formik initialValues={{}}
                    onSubmit={onFilterChanged}
                    enableReinitialize={true}
              >
                {formik_props => {
                    const { values } = formik_props
                    return (
                        <Form>
                          <FormikOnChange onChange={(values) => onFilterChanged(values, formik_props)} />
                          <FormikGeneralFormErrors render={(msg) => msg} />
                          <div className={classes.filterRow}>
                            <div className={classes.filterRowItem}>
                              <ProductCategorySelectField name="product_category"
                                                          can_add={false}
                                                          can_edit={false}
                                                          formik_props={formik_props} />
                            </div>
                            <div className={classes.filterRowItem}>
                              <FormikInputField name="any_field"
                                                placeholder="Search product"
                                                formik_props={formik_props}
                                                show_search_icon={true}
                              />
                            </div>

                            <div className={classes.filterRowItem}>
                              <Button variant="contained"
                                      onClick={() => setAddNew(true)}
                              >
                                Add new product
                              </Button>
                            </div>
                            

                          </div>
                        </Form>
                    )
                }}
            </Formik>
        )        
    }

    const onSaveNewProduct = (values, formik_funcs) => {
        const on_ok = function(json) {
            dispatch(adminProductAutoCompleteList.invalidateList())
            dispatch(adminProductAutoCompleteList.fetchListIfNeeded())
            showSuccess("Saved", "New product Saved")
            const product_id = json.id
            setAddNew(false)
            onSelectItem({id:product_id})
        }
        return dispatch(adminProductAutoCompleteList.saveNewObject(values)).then((res) => handleSubmitResult({res, formik_funcs, on_ok}))
    }
    
    const renderAddNewProduct = () => {
        return (
            <CommonInlineAddNewFormLayout
              is_loading={false}
              title={"Add Product"}
              initial_values={{}}
              validationSchema={validationSchema}
              onCancel={() => setAddNew(false)}
              onSave={(values, formik_funcs) => onSaveNewProduct(values, formik_funcs)}
            >
              {
                  ({formik_props}) => <AdminProductForm formik_props={formik_props} />
              }
            </CommonInlineAddNewFormLayout>
        )
    }
    
    const renderTreeSelector = () => {
        return (
            <Modal onClose={onClose}
                   fullWidth={true}
                   maxWidth='lg'
                   title="Select a product"
            >
              <div className={classes.treeContainer}>
                { renderFilter() }

                { adding_new && renderAddNewProduct() }
                <CommonTable is_loading={ is_loading }
                             rows={ products }
                             canDelete={false}
                             columns={columns}
                             onSelectRow={(item) => onSelectItem({id:item.id})}
                             item_list={adminProductAutoCompleteList}
                />
                
              </div>
            </Modal>
        )
    }

    const renderClosed = () => {

        const selected_product = value && adminProductAutoCompleteList.getObject(value)
        return (
            <TextField value={get(selected_product, "name", "")}
                       name={name}
                       label={label}
                       id={name}
                       helperText={touched ? get(formik_props, ["errors", name]) : ""}
                       error={touched && Boolean(get(formik_props, ["errors", name]))}
                       margin="normal"
                       variant="outlined"
                       fullWidth
                       loading={is_loading}
                       onFocus={onOpen}
                       {...props}
            />
        )
    }
    
    return (
        <div>
          { open && renderTreeSelector() }
          { ! open && renderClosed() }
        </div>
    )
    
}
