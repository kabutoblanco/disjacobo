import React, { useState, useEffect } from 'react';

import { Container, Form, Row, Col, Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CurrencyFormat from 'react-currency-format';
import ReactTable from 'react-table-6';
import { getProducts, resetProducts } from '../../actions/product';
import { addSale } from '../../actions/invoice';
import { getClients } from '../../actions/auth';
import { connect } from 'react-redux';
var moment = require('moment');

import '../dashboard/index.css';

function SaleDetail(props) {
  const [sale, setSale] = useState({
    date_record: new Date(),
    date_update: new Date(),
    ref: moment(new Date()).format('FVYYMMDDHHmmss'),
    amount: 1,
    total: 0,
    discount: 0,
    is_iva: false,
    is_discount: false,
  });

  const [client, setClient] = useState(null);
  const [details, setDetails] = useState([]);
  const [product, setProduct] = useState({ price_sale: 0 });

  const onAddDetail = (e) => {
    e.preventDefault();
    const data = {
      product: product.id,
      amount: parseFloat(sale.amount),
      total: parseFloat(sale.total),
      ref: product.ref,
      name: product.name,
      util: sale.is_iva
        ? 0.0
        : parseFloat(sale.total) - product.price_cost * parseFloat(sale.amount),
      is_sale: true,
      is_consumption: sale.is_iva,
      is_promo: sale.is_promo,
    };
    setDetails(details.concat(data));
  };

  const deleteRow = (product) => {
    setDetails(details.filter((item) => item.product !== product));
  };

  const onAddSale = () => {
    const {date_record, date_update} = sale;
    const payment = details.reduce(function (a, b) {
      return a + b.total;
    }, 0);
    const util = details.reduce(function (a, b) {
      return a + b.util;
    }, 0);
    let user = null;
    if (client !== null) user = client.user.id;
    const invoice = {
      user: user,
      total: payment,
      date_record: moment(date_record).format('YYYY-MM-DD' + 'T' + 'HH:mm'),
      date_update: moment(date_update).format('YYYY-MM-DD' + 'T' + 'HH:mm'),
    };
    const payments = [
      {
        ref: new Date().toLocaleString(),
        total: payment,
      },
    ];
    const data = {
      invoice: invoice,
      sale: {
        ref: sale.ref,
        util: parseFloat(util),
      },
      details: details,
      payments: payments,
    };
    props.addSale(data);
  };

  useEffect(() => {
    props.getClients();
    props.getProducts(0);
    return () => {
      props.resetProducts();
    };
  }, []);

  const onChange = (event) => {
    let { name, checked, value, type } = event.target;
    value = type === 'checkbox' ? checked : value;
    setSale({ ...sale, [name]: value });
  };

  const { products, clients } = props;
  const handleFocus = (event) => event.target.select();
  const payment = details.reduce(function (a, b) {
    return a + b.total;
  }, 0);
  const columns = [
    {
      Header: 'Nombre',
      accessor: 'name',
      width: 400,
      filterable: true,
    },
    {
      Header: 'Promo',
      accessor: 'is_promo',
      Cell: (props) => <span>{props.value ? 'SI' : 'NO'}</span>,
      width: 60,
    },
    {
      Header: 'IVA',
      accessor: 'is_iva',
      Cell: (props) => <span>{props.value ? '19%' : '0%'}</span>,
      width: 60,
    },
    { Header: 'Cantidad', accessor: 'amount' },
    {
      Header: 'Valor',
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
    {
      Header: 'Acciones',
      Cell: (props) => {
        return (
          <div>
            <OverlayTrigger
              placement='right'
              delay={{ show: 250, hide: 100 }}
              overlay={<Tooltip>Eliminar</Tooltip>}>
              <Button
                className='ml-1 remove'
                variant='outline-danger'
                onClick={() => {
                  deleteRow(props.original.product);
                }}></Button>
            </OverlayTrigger>
          </div>
        );
      },
    },
  ];

  const onSetAmount = (e) => {
    const value = e.target.value;
    if (value) {
      console.log(value);
      setSale({
        ...sale,
        amount: value,
        total: value * product.price_sale,
      });
    }
  };

  return (
    <Container>
      <Card className='mt-5 mb-3'>
        <Card.Header>
          <span className='h5'>Venta detallada: </span>
          <CurrencyFormat
            className='h5'
            value={payment}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
          />
          <Button className='float-right' onClick={onAddSale}>
            REGISTRAR
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={onAddDetail}>
            <Row>
              <Col md={4} lg={4}>
                <Form.Group>
                  <Form.Label>Cliente</Form.Label>
                  <Autocomplete
                    id='combo-box-demo'
                    options={clients}
                    getOptionLabel={(option) => {
                      return option.user.personal_id;
                    }}
                    onChange={(event, value) => {
                      console.log(value);
                      setClient(value);
                    }}
                    style={{ width: 300 }}
                    renderOption={(option) => (
                      <React.Fragment>
                        <div className='w-100'>
                          <span>
                            {option.user.personal_id} {option.user.username}
                          </span>
                        </div>
                      </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label='Combo box' name='client' variant='outlined' />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={4} lg={4}>
                <Form.Group>
                  <Form.Label>No. Factura</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Referencia'
                    value={sale.ref}
                    onChange={onChange}
                    name='ref'
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={4} lg={4}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    showYearDropdown
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    selected={sale.date_record}
                    onChange={(date) => {
                      setSale({ ...sale, date_record: date });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={4} lg={4}>
                <Form.Group>
                  <Form.Label>Producto</Form.Label>
                  <Autocomplete
                    id='combo-box-demo'
                    options={products}
                    getOptionLabel={(option) => {
                      return option.name;
                    }}
                    onChange={(event, value) => {
                      setProduct(value);
                      setSale({ ...sale, total: sale.amount * value.price_sale });
                    }}
                    style={{ width: 300 }}
                    renderOption={(option) => (
                      <React.Fragment>
                        <div className='w-100'>
                          <span>{option.name}</span>
                        </div>
                      </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label='Combo box' name='product' variant='outlined' />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col xs={5} md={2} lg={2}>
                <Form.Group>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Ej. 12'
                    name='amount'
                    value={sale.amount}
                    onFocus={handleFocus}
                    onChange={onSetAmount}
                  />
                </Form.Group>
              </Col>
              <Col xs={7} md={2} lg={2}>
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Ej. 2000'
                    name='total'
                    value={sale.total}
                    onFocus={handleFocus}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={1} lg={1}>
                <Form.Group>
                  <Form.Label>¿Gasto?</Form.Label>
                  <Form.Control
                    type='checkbox'
                    name='is_iva'
                    checked={sale.is_iva}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={1} lg={1}>
                <Form.Group>
                  <Form.Label>¿Promo?</Form.Label>
                  <Form.Control
                    type='checkbox'
                    name='is_promo'
                    checked={sale.is_promo}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col md={1} lg={1} className='align-self-end'>
                <Form.Group>
                  <Button className='w-100' type='submit'>
                    +
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <span className='h5'>Detalles</span>
      <ReactTable
        className='mt-3 mb-2'
        data={details}
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

const mapStateToProps = (state) => ({
  products: state.product.products,
  clients: state.auth.clients,
});

export default connect(mapStateToProps, {
  addSale,
  getProducts,
  resetProducts,
  getClients,
})(SaleDetail);
