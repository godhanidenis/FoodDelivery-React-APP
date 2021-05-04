import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { meals } from '../../../sampleData/sampleData'
import MealsMainLayout from '../../../layout/MealsMainLayout'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { SimplePaperTable } from '../../../components/SimpleTable'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import SearchFilter from '../../../../layout/SearchFilter'
import {Separator} from 'components/layout/Separator'
import {TextField, Paper, Typography, Select, MenuItem, FormControlLabel, Grid, Checkbox} from '@material-ui/core'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import DateRangeIcon from '@material-ui/icons/DateRange'
import ScheduleIcon from '@material-ui/icons/Schedule';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: 12,
    marginBottom: 15,
    fontSize: 18
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 15
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  input: {
    display: 'block',
    boxSizing: 'border-box',
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #999999',
    padding: '15px 0px',
    marginBottom: 10,
    fontSize: 14,
    '& focus': {
      border: 'none',
      borderBottom: '2px solid #000000'
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

const defaultValues = {
  Native: "",
  TextField: "",
  Select: "",
  ReactSelect: { value: "vanilla", label: "Vanilla" },
  Checkbox: false,
  switch: false,
  RadioGroup: "",
  numberFormat: 123456789,
  downShift: "apple"
};

export default function Beneficiaries() {
  const { handleSubmit, register, reset, control } = useForm({ defaultValues })
  const classes = useStyles()
  const [startDate, setStartDate] = useState(new Date())
  let history = useHistory()
  const expected_people = 315
  const columns = [
      { id: 'photo',
        label: 'Photo',
        width: 100,
      },
      { id: 'date',
        label: 'Date',
        width: 100,
      },
      { id: 'time',
        label: 'Time',
        width: 100,
      },
      { id: 'meal',
        label: 'Meal',
      },
      { id: 'name',
        label: 'Name',
      },
      { id: 'expected_people',
        label: 'Expected People',
      },
      { id: 'status',
        label: 'Status',
      },
      { id: 'serve',
        label: '',
        align: 'right'
      },
  ]

  const onAddBeneficiary = (props) => {
      history.push('/meals/meal')
  }

  return(
    <MealsMainLayout active_key="meal"
                     breadcrumbs={[{name: 'meals_home'},
                                   {name: 'meals', label: "Meals", url: '/meals'},
                                   {name: 'meal', label: "New Meal", url: '/meals'}
                                 ]}
    >
      <Typography variant="h6">Create Meal</Typography>
      <Separator h="10" />
        <Paper className={classes.root}>
          <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="mealName"
              name="mealName"
              label="Meal Name"
              placeholder="eg. Spaghetti Bolognese"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              required
              select
              id="mealType"
              name="mealType"
              label="Meal Type"
              fullWidth
            >
              {[{value: "dinner", label: "Dinner"}, {value: "lunch", label: "Lunch"}, {value: "breakfast", label: "Breakfast"}].map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} className={classes.input} /><DateRangeIcon />
          </Grid>
          <Grid item xs={12} sm={2}>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="time"
              dateFormat="HH:mm"
              className={classes.input}
            />
          <ScheduleIcon />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField id="expected_people" name="expected_people" label="Expected # of people" value={expected_people} fullWidth />
          </Grid>
          <Grid container justify="flex-start">
            <Button size="large" color="secondary" variant="contained" style={{margin: '15px 10px'}}>Save Meal</Button>
          </Grid>
        </Grid>

      </Paper>


    </MealsMainLayout>
  )
}
