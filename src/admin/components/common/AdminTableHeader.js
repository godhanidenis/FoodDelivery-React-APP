/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import { map, size } from 'lodash'
import { withRouter } from 'react-router-dom'
import { Row } from '../../components/layout/Row'
import { Col } from '../../components/layout/Col'
import { Container } from '../../components/layout/Container'
import { default_theme as theme } from '../../emotion/theme'

class AdminTableHeader extends Component {

    render() {
        const { title, children, custom_height, custom_background, variant } = this.props

        const content = (
            <Row>
              <Col className="col-auto mr-auto">
                <h1>{title}</h1>
              </Col>
              <Col className="col-auto">
                <Row>
                  { children && !children.length && <Col>{children}</Col> }
                  { children && children.length > 1 && map(children, (child, index) => <Col key={index} >{child}</Col>)}
                </Row>
              </Col>
            </Row>
        )
        
        if ( variant === "no_container" ) {
            return content
        }
        
        return (
            <Container fluid>
              {content}
            </Container>
        )
    }
}

function mapStateToProps(state, props) {
    const { children } = props
    return {
        children
    }
}
export default withRouter(connect(mapStateToProps)(AdminTableHeader))
