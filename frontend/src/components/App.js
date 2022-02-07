import React, { Suspense, useEffect, lazy, useState } from 'react';
import ReactDOM from 'react-dom';

import Routing from './Routing';

//ADMINISTRATION
const Alerts = lazy(() => import('./layout/Alerts'));
import ProgressAction from './layout/ProgressAction';

//REDUX
import { loadUser } from '../actions/auth';
import { Provider } from 'react-redux';
import store from '../store';

//ALERTS
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

//STYLESS
import { Container } from 'react-bootstrap';
import './App.css';

const alertOptions = {
  timeout: 3000,
  position: 'top center',
};

function App() {
  const [hWindow, setHWindow] = useState(window.innerHeight);
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    const hNavbar = document.getElementById('nav-top').clientHeight;
    const hWindow = window.innerHeight;
    const wWindow = window.innerWidth;
    const height = hWindow - hNavbar;

    setHWindow(height);
    setHeight(hWindow - hNavbar);
    setWidth(wWindow);
  };

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <ProgressAction />
          <Alerts />
          <Container
            fluid
            className='app-main'
            style={{
              minHeight: height + 'px',
            }}>
            <Routing width={width} height={height} hWindow={hWindow} />
          </Container>
        </AlertProvider>
      </Suspense>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
