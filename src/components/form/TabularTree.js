import React, {useState} from 'react'
import { map, get } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { Separator } from '../layout/Separator'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import LabelIcon from '@material-ui/icons/Label'
import { Button, Chip } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    extendedIcon: {
        marginRight: theme.spacing(2),
    },
    node_row: {
        padding: 10,
        marginLeft: -5,
        background: "#ffffff",
        borderBottom: "1px solid #efefef",
        display: "flex",
        justifyContent: "space-between",
        '&:hover': {
            backgroundColor: "#ededed"
        }
    },
    node_label: {
    },
    margin: {
        marginLeft: 0
    },
    node_actions: {
    },
    add_button: {
        float: "right"
    }
}))

export default function TabularTree({root_nodes, label_field_name, onAddItem, onEditItem, onDeleteItem, onSelectItem}) {
    const classes = useStyles()
    const [ selected_node, setSelectedNode ] = useState(null)

    const localOnAddItem = (kwargs) => {
        onAddItem(kwargs)
    }
    
    const renderAddButton = (parent_node) => {
        let size = "small"
        let color = "action"
        let label = "Add subcategory"
        let disableElevation=1
        let marginBottom = 0
        let marginLeft= 20
        if(parent_node == null) {
          label="New Top Level Product Category"
          marginBottom=10
          marginLeft=0
          disableElevation=0
        }
        return (
            <div className={classes.add_button} onClick={() => localOnAddItem({parent_item: parent_node})}>
              <Button size={size}
                      variant="contained"
                      color={color}
                      disableElevation={disableElevation}
                      style={{marginBottom: marginBottom, marginLeft: marginLeft}}
                      aria-label="add"
                      className={classes.margin}>
                <AddIcon /> {label}
              </Button>
             </div>
        )
    }

    const renderSelectButton = (node) => {
        return (
            <span onClick={() => onSelectItem(node)}>
              <Button size="small"
                      variant="contained"
                      color="action"
                      disableElevation={1}
                      style={{marginBottom: 0, marginLeft: 20}}
                      aria-label="add" className={classes.margin}>
                <LabelIcon />
                Select
              </Button>
            </span>
        )
    }

    const renderEditButton = (node) => {
        return (
            <span onClick={() => onEditItem({item:node})}>
              <Button size="small"
                      variant="contained"
                      color="action"
                      disableElevation={1}
                      style={{marginBottom: 0, marginLeft: 20}}
                      aria-label="add" className={classes.margin}>
                <EditIcon />
                Edit
              </Button>
            </span>
        )
    }

    const renderDeleteButton = (node) => {
        return (
            <span onClick={() => onDeleteItem({item:node})}>
              <Button size="small"
                      variant="contained"
                      color="action"
                      disableElevation={1}
                      style={{marginBottom: 0, marginLeft: 20}}
                      aria-label="add" className={classes.margin}>
                <DeleteIcon />
                Delete
              </Button>
            </span>
        )
    }

    const recursivelyRenderNode = (node) => {

        const label = (
            <div className={classes.node_row}>
              <div className={classes.node_label}>
                {get(node, label_field_name)}
              </div>

              <div className={classes.node_actions}>
                { onAddItem && renderAddButton(node) }
                { onSelectItem && renderSelectButton(node) }
                { onEditItem && renderEditButton(node) }
                { onDeleteItem && renderDeleteButton(node) }
              </div>
            </div>
        )

        return (
            <TreeItem key={node.id}
                      nodeId={node.id}
                      label={label}
                      style={{background: '#ffffff'}}

            >
              {map(get(node, "children"), (child) => recursivelyRenderNode(child))}
            </TreeItem>
        )
    }

    return (
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          { onAddItem && renderAddButton(null) }
          {map(root_nodes, (node) => recursivelyRenderNode(node))}

        </TreeView>
    )
}
