 import React from 'react'
import { get, size } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Link, useHistory } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import { clearAuthentication } from '../../../../actions/auth'
import { useDispatch } from 'react-redux'
import initHelpHero from 'helphero'
import { userList } from '../../../../actions/user'

var helpHero = initHelpHero(window.LOCAL_SETTINGS.HELPHERO_ADMIN)

const useStyles = makeStyles((theme) => ({
    toolbarButtons: {
        marginLeft: 'auto',
    },
    greeting: {
      padding: '7px 15px 10px 15px',
      fontWeight: 600,
      fontSize: "0.9em"
    },
    menuLinks: {
      textDecoration: 'none',
      color: '#000000',
      fontSize: "0.9em"
    }
}))

export default function LoggedUser() {
    const classes = useStyles()
    const logged_in_user = userList.getUser()
    const [auth, setAuth] = React.useState(true)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const user_popover_id = open ? 'profile-popover' : undefined
    const dispatch = useDispatch()
    const history = useHistory()
    const hideNotifications = true
    const userID = logged_in_user.id

    helpHero.identify(userID)

    const handleChange = (event) => {
        setAuth(event.target.checked)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const onLogout = () => {
        clearAuthentication()
        window.location="/"
    }

    return (
        <div className={classes.toolbarButtons}>

          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle fontSize="large"/>
          </IconButton>
          <Popover
            id={user_popover_id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className={classes.greeting}>Hi {get(logged_in_user, ["first_name"])}</div>
            <MenuItem><Link to={"/admin/profile"} className={classes.menuLinks}>Profile</Link></MenuItem>
            <MenuItem className={classes.menuLinks} onClick={onLogout}>Logout</MenuItem>
          </Popover>
        </div>
    )
}
