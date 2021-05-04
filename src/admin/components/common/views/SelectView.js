import React from 'react'
import { Select, MenuItem, ListItemIcon, ListItemText, makeStyles, FormControl } from '@material-ui/core'
import ListIcon from '@material-ui/icons/List'
import AppsIcon from '@material-ui/icons/Apps'
import MapIcon from '@material-ui/icons/Map'
import DateRangeIcon from '@material-ui/icons/DateRange'
import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import Tooltip from '@material-ui/core/Tooltip'
import { map } from 'lodash'

const views = [
    {
        label: "List",
        icon: <ListIcon />,
        link: "?view=list",
        value: "list",
        enabled: true
    },
    {
        label: "Grid",
        icon: <AppsIcon />,
        link: "?view=grid",
        value: "grid",
        enabled: false
    },
    {
        label: "Map",
        icon: <MapIcon />,
        link: "?view=map",
        value: "map",
        enabled: false
    },
    {
        label: "Calendar",
        icon: <DateRangeIcon />,
        link: "?view=calendar",
        value: "calendar",
        enabled: false
        
    },
    {
        label: "Kanban",
        icon: <ViewColumnIcon />,
        link: "?view=kanban",
        value: "kanban",
        enabled: false
    }
]

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        backgroundColor: "transparent",
        padding: '0px 5px',
        textDecoration: 'none',
        borderRadius: 3
    },
    disabledIcon: {
        opacity: "0.2"
    }
}))

export default function SelectView(props) {
  const classes = useStyles();
  const [view, setView] = React.useState('list');
  const [open, setOpen] = React.useState(false);

  const handleChange = event => {
    setView(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
      <form autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={view}
            name="view"
            onChange={handleChange}
            disableUnderline
            inputProps={{
              id: "open-select"
            }}
          >
            {map(views, (view_definition, index) => (
              <MenuItem value={view_definition.value} key={index}>
                <Tooltip title={`${view_definition.label} ${view_definition.enabled ? "" : " (coming soon)"}`}
                         arrow
                >
                  <div className={view_definition.enabled ? null : classes.disabledIcon}>
                    {view_definition.icon}
                  </div>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
  )
}
