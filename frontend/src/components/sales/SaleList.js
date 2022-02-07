import React, { useState, useEffect } from 'react';

import { Container } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CurrencyFormat from 'react-currency-format';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-6';
import SaleView from './SaleView';
import { getSales, resetSales, getDetails } from '../../actions/invoice';
import { connect } from 'react-redux';
var moment = require('moment');

import '../dashboard/index.css';

function useKeyPress(targetKey) {

  // State for keeping track of whether key is pressed

  const [keyPressed, setKeyPressed] = useState(false);



  // If pressed key is our target key then set to true

  function downHandler({ key }) {

    if (key === targetKey) {

      setKeyPressed(true);

    }

  }



  // If released key is our target key then set to false

  const upHandler = ({ key }) => {

    if (key === targetKey) {

      setKeyPressed(false);

    }

  };



  // Add event listeners

  useEffect(() => {

    window.addEventListener('keydown', downHandler);

    window.addEventListener('keyup', upHandler);

    // Remove event listeners on cleanup

    return () => {
      console.log("moriii perras")
      window.removeEventListener('keydown', downHandler);

      window.removeEventListener('keyup', upHandler);

    };

  }, []); // Empty array ensures that effect is only run on mount and unmount



  return keyPressed;

}

function SaleList(props) {
  const happyPress = useKeyPress('x');
  const history = useHistory();
  const [date_record, setDate_record] = useState(new Date());
  const [sale, setSale] = useState(null);
  const [show, setShow] = useState(false);

  const onOpenDetail = (sale) => {
    props.getDetails(sale.invoice.id);
    setSale(sale);
    setShow(true);
  };

  useEffect(() => {
    if (happyPress) {
      history.push("/ventas/add")
    }
  }, [happyPress])

  const onClose = () => {
    setShow(false);
  };

  const onChangeDate = (date) => {
    setDate_record(date);
  };

  useEffect(() => {
    props.getSales(moment(date_record).format('YYYY-MM-DD'));
  }, [date_record]);

  useEffect(() => {
    props.getSales('today');
    return () => {
      props.resetSales();
    };
  }, [sales]);

  const { sales } = props;
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
      <div className='row'>
        <div className='col-12'>
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
        data={sales}
        columns={columns}
        defaultPageSize={5}
        previousText='Atras'
        nextText='Siguiente'
        pageText='Página'
        ofText='de'
        rowsText='filas'
      />
      <SaleView show={show} sale={sale} onClose={onClose} />
    </Container>
  );
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
