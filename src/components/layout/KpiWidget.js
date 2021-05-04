import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardActionArea, Link, CardActions, CardContent, Button, Typography } from '@material-ui/core'
import { useHistory } from "react-router-dom"
import { Route } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    position: 'relative',
  },
  title: {
    fontSize: 18,
    textTransform: 'uppercase'
  },
  kpi: {
    fontSize: 36,
    color: '#333333'
  },
  widgetLink: {
    '&:hover': {
      textDecoration: 'none'
    }
  }

})

export default function KpiWidget({title, kpi, color, link, variant}) {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Card className={classes.root} style={{backgroundColor: color}} variant={variant}>
      <CardActionArea>
        <Route render={({ history }) => (
            <Link onClick={() => { history.push(link) }} className={classes.widgetLink}>
              <CardContent style={{padding: '7px 15px'}}>
                <Typography className={classes.title} color="textSecondary"  align="center">
                  {title}
                </Typography>
                <Typography className={classes.kpi} display="block" align="center">
                  {kpi}
                </Typography>
              </CardContent>
            </Link>
        )} />
      </CardActionArea>
    </Card>
  )
}
