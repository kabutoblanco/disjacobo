import React, { useState, useEffect } from 'react';

// REDUX
import { connect } from 'react-redux';

import { addBuy } from '../../actions/invoice';
import { getProducts, resetProducts, uploadProducts } from '../../actions/product';
import { getProviders } from '../../actions/auth';

// STYLESS
import { Container, Form, Row, Col, Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import '../dashboard/index.css';

// LIBRARIES
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyFormat from 'react-currency-format';
import DatePicker from 'react-datepicker';
import TextField from '@material-ui/core/TextField';
import ReactTable from 'react-table-6';

// SYSTEM
var moment = require('moment');

function BuyDetail(props) {
  const [buy, setBuy] = useState({
    date_record: new Date(),
    date_update: new Date(),
    provider: null,
    ref: '',
    amount: 1,
    total: 0,
    discount: 0,
    is_iva: 0,
    is_promo: 0,
  });
  const [details, setDetails] = useState([]);
  const [product, setProduct] = useState({ price_cost: 0 });

  useEffect(() => {
    props.getProviders();
    props.getProducts(0);
    return () => {
      props.resetProducts();
    };
  }, []);

  const onAddDetail = () => {
    const { amount, is_iva, is_promo, total } = buy;
    const data = {
      product: product.id,
      amount: parseFloat(amount),
      total: parseFloat(total),
      ref: product.ref,
      name: product.name,
      is_iva: is_iva,
      is_promo: is_promo,
    };
    setDetails(details.concat(data));
  };

  const deleteRow = (product) => {
    setDetails(details.filter((item) => item.product !== product));
  };

  const onAddBuy = () => {
    const { provider, ref, date_record, date_update } = buy;
    const payment = details.reduce(function (a, b) {
      return a + b.total;
    }, 0);
    let user = null;
    if (provider !== null) user = provider.user.id;
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
      buy: {
        ref: ref,
      },
      details: details,
      payments: payments,
    };
    props.addBuy(data);
  };

  const onChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    setBuy({ ...buy, [name]: value });
  };

  const onSetAmount = (e) => {
    const value = e.target.value;
    if (value) {
      setBuy({
        ...buy,
        amount: value,
        total: value * product.price_cost,
      });
    }
  };

  const { products, providers } = props;
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
  return (
    <Container>
      <Card className='mt-5 mb-3'>
        <Card.Header>
          <span className='h5'>Compra detallada: </span>
          <CurrencyFormat
            className='h5'
            value={payment}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
          />
          <Button className='float-right' onClick={onAddBuy}>
            REGISTRAR
          </Button>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={4} lg={4}>
                <Form.Group>
                  <Form.Label>Proveedor</Form.Label>
                  <Autocomplete
                    id='combo-box-providers'
                    disableClearable
                    disablePortal
                    options={providers}
                    getOptionLabel={(option) => {
                      return option.user.personal_id;
                    }}
                    onChange={(event, value) => {
                      setBuy({ ...buy, provider: value });
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
                      <TextField {...params} label='Combo box' name='provider' variant='outlined' />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={4} lg={4}>
                <Form.Group>
                  <Form.Label>No. Factura</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Referencia'
                    value={buy.ref}
                    onChange={onChange}
                    name='ref'
                  />
                </Form.Group>
              </Col>
              <Col md={4} lg={4}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    showYearDropdown
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    selected={buy.date_record}
                    onChange={(date) => {
                      setBuy({ ...buy, date_record: date });
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
                      setBuy({ ...buy, total: buy.amount * value.price_cost });
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
              <Col md={2} lg={2}>
                <Form.Group>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Ej. 12'
                    name='amount'
                    value={buy.amount}
                    onFocus={handleFocus}
                    onChange={onSetAmount}
                  />
                </Form.Group>
              </Col>
              <Col md={2} lg={2}>
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Ej. 2000'
                    name='total'
                    value={buy.total}
                    onFocus={handleFocus}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col md={1} lg={1}>
                <Form.Group>
                  <Form.Label>IVA</Form.Label>
                  <Form.Control
                    type='checkbox'
                    name='is_iva'
                    checked={buy.is_iva}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col md={1} lg={1}>
                <Form.Group>
                  <Form.Label>Promocion</Form.Label>
                  <Form.Control
                    type='checkbox'
                    name='is_promo'
                    checked={buy.is_promo}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col md={1} lg={1} className='align-self-end'>
                <Form.Group>
                  <Button className='w-100' onClick={onAddDetail}>
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
  providers: state.auth.providers,
});

export default connect(mapStateToProps, {
  addBuy,
  getProducts,
  resetProducts,
  getProviders,
  uploadProducts,
})(BuyDetail);
