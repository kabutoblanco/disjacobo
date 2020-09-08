import React, { Component, Fragment } from 'react';

// REDUX
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

//STYLESS
import './Login.css';
import { Button, Card, Col, Form } from 'react-bootstrap';

//ROUTER
import { Redirect } from 'react-router-dom';

export class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticate: PropTypes.bool,
  };

  state = {
    username: '',
    password: '',
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = () => {
    event.preventDefault();
    this.props.login(
      this.state.username,
      this.state.password
    );
  };

  render() {
    const { username, password } = this.state;
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }
    return (
      <Fragment>
        <Col
          className='body-login'>
          <Card className='card-login'>
            <Card.Body className='my-login'>
              <Form onSubmit={this.onSubmit}>
                <Form.Label>
                  <h3 className='mt-2'>INICIAR SESION</h3>
                </Form.Label>
                <Form.Control
                  className='mb-2'
                  type='text'
                  name='username'
                  value={username}
                  onChange={this.onChange}
                  placeholder='Usuario'
                  required
                />
                <Form.Control
                  className='mb-2'
                  type='password'
                  name='password'
                  value={password}
                  onChange={this.onChange}
                  placeholder='Contraseña'
                  required
                />
                <div className='d-block'>
                  <Button className='btn-link mb-1'>
                    Olvide mi contraseña
                  </Button>
                  <br />
                  <Button
                    type='submit'
                    className='btn-primary btn-black'>
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
}

const mapStateProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateProps, { login })(Login);
