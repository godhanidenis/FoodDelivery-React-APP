import React from "react"
import { withStyles, Typography, Box, Card, CardContent, CardActions, Button, Divider } from "@material-ui/core"
import { spacing } from '@material-ui/system'
import { FormikGeneralFormErrors } from '../form/GeneralFormErrors'

const styles = () => ({
    alert: {
        marginBottom: '7px'
    },
    card: {
        maxWidth: '100%',
        marginTop: 0,
        width: "100%",
    },
    container: {
        justifyContent: "center",
        width: "100%",
    },
    actions: {
      width: "100%",
      float: "right",
      padding: "0 15px 15px 15px"
    },
    actionsInDrawer: {
      position: "fixed",
      bottom: 0,
      width: "100%",
      padding: 0
    },
    drawerInnnerActionsDiv: {
      width: "470px",
      display: "block",
      background: "#efefef",
      padding: 7,
    },
    buttons: {
      width: "100%",
    }
})

const FormCard = ({classes, title, children, isSubmitting, onCancel, cardIsInDrawer, elevation, variant, save_label}) => {
    let actions = classes.actions
    let buttons = classes.buttons
    if(cardIsInDrawer) {
      elevation = 0
      actions = classes.actionsInDrawer
      buttons = classes.drawerInnnerActionsDiv
    }
    return (
      <div className={classes.container}>
        <Card className={classes.cardNoborder} elevation={elevation} variant={variant}>

          <CardContent>
            { title && <Typography variant="h6">{title}</Typography>}
            <FormikGeneralFormErrors />
            {children}
          </CardContent>
          <CardActions className={actions}>
            <div className={buttons} >

            { onCancel &&
              <Button variant="contained" color="action" onClick={onCancel}>
                CANCEL
              </Button>
            }
              <Button variant="contained" size="large" type="submit" color="primary" disabled={isSubmitting} style={{float: "right"}}>
                {save_label || "SAVE"}
              </Button>
            </div>
          </CardActions>
        </Card>
      </div>
    )
}

export default withStyles(styles)(FormCard)
