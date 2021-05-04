import React from 'react'
import { size, map } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Link } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'

const DEFAULT_CRUMBS = [{'name': 'admin_home', 'label': 'Home', 'url':'/admin', icon: 'home'},
                        {'name': 'home', 'label': 'Home', 'url':'/', icon: 'home'},
]

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '15px 0 15px 0',
        fontSize: '80%'
    },
    link: {
        display: 'flex',
        color: theme.palette.black
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
}))

export default function Breadcrumb({crumbs}) {
    const classes = useStyles()

    if ( size(crumbs) === 0 ) {
        return null
    }

    map(crumbs, (crumb) => {
        map(DEFAULT_CRUMBS, function(default_crumb) {
            if ( default_crumb.name === crumb.name ) {
                crumb.url = default_crumb.url
                crumb.label = default_crumb.label
                if ( default_crumb.icon === 'home' ) {
                    crumb.icon = <HomeIcon className={classes.icon} />
                }
                return
            }
        })
    })


    return (
        <Breadcrumbs aria-label="breadcrumb" className={classes.root}>

          {map(crumbs, (crumb, index) =>
               <div key={index}>
                 <Link key={index} to={crumb.url} className={classes.link}>
                   { crumb.icon && crumb.icon }

                   { index < size(crumbs)-1 &&
                     <span>{crumb.label}</span>
                   }

                 </Link>
                 { index === size(crumbs)-1 &&
                   <span>{crumb.label}</span>
                 }
               </div>
              )}

        </Breadcrumbs>
    )
}
