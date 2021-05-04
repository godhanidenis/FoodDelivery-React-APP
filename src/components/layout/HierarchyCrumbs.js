import React from 'react'
import { reverse, clone, size, map } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import ForwardIcon from '@material-ui/icons/Forward'

const useStyles = makeStyles((muiTheme) => ({
    crumbRow: {
        display: "flex"
    },
}))

export function HierarchyCrumbs({crumbs, extra_crumb, empty_label}) {

    const classes = useStyles()
    const ordered_crumbs = reverse(clone(crumbs))
    const num_crumbs = size(crumbs)
    return (
        <div className={classes.crumbRow}>
          { size(ordered_crumbs) === 0 && <span>{empty_label}</span> }
          {map(ordered_crumbs, (crumb, index) => (
              <>
                {crumb}
                { (index < num_crumbs-1) && <div><ForwardIcon/></div>}
              </>
          ))}
          { extra_crumb && <><div><ForwardIcon/></div>{extra_crumb}</>}
        </div>
    )
    
}
