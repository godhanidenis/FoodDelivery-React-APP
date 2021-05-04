import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AdminMainLayout from '../layout/AdminMainLayout'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
    marginBottom: 10
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function AdminRoadMap() {
  const classes = useStyles();

  return (
    <AdminMainLayout active_key='calendar'
                     breadcrumbs={[{name: 'admin_home'},
                                   {name: 'configuration',label: 'Configuration',url: '/admin/configuration'},
                                   {name: 'roadmap',label: 'Roadmap',url: '/admin/configuration/roadmap'},
                                  ]}>
        <Timeline align="alternate">

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography variant="body2" color="textSecondary">
                31 January 2021
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  Order Creation & Fulfilment
                </Typography>
                <Typography>Create orders and push them to Bringg which connects our orders to our drivers and donors/beneficiaries through the Bringg API and the Bringg Driver App</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography variant="body2" color="textSecondary">
                21 February 2021
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1"  align="left">
                  Inventory
                </Typography>
                <Typography align="left">Connect donation stock to warehouse inventory and update inventory when orders are created and completed.</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              28 February 2021
            </Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  Nutrition
                </Typography>
                <Typography>Products and product categories will require nutrition </Typography>
              </Paper>

              <Paper elevation={3} className={classes.paper} t={2}>
                <Typography variant="h6" component="h1">
                  Geolocation
                </Typography>
                <Typography>Donors and beneficiaries will be geolocated using Google Places and Google maps</Typography>
              </Paper>

              <Paper elevation={3} className={classes.paper} t={2}>
                <Typography variant="h6" component="h1">
                  Scheduling
                </Typography>
                <Typography>Calendar views will be introduced on all lists with a date value</Typography>
              </Paper>

              <Paper elevation={3} className={classes.paper} t={2}>
                <Typography variant="h6" component="h1">
                  Kanban
                </Typography>
                <Typography>Kanban views will be introduced on all lists with a status</Typography>
              </Paper>

            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              31 March 2021
            </Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  Donor Portal
                </Typography>
                <Typography>Donors can create donations and upload stock sheets.<br />Donation history and tools for our growing network of donors including reporting, Section 18A certificates and education tools</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              30 April 2021
            </Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  Beneficiary Portal
                </Typography>
                <Typography>Delivery history and tools for our growing network of beneficiaries including reporting, beneficiaryregistration, meal registration and tracking, education tools and more. The beneficiary tools we see as a key area of focus once the SA Harvest operations platform is stable.
                Access to affordable food prorducts through a marketplace and a value exchange system which also allows for a reward system</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              30 December 2021
            </Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  Marketplace
                </Typography>
                <Typography>A marketplace that allows farmers espcially to sell produce (including surplus) at regulated prices to the foodspace network</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              30 December 2021
            </Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  Beneficiary Tools
                </Typography>
                <Typography>These need to be assessed in terms of priority and rolled out on that basis</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              30 June 2022
            </Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary">
                <RadioButtonUncheckedOutlinedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" component="h1">
                  Donor FLW Measurement & Reporting Tools
                </Typography>
                <Typography>These need to be assessed in terms of priority and rolled out on that basis</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

        </Timeline>

    </AdminMainLayout>

  );
}
