import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { get } from 'lodash'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import MainRouter from './components/MainRouter'
import configureStore from './store/configureStore'
import { syncORMWithStore } from './orm'
import './i18n'
import WebFont from 'webfontloader'
import * as Sentry from '@sentry/browser'
import ReactGA from 'react-ga'

if ( get(window, ["LOCAL_SETTINGS", "SENTRY_DSN"]) ) {
    Sentry.init({ dsn: window.LOCAL_SETTINGS.SENTRY_DSN })
}

export const store = configureStore({})
syncORMWithStore(store)

WebFont.load({
  google: {
    families: ['Roboto:300,400,500,600', 'sans-serif']
  }
});

if ( get(window, ["LOCAL_SETTINGS", "GOOGLE_ANALYTICS_USERID"]) ) {
    ReactGA.initialize(window.LOCAL_SETTINGS.GOOGLE_ANALYTICS_USERID)
    ReactGA.pageview(window.location.pathname + window.location.search)
}


class App extends Component {
    render() {
        return (
            <Provider store={store}>
              <Router>
                <MainRouter />
              </Router>
            </Provider>
        );
    }
}



ReactDOM.render(<App />, document.getElementById('root'));
