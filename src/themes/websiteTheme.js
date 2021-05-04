import { createMuiTheme }  from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
        primary: {
          main: '#10412e'
        },
        secondary: {
          main: '#8dc83e'
        },
  },
  overrides: {
    MuiCard: {
      root: {
        marginBottom: '10px'
      },
      elevation: 0
    },
    MuiSlider: {
      thumb:{
      color: "#fadf00",
      },
      track: {
        color: 'black'
      },
      rail: {
        color: 'black'
      }
    }
  },
})

const { breakpoints, typography: { pxToRem } } = theme
const websiteTheme = {
  ...theme,
  overrides: {
    MuiTypography: {
      h2: {
        [breakpoints.down("xs")]: {
          fontSize: "2rem"
        }
      }
    }
  }
}


export default websiteTheme
