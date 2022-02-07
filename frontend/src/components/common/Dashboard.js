import React, { useState, useEffect } from 'react';

import Inventory from '../inventories/Inventory';
import BuyDetail from '../buys/BuyDetail';
import SaleDetail from '../sales/SaleDetail';
import BuyList from '../buys/BuyList';
import SaleList from '../sales/SaleList';
import HomeIn from '../dashboard/HomeIn';
import { resetSales } from '../../actions/invoice';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

function Dashboard(props) {
  switch (useLocation().pathname) {
    case '/':
    case '/home':
      console.log('renderizando putos 1');
      return <HomeIn />;
    case '/ventas':
      props.resetSales();
      return <SaleList />;
    case '/compras':
      console.log('renderizando putos 3');
      return <BuyList />;
    case '/inventario':
      return <Inventory />;
    case '/ventas/add':
      return <SaleDetail />;
    case '/compras/add':
      return <BuyDetail />;
    default:
      return <></>;
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  resetSales,
})(Dashboard);
