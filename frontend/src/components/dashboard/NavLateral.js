import React, { Component } from 'react';

import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './index.css';

export class NavLateral extends Component {
  render() {
    return (
      <div className='navlateral' style={{ top: '43px', position: 'fixed', left: '0' }}>
        <Nav
          defaultActiveKey='/ventas'
          className='flex-column nav-lateral'
          style={{
            height: this.props.height + 'px',
          }}>
          <Link to='/home' onClick={this.props.onChange} className='first-menu'>INICIO</Link>
          <Link to='/ventas' onClick={this.props.onChange}>VENTAS</Link>
          <Link to='/compras' onClick={this.props.onChange}>COMPRAS</Link>
          <Link to='/inventario' onClick={this.props.onChange}>INVENTARIO</Link>
        </Nav>
      </div>
    );
  }
}

export default NavLateral;
