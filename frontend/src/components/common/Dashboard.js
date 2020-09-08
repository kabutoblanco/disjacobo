import React, { Component } from 'react';

import Inventory from '../dashboard/Inventory';
import BuyDetail from '../dashboard/BuyDetail';
import SaleDetail from '../dashboard/SaleDetail';
import BuyList from '../dashboard/BuyList';
import SaleList from '../dashboard/SaleList';

class Dashboard extends Component {
  onChange = () => {
    const path = this.props.match.path;
    switch (path) {
      case '/ventas':
        return <SaleList />;
      case '/compras':
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
  };

  render() {
    return (
      <div style={{ height: this.props.height + 'px' }}>
        <this.onChange />
      </div>
    );
  }
}

export default Dashboard;
