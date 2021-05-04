// @ts-nocheck
import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Title from './Title'
import { map } from 'lodash'
import { Accordion, AccordionDetails, Typography, AccordionActions, Chip, Divider, Link,
         Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import { positions } from '@material-ui/system'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import NumberFormat from 'react-number-format'
import { useHistory } from "react-router-dom"
import { Route } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    flexDirection: "column"
  },
}));
const AccordionSummary = withStyles({
    root: {
        backgroundColor: '#3f51b5',
        borderRadius: 4,
        color: '#ffffff',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
            backgroundColor: '#FFFFFF',
            color: '#000000'

        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
        flexDirection: "column",
    },
    expanded: {},
})(MuiAccordionSummary)

export default function TotalsWidget({title, grand_total, detail_rows, units, actions}) {

    const classes = useStyles()
    const history = useHistory()

    const renderNumber = (x, units) => {
        return <NumberFormat value={x}
                             displayType={'text'}
                             thousandSeparator={true}
                             decimalScale={0}
                             suffix={` ${units || ""}`} />
    }

    const renderSummary = () => {
        return (
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="inherit" />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <Typography component="div">{title}</Typography>
              <Typography variant="h4">{renderNumber(grand_total, units)}</Typography>
            </AccordionSummary>
        )
    }

    const renderActiveFilterName = () => {
        return (
            <Typography variant="h6" style={{padding: "3px 15px"}}>All Time</Typography>
        )
    }

    const renderDetailRow = (row) => {
        return (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" style={{borderBottom: "none", padding: 0}}>
                {row.name}
              </TableCell>
              <TableCell align="right" style={{borderBottom: "none", padding: "0 0 7px 0"}}>
                {renderNumber(row.value, units)}
              </TableCell>
            </TableRow>
        )
    }

    const renderAction = (action, key) => {
      return (
          <Route key={key} render={({ history }) => (
              <Button onClick={() => { history.push(action.href) }} size="small">
                {action.label}
              </Button>
          )} />
      )
    }

    const renderActions = () => {
        return (
            <AccordionActions>
              {map(actions, (action, index) => renderAction(action, index))}
            </AccordionActions>
        )
    }

    return (
        <Accordion defaultCollapsed>
          { renderSummary() }
          { renderActiveFilterName() }
          <Divider />
          <AccordionDetails>
            <Table size="small">
              <TableBody>
                {map(detail_rows, (row) => renderDetailRow(row))}
              </TableBody>
            </Table>
          </AccordionDetails>
          <Divider />
          { renderActions() }
        </Accordion>
    )
}
