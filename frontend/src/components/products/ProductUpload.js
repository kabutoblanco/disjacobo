import React, { Component } from 'react';
import { Button, Modal, Form, FormControl } from 'react-bootstrap';
import { uploadProducts, getProducts } from '../../actions/product';
import { connect } from 'react-redux';

export class ProductUpload extends Component {
  state = {
    cvs_file: {},
  };

  onChange = (event) => {
    const target = event.target;
    const value = target.type === 'file' ? target.files : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  onUpload = () => {
    console.log(this.state.cvs_file);
    this.props.uploadProducts(this.state.cvs_file);
  };

  componentDidMount() {
    // this.props.getProducts();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cargar reporte productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormControl name='cvs_file' type='file' onChange={this.onChange}></FormControl>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.props.onClose}>
            Cancelar
          </Button>
          <Button variant='primary' name='eliminar' onClick={this.onUpload}>
            Subir
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.product.products,
});

export default connect(mapStateToProps, {
  uploadProducts,
  getProducts,
})(ProductUpload);
