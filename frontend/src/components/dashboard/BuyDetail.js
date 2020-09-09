import React, { Component } from 'react';

import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CurrencyFormat from 'react-currency-format';
import ReactTable from 'react-table-6';
import { getProducts, resetProducts } from '../../actions/product';
import { addBuy } from '../../actions/invoice';
import { getProviders } from '../../actions/auth';
import { connect } from 'react-redux';
var moment = require('moment');

import './index.css';

export class BuyDetail extends Component {
  state = {
    date_record: new Date(),
    date_update: new Date(),
    provider: null,
    ref: '',
    amount: 0,
    total: 0,
    discount: 0,
    is_iva: false,
    is_promo: false,
    details: [],
    product: {
      price_cost: 0,
    },
  };

  onAddDetail = () => {
    const { product, amount, is_iva, is_promo, total } = this.state;
    const data = {
      product: product.id,
      amount: parseInt(amount),
      total: parseFloat(total),
      ref: product.ref,
      name: product.metaproduct.name + ' ' + product.presentation.name,
      is_iva: is_iva,
      is_promo: is_promo,
    };
    this.setState({ details: this.state.details.concat(data) });
  };

  deleteRow = (product) => {
    this.setState({
      details: this.state.details.filter((item) => item.product !== product),
    });
  };

  onAddBuy = () => {
    const { details } = this.state;
    const { provider, ref, date_record, date_update, payment } = this.state;
    const pay = details.reduce(function (a, b) {
      return a + b.total;
    }, 0);
    let user = null;
    if (provider !== null) user = provider.user.id;
    const buy = {
      user: user,
      total: pay,
      ref: ref,
      date_record: moment(date_record).format('YYYY-MM-DD' + 'T' + 'HH:mm:SS'),
      date_update: moment(date_update).format('YYYY-MM-DD' + 'T' + 'HH:mm:SS'),
    };
    const payments = [
      {
        ref: new Date().toLocaleString(),
        payment: pay,
      },
    ];
    const data = {
      buy: buy,
      details: details,
      payments: payments,
    };
    this.props.addBuy(data);
  };

  componentDidMount() {
    this.props.getProviders();
    this.props.getProducts(1);
  }

  componentWillUnmount() {
    this.props.resetProducts();
  }

  onChange = (event) => {
    let { name } = event.target;
    let value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    const { product } = this.state;
    if (value === '') value = 0;
    this.setState(
      {
        [name]: value,
      },
      () => {
        if (name === 'amount') {
          const total = value * product.price_cost;
          this.setState({ total: total });
        }
      }
    );
  };

  render() {
    const { amount, total, is_iva, is_promo, details, ref } = this.state;
    const { products, providers } = this.props;
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
      { Header: 'Valor', accessor: 'total' },
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
                    this.deleteRow(props.original.product);
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
            <Button className='float-right' onClick={this.onAddBuy}>
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
                        this.setState({
                          provider: value,
                        });
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
                        <TextField
                          {...params}
                          label='Combo box'
                          name='provider'
                          variant='outlined'
                        />
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
                      value={ref}
                      onChange={this.onChange}
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
                      selected={this.state.date_record}
                      onChange={(date) => {
                        this.setState({ date_record: date });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4} lg={4}>
                  <Form.Group>
                    <Form.Label>Producto</Form.Label>
                    <Autocomplete
                      id='combo-box-products'
                      options={products}
                      getOptionLabel={(option) => {
                        return (
                          option.metaproduct.name +
                          ' ' +
                          option.presentation.name
                        );
                      }}
                      disableClearable
                      disablePortal
                      onChange={(event, value) => {
                        this.setState({
                          product: value,
                          total: amount * value.price_cost,
                        });
                      }}
                      style={{ width: 300 }}
                      renderOption={(option) => (
                        <React.Fragment>
                          <div className='w-100'>
                            <span>
                              {option.metaproduct.name}{' '}
                              {option.presentation.name}
                            </span>
                          </div>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Combo box'
                          name='product'
                          variant='outlined'
                        />
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
                      value={amount}
                      onFocus={handleFocus}
                      onChange={this.onChange}
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
                      value={total}
                      onFocus={handleFocus}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} lg={1}>
                  <Form.Group>
                    <Form.Label>IVA</Form.Label>
                    <Form.Control
                      type='checkbox'
                      name='is_iva'
                      checked={is_iva}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} lg={1}>
                  <Form.Group>
                    <Form.Label>Promocion</Form.Label>
                    <Form.Control
                      type='checkbox'
                      name='is_promo'
                      checked={is_promo}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} lg={1} className='align-self-end'>
                  <Form.Group>
                    <Button className='w-100' onClick={this.onAddDetail}>
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
})(BuyDetail);
