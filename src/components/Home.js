/** @jsx jsx */
import { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { jsx, css } from '@emotion/core'

class Home extends Component {

    render() {
        return (
            <div>
              Welcome to SAHarvest
            </div>
        )
    }
}

export default Home
