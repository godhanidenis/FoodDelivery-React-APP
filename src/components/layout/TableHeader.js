/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { map, size } from 'lodash'
import { withRouter } from 'react-router-dom'
import Row from './Row'
import Col from './Col'
import Container from './Container'
import { default_theme as theme } from '../../emotion/theme'

class TableHeader extends Component {

    render() {
        const { title, children } = this.props
        return (
            <Container fluid>
              <Row>
                <Col className="col-auto mr-auto">
                  <h1>{title}</h1>
                </Col>
                <Col className="col-auto">
                  <Row>
                    { !children.length && <Col>{children}</Col> }
                    { children.length > 1 && map(children, (child, index) => <Col key={index} >{child}</Col>)}
                  </Row>
                </Col>
              </Row>
            </Container>
        )
    }
}

export default TableHeader

const header = css`
display: flex;
flex-direction: row;
justify-content: space-between;
background-color: ${theme.colors.primary};
align-items: center;
height: 70px;
width: 100%;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
padding-right: 15px;
padding-left: 15px;
`
