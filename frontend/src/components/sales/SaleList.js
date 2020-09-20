import React, { Component } from 'react';

import { Container } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-6';
import SaleView from './SaleView';
import { getSales, resetSales, getDetails } from '../../actions/invoice';
import { connect } from 'react-redux';
var moment = require('moment');

import '../dashboard/index.css';

export class SaleList extends Component {
  state = {
    amount: 0,
    payment: 0,
    product: {},
    sale: null,
    show: false,
  };

  onOpenDetail = (sale) => {
    this.props.getDetails(sale.invoice.id);
    this.setState({ sale: sale, show: true });
  };

  onClose = () => {
    this.setState({ show: false });
  };

  componentDidMount() {
    this.props.getSales('today');
  }

  componentWillUnmount() {
    this.props.resetSales();
  }

  render() {
    const { sales } = this.props;
    const { sale, show } = this.state;
    const total = sales.reduce(function (a, b) {
      return a + b.invoice.total;
    }, 0);
    const columns = [
      {
        Header: 'REF',
        accessor: 'ref',
        Cell: (props) => (
          <span
            style={{ textDecoration: 'underline blue', color: 'blue' }}
            onClick={() => {
              this.onOpenDetail(props.original);
            }}>
            {props.original.ref}
            {props.original.id}
          </span>
        ),
        width: 100,
      },
      {
        id: 'name',
        Header: 'Cliente',
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
            Ventas del día:{'  '}
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
        <SaleView show={show} sale={sale} onClose={this.onClose} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  sales: state.invoice.sales,
  details: state.invoice.details,
});

export default connect(mapStateToProps, {
  getSales,
  resetSales,
  getDetails,
})(SaleList);
