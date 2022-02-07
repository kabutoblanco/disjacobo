import React, { useEffect, useState } from 'react';

import { Container } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactTable from 'react-table-6';
import BuyView from './BuyView';
import { getBuys, getDetails } from '../../actions/invoice';
import { connect } from 'react-redux';
var moment = require('moment');

import '../dashboard/index.css';

function BuyList(props) {
  const [show, setShow] = useState(false);
  const [date_record, setDate_record] = useState(new Date());
  const [buy, setBuy] = useState(null);

  const onOpenDetail = (buy) => {
    props.getDetails(buy.invoice.id);
    setBuy(buy);
    setShow(true);
  };

  const onClose = () => {
    setShow(false);
  };

  useEffect(() => {
    props.getBuys(moment(date_record).format('YYYY-MM-DD'));
  }, [date_record]);

  const onChangeDate = (date) => {
    setDate_record(date);
  };

  useEffect(() => {
    console.log('llamando')
    props.getBuys('today');
  }, []);

  const { buys } = props;
  const total = buys.reduce(function (a, b) {
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
            onOpenDetail(props.original);
          }}>
          {props.original.ref}
          {props.original.id}
        </span>
      ),
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
      <div className='row'>
        <div className='col-12'>
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
      </div>
      <div className='row'>
        <div className='col-md-3'>
          <DatePicker
            dateFormat='dd/MM/yyyy'
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            selected={date_record}
            onChangeRaw={(e) => {
              e.preventDefault();
            }}
            onChange={(date) => {
              onChangeDate(date);
            }}
          />
        </div>
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
      <BuyView show={show} buy={buy} onClose={onClose} />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  buys: state.invoice.buys,
  details: state.invoice.details,
});

export default connect(mapStateToProps, {
  getBuys,
  getDetails,
})(BuyList);
