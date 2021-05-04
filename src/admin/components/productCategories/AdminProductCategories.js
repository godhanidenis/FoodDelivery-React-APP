/** @jsx jsx */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { head, get } from 'lodash'
import { Trans, Translation } from 'react-i18next'
import { confirmModal } from 'actions/ui'
import { FormikDropdownField } from 'components/form/Dropdown'
import AdminMainLayout from '../layout/AdminMainLayout'
import Timestamp from 'components/Timestamp'
import { FormikInputField } from 'components/form/InputField'
import { adminProductCategoryList } from './actions/admin_product_category'
import { Separator } from 'components/layout/Separator'
import { ShortId } from 'components/ShortId'
import {showSuccess, showError} from 'actions/Error'
import { Button } from 'components/layout/Button'
import TabularTree from 'components/form/TabularTree'
import { Formik, Form, FieldArray, Field } from 'formik'
import ProductCategoryInlineForm from './form/ProductCategoryInlineForm'
import { Modal } from 'components/layout/Modal'
import { Typography, Card, CardContent, SvgIcon, Spacer } from '@material-ui/core'

class ProductCategories extends Component {

    constructor(props) {
        super(props)
        this.state = {adding_child_of_product_category: false,
                      editing_product_category: null}
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(adminProductCategoryList.updateListFilter({top_level_only:true}))
        dispatch(adminProductCategoryList.updatePaginationNumItemsPerPage(1000))

    }

    componentDidUpdate() {
        const { dispatch, filter } = this.props
        dispatch(adminProductCategoryList.fetchListIfNeeded())
    }

    onEditProductCategory = (product_category_id) => {
        const { history } = this.props
        history.push({
            pathname: '/admin/product_category/'+product_category_id
        })
    }

    onAddProductCategory = () => {
        const { history } = this.props
        history.push('/admin/product_category')
    }

    onQuickAddTreeItem = ({parent_item}) => {
        this.setState({adding_child_of_product_category: parent_item})
    }

    onDoneQuickAddTreeItem = () => {
        this.setState({adding_child_of_product_category: false})
    }

    onQuickEditTreeItem = ({item}) => {
        this.setState({editing_product_category: item})
    }

    onDeleteTreeItem = ({item}) => {
        const { dispatch } = this.props

        const onDone = (res) => {
            if ( res.errors ) {
                showError("Failed", "Category is in use and could not be deleted")
            } else {
                showSuccess("Deleted", "Category deleted")
                dispatch(adminProductCategoryList.invalidateList())
                dispatch(adminProductCategoryList.fetchListIfNeeded())
            }
        }

        const onConfirmed = () => {
            dispatch(adminProductCategoryList.deleteObject(item.id)).then(onDone)
        }

        dispatch(confirmModal({text: "Are you sure you want to delete this category?",
                               onConfirmed,
                               can_cancel: true}))
    }

    onDoneQuickEditTreeItem = () => {
        this.setState({editing_product_category: null})
    }

    renderQuickAddTreeItemForm() {
        const { adding_child_of_product_category } = this.state
        const that = this
        return (
            <Modal onClose={that.onDoneQuickAddTreeItem}
                   fullWidth={true}
                   width='xl'
                   title=""
            >
              <ProductCategoryInlineForm product_category={null}
                                         parent_product_category={adding_child_of_product_category}
                                         onSaved={that.onDoneQuickAddTreeItem}
                                         onCancel={that.onDoneQuickAddTreeItem}
              />
            </Modal>
        )
    }

    renderQuickEditTreeItemForm() {
        const { editing_product_category } = this.state
        const that = this
        return (
            <Modal onClose={that.onDoneQuickEditTreeItem}
                   fullWidth={true}
                   width='xl'
                   title=""
            >
              <ProductCategoryInlineForm product_category={editing_product_category}
                                         onSaved={that.onDoneQuickEditTreeItem}
                                         onCancel={that.onDoneQuickEditTreeItem}
              />
            </Modal>
        )
    }

    render() {
        const { is_loading, product_categories_as_tree } = this.props
        const { adding_child_of_product_category, editing_product_category } = this.state
        const that = this

        const columns = [
            { field: 'id', title: 'Id',
              render: (item) => <ShortId value={item.id} />
            },
            { field: 'name', title: 'Product Category'},
            { field: 'created_at',
              title: 'Created at',
              render: (item) => <Timestamp value={item.created_at} format='datetime' />
            },
        ]

        return (
            <AdminMainLayout active_key="product_categories"
                             breadcrumbs={[{name: 'admin_home'},
                                           {name: 'product_categories', label: "Product Categories", url: '/admin/product_categories'}]}>
              <Typography variant="h5">Product Categories</Typography>
              <Separator variant="h10" />
              <Card>
                <CardContent>
                  <TabularTree root_nodes={product_categories_as_tree}
                               onAddItem={this.onQuickAddTreeItem}
                               onEditItem={this.onQuickEditTreeItem}
                               onDeleteItem={this.onDeleteTreeItem}
                               label_field_name = "name"
                  />

                  { adding_child_of_product_category !== false && this.renderQuickAddTreeItemForm() }
                  { editing_product_category && this.renderQuickEditTreeItemForm() }
                </CardContent>
              </Card>

            </AdminMainLayout>
        )
    }
}

function mapStateToProps(state, props) {
    const product_categories_as_tree = adminProductCategoryList.getVisibleObjectsAsTree()
    console.log("product_categories_as_tree:", product_categories_as_tree);

    return {
        product_categories_as_tree,
        is_loading: adminProductCategoryList.isLoading(),
        filter: adminProductCategoryList.getFilter()
    }
}

export default connect(mapStateToProps)(ProductCategories)

const filter_row_style = css`
width: 100%
display: flex
justify-content: space-between
`


const filter_style = css`
display: flex
margin-right: 16px
`
