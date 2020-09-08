import React, { Component } from 'react';

import { Container, Form, Row, Col, Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyFormat from 'react-currency-format';
import TextField from '@material-ui/core/TextField';
import ReactTable from 'react-table-6';
import {
  addProduct,
  getProducts,
  resetProducts,
  addMetaproduct,
  getMetaproducts,
  resetMetaproducts,
  getCategories,
  getTrademarks,
  getPresentations,
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
    stock: 0,
    price_sale: 0,
    price_cost: 0,
    atomic: false,
    category: {},
    trademark: {},
    amount: 0,
    payment: 0,
    product: {},
    metaproduct: {},
  };

  onAddMetaproduct = () => {
    const { name, category, trademark } = this.state;
    const data = {
      name: name,
      category: category.id,
      trademark: trademark.id,
    };
    this.props.addMetaproduct(data);
  };

  onAddProduct = () => {
    const { ref, metaproduct, presentation, stock, price_sale, price_cost, atomic } = this.state;
    const data = {
      ref: ref,
      metaproduct: metaproduct.id,
      presentation: presentation.id,
      stock: stock,
      price_sale: price_sale,
      price_cost: price_cost,
      is_atomic: atomic,
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
    this.props.getTrademarks();
    this.props.getPresentations();
    this.props.getMetaproducts();
    this.props.getProducts(1);
  }

  componentWillUnmount() {
    this.props.resetMetaproducts();
    this.props.resetProducts();
  }

  render() {
    const { name, ref, stock, price_sale, price_cost, atomic } = this.state;
    const { categories, trademarks, presentations, products, metaproducts } = this.props;
    const handleFocus = (event) => event.target.select();
    const columns = [
      {
        Header: 'Ref',
        accessor: 'ref',
        width: 100,
      },
      {
        id: 'name',
        Header: 'Nombre',
        accessor: (d) => d.metaproduct.name + ' ' + d.presentation.name,
        width: 300,
      },
      {
        Header: 'Stock',
        accessor: 'stock',
        width: 100,
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
                  disabled={props.original.is_atomic ? true : false}
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
        <Card className='mt-5 mb-3'>
          <Card.Header>Registrar producto</Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col md={3} lg={4}>
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Ej. 12'
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
                      id='combo-box-demo'
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
                <Col md={3} lg={3}>
                  <Form.Group>
                    <Form.Label>Marca</Form.Label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={trademarks}
                      getOptionLabel={(option) => {
                        return option.name;
                      }}
                      onChange={(event, value) => {
                        this.setState({
                          trademark: value,
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
                          name='trademark'
                          variant='outlined'
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} lg={2} className='align-self-end'>
                  <Form.Group>
                    <Button className='w-100' variant='secondary' onClick={this.onAddMetaproduct}>
                      +
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <hr />
            <Form>
              <Row>
                <Col md={3} lg={4}>
                  <Form.Group>
                    <Form.Label>Referencia</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Ej. 12'
                      name='ref'
                      value={ref}
                      onFocus={handleFocus}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} lg={4}>
                  <Form.Group>
                    <Form.Label>Metaproducto</Form.Label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={metaproducts}
                      getOptionLabel={(option) => {
                        return option.name;
                      }}
                      onChange={(event, value) => {
                        this.setState({
                          metaproduct: value,
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
                          name='metaproduct'
                          variant='outlined'
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} lg={4}>
                  <Form.Group>
                    <Form.Label>Presentacion</Form.Label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={presentations}
                      getOptionLabel={(option) => {
                        return option.name;
                      }}
                      onChange={(event, value) => {
                        this.setState({
                          presentation: value,
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
                          name='presentation'
                          variant='outlined'
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} lg={2}>
                  <Form.Group>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder='Ej. 2000'
                      name='stock'
                      value={stock}
                      onFocus={handleFocus}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} lg={3}>
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
                <Col md={3} lg={3}>
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
                <Col md={1} lg={1}>
                  <Form.Group>
                    <Form.Label>Atomico</Form.Label>
                    <Form.Control
                      type='checkbox'
                      name='atomic'
                      checked={atomic}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} lg={2} className='align-self-end'>
                  <Form.Group>
                    <Button className='w-100' onClick={this.onAddProduct}>
                      +
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
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
  categories: state.product.categories,
  trademarks: state.product.trademarks,
  presentations: state.product.presentations,
  metaproducts: state.product.metaproducts,
  products: state.product.products,
});

export default connect(mapStateToProps, {
  addMetaproduct,
  getMetaproducts,
  resetMetaproducts,
  addProduct,
  getProducts,
  resetProducts,
  getCategories,
  getTrademarks,
  getPresentations,
  updateProduct,
})(Inventory);
