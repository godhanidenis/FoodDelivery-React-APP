import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Grid, Typography, Divider, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  filterButtonDivider: {
    margin: '0 10px'
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color:' theme.palette.getContrastText(purple[500])',
    backgroundColor: '#fdfacd',
    '&:hover': {
      backgroundColor: '#fffaaa',
    },
  },
}))(Button);

export default function FilterButton(props) {
  const classes = useStyles();

  return (
    <div>
      <ColorButton variant="outlined" className={classes.filterButton} style={{margin: props.margin}}>FILTERS <Divider orientation="vertical" className={classes.filterButtonDivider} flexItem /> 4 </ColorButton>
    </div>
  );
}
