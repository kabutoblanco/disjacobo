import React, { Component } from 'react';

export class ProductUpdate extends Component {
  render() {
    return (
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
                    <TextField {...params} label='Combo box' name='category' variant='outlined' />
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
    );
  }
}

export default ProductUpdate;
