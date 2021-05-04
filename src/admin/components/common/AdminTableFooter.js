/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { withRouter } from 'react-router-dom'
import { Row } from '../../components/layout/Row'
import { Col } from '../../components/layout/Col'
import { Container } from '../../components/layout/Container'
import { default_theme as theme } from '../../emotion/theme'

class AdminTableFooter extends Component {

    render() {
        const { children } = this.props
        return (
            <Container fluid>
              <Row>
                <Col>
                  {children}
                </Col>
              </Row>
            </Container>
        )
    }
}

export default AdminTableFooter
