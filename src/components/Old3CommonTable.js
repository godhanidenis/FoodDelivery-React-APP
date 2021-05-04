import React from 'react'
import MaterialTable from 'material-table'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { useDispatch, useSelector } from "react-redux"

export default function CommonTable({columns, rows, onSelectRow, item_list, onEditRow}) {

    const dispatch = useDispatch()
    
    const onEdit = (rowData) => {
        if ( onEditRow ) {
            onEditRow(rowData.id)
        }
    }

    const onDelete = (rowData) => {
        if ( ! window.confirm("Are you sure you want to delete this row?") ) {
            return
        }
        dispatch(item_list.deleteObject(rowData.id))
    }

    const actions = []
    if ( onEditRow ) {
        actions.push({
            icon: 'edit',
            tooltip: 'Edit',
            onClick: (event, rowData) => { onEdit(rowData) }
        })
    }
    if ( item_list ) {
        actions.push({
            icon: 'delete',
            tooltip: 'Delete User',
            onClick: (event, rowData) => { onDelete(rowData) }
        })
    }
    
    return (
        <Grid container>
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <MaterialTable
                title="Donors"
                /* cellEditable={{ */
                /*     cellStyle: {}, */
                /*     onCellEditApproved: (newValue, oldValue, rowData, columnDef) => { */
                /*         return new Promise((resolve, reject) => { */
                /*            
                /*             setTimeout(resolve, 4000); */
                /*         }); */
                /*     } */
                /* }} */
                columns={columns}
                data={rows}
                actions={actions}
                /* detailPanel={[ */
                /*     { */
                /*         tooltip: 'Show Name', */
                /*         render: rowData => { */
                /*             return ( */
                /*                 <div */
                /*                   style={{ */
                /*                       fontSize: 12, */
                /*                       textAlign: 'left', */
                /*                       color: 'black', */
                /*                       backgroundColor: '#eeeeee', */
                /*                       padding: '15px' */
                /*                   }} */
                /*                 > */
                /*                   {rowData.name} */
                /*                 </div> */
                /*             ) */
                /*         }, */
                /*     }, */
                /* ]} */
                options={{
                    pageSize: 10,
                    pageSizeOptions: [5,10,20,50,100],
                    //filtering: true,
                    search: true,
                    //actionsColumnIndex: -1,
                    //exportButton: true,
                    //selection: true,
                    selectionProps: rowData => ({
                        color: 'primary'
                    }),
                    //sorting: true,
                    //grouping: true
                }}
              />
            </Paper>
          </Grid>
        </Grid>

    )
}
