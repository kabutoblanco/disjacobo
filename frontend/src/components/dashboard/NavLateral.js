import React, { Component } from 'react';

import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './index.css';

function NavLateral(props) {
    return (
      <div className='navlateral' style={{ top: '43px', position: 'fixed', left: '0' }}>
        <Nav
          defaultActiveKey='/ventas'
          className='flex-column nav-lateral'
          style={{
            height: props.height + 'px',
          }}>
          <Link to='/home' onClick={props.onChange} className='first-menu'>INICIO</Link>
          <Link to='/ventas' onClick={props.onChange}>VENTAS</Link>
          <Link to='/compras' onClick={props.onChange}>COMPRAS</Link>
          <Link to='/inventario' onClick={props.onChange}>INVENTARIO</Link>
        </Nav>
      </div>
    );
}

export default NavLateral;
