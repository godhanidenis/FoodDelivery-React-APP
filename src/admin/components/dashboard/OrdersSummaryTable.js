import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Accordion, Typography, AccordionActions, Chip, Divider, Link, Table,TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import { positions } from '@material-ui/system'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AdminParcelsTable from 'admin/components/orders/AdminParcelsTable'
import clsx from 'clsx'
import moment from 'moment'
import { adminParcelListForDashboard } from 'admin/components/orders/actions/admin_parcel'

const AccordionSummary = withStyles({
    root: {
        borderBottom: '1px solid #efefef',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles({
    root: {
      margin: 0,
      padding: 0
    }
})(MuiAccordionDetails)


// Generate Order Data
function createData(id, date, customer, customerType, task, driver, city, weight, status) {
    return { customerType, customer, date, time, job, driver, city, weight, status }
}

function preventDefault(event) {
    event.preventDefault()
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}))

const filter_date = moment()
let now = moment()

export default function OrdersSummaryTable() {
    const classes = useStyles()
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchStaticObjects() {
            dispatch(adminParcelListForDashboard.updateListFilter({from_date: filter_date.format(),
                                                                   to_date: filter_date.format()}))
            dispatch(adminParcelListForDashboard.fetchListIfNeeded())
        }
        fetchStaticObjects()
    }, [])

    return (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="inherit" />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <Typography variant="h6" >
              Today's Orders
            </Typography>
            <Typography variant="h6" style={{position: 'absolute', right: 55, top: 13}}>
              { filter_date.format('LL') }
            </Typography>
          </AccordionSummary>
          <AccordionDetails>

            <AdminParcelsTable parcelItemList={adminParcelListForDashboard} showFilters={false} showViewSelect={false} />

          </AccordionDetails>
          <AccordionActions>
            <Button size="small" color="textSecondary" href="#" onClick={preventDefault}>
              View Orders
            </Button>
          </AccordionActions>
        </Accordion>
    )
}
