// @ts-nocheck
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import ConfirmationModal from 'components/ConfirmationModal'
import Breadcrumbs from 'components/layout/Breadcrumbs'
import { Row } from 'components/layout/Row'
import { Col }from 'components/layout/Col'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { Root, Header, Nav, Content, Footer } from './'
import CssBaseline from '@material-ui/core/CssBaseline';
import { default_theme as theme } from 'emotion/theme'
import muiTheme from 'muiTheme'
import { ThemeProvider } from '@material-ui/core/styles';
import { Separator } from 'components/layout/Separator'
import Logo from './Logo'
import LoggedInUser from './header/LoggedInUser'
import config from 'config'
import { MainMenu } from '../../../admin/components/common/menus/Menus'
import Hidden from '@material-ui/core/Hidden'

class AdminMainLayout extends Component {

  render() {
      const { title, children, breadcrumbs, active_key } = this.props
    
      return (
          <ThemeProvider theme={muiTheme}>
          <Root config={config} style={{ minHeight: "100vh" }}>
            <CssBaseline />

            <Header
              menuIcon={{
                  inactive: <MenuIcon />,
                  active: <ChevronLeftIcon />
              }}
            >
              <Logo style={{height:35, marginRight: 15}} />
              <Hidden xsDown>
                <Typography variant="h6" style={{marginTop: 15}}>Admin Portal</Typography>
              </Hidden>
              <LoggedInUser />
            </Header>

            <Nav
              collapsedIcon={{
                  inactive: <ChevronLeftIcon />,
                  active: <ChevronRightIcon />
              }}
              header={
                  ctx => null
              }
            >
              <MainMenu />
            </Nav>
            <Content>
            <Container disableGutters={false} maxWidth={false}>
              <ConfirmationModal />

              <Breadcrumbs crumbs={breadcrumbs}/>
              { title &&
                <Typography variant="h6">{ title }</Typography>
              }
              { children }
              </Container>
            </Content>

            <Footer />
          </Root>
          </ThemeProvider>
      )
  }
}

function mapStateToProps(state, props) {
  const { title, layout, children } = props
  return {
      title,
      children
  }
}
export default connect(mapStateToProps)(AdminMainLayout)
