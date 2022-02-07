import React, { Component } from 'react';

import { Button, Modal, Table } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';

import { connect } from 'react-redux';

var moment = require('moment');

function SaleView(props) {
  const { sale, details } = props;
  const listDetails = details.map((item) => {
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
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{sale !== null ? sale.ref : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-table'>
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
        <Table striped bordered hover responsive>
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
        <Button variant='secondary' onClick={props.onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  details: state.invoice.details,
});

export default connect(mapStateToProps, {})(SaleView);
