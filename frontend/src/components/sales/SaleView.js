import React, { Component } from 'react';

import { Button, Modal, Table } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';

import { connect } from 'react-redux';

var moment = require('moment');

export class SaleView extends Component {
  render() {
    const { sale, details } = this.props;
    console.log(details);
    const listDetails = details.map((item) => {
      console.log(item);
      return (
        <tr key={item.id}>
          <td>{item.product.name}</td>
          <td>{item.amount}</td>
          <td>
            <CurrencyFormat
              value={item.total}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </td>
        </tr>
      );
    });
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{sale !== null ? sale.ref : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <span>
              {sale !== null
                ? sale.invoice.user !== null
                  ? sale.invoice.user.username
                  : 'N/A'
                : 'N/A'}
            </span>{' '}
            <span>
              {sale !== null ? moment(sale.invoice.date_record).format('YYYY-MM-DD hh:mm A') : ''}
            </span>
            <br />
            <span>Total venta: </span>
            <CurrencyFormat
              value={sale !== null ? sale.invoice.total : 0}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
            />
          </div>
          <Table striped bordered hover responsive style={{ maxHeight: 300 }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>{listDetails}</tbody>
          </Table>
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
  details: state.invoice.details,
});

export default connect(mapStateToProps, {})(SaleView);
