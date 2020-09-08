import React, { Component } from 'react';

import { Container, Button } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-6';
import { getSales } from '../../actions/invoice';
import { connect } from 'react-redux';
var moment = require('moment');

import './index.css';

export class SaleList extends Component {
  state = {
    amount: 0,
    payment: 0,
    product: {},
  };

  componentDidMount() {
    this.props.getSales('today');
  }

  componentWillUnmount() {}

  render() {
    const { sales } = this.props;
    const total = sales.reduce(function (a, b) {
      return a + b.total;
    }, 0);
    const columns = [
      {
        Header: 'REF',
        accessor: 'ref',
        width: 180,
      },
      {
        id: 'name',
        Header: 'Cliente',
        accessor: (d) => (d.user !== null ? d.user.username : 'N/A'),
        width: 300,
      },
      {
        Header: 'Fecha',
        accesor: 'date_record',
        Cell: (props) => (
          <span>{moment(props.original.date_record).format('YYYY-MM-DD hh:mm A')}</span>
        ),
      },
      {
        Header: 'Total',
        accessor: 'total',
        Cell: (props) => (
          <CurrencyFormat
            value={props.value}
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
          <Link className='float-right link-button' to='/ventas/add'>
            AGREGAR
          </Link>
        </div>
        <ReactTable
          className='mt-3 mb-2'
          data={sales}
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
  sales: state.invoice.sales,
});

export default connect(mapStateToProps, {
  getSales,
})(SaleList);
