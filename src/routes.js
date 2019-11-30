import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'

import Login from './pages/Login/index'
import Home from './pages/Home/index'
import NewPost from './pages/NewPost/index'
import NewAccount from './pages/NewAccount/index'
import Profile from './pages/Profile/index'
import Search from './pages/Search/index'
import EditProfile from './pages/EditProfile/index'
import { isAuthenticated } from './services/auth'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
)

const Routes = () => (
  <BrowserRouter>
    <Route path="/" exact component={Login} />
    <Route path="/newaccount" component={NewAccount} />
    <PrivateRoute path="/home" component={Home} />
    <PrivateRoute path="/newpost" component={NewPost} />
    <PrivateRoute path="/profile/:id" component={Profile} />
    <PrivateRoute path="/search" component={Search} />
    <PrivateRoute path="/edit/:id" component={EditProfile} />
  </BrowserRouter>
)

export default Routes
