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
  Accordion,
} from 'react-bootstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyFormat from 'react-currency-format';
import TextField from '@material-ui/core/TextField';
import ReactTable from 'react-table-6';
import {
  addProduct,
  getProducts,
  resetProducts,
  getCategories,
  updateProduct,
} from '../../actions/product';
import { connect } from 'react-redux';
var moment = require('moment');

import './index.css';
import 'react-table-6/react-table.css';

export class Inventory extends Component {
  state = {
    ref: '',
    name: '',
    category: {},
    price_cost: 0,
    price_sale: 0,
    amount: 0,
  };

  onAddProduct = () => {
    const { ref, name, category, price_cost, price_sale, amount } = this.state;
    const data = {
      ref: ref,
      name: name,
      category: category.id,
      price_sale: price_sale,
      price_cost: price_cost,
      amount: amount,
    };
    this.props.addProduct(data);
  };

  onBreakProduct = (product) => {
    //PASAR PRODUCTOS DE UNA PRESENTACION EN PACK A LA UNITARIA
    let product_atomic = this.props.products.find(
      (item) => item.metaproduct.id === product.metaproduct.id && item.is_atomic
    );
    product.stock -= 1;
    product_atomic.stock += product.presentation.amount;

    var { ref, metaproduct, presentation, ...restProduct } = product;
    var { ref, metaproduct, presentation, ...restProduct_atomic } = product_atomic;

    this.props.updateProduct(product.id, restProduct);
    this.props.updateProduct(product_atomic.id, restProduct_atomic);
  };

  onChange = (event) => {
    let { name } = event.target;
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value,
    });
  };

  componentDidMount() {
    this.props.getCategories();
    this.props.getProducts(1);
  }

  componentWillUnmount() {
    this.props.resetProducts();
  }

  render() {
    const { ref, name, price_cost, price_sale, amount } = this.state;
    const { products, categories } = this.props;
    const handleFocus = (event) => event.target.select();
    const columns = [
      {
        Header: 'Ref',
        accessor: 'ref',
        width: 100,
        minWidth: 50,
      },
      {
        Header: 'Nombre',
        accessor: 'name',
        width: 200,
        minWidth: 50,
      },
      {
        Header: 'Stock',
        accessor: 'stock',
        width: 100,
      },
      {
        Header: 'Precio costo',
        accessor: 'price_cost',
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
        Header: 'Precio venta',
        accessor: 'price_sale',
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
                overlay={<Tooltip>Romper</Tooltip>}>
                <Button
                  className='ml-1 break'
                  variant='outline-dark'
                  disabled={props.original.amount < 2 ? true : false}
                  onClick={() => {
                    this.onBreakProduct(props.original);
                  }}></Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement='right'
                delay={{ show: 250, hide: 100 }}
                overlay={<Tooltip>Remover</Tooltip>}>
                <Button
                  className='ml-1 remove'
                  variant='outline-danger'
                  disabled={false}
                  onClick={() => {
                    this.remover(props.original.product);
                  }}></Button>
              </OverlayTrigger>
            </div>
          );
        },
      },
    ];
    return (
      <Container>
        <Accordion className='mt-5 mb-3'>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Card.Header} variant='link' eventKey='0'>
                Registrar producto
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={2} lg={2}>
                      <Form.Group>
                        <Form.Label>Referencia</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Ej. 0001XX'
                          name='ref'
                          value={ref}
                          onFocus={handleFocus}
                          onChange={this.onChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} lg={4}>
                      <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Ej. limpido patojito x150ml'
                          name='name'
                          value={name}
                          onFocus={handleFocus}
                          onChange={this.onChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} lg={3}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Autocomplete
                          id='combo-box-category'
                          options={categories}
                          getOptionLabel={(option) => {
                            return option.name;
                          }}
                          onChange={(event, value) => {
                            this.setState({
                              category: value,
                            });
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
                            <TextField
                              {...params}
                              label='Combo box'
                              name='category'
                              variant='outlined'
                            />
                          )}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2} lg={2}>
                      <Form.Group>
                        <Form.Label>Precio costo</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Ej. 2000'
                          name='price_cost'
                          value={price_cost}
                          onFocus={handleFocus}
                          onChange={this.onChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} lg={2}>
                      <Form.Group>
                        <Form.Label>Precio venta</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Ej. 2000'
                          name='price_sale'
                          value={price_sale}
                          onFocus={handleFocus}
                          onChange={this.onChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} lg={2}>
                      <Form.Group>
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Ej. 10'
                          name='amount'
                          value={amount}
                          onFocus={handleFocus}
                          onChange={this.onChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={1} lg={1} className='align-self-end'>
                      <Form.Group>
                        <Button className='w-100' onClick={this.onAddProduct}>
                          +
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <span className='h5'>Lista de productos</span>
        <ReactTable
          className='mt-3 mb-2'
          data={products}
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
  categories: state.product.categories,
});

export default connect(mapStateToProps, {
  addProduct,
  getProducts,
  resetProducts,
  getCategories,
  updateProduct,
})(Inventory);
