import React, { useEffect, useState } from 'react';

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
import ProductUpload from '../products/ProductUpload';
import ProductDetail from '../products/ProductDetail';
import {
  addProduct,
  getProducts,
  resetProducts,
  getCategories,
  updateProduct,
  uploadProducts,
  getDetail,
} from '../../actions/product';
import { connect } from 'react-redux';

import '../dashboard/index.css';
import 'react-table-6/react-table.css';

function Inventory(props) {
  const [item, setItem] = useState({ ref: '', name: '', price_cost: 0, price_sale: 0, amount: 0 });
  const [category, setCategory] = useState({});
  const [filter, setFilter] = useState(0);
  const [product, setProduct] = useState(null);
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [total, setTotal] = useState(0);

  const onOpen = () => {
    setShow(true);
  };

  const onOpenDetail = (product) => {
    console.log('open');
    props.getDetail(product.id);
    setProduct(product);
    setShowDetail(true);
  };

  useEffect(() => {
    props.getProducts(filter);
  }, [filter]);

  useEffect(() => {
    props.getCategories();
    props.getProducts(0);
    return () => {
      props.resetProducts();
    };
  }, []);

  const onClose = () => {
    setShow(false);
    setShowDetail(false);
  };

  const onAddProduct = () => {
    const data = {
      ref: item.ref,
      name: item.name,
      category: category.id,
      price_sale: item.price_sale,
      price_cost: item.price_cost,
      amount: item.amount,
    };
    props.addProduct(data);
  };

  const onBreakProduct = (product1) => {
    //PASAR PRODUCTOS DE UNA PRESENTACION EN PACK A LA UNITARIA
    let product_atomic = props.products.find(
      (item) => item.ref === product1.ref && item.amount === 1
    );
    product1.stock -= 1;
    product_atomic.stock += product1.amount;

    var { ref, ...restProduct } = product1;
    var { ref, ...restProduct_atomic } = product_atomic;

    props.updateProduct(product1.id, restProduct);
    props.updateProduct(product_atomic.id, restProduct_atomic);
  };

  const onChange = (e) => {
    var { type, name, checked } = e.target;
    let value = type === 'checkbox' ? checked : e.target.value;
    setItem({ ...item, [name]: value });
  };

  const { products, categories } = props;
  const comboCategories = categories.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));
  const handleFocus = (event) => event.target.select();
  const columns = [
    {
      Header: 'Ref',
      accessor: 'ref',
      Cell: (props) => (
        <span
          style={{ textDecoration: 'underline blue', color: 'blue' }}
          onClick={() => {
            console.log('detalles');
            onOpenDetail(props.original);
          }}>
          {props.original.ref}
          {props.original.id}
        </span>
      ),
      width: 70,
    },
    {
      Header: 'Nombre',
      accessor: 'name',
      filterable: true,
      width: 200,
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
      width: 100,
    },
    {
      id: 'util',
      Header: 'Utilidad',
      accessor: (d) => (d.price_cost > 0 ? d.price_sale / d.price_cost - 1 : 1),
      Cell: (props) => <span>{(props.value * 100).toFixed(0)}%</span>,
      width: 80,
    },
    {
      Header: 'Stock',
      accessor: 'stock',
      width: 50,
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
                disabled={
                  props.original.amount < 2 ||
                  (props.original.amount > 1 && props.original.stock < 1)
                    ? true
                    : false
                }
                onClick={() => {
                  onBreakProduct(props.original);
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
                  remover(props.original.product);
                }}></Button>
            </OverlayTrigger>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const total = products.reduce(function (a, b) {
      return a + (b.stock > 0 ? b.price_cost * b.stock : 0);
    }, 0);
    setTotal(total);
  }, [products]);

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
                        value={item.ref}
                        onFocus={handleFocus}
                        onChange={onChange}
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
                        value={item.name}
                        onFocus={handleFocus}
                        onChange={onChange}
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
                          setCategory(value);
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
                        value={item.price_cost}
                        onFocus={handleFocus}
                        onChange={onChange}
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
                        value={item.price_sale}
                        onFocus={handleFocus}
                        onChange={onChange}
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
                        value={item.amount}
                        onFocus={handleFocus}
                        onChange={onChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} lg={1} className='align-self-end'>
                    <Form.Group>
                      <Button className='w-100' onClick={onAddProduct}>
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
      <div className='d-block'>
        <span className='h5'>Lista de productos</span>
      </div>
      <div className='d-inline-flex'>
        <Form.Control
          as='select'
          name='filter'
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}>
          <option key={0} value={0}>
            ---categoria---
          </option>
          {comboCategories}
        </Form.Control>
        <button className='ml-1' onClick={onOpen}>
          Upload
        </button>
      </div>
      <div className='mt-1'>
        <span>Total costo: </span>
        <CurrencyFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'$'} />
      </div>
      <ReactTable
        className='mt-3 mb-2'
        data={products}
        columns={columns}
        defaultPageSize={5}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined
            ? String(row[id])
                .toLowerCase()
                .replace(/ /g, '')
                .includes(filter.value.toLowerCase().replace(/ /g, ''))
            : true;
        }}
        previousText='Atras'
        nextText='Siguiente'
        pageText='Página'
        ofText='de'
        rowsText='filas'
      />
      <ProductUpload show={show} onClose={onClose} uploadProducts={props.uploadProducts} />
      <ProductDetail
        show={showDetail}
        onClose={onClose}
        getDetail={props.getDetail}
        product={product}
        updateProduct={props.updateProduct}
        detail={props.detail}
      />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  products: state.product.products,
  categories: state.product.categories,
  detail: state.product.detail,
});

export default connect(mapStateToProps, {
  addProduct,
  getProducts,
  resetProducts,
  getCategories,
  updateProduct,
  uploadProducts,
  getDetail,
})(Inventory);
