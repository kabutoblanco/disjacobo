import React, { useEffect, useState } from 'react';

import { Button, Modal, ListGroup, Form } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';

function ProductDetail(props) {
  const [item, setItem] = useState({ id: -1, price_cost: 0, price_sale: 0, stock: 0 });

  const onChange = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const onSubmit = () => {
    const { id } = props.product;
    const data = {
      price_sale: item.price_sale,
      price_cost: item.price_cost,
      stock: item.stock,
    };
    props.updateProduct(id, data);
  };

  useEffect(() => {
    const product = props.product;
    if (product !== null)
      setItem({
        ...item,
        price_sale: product.price_sale,
        price_cost: product.price_cost,
        stock: product.stock,
      });
  }, [props.product]);

  const { product, detail } = props;
  const rate = () => {
    console.log('hasta aqui si');
    let rate = detail !== null ? detail.total : 0;
    if (rate === 0)
      return (
        <ListGroup.Item variant='danger'>
          <p>
            {' '}
            Tasa de venta: {rate} {'ninguno vendido'}
          </p>
        </ListGroup.Item>
      );
    else if (rate > 0 && rate <= 2)
      return (
        <ListGroup.Item variant='warning'>
          <p>
            {' '}
            Tasa de venta: {rate} {'poca rotación'}
          </p>
        </ListGroup.Item>
      );
    else if (rate > 2 && rate <= 5)
      return (
        <ListGroup.Item variant='info'>
          <p>
            {' '}
            Tasa de venta: {rate} {'rotación normal'}
          </p>
        </ListGroup.Item>
      );
    else if (rate > 5 && rate <= 7)
      return (
        <ListGroup.Item variant='primary'>
          <p>
            {' '}
            Tasa de venta: {rate} {'alto rotación'}
          </p>
        </ListGroup.Item>
      );
    else
      return (
        <ListGroup.Item variant='success'>
          <p>
            {' '}
            Tasa de venta: {rate} {'es una locura de ventas'}
          </p>
        </ListGroup.Item>
      );
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.product !== null ? props.product.name : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item>
            <Form.Label>Stock</Form.Label>
            <Form.Control type='number' name='stock' value={item.stock} onChange={onChange} />
          </ListGroup.Item>
          {rate()}
          <ListGroup.Item>
            Costo:{' '}
            <CurrencyFormat
              value={item.price_cost}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </ListGroup.Item>
          <ListGroup.Item>
            Precio:{' '}
            <CurrencyFormat
              value={item.price_sale}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </ListGroup.Item>
          <ListGroup.Item>
            Utilidad:{' '}
            {(
              (product !== null
                ? item.price_cost > 0
                  ? item.price_sale / item.price_cost - 1
                  : 1
                : 0) * 100
            ).toFixed(0)}
            %
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onClose}>
          Cerrar
        </Button>
        <Button variant='primary' onClick={onSubmit}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductDetail;
