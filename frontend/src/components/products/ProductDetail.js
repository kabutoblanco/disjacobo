import React, { Component } from 'react';

import { Button, Modal, ListGroup } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';
import { getDetail } from '../../actions/product';
import { connect } from 'react-redux';

export class ProductDetail extends Component {
  componentDidMount() {
    this.props.getDetail(this.props.id);
  }

  render() {
    const { product, detail } = this.props;
    const rate = () => {
      let rate = detail !== null ? detail.total : 0;
      if (rate === 0)
        return <ListGroup.Item variant='danger'>Tasa de venta: {'ninguno vendido'}</ListGroup.Item>;
      else if (rate > 0 && rate <= 2)
        return <ListGroup.Item variant='warning'>Tasa de venta: {'poca rotación'}</ListGroup.Item>;
      else if (rate > 2 && rate <= 5)
        return <ListGroup.Item variant='info'>Tasa de venta: {'rotación normal'}</ListGroup.Item>;
      else if (rate > 5 && rate <= 7)
        <ListGroup.Item variant='primary'>Tasa de venta: {'alto rotación'}</ListGroup.Item>;
      else
        return (
          <ListGroup.Item variant='success'>
            Tasa de venta: {'es una locura de ventas'}
          </ListGroup.Item>
        );
    };
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{product !== null ? product.name : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item>Stock: {product !== null ? product.stock : 0}</ListGroup.Item>
            {rate()}
            <ListGroup.Item>
              Costo:{' '}
              <CurrencyFormat
                value={product !== null ? product.price_cost : 0}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              Precio:{' '}
              <CurrencyFormat
                value={product !== null ? product.price_sale : 0}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              Utilidad:{' '}
              {(
                (product !== null
                  ? product.price_cost > 0
                    ? product.price_sale / product.price_cost - 1
                    : 1
                  : 0) * 100
              ).toFixed(0)}
              %
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.props.onClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  detail: state.product.detail,
});

export default connect(mapStateToProps, {
  getDetail,
})(ProductDetail);
