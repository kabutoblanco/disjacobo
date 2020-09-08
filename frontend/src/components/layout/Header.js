import React, { Component } from 'react';

//ROUTER
import { Link } from 'react-router-dom';
import NavLateral from '../dashboard/NavLateral';

//REDUX
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';

//STYLESS
import { Button, Nav, Navbar } from 'react-bootstrap';
import './Header.css';

export class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  state = {
    select: false,
    check: true,
  };

  onLogout = () => {
    this.props.logout();
  };

  onLink = () => {
    this.setState({ option: true, select: false });
  };

  onNav = () => {
    this.setState({ check: true });
  };

  onChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  render() {
    const path = window.location.hash;
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <>
        <Button
          variant='outline-success'
          className='p-0 btn-salir float-right'
          onClick={this.onLogout}>
          SALIR
        </Button>
        <input
          type='checkbox'
          name='check'
          id='expand-menu'
          checked={this.state.check}
          value={this.state.check}
          onChange={this.onChange}
        />
        <label className='label-menu' htmlFor='expand-menu'>
          <img src='/static/frontend/img/menu.png' height='15' alt='' />
        </label>
        <span className='pl-3 h5'>DISJACOBO</span>
        <span className='pr-2 float-right'>{user === null ? '-' : user.username}</span>
        <NavLateral height={this.props.height} onChange={this.onNav} />
      </>
    );
    const guestLinks = (
      <Nav className='main-menu'>
        <Link
          to='/inicio'
          className={path.endsWith('inicio') ? 'active-custom' : ''}
          onClick={this.onLink}></Link>
      </Nav>
    );
    return (
      <div id='nav-top' style={{ height: '43px' }}>
        <Navbar
          expand='sm'
          expanded={this.state.select}
          style={{
            display: isAuthenticated ? 'block' : 'flex',
            height: isAuthenticated ? '43px' : 'auto',
          }}>
          {!isAuthenticated ? (
            <Navbar.Toggle
              aria-controls='main-nav'
              onClick={() => this.setState({ select: !this.state.select })}
            />
          ) : (
            authLinks
          )}
          <Navbar.Collapse id='main-nav'>
            {isAuthenticated ? <></> : guestLinks}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
