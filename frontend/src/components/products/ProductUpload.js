import React, { useState } from 'react';
import { Button, Modal, Form, FormControl } from 'react-bootstrap';
import { uploadProducts, getProducts } from '../../actions/product';
import { connect } from 'react-redux';

function ProductUpload(props) {
  const [cvs_file, setCvs_file] = useState({});

  const onChange = (event) => {
    let { value, files, type } = event.target;
    value = type === 'file' ? files : value;
    setCvs_file(value);
  };

  const onUpload = () => {
    console.log(cvs_file);
    props.uploadProducts(cvs_file);
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cargar reporte productos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormControl name='cvs_file' type='file' onChange={onChange}></FormControl>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onClose}>
          Cancelar
        </Button>
        <Button variant='primary' name='eliminar' onClick={onUpload}>
          Subir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  products: state.product.products,
});

export default connect(mapStateToProps, {
  uploadProducts,
  getProducts,
})(ProductUpload);
