import React, { useState, useEffect, useRef } from 'react'
import websiteTheme from 'themes/websiteTheme'
import { ThemeProvider } from '@material-ui/styles'
import { makeStyles } from '@material-ui/core/styles'
import {Grid, Typography, Slider, Input, Button, TextField} from '@material-ui/core'
import johannesburg from 'images/cities/johannesburg.png'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import 'themes/css/slider.css'
import logo from 'images/logo.png'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    background: '#fadf00',
    fontSize: 48,
    fontWeight: 100
  },
  input: {
    fontSize: 48,
    width: 220,
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
      width: 200,
      textAlign: 'center'
    },
  },
  sliderArea: {
    backgroundImage: `url(${johannesburg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
    height: 350,
  },
  slider: {
    marginTop: 328,
    width: '95%',
    [theme.breakpoints.down("xs")]: {
      marginTop: 320,
      width: '90%',
    },
  },
  calculator: {
    fontSize: 40,
    padding: 50,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.8rem",
      paddingTop: 60,
      paddingBottom: 20
    },
  },
  p50: {
    padding: 50,
    [theme.breakpoints.down("xs")]: {
      padding: 20
    },
  },
  donateButton: {
    fontSize: 24,
    border: '2px solid #000000',
    background: '#ffffff',
    padding: '10px 20px',
    marginBottom: 50,
  },
}))

function SAHThumbComponent(props){
  return(
    <span {...props}><img src={logo} width={200} style={{marginBottom: 100}} /></span>
  )
}

const donationMarks = [
  {
    value: 0,
    scaledValue: 100,
    label: "R100"
  },
  {
    value: 25,
    scaledValue: 500,
    label: "R500"
  },
  {
    value: 50,
    scaledValue: 1000,
    label: "R1k"
  },
  {
    value: 75,
    scaledValue: 5000,
    label: "R5k"
  },
  {
    value: 100,
    scaledValue: 10000,
    label: "R10k"
  },
  {
    value: 125,
    scaledValue: 25000,
    label: "R25k"
  },
  {
    value: 150,
    scaledValue: 50000,
    label: "R50k"
  },
  {
    value: 175,
    scaledValue: 100000,
    label: "R100k"
  },
  {
    value: 200,
    scaledValue: 1000000,
    label: "1M"
  }
];

const scale = value => {
  const previousMarkIndex = Math.floor(value / 25);
  const previousMark = donationMarks[previousMarkIndex];
  const remainder = value % 25;
  if (remainder === 0) {
    return previousMark.scaledValue;
  }
  const nextMark = donationMarks[previousMarkIndex + 1];
  const increment = (nextMark.scaledValue - previousMark.scaledValue) / 25;
  return remainder * increment + previousMark.scaledValue;
};

function numFormatter(num) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + "M"; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }
}

export default function InputSlider() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const firstName = useRef(null)
  const lastName = useRef(null)
  const email = useRef(null)

  useEffect(()=>{
    setTimeout(() => {
      setValue(100)
    }, 500)
  }, [setInitialInputValue])

  const setInitialInputValue = () => {
    setValue(0)
  }

  const handleSliderChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSubmit = (event) => {
    let first = ''
    let last = ''
    let email = ''
    let url = "https://saharvest.org/donations/donate-form/?amount=" + scale(value)
    if(document.getElementById("firstName").value) {
      first = '&first=' + document.getElementById("firstName").value
    }
    if(document.getElementById("lastName").value) {
      last = '&last=' + document.getElementById("lastName").value
    }
    if(document.getElementById("email").value) {
      email = '&email=' + document.getElementById("email").value
    }
    url = url + first + last + email
    window.location.href = url
  }



  return (
    <ThemeProvider theme={websiteTheme}>
    <div className={classes.root}>
      <div className={classes.p50}>
      <Typography variant="h2" align="center">Drive our truck to see how much food your donation will rescue.</Typography>
      </div>
      <Grid container spacing={2} align="center" >
        <Grid item xs className={classes.sliderArea}>
          <Slider
            value={typeof value === 'number' ? value : 0}
            min={0}
            step={1}
            max={200}
            valueLabelFormat={numFormatter}
            marks={donationMarks}
            scale={scale}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            ThumbComponent={SAHThumbComponent}
            className={classes.slider}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} align="center" className={classes.calculator}>
        <Grid item xs>
          R{numFormatter(scale(value))} {/*
            <Input
            id={"donation-value"}
            className={classes.input}
            value={scale(value)}
            onChange={handleInputChange}
            ref={textInput}
            min={0}
            step={1}
            max={200}
            valueLabelFormat={numFormatter}
          />

          <ArrowForwardIcon fontSize="large" style={{margin: '0 10px'}} />
          */}
          <Typography variant="p" align="center">rescues & delivers {(scale(value)/2).toLocaleString()} meals.</Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item align="center" xs={12}>
          <TextField name="first" id="firstName" placeholder="First Name" className={classes.input} />
        </Grid>
        <Grid item align="center" xs={12}>
          <TextField name="last" id="lastName" placeholder="Last Name" className={classes.input} />
        </Grid>
        <Grid item align="center" xs={12}>
          <TextField name="email" id="email" type="email" placeholder="Email" className={classes.input} />
        </Grid>
        {}
        <Grid item align="center" xs={12}><Button className={classes.donateButton} onClick={handleSubmit}>DONATE NOW</Button></Grid>
      </Grid>
    </div>
    </ThemeProvider>
  )
}
