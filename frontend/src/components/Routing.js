import React from 'react';
import PropTypes from 'prop-types';

import { lazy } from 'react';
import Header from './layout/Header';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

//AUTHENTICATION
const Login = lazy(() => import('./accounts/Login'));
const PrivateRoute = lazy(() => import('./common/PrivateRoute'));
const Dashboard = lazy(() => import('./common/Dashboard'));
const Home = lazy(() => import('./common/Home'));

function Routing(props) {
  return (
    <Router>
      <Header height={props.hWindow} width={props.width} />
      <Switch>
        <PrivateRoute
          exact
          path={['/', '/home', '/ventas', '/compras', '/inventario', '/ventas/add', '/compras/add']}
          component={Dashboard}
          height={props.hWindow}
        />
        <Route exact path='/inicio' render={() => <Home height={props.height} />} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </Router>
  );
}

Routing.propTypes = {};

export default Routing;
