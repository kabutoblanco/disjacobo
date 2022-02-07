import React, { useState } from 'react';

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

function Header(props) {
  const [select, setSelect] = useState(false);
  const [check, setCheck] = useState(true);

  const onLogout = () => {
    props.logout();
  };

  const onLink = () => {
    setSelect(false);
  };

  const onNav = () => {
    setCheck(true);
  };

  const [path, setPath] = useState(window.location.hash);

  const { isAuthenticated, user } = props.auth;
  const authLinks = (
    <>
      <Button variant='outline-success' className='p-0 btn-salir float-right' onClick={onLogout}>
        SALIR
      </Button>
      <input
        type='checkbox'
        name='check'
        id='expand-menu'
        checked={check}
        value={check}
        onChange={() => setCheck(!check)}
      />
      <label className='label-menu' htmlFor='expand-menu'>
        <img src='/static/frontend/img/menu.png' height='15' alt='' />
      </label>
      <span className='pl-3 h5'>DISJACOBO</span>
      <span className='pr-2 float-right'>{user === null ? '-' : user.username}</span>
      <NavLateral height={props.height} onChange={onNav} />
    </>
  );
  const guestLinks = (
    <Nav className='main-menu'>
      <Link
        to='/inicio'
        className={path.endsWith('inicio') ? 'active-custom' : ''}
        onClick={onLink}></Link>
    </Nav>
  );

  return (
    <div id='nav-top' style={{ height: '43px' }}>
      <Navbar
        expand='sm'
        expanded={select}
        style={{
          display: isAuthenticated ? 'block' : 'flex',
          height: isAuthenticated ? '43px' : 'auto',
        }}>
        {!isAuthenticated ? (
          <Navbar.Toggle aria-controls='main-nav' onClick={() => setSelect(!state.select)} />
        ) : (
          authLinks
        )}
        <Navbar.Collapse id='main-nav'>{isAuthenticated ? <></> : guestLinks}</Navbar.Collapse>
      </Navbar>
    </div>
  );
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
