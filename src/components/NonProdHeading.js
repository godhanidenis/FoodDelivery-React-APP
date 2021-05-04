/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import { Col } from './layout/Col'

export default class NonProdHeading extends Component {
    render() {
        return null
        
        // const dest = window.location.protocol + "//" + window.location.host.replace("web.", "mail.")
        // return (
        //     <div css={non_prod_warning}>
        //       WARNING: This site is for testing purposes only, data might not be preserved
        //       <div className="float-right">
        //         <Col>
        //           <a target="_blank" href={dest}>
        //             Open Email Inbox
        //           </a>
        //         </Col>
        //       </div>
        //     </div>
        // )
    }
}

const non_prod_warning = css`
height: 30px;
background-color: orange;
width: 100%;
text-align: center;
border-bottom: 1px solid #000000;
border-top: 1px solid #000000;
position: sticky;
top: 0;
z-index: 10;
`
