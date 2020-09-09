import React, { Component } from 'react';

import { Container, Button } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-6';
import { getBuys } from '../../actions/invoice';
import { connect } from 'react-redux';
var moment = require('moment');

import './index.css';

export class BuyList extends Component {
  state = {
    amount: 0,
    payment: 0,
    product: {},
  };

  componentDidMount() {
    this.props.getBuys('today');
  }

  componentWillUnmount() {}

  render() {
    const { buys } = this.props;
    const total = buys.reduce(function (a, b) {
      return a + b.invoice.total;
    }, 0);
    const columns = [
      {
        Header: 'REF',
        accessor: 'ref',
        width: 100,
      },
      {
        id: 'name',
        Header: 'Proveedor',
        accessor: (d) => (d.invoice.user !== null ? d.invoice.user.username : 'N/A'),
        width: 150,
      },
      {
        Header: 'Fecha',
        accesor: 'date_record',
        Cell: (props) => (
          <span>{moment(props.original.invoice.date_record).format('YYYY-MM-DD hh:mm A')}</span>
        ),
      },
      {
        Header: 'Total',
        accessor: 'total',
        Cell: (props) => (
          <CurrencyFormat
            value={props.original.invoice.total}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
          />
        ),
      },
    ];
    return (
      <Container className='pt-4'>
        <div className='w-100'>
          <span className='h5'>
            Compras del día:{'  '}
            <CurrencyFormat
              value={total}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </span>
          <Link className='float-right link-button' to='/compras/add'>
            AGREGAR
          </Link>
        </div>
        <ReactTable
          className='mt-3 mb-2'
          data={buys}
          columns={columns}
          defaultPageSize={5}
          previousText='Atras'
          nextText='Siguiente'
          pageText='Página'
          ofText='de'
          rowsText='filas'
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  buys: state.invoice.buys,
});

export default connect(mapStateToProps, {
  getBuys,
})(BuyList);
