import React, { Component } from 'react'
import logo from '../../images/logo.png'
import { makeStyles } from '@material-ui/core/styles'

const Logo = (props) => {
  return (
      <div id="logoDiv">
        <img src={logo} alt="Logo" style={props.style} />
      </div>
  )
}

export default Logo
