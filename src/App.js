import { Switch } from '@material-ui/core'
import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import PropTypes from 'prop-types'
import Login from 'src/views/pages/login/Login'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
//lazy==>improve the performance
//const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

/* Login.propTypes = {
  loading: PropTypes.any,
  error: PropTypes.any,
  props: PropTypes.any,
} */
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/" name="Login Page" element={<Login />} />
            <Route exact path="/Inscription" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      /*     <BrowserRouter>
              <Suspense fallback={loading}>

        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/Inscription" exact component={Register} />
          {/*    <Route path="/ForgetPassword" exact component={ForgetPassword} />
          <Route path="/Accueil" exact component={Accueil} />
          <Route path="/Reinitialiser_mdp" exact component={Reinitialiser_mdp} />
      }{' '}
        </Switch>
                </Suspense>

      </BrowserRouter> */
    )
  }
}

export default App
