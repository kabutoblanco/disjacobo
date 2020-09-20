import React, { Component } from 'react';

import Inventory from '../inventories/Inventory';
import BuyDetail from '../buys/BuyDetail';
import SaleDetail from '../sales/SaleDetail';
import BuyList from '../buys/BuyList';
import SaleList from '../sales/SaleList';
import HomeIn from '../dashboard/HomeIn';
import { resetSales } from '../../actions/invoice';
import { connect } from 'react-redux';

class Dashboard extends Component {
  onChange = () => {
    const path = this.props.match.path;
    switch (path) {
      case '/':
      case '/home':
        this.props.resetSales();
        return <HomeIn />;
      case '/ventas':
        this.props.resetSales();
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

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  resetSales,
})(Dashboard);
