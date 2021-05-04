import React, { PureComponent } from 'react'
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatterm, ResponsiveContainer } from 'recharts'
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles'
import { Accordion, AccordionDetails, Typography, AccordionActions, Chip, Divider, Link, Table,TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import { positions } from '@material-ui/system'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from 'clsx'
import moment from 'moment'
import { map, forEach } from 'lodash'

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

function preventDefault(event) {
    event.preventDefault()
}

export default function MealsDeliveredChart({data}) {
    const theme = useTheme()

    forEach(data, (row) => row['meals_per_1000'] = row['meals'] / 1000)
    
    return (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="inherit" />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <Typography variant="h6" >
              Meals Delivered (*1000)
            </Typography>
            <Typography variant="h6" style={{position: 'absolute', right: 55, top: 13}}>
              Last 12 Months
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ResponsiveContainer width='100%' aspect={4.0/2.5}>
              <ComposedChart
                data={data}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="month_short_name" />
                <YAxis />
                <Tooltip />
                { false && <Legend /> }
                <Bar dataKey="meals_per_1000" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="meals_per_1000" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </AccordionDetails>
          <AccordionActions>
            <Button size="small" color="textSecondary" href="#" onClick={preventDefault}>
              View Orders
            </Button>
          </AccordionActions>
        </Accordion>
    )
}
