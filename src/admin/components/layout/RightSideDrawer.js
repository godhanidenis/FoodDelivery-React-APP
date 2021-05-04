import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(1),
      width: '100%',
    },
  },
  list: {
    width: 470,
  },
  fullList: {
    width: 'auto',
  },
}))

export default function RightSideDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  })

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  }

  const list = (anchor) => (
    <Grid
      className={classes.list}
      role="presentation"
      style={{padding: 20}}
    >
      <form className={classes.root} noValidate autoComplete="off">
        <TextField variant="outlined" fullWidth defaultValue="Input 1" inputProps={{ 'aria-label': 'description' }} />
        <TextField variant="outlined" fullWidth placeholder="Input 2" inputProps={{ 'aria-label': 'description' }} />
        <TextField variant="outlined" fullWidth defaultValue="Disabled" disabled inputProps={{ 'aria-label': 'description' }} />
        <TextField variant="outlined" fullWidth defaultValue="Error" error inputProps={{ 'aria-label': 'description' }} />
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
          size="large"
        >
          Submit and Close
        </Button>
      </form>
    </Grid>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} variant="contained" style={{marginTop: 10}} color="secondary">Add New Product</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  )
}
