
import { createMuiTheme }  from '@material-ui/core/styles'
const muiTheme = createMuiTheme({
  overrides: {
    MuiCard: {
      root: {
        marginBottom: '10px'
      },
      elevation: 0
    },
  }
})
export default muiTheme

export const PARCEL_STATUS_COLOURS = {
    ready_to_go: "#fff9c4",
    picking: "#eceff1",
    in_transit: "#bbdefb",
    complete: "#c8e6c9",
    cancelled: "#ef9a9a",
    pending: "#bbdefb",
}
