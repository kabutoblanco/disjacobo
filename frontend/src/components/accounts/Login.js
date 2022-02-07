import React, { useState, Fragment } from 'react';

// REDUX
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

//ROUTER
import { Redirect } from 'react-router-dom';

//STYLESS
import { Button, Card, Col, Form } from 'react-bootstrap';
import './Login.css';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    props.login(username, password);
  };

  if (props.isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <Fragment>
      <Col className='body-login'>
        <Card className='card-login'>
          <Card.Body className='my-login'>
            <Form onSubmit={onSubmit}>
              <Form.Label>
                <h3 className='mt-2'>INICIAR SESION</h3>
              </Form.Label>
              <Form.Control
                className='mb-2'
                type='text'
                name='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Usuario'
                required
              />
              <Form.Control
                className='mb-2'
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Contraseña'
                required
              />
              <div className='d-block'>
                <Button className='btn-link mb-1'>Olvide mi contraseña</Button>
                <br />
                <Button type='submit' className='btn-primary btn-black'>
                  INGRESAR
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Fragment>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticate: PropTypes.bool,
};

const mapStateProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateProps, { login })(Login);
