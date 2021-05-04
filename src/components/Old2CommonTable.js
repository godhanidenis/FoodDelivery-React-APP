import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { map, get } from 'lodash'
import { lighten, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'

// function createData(name, calories, fat, carbs, protein) {
//     return { name, calories, fat, carbs, protein }
// }

// const headCells = [
//     { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
//     { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//     { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//     { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//     { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ]

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
    theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
    : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
    },
    title: {
        flex: '1 1 100%'
    }
}))

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles()
    const { numSelected } = props

    return (
        <Toolbar
          className={clsx(classes.root, {
              [classes.highlight]: numSelected > 0
          })}
        >
          {numSelected > 0 ? (
              <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                {numSelected} selected
              </Typography>
          ) : (
              <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                
              </Typography>
          )}

          {numSelected > 0 ? (
              <Tooltip title="Delete">
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
          ) : (
              <Tooltip title="Filter list">
                <IconButton aria-label="filter list">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
          )}
        </Toolbar>
    )
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}))

export default function CommonTable({columns, rows, onSelectRow}) {
    const classes = useStyles()
    const [order, setOrder] = React.useState('asc')
    const [orderBy, setOrderBy] = React.useState('name')
    const [selected, setSelected] = React.useState([])
    const [page, setPage] = React.useState(0)
    const [dense, setDense] = React.useState(false)
    const [rowsPerPage, setRowsPerPage] = React.useState(20)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name)
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }

    const handleClick = (row) => {
        // headers['action'].click()
        // const selectedIndex = selected.indexOf(name)
        // let newSelected = []

        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(selected, name)
        // } else if (selectedIndex === 0) {
        //     newSelected = newSelected.concat(selected.slice(1))
        // } else if (selectedIndex === selected.length - 1) {
        //     newSelected = newSelected.concat(selected.slice(0, -1))
        // } else if (selectedIndex > 0) {
        //     newSelected = newSelected.concat(
        //         selected.slice(0, selectedIndex),
        //         selected.slice(selectedIndex + 1),
        //     )
        // }

        // setSelected(newSelected)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const isSelected = (name) => selected.indexOf(name) !== -1

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

    return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {map(columns, (column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.headerName}
                        </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map(rows, (row, index) => {
                       const isItemSelected = isSelected(row.name)
                       const labelId = `enhanced-table-checkbox-${index}`

                       return (
                           <TableRow
                             hover
                             onClick={(event) => handleClick(row)}
                             role="checkbox"
                             aria-checked={isItemSelected}
                             tabIndex={-1}
                             key={row.id}
                             selected={isItemSelected}
                           >
                             { false && 
                               <TableCell padding="checkbox">
                                 <Checkbox
                                   checked={isItemSelected}
                                   inputProps={{ 'aria-labelledby': labelId }}
                                 />
                               </TableCell>
                             }
                             {map(columns, function(column) {
                                 let value = null
                                 if ( column.render ) {
                                     value = column.render(row)
                                 } else {
                                     value = get(row, column.field)
                                 }
                                 return (
                                     <TableCell scope="row" padding="none">
                                       {value}
                                     </TableCell>
                                 )
                             })}
                           </TableRow>
                       )
                   })}
                  {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
    )
}
